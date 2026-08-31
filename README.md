# RoadGuard 

### AI-Powered Road Defect Detection System

> **Computer Vision • YOLO • OpenCV • FastAPI • React**\
> **Project:** RoadGuard AI\
> **Purpose:** Detect potholes and road cracks from road inspection
> videos

------------------------------------------------------------------------
<img width="1769" height="752" alt="image" src="https://github.com/user-attachments/assets/a2a7542e-447c-4657-be51-33896e90dffe" />

## 🚧 What is RoadGuard AI?

**RoadGuard AI** is an AI-powered road inspection system that analyzes
road videos and automatically detects common road defects such as:

-   🕳️ Potholes
-   🛣️ Road cracks

Instead of manually watching hours of road footage, RoadGuard AI
processes uploaded videos using a **YOLO object-detection model** and
**OpenCV**.

The system identifies defects, draws bounding boxes around them,
calculates confidence scores, counts detected defects, and generates an
annotated output video.

### Core Flow

``` text
Upload Multiple Videos
          ↓
    Video Processing
          ↓
     Frame Extraction
          ↓
       YOLO Model
          ↓
 Detect Potholes / Cracks
          ↓
 Bounding Boxes + Confidence
          ↓
   Annotated Output Video
          ↓
       Results Page
```

------------------------------------------------------------------------

## 🎯 Problem

Road damage is commonly identified through manual inspection.

This creates several problems:

-   Manual inspection takes significant time.
-   Large amounts of road footage are difficult to analyze.
-   Small potholes and cracks can be missed.
-   Inspection results can be inconsistent.
-   Processing large video datasets manually does not scale.

RoadGuard AI aims to make road inspection faster and more consistent by
automatically analyzing road footage using computer vision.

------------------------------------------------------------------------

## 💡 Our Solution

RoadGuard AI allows a user to upload multiple road videos.

The system:

1.  Accepts multiple video files.
2.  Extracts frames from each video.
3.  Runs a YOLO object-detection model on the frames.
4.  Detects potholes and road cracks.
5.  Draws bounding boxes around detected defects.
6.  Displays confidence scores.
7.  Counts potholes and cracks.
8.  Generates an annotated video.
9.  Displays the final detection results.
10. Allows users to download the processed video.

### Example Detection

``` text
┌─────────────────────────────────┐
│                                 │
│       ┌──────────────────┐      │
│       │     POTHOLE      │      │
│       │     94.6%        │      │
│       └──────────────────┘      │
│                                 │
└─────────────────────────────────┘
```

------------------------------------------------------------------------

# ✨ Key Features

## 📹 Multiple Video Upload

Users can upload multiple road videos at once.

### Supported Formats

-   MP4
-   MOV
-   AVI
-   WebM

The upload interface supports:

-   Drag and drop
-   Browse files
-   Multiple file selection
-   Selected file preview
-   Removing individual files
-   Batch analysis

------------------------------------------------------------------------

## 🤖 AI-Based Defect Detection

RoadGuard AI uses **YOLO** for object detection.

The application focuses on:

``` text
POTHOLE
ROAD CRACK
```

For every detection, the system provides:

-   Bounding box
-   Defect class
-   Confidence score

Example:

``` text
POTHOLE     94.6%
ROAD CRACK  91.2%
```

------------------------------------------------------------------------

## 🎥 Video Processing

The backend uses **OpenCV** to process videos frame-by-frame.

``` text
Video
  ↓
OpenCV
  ↓
Frame Extraction
  ↓
YOLO Detection
  ↓
Draw Bounding Boxes
  ↓
Write Annotated Frames
  ↓
Output Video
```

The final video contains the detected defects directly on the original
road footage.

------------------------------------------------------------------------

## 📊 Detection Results

For every processed video, RoadGuard AI displays:

-   Original filename
-   Processing status
-   Number of potholes
-   Number of cracks
-   Total defects
-   Annotated video
-   Download option

Example:

``` text
road_01.mp4

Potholes: 12
Cracks:    5
Total:    17

[▶ View Processed Video]

[Download]
```
<img width="733" height="700" alt="image" src="https://github.com/user-attachments/assets/d2dc859b-1b04-4525-9cef-6e94f0253ce5" />

