# SecureVision — Real-Time AI Surveillance System
An AI-powered system for detecting suspicious activity across live video streams using computer vision.

---

## Live Demo
https://secure-vision-phi.vercel.app/

---

## Overview

SecureVision is a real-time computer vision system that analyzes video streams to detect events and generate actionable insights.

Unlike traditional CCTV systems that only record footage, this system processes frames continuously and identifies relevant activity as it happens.

---

## Key Highlights

- Real-time AI inference on live video streams  
- End-to-end pipeline: input → detection → output  
- Deployed and accessible (production-oriented approach)  
- Designed for scalability across multiple camera feeds  

---

## Problem

Traditional surveillance systems are passive:
- They record but do not interpret  
- They require constant human monitoring  
- Critical events are often missed in real time  

---

## Solution

SecureVision introduces an active monitoring system:
- Detects objects and events using computer vision  
- Processes frames in real time with low latency  
- Provides structured outputs for downstream actions  

---

## System Architecture

Camera Feed → Frame Extraction → Detection Model (YOLO) → Event Processing → UI Display

---

## Tech Stack

- Computer Vision: YOLO, OpenCV  
- Language: TypeScript / Python (if applicable)  
- Processing: Real-time inference pipeline  
- Deployment: Vercel  

---

## Core Features

- Live video stream processing  
- Real-time object detection  
- Low-latency inference pipeline  
- Visual interface for monitoring  

---

## Performance
  
- Detection Accuracy: 77%  

---

## Challenges & Engineering Decisions

- Maintaining real-time performance under continuous input  
- Balancing detection accuracy with latency  
- Structuring a pipeline suitable for scaling to multiple feeds  

---

## Future Improvements

- Multi-camera synchronization  
- Edge deployment (Jetson / Raspberry Pi)  
- Behavior analysis using sequence models  
- Alerting system (notifications / triggers)  

---

## Why This Project Matters

This project demonstrates:
- Real-time AI system design  
- Integration of ML models into usable systems  
- Practical deployment mindset  

---

## Author

Miral Hasan
