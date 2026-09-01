#!/usr/bin/env python3
"""
RoadGuard AI - High-Precision Road Defect Detection & Analytics Engine
Specialized for precise detection of road potholes and cracks on asphalt surfaces.
Features:
- Road plane / asphalt surface isolation (HSV + luminance + gradient masking)
- Multi-scale morphological cavity fusion for seamless, non-fractured pothole bounding boxes
- Directional ridge and linear continuity filters for genuine road crack distinction
- Spatio-temporal multi-object tracking with ID persistence, track clustering, and jitter smoothing
- Browser-compatible H.264 MP4 re-encoding and defect analytics summary
"""

import sys
import os
import json
import math
import subprocess
import traceback

# Suppress all OpenCV log/warning messages (codec errors, FFMPEG noise, etc.)
os.environ.setdefault("OPENCV_LOG_LEVEL", "SILENT")
os.environ.setdefault("OPENCV_VIDEOIO_DEBUG", "0")

def log(msg):
    sys.stderr.write(f"[RoadGuard-AI] {msg}\n")
    sys.stderr.flush()

try:
    # Suppress OpenCV's noisy codec/FFMPEG warning messages that go to stderr
    # and cause non-zero exit codes when run via subprocess on Windows.
    import os as _os
    _devnull = open(_os.devnull, 'w')
    _old_stderr_fd = _os.dup(2)
    _os.dup2(_devnull.fileno(), 2)
    import cv2
    import numpy as np
    _os.dup2(_old_stderr_fd, 2)
    _os.close(_old_stderr_fd)
    _devnull.close()
except ImportError:
    log("Installing cv2/numpy runtime fallback...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", "opencv-python-headless", "numpy"])
    import cv2
    import numpy as np


class DefectTrack:
    """Tracks a single physical road defect across consecutive video frames."""
    def __init__(self, track_id, defect_type, bbox, conf, frame_idx):
        self.track_id = track_id
        self.defect_type = defect_type
        self.bbox = list(bbox)  # [x1, y1, x2, y2]
        self.smooth_bbox = list(bbox)
        self.conf = conf
        self.max_conf = conf
        self.first_frame = frame_idx
        self.last_frame = frame_idx
        self.hits = 1
        self.disappeared = 0
        self.confirmed = False

    def update(self, bbox, conf, frame_idx, min_hits_for_confirm=4):
        # Exponential moving average for smooth bounding box
        alpha = 0.55
        for i in range(4):
            self.smooth_bbox[i] = int(alpha * bbox[i] + (1 - alpha) * self.smooth_bbox[i])
        self.bbox = list(bbox)
        self.conf = conf
        self.max_conf = max(self.max_conf, conf)
        self.last_frame = frame_idx
        self.hits += 1
        self.disappeared = 0
        if self.hits >= min_hits_for_confirm or self.max_conf >= 0.85:
            self.confirmed = True