------------------------------------------------------------------------

# 🧠 AI Model

## YOLOv8

RoadGuard AI uses the **Ultralytics YOLO** object-detection framework.

### Initial Model

``` text
YOLOv8n
```

YOLOv8n is used as the initial lightweight detection architecture
because it provides a practical balance between:

-   Detection speed
-   Model size
-   CPU/GPU performance
-   Real-time inference capability

The model-loading layer is kept separate so that a custom trained
pothole/crack model can be added or upgraded without changing the rest
of the application.

### Model Pipeline

``` text
Input Frame
     ↓
Image Preprocessing
     ↓
YOLOv8n / Custom YOLO Model
     ↓
Object Detection
     ↓
Class + Bounding Box
     ↓
Confidence Filtering
     ↓
Annotated Frame
```

> **Important:** YOLOv8n is the detection architecture. For meaningful
> pothole and road-crack detection, the model must be trained or
> fine-tuned on a road-defect dataset. The application should not use
> random or hardcoded detection results.

------------------------------------------------------------------------

# 🗃️ Dataset

RoadGuard AI requires a labeled road-defect dataset containing
road-surface images with bounding-box annotations.

A suitable public starting point is the **RDD2022 (Road Damage
Dataset)**, which contains road images representing different categories
of road damage.

Typical categories include:

``` text
Longitudinal Crack
Transverse Crack
Alligator Crack
Pothole
```

For the RoadGuard AI application, these can be mapped into two main
user-facing classes:

``` text
Pothole
Road Crack
```

### Dataset Workflow

``` text
Public Road Damage Dataset
          ↓
     Data Cleaning
          ↓
   Select Road Classes
          ↓
   Convert Annotations
          ↓
 Train / Validation / Test Split
          ↓
       YOLO Training
          ↓
    Best Model Weights
          ↓
      RoadGuard AI
```

> The final repository should document the exact dataset source,
> license, preprocessing steps, class mapping, and train/validation/test
> split used for the trained model.

------------------------------------------------------------------------

# 🎯 Detection Classes

RoadGuard AI focuses on two main application-level classes:

  Class          Description
  -------------- -----------------------------------------------
  `pothole`      Depressions or holes in the road surface
  `road_crack`   Visible cracks or fractured areas on the road

If the training dataset contains multiple crack categories, they can be
consolidated into the application-level class:

``` text
Longitudinal Crack ─┐
Transverse Crack    ├──→ ROAD CRACK
Alligator Crack     ┘
```

This keeps the user interface simple while allowing the model to learn
from more detailed training labels.

------------------------------------------------------------------------

# ⚙️ Confidence Threshold

The YOLO confidence threshold determines which detections are displayed.

Example backend configuration:

``` env
CONFIDENCE_THRESHOLD=0.40
```

The threshold can be adjusted depending on validation performance.

A lower threshold may increase recall but can introduce more false
positives.

A higher threshold may reduce false positives but can miss smaller or
less-visible defects.

------------------------------------------------------------------------

# 🏗️ System Architecture

``` text
                    ┌──────────────────────┐
                    │      React UI        │
                    │ Upload / Results     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │     REST Backend     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Video Processor    │
                    │       OpenCV         │
                    └──────────┬───────────┘
                               │
                         Video Frames
                               │
                               ▼
                    ┌──────────────────────┐
                    │      YOLO Model      │
                    │ Pothole / Road Crack │
                    └──────────┬───────────┘
                               │
                    Detection Results
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Annotated Video      │
                    │ + Counts + Scores    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      React UI        │
                    │      Results         │
                    └──────────────────────┘
```

------------------------------------------------------------------------

# 🛠️ Tech Stack

## AI / Computer Vision

-   `YOLOv8` --- object detection
-   `Ultralytics` --- YOLO framework
-   `OpenCV` --- video processing and frame extraction
-   `NumPy` --- numerical processing
-   `PyTorch` --- deep-learning runtime

## Backend

-   `Python`
-   `FastAPI`
-   `Uvicorn`
-   `Pydantic`

