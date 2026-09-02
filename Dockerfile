FROM node:20-bookworm-slim

# Install system dependencies: Python, FFmpeg, and OpenCV libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install Python dependencies
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy application source
COPY . .

# Build Vite frontend and server bundle
RUN npm run build

# Default environment variables
ENV PORT=3000
ENV NODE_ENV=production
ENV PYTHON_CMD=python3

EXPOSE 3000

CMD ["npm", "start"]
