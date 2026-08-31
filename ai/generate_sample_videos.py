#!/usr/bin/env python3
"""
Generates high-quality realistic road simulation videos featuring potholes and cracks
for testing and pre-loaded demonstration in RoadGuard AI.
"""

import os
import sys
import math
import random
import subprocess
import numpy as np
import cv2

def generate_road_video(output_filename, defect_scenario="mixed", num_frames=100, fps=24, width=854, height=480):
    os.makedirs(os.path.dirname(os.path.abspath(output_filename)), exist_ok=True)
    temp_avi = output_filename + ".raw.avi"
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    out = cv2.VideoWriter(temp_avi, fourcc, fps, (width, height))
    
    random.seed(42 if "1" in output_filename or "highway" in output_filename else (99 if "urban" in output_filename else 123))
    
    vp_x, vp_y = width // 2, int(height * 0.35)
    
    road_color = np.array([75, 78, 80], dtype=np.uint8)
    grass_color = np.array([45, 95, 40], dtype=np.uint8)
    sky_color = np.array([195, 175, 140], dtype=np.uint8)
    
    if defect_scenario == "potholes_focus":
        defects = [
            {"type": "pothole", "lane": -0.35, "z_start": 40, "size": (45, 30)},
            {"type": "pothole", "lane": 0.4, "z_start": 85, "size": (55, 36)},
            {"type": "crack", "lane": 0.1, "z_start": 125, "length": 65, "angle": 0.4},
        ]
    elif defect_scenario == "cracks_focus":
        defects = [
            {"type": "crack", "lane": -0.2, "z_start": 35, "length": 95, "angle": -0.3},
            {"type": "crack", "lane": 0.35, "z_start": 75, "length": 110, "angle": 0.5},
            {"type": "crack", "lane": -0.4, "z_start": 115, "length": 85, "angle": 0.1},
            {"type": "pothole", "lane": 0.25, "z_start": 135, "size": (35, 24)}
        ]
    else: # mixed
        defects = [
            {"type": "pothole", "lane": -0.3, "z_start": 30, "size": (45, 28)},
            {"type": "crack", "lane": 0.25, "z_start": 60, "length": 90, "angle": 0.6},
            {"type": "pothole", "lane": 0.35, "z_start": 95, "size": (55, 35)},
            {"type": "crack", "lane": -0.15, "z_start": 125, "length": 105, "angle": -0.4},
            {"type": "pothole", "lane": -0.4, "z_start": 145, "size": (40, 26)}
        ]
        
    speed = 1.8
    
    for f in range(num_frames):
        current_distance = f * speed
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Sky
        frame[0:vp_y, :] = sky_color
        # Mountains/trees
        for tx in range(0, width, 20):
            th = int(math.sin(tx * 0.02) * 12 + 15)
            cv2.line(frame, (tx, vp_y), (tx + 20, vp_y - th), (40, 75, 45), 2)
        
        # Road shoulder / grass
        frame[vp_y:, :] = grass_color
        
        # Road trapezoid
        road_pts = np.array([
            [vp_x - 30, vp_y],
            [vp_x + 30, vp_y],
            [width + 120, height],
            [-120, height]
        ], np.int32)
        
        cv2.fillPoly(frame, [road_pts], road_color.tolist())
        
        # Road texture noise
        noise = np.random.randint(-10, 10, (height - vp_y, width, 3), dtype=np.int16)
        road_region = frame[vp_y:, :].astype(np.int16) + noise
        frame[vp_y:, :] = np.clip(road_region, 0, 255).astype(np.uint8)
        
        # Center dashed yellow lines
        for d in range(0, 160, 14):
            z = (d - (current_distance % 14))
            if z <= 2 or z > 140:
                continue
            persp = 1.0 / (z * 0.07 + 1.0)
            cur_y = int(vp_y + (height - vp_y) * persp)
            dash_len = int(22 * persp)
            if cur_y >= height or cur_y - dash_len < vp_y:
                continue
            cur_x = vp_x
            cv2.line(frame, (cur_x, cur_y - dash_len), (cur_x, cur_y), (220, 210, 80), max(1, int(5 * persp)), cv2.LINE_AA)
            
        # Side boundary lines
        cv2.line(frame, (vp_x - 30, vp_y), (-120, height), (230, 230, 230), 3, cv2.LINE_AA)
        cv2.line(frame, (vp_x + 30, vp_y), (width + 120, height), (230, 230, 230), 3, cv2.LINE_AA)
        
        # Defects
        for defect in defects:
            z_pos = defect["z_start"] - current_distance
            if 3 < z_pos < 130:
                persp = 1.0 / (z_pos * 0.065 + 1.0)
                screen_y = int(vp_y + (height - vp_y) * (persp ** 1.35))
                road_half_w = (vp_x + 120) * persp
                screen_x = int(vp_x + defect["lane"] * road_half_w * 1.8)
                
                if screen_y < vp_y or screen_y >= height or screen_x < 20 or screen_x >= width - 20:
                    continue
                    
                if defect["type"] == "pothole":
                    bw, bh = defect["size"]
                    scaled_w = max(8, int(bw * persp * 2.2))
                    scaled_h = max(5, int(bh * persp * 1.4))
                    
                    # Dark cavity with edge shadow
                    cv2.ellipse(frame, (screen_x, screen_y), (scaled_w // 2, scaled_h // 2), 0, 0, 360, (20, 20, 22), -1, cv2.LINE_AA)
                    cv2.ellipse(frame, (screen_x + 1, screen_y + 1), (scaled_w // 3, scaled_h // 3), 0, 0, 360, (10, 10, 12), -1, cv2.LINE_AA)
                    cv2.ellipse(frame, (screen_x, screen_y), (scaled_w // 2 + 1, scaled_h // 2 + 1), 0, 30, 200, (40, 42, 45), 2, cv2.LINE_AA)
                    
                elif defect["type"] == "crack":
                    length = defect["length"]
                    scaled_len = max(12, int(length * persp * 2.0))
                    angle = defect["angle"]
                    
                    cur_cx, cur_cy = screen_x, screen_y
                    num_segments = 5
                    seg_len = scaled_len / num_segments
                    
                    for s in range(num_segments):
                        dx = int(math.cos(angle) * seg_len + (random.Random(s + int(defect["z_start"])).random() - 0.5) * 8 * persp)
                        dy = int(math.sin(angle) * seg_len + (random.Random(s * 2 + int(defect["z_start"])).random() - 0.5) * 6 * persp)
                        nxt_x = cur_cx + dx
                        nxt_y = cur_cy + dy
                        
                        cv2.line(frame, (cur_cx, cur_cy), (nxt_x, nxt_y), (15, 17, 18), max(1, int(3 * persp)), cv2.LINE_AA)
                        
                        if s == 2:
                            bx = cur_cx - int(dy * 0.6)
                            by = cur_cy + int(dx * 0.6)
                            cv2.line(frame, (cur_cx, cur_cy), (bx, by), (22, 24, 26), max(1, int(2 * persp)), cv2.LINE_AA)
                            
                        cur_cx, cur_cy = nxt_x, nxt_y
                        
        out.write(frame)
        
    out.release()
    
    subprocess.run([
        "ffmpeg", "-y", "-i", temp_avi,
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-preset", "veryfast", "-crf", "22", "-movflags", "+faststart",
        output_filename
    ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    if os.path.exists(temp_avi):
        os.remove(temp_avi)
    print(f"Generated sample video: {output_filename}")


if __name__ == "__main__":
    os.makedirs("public/samples", exist_ok=True)
    generate_road_video("public/samples/highway_inspection.mp4", "mixed", num_frames=80)
    generate_road_video("public/samples/urban_pothole_patrol.mp4", "potholes_focus", num_frames=70)
    generate_road_video("public/samples/expressway_cracks_survey.mp4", "cracks_focus", num_frames=70)