## Frontend

-   `React`
-   `Vite`
-   `CSS / Tailwind CSS`

## Video

-   `OpenCV`
-   `FFmpeg`

------------------------------------------------------------------------

# 📁 Project Structure

``` text
road_detection/
│
├── backend/
│   ├── main.py
│   ├── routes/
│   │   ├── upload.py
│   │   ├── analysis.py
│   │   └── results.py
│   ├── services/
│   │   ├── video_processor.py
│   │   ├── detector.py
│   │   └── result_manager.py
│   ├── models/
│   │   └── yolov8_model.pt
│   └── config.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoUploader.jsx
│   │   │   ├── VideoList.jsx
│   │   │   ├── ProcessingStatus.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── DetectionSummary.jsx
│   │   ├── pages/
│   │   │   ├── Upload.jsx
│   │   │   └── Results.jsx
│   │   └── App.jsx
│   └── package.json
│
├── models/
│   └── best.pt
│
├── data/
│   ├── uploads/
│   ├── outputs/
│   └── dataset/
│
├── requirements.txt
├── .env.example
└── README.md
```

------------------------------------------------------------------------

# 🚀 Quick Start

## Prerequisites

-   Python 3.10+
-   Node.js 18+
-   npm
-   FFmpeg
-   Git
-   8GB+ RAM recommended

A GPU is recommended for faster YOLO inference but is not mandatory for
development.

------------------------------------------------------------------------

## 1. Clone the Repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd road_detection
```

------------------------------------------------------------------------

## 2. Create Python Virtual Environment

### Linux / macOS

``` bash
python3 -m venv venv
source venv/bin/activate
```

### Windows

``` bash
python -m venv venv
venv\Scriptsctivate
```

------------------------------------------------------------------------

## 3. Install Python Dependencies

``` bash
pip install --upgrade pip
pip install ultralytics opencv-python numpy
pip install fastapi uvicorn python-multipart
```

Or:

``` bash
pip install -r requirements.txt
```

------------------------------------------------------------------------

## 4. Verify AI Dependencies

``` bash
python3 -c "import cv2, numpy, torch; print('OpenCV:', cv2.__version__); print('NumPy:', numpy.__version__); print('PyTorch:', torch.__version__)"
```

Verify YOLO:

``` bash
python3 -c "from ultralytics import YOLO; print('Ultralytics YOLO: OK')"
```

------------------------------------------------------------------------

## 5. Add the Trained Model

Place the trained model inside:

``` text
models/best.pt
```

Example:

``` text
road_detection/
└── models/
    └── best.pt
```

The model should be trained for the required road-defect classes.

------------------------------------------------------------------------

# 🧪 Training the YOLO Model

After preparing the dataset in YOLO format:

``` text
dataset/
├── images/
│   ├── train/
│   └── val/
├── labels/
│   ├── train/
│   └── val/
└── data.yaml
```

Example `data.yaml`:

``` yaml
path: ./dataset

train: images/train
val: images/val

names:
  0: pothole
  1: road_crack
```

Train the model:

``` bash
yolo detect train     data=dataset/data.yaml     model=yolov8n.pt     epochs=50     imgsz=640
```

After training, the best model will typically be available at:

``` text
runs/detect/train/weights/best.pt
```

Copy it to:

``` text
models/best.pt
```

------------------------------------------------------------------------

# 🔍 Testing YOLO Detection

Test the trained model on an image:

``` bash
yolo detect predict     model=models/best.pt     source=test.jpg     conf=0.40
```

Test it on a video:

``` bash
yolo detect predict     model=models/best.pt     source=road_video.mp4     conf=0.40
```

------------------------------------------------------------------------

# 🐍 Python Detection Example

``` python
from ultralytics import YOLO

model = YOLO("models/best.pt")

results = model(
    "road_video.mp4",
    conf=0.40,
    save=True
)

for result in results:
    for box in result.boxes:
        class_id = int(box.cls[0])
        confidence = float(box.conf[0])

        print(
            f"Class: {class_id}, "
            f"Confidence: {confidence:.2%}"
        )