class MultiObjectTracker:
    """Spatio-temporal tracker for road defects to maintain unique IDs and avoid duplicate counts."""
    def __init__(self, fps=24.0, max_disappeared_sec=2.5, iou_thresh=0.15, dist_thresh_ratio=0.35):
        self.fps = max(1.0, fps)
        self.next_id = 1
        self.active_tracks = []
        self.all_lifetime_tracks = []
        self.max_disappeared = int(self.fps * max_disappeared_sec)
        self.min_hits_for_confirm = max(3, int(self.fps * 0.18))
        self.iou_thresh = iou_thresh
        self.dist_thresh_ratio = dist_thresh_ratio

    def _compute_iou(self, boxA, boxB):
        xA = max(boxA[0], boxB[0])
        yA = max(boxA[1], boxB[1])
        xB = min(boxA[2], boxB[2])
        yB = min(boxA[3], boxB[3])

        interArea = max(0, xB - xA) * max(0, yB - yA)
        boxAArea = max(1, (boxA[2] - boxA[0]) * (boxA[3] - boxA[1]))
        boxBArea = max(1, (boxB[2] - boxB[0]) * (boxB[3] - boxB[1]))
        iou = interArea / float(boxAArea + boxBArea - interArea)
        return iou

    def update(self, detections, frame_idx, frame_w, frame_h):
        dist_thresh = min(frame_w, frame_h) * self.dist_thresh_ratio
        assigned_det_indices = set()
        active_frame_detections = []

        # 1. Match detections with existing active tracks
        for track in self.active_tracks:
            best_det_idx = -1
            best_score = -1

            tx1, ty1, tx2, ty2 = track.smooth_bbox
            tcx, tcy = (tx1 + tx2) / 2.0, (ty1 + ty2) / 2.0

            for d_idx, det in enumerate(detections):
                if d_idx in assigned_det_indices:
                    continue
                if det["type"] != track.defect_type:
                    continue

                dx1, dy1, dx2, dy2 = det["bbox"]
                dcx, dcy = (dx1 + dx2) / 2.0, (dy1 + dy2) / 2.0
                dist = math.sqrt((dcx - tcx)**2 + (dcy - tcy)**2)
                iou = self._compute_iou(track.smooth_bbox, det["bbox"])

                if iou >= self.iou_thresh or dist <= dist_thresh:
                    score = iou * 0.65 + max(0, (dist_thresh - dist) / dist_thresh) * 0.35
                    if score > best_score:
                        best_score = score
                        best_det_idx = d_idx

            if best_det_idx >= 0:
                det = detections[best_det_idx]
                track.update(det["bbox"], det["conf"], frame_idx, self.min_hits_for_confirm)
                assigned_det_indices.add(best_det_idx)
                active_frame_detections.append({
                    "track_id": track.track_id,
                    "type": track.defect_type,
                    "conf": round(track.conf, 2),
                    "bbox": track.smooth_bbox,
                    "confirmed": track.confirmed
                })
            else:
                track.disappeared += 1
                # If recently seen, still draw it for visual smoothness
                if track.disappeared <= int(self.fps * 0.3) and track.confirmed:
                    active_frame_detections.append({
                        "track_id": track.track_id,
                        "type": track.defect_type,
                        "conf": round(track.conf * 0.9, 2),
                        "bbox": track.smooth_bbox,
                        "confirmed": True
                    })

        # 2. Register new tracks for unassigned detections
        for d_idx, det in enumerate(detections):
            if d_idx not in assigned_det_indices:
                new_track = DefectTrack(
                    track_id=self.next_id,
                    defect_type=det["type"],
                    bbox=det["bbox"],
                    conf=det["conf"],
                    frame_idx=frame_idx
                )
                self.next_id += 1
                self.active_tracks.append(new_track)
                self.all_lifetime_tracks.append(new_track)
                active_frame_detections.append({
                    "track_id": new_track.track_id,
                    "type": new_track.defect_type,
                    "conf": round(new_track.conf, 2),
                    "bbox": new_track.smooth_bbox,
                    "confirmed": new_track.confirmed
                })

        # 3. Prune old inactive tracks
        self.active_tracks = [t for t in self.active_tracks if t.disappeared <= self.max_disappeared]

        return active_frame_detections

    def get_consolidated_counts(self, frame_w, frame_h):
        """
        Consolidates lifetime tracks spatially to produce the true count of physical road defects.
        """
        confirmed_tracks = [
            t for t in self.all_lifetime_tracks
            if t.hits >= self.min_hits_for_confirm or t.max_conf >= 0.85
        ]

        if not confirmed_tracks:
            return 0, 0

        pothole_tracks = [t for t in confirmed_tracks if t.defect_type == "Pothole"]
        crack_tracks = [t for t in confirmed_tracks if t.defect_type == "Crack"]

        def cluster_tracks(tracks, max_gap_ratio=0.25):
            if not tracks:
                return 0
            max_gap = min(frame_w, frame_h) * max_gap_ratio
            clusters = []
            for t in tracks:
                bx1, by1, bx2, by2 = t.smooth_bbox
                cx, cy = (bx1 + bx2) / 2.0, (by1 + by2) / 2.0
                merged = False
                for c in clusters:
                    ccx, ccy = c["center"]
                    dist = math.sqrt((cx - ccx)**2 + (cy - ccy)**2)
                    if dist <= max_gap:
                        c["count"] += 1
                        c["center"] = ((ccx + cx) / 2.0, (ccy + cy) / 2.0)
                        merged = True
                        break
                if not merged:
                    clusters.append({"center": (cx, cy), "count": 1})
            return len(clusters)

        unique_potholes = cluster_tracks(pothole_tracks, max_gap_ratio=0.30)
        unique_cracks = cluster_tracks(crack_tracks, max_gap_ratio=0.22)

        return unique_potholes, unique_cracks