```

------------------------------------------------------------------------

# 🎥 Video Processing Pipeline

For every uploaded video:

``` text
             Input Video
                  │
                  ▼
          Validate File
                  │
                  ▼
           OpenCV VideoCapture
                  │
                  ▼
             Read Frame
                  │
                  ▼
             YOLO Inference
                  │
                  ▼
        ┌─────────┴─────────┐
        │                   │
     Pothole            Road Crack
        │                   │
        └─────────┬─────────┘
                  ▼
         Confidence Filter
                  │
                  ▼
        Draw Bounding Boxes
                  │
                  ▼
          Write Output Frame
                  │
                  ▼
          Annotated Video
                  │
                  ▼
        Detection Statistics
```

------------------------------------------------------------------------

# 📊 Result Calculation

For every video:

``` text
Potholes = Number of pothole detections
Cracks   = Number of road-crack detections
Total    = Potholes + Cracks
```

Example:

``` text
Video: road_01.mp4

Potholes: 12
Cracks:    5
Total:    17
```

The backend returns structured results to the frontend.

Example:

``` json
{
  "filename": "road_01.mp4",
  "status": "completed",
  "potholes": 12,
  "cracks": 5,
  "total_detections": 17,
  "output_video": "/outputs/road_01_annotated.mp4"
}
```

------------------------------------------------------------------------

# 🔌 API Design

## Upload Videos

``` http
POST /api/videos/upload
```

Uploads one or more supported video files.

------------------------------------------------------------------------

## Start Analysis

``` http
POST /api/videos/analyze
```

Starts YOLO processing for uploaded videos.

------------------------------------------------------------------------

## Processing Status

``` http
GET /api/videos/{video_id}/status
```

Returns:

``` json
{
  "status": "processing",
  "progress": 78,
  "message": "Detecting road defects..."
}
```

Possible states:

``` text
waiting
processing
completed
failed
```

------------------------------------------------------------------------

## Get Results

``` http
GET /api/videos/{video_id}/results
```

Returns detection counts and output information.

------------------------------------------------------------------------

## Download Processed Video

``` http
GET /api/videos/{video_id}/download
```

Returns the annotated video.

------------------------------------------------------------------------

# 🖥️ User Interface

## Home / Upload Page

The main page contains:

-   RoadGuard AI logo
-   Short product description
-   Drag-and-drop upload area
-   Browse files button
-   Selected video list
-   Remove file controls
-   Analyze Videos button

### UI Direction

``` text
White Background
       +
Dark Text
       +
Green Accent
       +
Soft Borders
       +
Rounded Cards
       +
Clean Typography
```

The interface is intentionally minimal and focused on the core workflow.

------------------------------------------------------------------------

# 📈 Processing Experience

While a video is being analyzed, the interface displays progress.

Example:

``` text
Analyzing road_01.mp4

██████████████░░░░ 78%

Detecting road defects...
```

Each video can have its own state:

``` text
WAITING
   ↓
PROCESSING
   ↓
COMPLETED
```

If processing fails:

``` text
FAILED
```

A failed video should not prevent the remaining videos from being
processed.

------------------------------------------------------------------------

# 📋 Results Page

The results page contains an overall summary:

``` text
Videos Analyzed: 5
Total Potholes:  38
Total Cracks:    21
Total Defects:   59
```

Each video gets its own result card:

``` text
┌──────────────────────────────────────┐
│ road_01.mp4                          │
│                                      │
│ Potholes: 12                         │
│ Cracks:    5                         │
│ Total:    17                         │
│                                      │
│ [▶ View Processed Video]             │
│ [Download]                            │
└──────────────────────────────────────┘
```

------------------------------------------------------------------------

# ❌ Error Handling

RoadGuard AI handles common failures professionally.

### Unsupported Format

``` text
Unsupported video format.
Please upload MP4, MOV, AVI, or WebM.
```

### Corrupted Video

``` text
Unable to read this video.
Please try another file.
```

### Processing Failure

``` text
Video processing failed.
The remaining videos will continue processing.
```

### No Defects

A video containing no detected defects is **not considered an error**.

``` text
No defects detected

No potholes or road cracks were detected in this video.
```

### Backend Unavailable

``` text
Unable to connect to the RoadGuard AI backend.
Please try again.
```

------------------------------------------------------------------------

# 🔐 Configuration

Example `.env`:

``` env
CONFIDENCE_THRESHOLD=0.40
MODEL_PATH=models/best.pt

MAX_VIDEO_SIZE_MB=500

ALLOWED_EXTENSIONS=mp4,mov,avi,webm
```

------------------------------------------------------------------------

# 📦 Requirements

Example `requirements.txt`:

``` text
ultralytics
opencv-python
numpy
torch
torchvision
fastapi
uvicorn
python-multipart
pydantic
```

------------------------------------------------------------------------

# 🧪 Testing

Run backend tests:

``` bash
pytest
```

Test the model:

``` bash
python tests/test_detector.py
```

Test video processing:

``` bash
python tests/test_video_processor.py
```

Test the API:

``` bash
python tests/test_api.py
```

------------------------------------------------------------------------

# 🗺️ Development Roadmap

## Phase 1 --- Core Detection

-   [x] Project structure
-   [x] YOLO integration
-   [x] OpenCV video processing
-   [x] Pothole detection
-   [x] Road-crack detection
-   [x] Bounding boxes
-   [x] Confidence scores

## Phase 2 --- Backend

-   [x] FastAPI setup
-   [x] Multiple video upload
-   [x] Video processing endpoint
-   [x] Processing status
-   [x] Result API
-   [x] Annotated video download

## Phase 3 --- Frontend

-   [x] React application
-   [x] Drag-and-drop uploader
-   [x] Video list
-   [x] Processing status
-   [x] Results dashboard
-   [x] Annotated video preview
-   [x] Download button

## Phase 4 --- Model Improvement

-   [ ] Collect additional road images
-   [ ] Improve dataset quality
-   [ ] Fine-tune YOLO
-   [ ] Evaluate precision and recall
-   [ ] Improve small-defect detection
-   [ ] Test different confidence thresholds

------------------------------------------------------------------------

# 🎯 Project Goals

RoadGuard AI focuses on four main goals:

### 1. Faster Inspection

Reduce the amount of manual video inspection required.

### 2. Automated Detection

Use computer vision to identify potholes and cracks automatically.

### 3. Clear Evidence

Generate annotated videos showing exactly where defects were detected.

### 4. Simple Workflow

Keep the product focused:

``` text
Upload
  ↓
Analyze
  ↓
Detect
  ↓
Review
  ↓
Download
```

------------------------------------------------------------------------

# 👥 Team

  Member          Responsibility
  --------------- -----------------------
  Team Member 1   AI / ML & YOLO
  Team Member 2   Backend / FastAPI
  Team Member 3   Frontend / React
  Team Member 4   Testing / Integration

------------------------------------------------------------------------

# 📌 Important Technical Notes

-   RoadGuard AI does **not** use hardcoded or random detection results.
-   Detection results come from the configured YOLO model.
-   The model must be trained or fine-tuned on appropriate road-defect
    data for meaningful pothole/crack detection.
-   OpenCV handles video decoding, frame reading, annotation, and output
    video generation.
-   The frontend communicates with the FastAPI backend rather than
    performing model inference directly.
-   The model-loading layer is separated so a better trained model can
    replace the initial YOLOv8n model later.
-   Dataset licensing and attribution should be checked before using any
    public dataset in production.

------------------------------------------------------------------------

# ⭐ Why RoadGuard AI?

RoadGuard AI combines:

``` text
Computer Vision
      +
YOLO Object Detection
      +
OpenCV Video Processing
      +
FastAPI Backend
      +
React Frontend
```

into one focused road-inspection workflow.

The goal is simple:

> **Upload road videos → Detect potholes and cracks → Generate annotated
> evidence → Review the results.**

------------------------------------------------------------------------

## 📄 License

This project is licensed under the MIT License.

------------------------------------------------------------------------

### Built with ❤️ using Python, YOLO, OpenCV, FastAPI and React.

**RoadGuard AI --- Making Road Inspection Smarter.**