class HighPrecisionRoadDetector:
    """
    Advanced road defect detector combining road plane segmentation,
    multi-scale cavity morphology, and directional fissure analysis.
    """
    def __init__(self):
        pass

    def extract_road_plane_mask(self, frame):
        """
        Segment the asphalt road surface from background (sky, cars, vegetation, sidewalk).
        Returns: (road_mask, roi_top, gray_road)
        """
        h, w = frame.shape[:2]
        
        # Road plane generally lies in the lower ~75% of view in inspection/dashcam clips
        roi_top = int(h * 0.20)
        roi_frame = frame[roi_top:, :]
        roi_h, roi_w = roi_frame.shape[:2]

        hsv = cv2.cvtColor(roi_frame, cv2.COLOR_BGR2HSV)
        h_chan, s_chan, v_chan = cv2.split(hsv)
        gray = cv2.cvtColor(roi_frame, cv2.COLOR_BGR2GRAY)

        # 1. Color filtering: Asphalt is low-saturation neutral gray/dark (S < 85)
        asphalt_sat_mask = s_chan < 85

        # 2. Exclude extreme bright regions (sky glare, bright hood reflections) and extreme dark letterbox
        asphalt_val_mask = (v_chan > 20) & (v_chan < 240)

        # 3. Road mask combination
        raw_road_mask = (asphalt_sat_mask & asphalt_val_mask).astype(np.uint8) * 255

        # 4. Clean road mask with morphology
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 17))
        road_mask = cv2.morphologyEx(raw_road_mask, cv2.MORPH_CLOSE, kernel)
        road_mask = cv2.morphologyEx(road_mask, cv2.MORPH_OPEN, kernel)

        # 5. Mask out vehicle hood if present at bottom 3%
        road_mask[int(roi_h * 0.97):, :] = 0

        return road_mask, roi_top, gray

    def detect_potholes(self, gray, road_mask, roi_top, full_w, full_h):
        """
        Detects road potholes using multi-scale Black-Hat morphology and cavity fusion.
        Avoids fracturing a large pothole into tiny multiple boxes.
        """
        roi_h, roi_w = gray.shape[:2]

        # Multi-scale Black-Hat filtering to capture both medium and large pothole cavities
        blackhat_combined = np.zeros_like(gray, dtype=np.float32)
        scales = [25, 45, 75, 110]
        
        for k_size in scales:
            if k_size >= min(roi_w, roi_h):
                continue
            k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k_size, k_size))
            bh = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, k)
            blackhat_combined += bh.astype(np.float32)

        blackhat_norm = cv2.normalize(blackhat_combined, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

        # Apply road mask
        masked_bh = cv2.bitwise_and(blackhat_norm, blackhat_norm, mask=road_mask)

        # Threshold to get candidate depression regions
        road_pixels = masked_bh[road_mask > 0]
        if len(road_pixels) == 0:
            return []

        mean_val = np.mean(road_pixels)
        std_val = np.std(road_pixels)
        thresh_val = max(40, int(mean_val + 1.2 * std_val))

        _, binary_cavities = cv2.threshold(masked_bh, thresh_val, 255, cv2.THRESH_BINARY)

        # Morphological Closing & Dilation to bridge all fragmented dark patches within the crater
        fuse_kernel_w = max(21, int(roi_w * 0.05))
        fuse_kernel_h = max(17, int(roi_h * 0.05))
        fuse_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (fuse_kernel_w, fuse_kernel_h))
        fused_cavities = cv2.morphologyEx(binary_cavities, cv2.MORPH_CLOSE, fuse_kernel, iterations=2)
        fused_cavities = cv2.dilate(fused_cavities, fuse_kernel, iterations=1)

        contours, _ = cv2.findContours(fused_cavities, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        min_area = (roi_w * roi_h) * 0.0075  # Must be substantial road hole (reject tiny gravel noise)
        max_area = (roi_w * roi_h) * 0.60

        raw_candidates = []
        for c in contours:
            area = cv2.contourArea(c)
            if area < min_area or area > max_area:
                continue

            x, y, bw, bh = cv2.boundingRect(c)
            aspect_ratio = float(bw) / max(1, bh)

            if aspect_ratio < 0.25 or aspect_ratio > 4.5:
                continue

            # Annular contrast validation
            pad = 16
            x1_pad = max(0, x - pad)
            y1_pad = max(0, y - pad)
            x2_pad = min(roi_w, x + bw + pad)
            y2_pad = min(roi_h, y + bh + pad)

            inner_mask = np.zeros((roi_h, roi_w), dtype=np.uint8)
            cv2.drawContours(inner_mask, [c], -1, 255, -1)
            
            outer_mask = np.zeros((roi_h, roi_w), dtype=np.uint8)
            outer_mask[y1_pad:y2_pad, x1_pad:x2_pad] = 255
            outer_mask = cv2.bitwise_and(outer_mask, outer_mask, mask=road_mask)
            outer_ring_mask = cv2.subtract(outer_mask, inner_mask)

            inner_mean = cv2.mean(gray, mask=inner_mask)[0]
            outer_mean = cv2.mean(gray, mask=outer_ring_mask)[0]

            luminance_drop = outer_mean - inner_mean
            if luminance_drop >= 4.0:
                contrast_ratio = luminance_drop / max(1.0, outer_mean)
                conf = min(0.96, max(0.65, 0.60 + 0.35 * min(1.0, contrast_ratio * 3.0) + 0.15 * min(1.0, area / (min_area * 6))))
                
                raw_candidates.append({
                    "bbox": [x, y + roi_top, x + bw, y + bh + roi_top],
                    "conf": round(float(conf), 2),
                    "area": area,
                    "inner_mean": inner_mean
                })

        # Proximity clustering to merge adjacent cavity pieces
        merged_boxes = self._merge_adjacent_boxes(raw_candidates, full_w, full_h, max_dist_ratio=0.14)
        return merged_boxes

    def _merge_adjacent_boxes(self, candidates, full_w, full_h, max_dist_ratio=0.14):
        """Merges boxes that are part of the same physical road pothole."""
        if not candidates:
            return []

        max_dist = max(full_w, full_h) * max_dist_ratio
        clusters = []

        for cand in candidates:
            c_box = cand["bbox"]
            cx1, cy1, cx2, cy2 = c_box
            merged = False

            for cluster in clusters:
                bx1, by1, bx2, by2 = cluster["bbox"]
                h_gap = max(0, max(cx1, bx1) - min(cx2, bx2))
                v_gap = max(0, max(cy1, by1) - min(cy2, by2))

                if h_gap < max_dist and v_gap < max_dist:
                    cluster["bbox"] = [
                        min(bx1, cx1),
                        min(by1, cy1),
                        max(bx2, cx2),
                        max(by2, cy2)
                    ]
                    cluster["conf"] = max(cluster["conf"], cand["conf"])
                    cluster["count"] += 1
                    merged = True
                    break

            if not merged:
                clusters.append({
                    "bbox": list(c_box),
                    "conf": cand["conf"],
                    "count": 1
                })

        results = []
        for c in clusters:
            results.append({
                "type": "Pothole",
                "conf": c["conf"],
                "bbox": c["bbox"]
            })
        return results

    def detect_cracks(self, gray, road_mask, pothole_boxes, roi_top, full_w, full_h):
        """
        Detects genuine continuous road cracks while strictly suppressing asphalt grain noise.
        """
        roi_h, roi_w = gray.shape[:2]
        
        # 1. Mask out areas already covered by detected potholes (with generous padding)
        crack_search_mask = road_mask.copy()
        pad = 20
        for p in pothole_boxes:
            px1, py1, px2, py2 = p["bbox"]
            ry1 = max(0, py1 - roi_top - pad)
            ry2 = min(roi_h, py2 - roi_top + pad)
            rx1 = max(0, px1 - pad)
            rx2 = min(roi_w, px2 + pad)
            crack_search_mask[ry1:ry2, rx1:rx2] = 0

        # 2. Multi-directional linear morphological line filtering
        angles = [0, 30, 45, 60, 90, 120, 135, 150]
        max_response = np.zeros_like(gray, dtype=np.uint8)
        line_len = 23

        for angle in angles:
            rad = math.radians(angle)
            dx = int(round(math.cos(rad) * line_len / 2))
            dy = int(round(math.sin(rad) * line_len / 2))
            kernel = np.zeros((line_len, line_len), dtype=np.uint8)
            cx, cy = line_len // 2, line_len // 2
            cv2.line(kernel, (cx - dx, cy - dy), (cx + dx, cy + dy), 1, 1)
            
            bh_dir = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)
            max_response = np.maximum(max_response, bh_dir)

        masked_cracks = cv2.bitwise_and(max_response, max_response, mask=crack_search_mask)

        road_px = masked_cracks[crack_search_mask > 0]
        if len(road_px) == 0:
            return []

        c_thresh = max(32, int(np.mean(road_px) + 2.0 * np.std(road_px)))
        _, bin_cracks = cv2.threshold(masked_cracks, c_thresh, 255, cv2.THRESH_BINARY)

        connect_k = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
        connected_cracks = cv2.morphologyEx(bin_cracks, cv2.MORPH_CLOSE, connect_k)

        contours, _ = cv2.findContours(connected_cracks, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        min_crack_length = max(45, int(min(full_w, full_h) * 0.11))
        crack_boxes = []

        for c in contours:
            area = cv2.contourArea(c)
            x, y, bw, bh = cv2.boundingRect(c)
            diag = math.sqrt(bw**2 + bh**2)

            if diag >= min_crack_length:
                perimeter = cv2.arcLength(c, False)
                fill_ratio = area / max(1.0, bw * bh)
                aspect_ratio = max(bw, bh) / max(1.0, min(bw, bh))

                if fill_ratio < 0.32 and (aspect_ratio >= 2.2 or perimeter >= min_crack_length * 2.0):
                    conf = min(0.94, max(0.62, 0.60 + 0.28 * min(1.0, diag / (min_crack_length * 2.5))))
                    crack_boxes.append({
                        "type": "Crack",
                        "conf": round(float(conf), 2),
                        "bbox": [x, y + roi_top, x + bw, y + bh + roi_top]
                    })

        return self._merge_adjacent_boxes(crack_boxes, full_w, full_h, max_dist_ratio=0.08)

    def analyze_frame(self, frame):
        h, w = frame.shape[:2]
        road_mask, roi_top, gray = self.extract_road_plane_mask(frame)

        potholes = self.detect_potholes(gray, road_mask, roi_top, w, h)
        cracks = self.detect_cracks(gray, road_mask, potholes, roi_top, w, h)

        all_detections = potholes + cracks
        return all_detections


def draw_high_precision_annotations(frame, tracked_detections, frame_idx, total_frames, fps, running_counts):
    """
    Renders high-contrast, professional engineering HUD annotations and defect boxes.
    """
    annotated = frame.copy()
    h, w = frame.shape[:2]

    THEME = {
        "Pothole": {
            "border": (25, 120, 245),       # High-vis Road Orange (BGR)
            "fill": (20, 80, 210),
            "accent": (50, 190, 255),
            "text": (255, 255, 255)
        },
        "Crack": {
            "border": (210, 160, 20),       # Cyan-Teal (BGR)
            "fill": (170, 125, 10),
            "accent": (255, 220, 60),
            "text": (255, 255, 255)
        }
    }

    # 1. Draw defect bounding boxes
    for det in tracked_detections:
        dtype = det["type"]
        conf = det["conf"]
        track_id = det.get("track_id", 1)
        x1, y1, x2, y2 = det["bbox"]
        
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w - 1, x2), min(h - 1, y2)

        style = THEME.get(dtype, THEME["Pothole"])
        box_col = style["border"]
        accent_col = style["accent"]

        # Main bounding rectangle
        cv2.rectangle(annotated, (x1, y1), (x2, y2), box_col, 2, cv2.LINE_AA)

        # Tactical corner brackets
        corner_sz = min(20, max(8, int(min(x2 - x1, y2 - y1) * 0.28)))
        # Top-left
        cv2.line(annotated, (x1, y1), (x1 + corner_sz, y1), accent_col, 3, cv2.LINE_AA)
        cv2.line(annotated, (x1, y1), (x1, y1 + corner_sz), accent_col, 3, cv2.LINE_AA)
        # Top-right
        cv2.line(annotated, (x2, y1), (x2 - corner_sz, y1), accent_col, 3, cv2.LINE_AA)
        cv2.line(annotated, (x2, y1), (x2, y1 + corner_sz), accent_col, 3, cv2.LINE_AA)
        # Bottom-left
        cv2.line(annotated, (x1, y2), (x1 + corner_sz, y2), accent_col, 3, cv2.LINE_AA)
        cv2.line(annotated, (x1, y2), (x1, y2 - corner_sz), accent_col, 3, cv2.LINE_AA)
        # Bottom-right
        cv2.line(annotated, (x2, y2), (x2 - corner_sz, y2), accent_col, 3, cv2.LINE_AA)
        cv2.line(annotated, (x2, y2), (x2, y2 - corner_sz), accent_col, 3, cv2.LINE_AA)

        # Label Pill
        label_text = f"{dtype} #{track_id} ({int(conf * 100)}%)"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.48
        font_thick = 1
        (tw, th), baseline = cv2.getTextSize(label_text, font, font_scale, font_thick)

        pill_y1 = max(0, y1 - th - 10)
        pill_y2 = y1
        pill_x1 = x1
        pill_x2 = x1 + tw + 14

        cv2.rectangle(annotated, (pill_x1, pill_y1), (pill_x2, pill_y2), style["fill"], -1)
        cv2.putText(annotated, label_text, (pill_x1 + 7, pill_y2 - 5), font, font_scale, style["text"], font_thick, cv2.LINE_AA)

    # 2. Modern Tactical HUD Overlay (Top-Left)
    hud_w, hud_h = 310, 78
    overlay = annotated.copy()
    cv2.rectangle(overlay, (14, 14), (14 + hud_w, 14 + hud_h), (18, 22, 26), -1)
    cv2.addWeighted(overlay, 0.85, annotated, 0.15, 0, annotated)
    cv2.rectangle(annotated, (14, 14), (14 + hud_w, 14 + hud_h), (60, 75, 90), 1, cv2.LINE_AA)

    # Header
    cv2.putText(annotated, "ROADGUARD AI DEFECT INTELLIGENCE", (24, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (50, 220, 130), 2, cv2.LINE_AA)
    time_str = f"{(frame_idx / max(1, fps)):.1f}s | F {frame_idx}/{total_frames}"
    cv2.putText(annotated, time_str, (185, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (170, 185, 200), 1, cv2.LINE_AA)

    # Live Confirmed Counts
    p_cnt = running_counts.get("potholes", 0)
    c_cnt = running_counts.get("cracks", 0)
    total_cnt = p_cnt + c_cnt

    cv2.putText(annotated, f"Potholes: {p_cnt}", (24, 62), cv2.FONT_HERSHEY_SIMPLEX, 0.46, (70, 160, 255), 1, cv2.LINE_AA)
    cv2.putText(annotated, f"Cracks: {c_cnt}", (135, 62), cv2.FONT_HERSHEY_SIMPLEX, 0.46, (245, 205, 45), 1, cv2.LINE_AA)
    cv2.putText(annotated, f"Total: {total_cnt}", (235, 62), cv2.FONT_HERSHEY_SIMPLEX, 0.46, (255, 255, 255), 1, cv2.LINE_AA)

    # 3. Bottom Status Bar
    cv2.rectangle(annotated, (0, h - 22), (w, h), (14, 17, 20), -1)
    cv2.putText(
        annotated, "High-Precision Road Defect Analyzer | Multi-Scale Cavity & Spatio-Temporal Tracking",
        (12, h - 7),
        cv2.FONT_HERSHEY_SIMPLEX, 0.34, (140, 155, 170), 1, cv2.LINE_AA
    )

    return annotated


def process_video(input_path, output_path, video_id="vid_1"):
    """
    Executes the high-precision detection pipeline on the video stream.
    Re-encodes output to browser-native H.264 MP4.
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input video not found: {input_path}")

    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise RuntimeError(f"Failed to open video stream: {input_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0 or math.isnan(fps):
        fps = 24.0

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    if width <= 0 or height <= 0:
        width, height = 854, 480

    log(f"Processing '{input_path}' ({width}x{height}, {fps:.1f} fps, {total_frames} frames)")

    detector = HighPrecisionRoadDetector()
    tracker = MultiObjectTracker(fps=fps)

    # Write directly to MP4 using OpenCV — no ffmpeg dependency required.
    # Try H.264 (avc1) first; fall back to mp4v which is universally available.
    temp_mp4 = output_path + ".tmp.mp4"
    fourcc_h264 = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter(temp_mp4, fourcc_h264, fps, (width, height))
    if not out.isOpened():
        log("avc1 codec unavailable, falling back to mp4v")
        out.release()
        fourcc_mp4v = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(temp_mp4, fourcc_mp4v, fps, (width, height))
    if not out.isOpened():
        raise RuntimeError("Could not open any VideoWriter codec (tried avc1, mp4v). Check OpenCV installation.")

    frame_idx = 0
    sample_detections = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_idx += 1

        # 1. High-precision defect detection on current frame
        raw_detections = detector.analyze_frame(frame)

        # 2. Spatio-temporal multi-object tracking to maintain persistent IDs
        active_tracked = tracker.update(raw_detections, frame_idx, width, height)

        # Register sample detections for UI
        for t in tracker.active_tracks:
            if t.confirmed and len(sample_detections) < 25:
                exists = any(s.get("track_id") == t.track_id for s in sample_detections)
                if not exists:
                    sample_detections.append({
                        "track_id": t.track_id,
                        "type": t.defect_type,
                        "conf": round(t.max_conf, 2),
                        "frame": frame_idx,
                        "timestamp": round(frame_idx / fps, 2),
                        "bbox": t.smooth_bbox
                    })

        # Calculate current running unique counts
        running_p, running_c = tracker.get_consolidated_counts(width, height)
        running_counts = {
            "potholes": running_p,
            "cracks": running_c
        }

        # 3. Draw annotations on frame
        annotated_frame = draw_high_precision_annotations(
            frame, active_tracked, frame_idx, total_frames, fps, running_counts
        )
        out.write(annotated_frame)

        if frame_idx % 30 == 0 or frame_idx == total_frames:
            pct = int((frame_idx / max(1, total_frames)) * 100)
            log(f"Frame {frame_idx}/{total_frames} ({pct}%) - Verified Potholes: {running_p}, Cracks: {running_c}")

    cap.release()
    out.release()

    # Re-encode to browser-native H.264 MP4 using ffmpeg.
    # OpenCV's mp4v codec is not supported by browsers — H.264 (libx264) is required.
    # Resolution order:
    #   1. imageio_ffmpeg bundled binary (installed via pip, no system install needed)
    #   2. System ffmpeg in PATH
    #   3. Graceful fallback (video will be black in browser)
    log(f"Re-encoding to H.264 for browser playback: {output_path}")

    ffmpeg_exe = None
    # Try imageio_ffmpeg bundled binary first
    try:
        from imageio_ffmpeg import get_ffmpeg_exe
        ffmpeg_exe = get_ffmpeg_exe()
        log(f"Using bundled ffmpeg: {ffmpeg_exe}")
    except Exception:
        pass

    # Fall back to known winget install locations on Windows
    if not ffmpeg_exe:
        _winget_base = os.path.join(os.environ.get("LOCALAPPDATA", ""), "Microsoft", "WinGet", "Packages")
        _candidates = [
            os.path.join(_winget_base, "Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe", "ffmpeg-8.1.1-essentials_build", "bin", "ffmpeg.exe"),
            os.path.join(_winget_base, "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe", "ffmpeg-9.0.1-full_build", "bin", "ffmpeg.exe"),
        ]
        for _c in _candidates:
            if os.path.exists(_c):
                ffmpeg_exe = _c
                log(f"Using winget ffmpeg: {ffmpeg_exe}")
                break

    # Finally fall back to system PATH
    if not ffmpeg_exe:
        ffmpeg_exe = "ffmpeg"
        log("Trying system ffmpeg from PATH...")

    ffmpeg_cmd = [
        ffmpeg_exe, "-y",
        "-i", temp_mp4,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "23",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        output_path
    ]
    try:
        subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=300)
        if os.path.exists(temp_mp4):
            os.remove(temp_mp4)
        log("H.264 re-encode complete — video is browser-ready.")
    except FileNotFoundError:
        log("WARNING: ffmpeg not found. Output video may not play in browser.")
        log("Fix: run `python -m pip install imageio[ffmpeg]` or install ffmpeg from https://ffmpeg.org")
        if os.path.exists(temp_mp4):
            os.replace(temp_mp4, output_path)
    except Exception as e:
        log(f"ffmpeg re-encode failed ({e}). Using raw OpenCV output.")
        if os.path.exists(temp_mp4):
            os.replace(temp_mp4, output_path)

    duration_sec = round(frame_idx / max(1, fps), 2)
    final_potholes, final_cracks = tracker.get_consolidated_counts(width, height)

    result = {
        "video_id": video_id,
        "input_path": input_path,
        "output_path": output_path,
        "pothole_count": final_potholes,
        "crack_count": final_cracks,
        "total_defects": final_potholes + final_cracks,
        "duration_seconds": duration_sec,
        "total_frames": frame_idx,
        "fps": round(fps, 1),
        "resolution": f"{width}x{height}",
        "sample_detections": sample_detections
    }

    return result


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python detector.py <input_video> <output_video> [video_id]"}))
        sys.exit(1)

    input_video = sys.argv[1]
    output_video = sys.argv[2]
    video_id = sys.argv[3] if len(sys.argv) > 3 else "vid_1"

    try:
        os.makedirs(os.path.dirname(os.path.abspath(output_video)), exist_ok=True)
        stats = process_video(input_video, output_video, video_id)
        print(json.dumps(stats))
    except Exception as e:
        err_msg = f"{str(e)}\n{traceback.format_exc()}"
        log(f"Fatal error during processing: {err_msg}")
        print(json.dumps({"error": str(e), "traceback": traceback.format_exc()}))
        sys.exit(1)

if __name__ == "__main__":
    main()
