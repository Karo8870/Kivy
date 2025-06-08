'use client';

import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const content = `### Overview

The Kivy hardware system is meticulously designed for robust performance, portability, and seamless integration into any kitchen environment. It comprises two primary elements: a **HY320 projector** and an integrated **video camera**, both strategically mounted on a versatile support structure.

*   **The HY320 Projector:** This compact projector is the visual output core of Kivy. Its primary function is to project the interactive user interface directly onto any flat, neutral surface within the kitchen, such as a countertop, dining table, or wall. This effectively transforms these mundane surfaces into **dynamic, interactive digital displays**. The choice of the HY320 was driven by its balance of projection quality, compact form factor, and suitability for ambient lighting conditions typical in a kitchen.
*   **The Integrated Video Camera:** Positioned alongside the projector, the camera is the sensory input component. Its crucial role is to **detect and track user gestures and hand positions** within the projected workspace. By continuously monitoring the interaction area, the camera enables hands-free control of the application, eliminating the need for any physical contact with the interface. This feature significantly enhances hygiene, especially during cooking when hands may be wet or messy.
*   **Versatile Support Structure:** The projector and camera are attached to a fixed support, which can be a permanent fixture (like a kitchen wall or cabinet) or a portable setup. For practical demonstration and ease of transport, Kivy utilizes an **improvised, modular wall constructed from two main panels joined by hinges**. This clever design allows the entire hardware assembly to be easily folded and transported, offering unparalleled flexibility for presentations, demonstrations, or relocation within different kitchen setups.

The processing power and software logic underpinning Kivy are provided by a **Raspberry Pi 5 microcomputer**. This choice was deliberate due to its **small footprint, low power consumption, and excellent capabilities for local processing**, especially in computer vision and real-time interaction. The Raspberry Pi 5 can be discreetly placed near the system, connecting to the projector and camera either directly via cables or wirelessly, depending on the chosen configuration. Crucially, all computationally intensive tasks—such as image processing for gesture recognition and managing the interactive interface—are performed locally on the Raspberry Pi. This **minimizes latency, ensures responsiveness, and eliminates reliance on external internet connectivity** for core functionalities, making Kivy reliable even in environments with patchy Wi-Fi.

This integrated hardware configuration transforms any ordinary flat surface into a responsive, intelligent workstation, ideal not only for kitchens but also for educational settings, creative workshops, or any space where hands-free digital interaction is desired.

**Key Software Functionalities (Hardware-Enabled):**
The hardware-software synergy enables a suite of functionalities directly accessible through the projected interface:

*   **Timer:** A digital timer that can be started, paused, and reset via gestures, perfect for managing cooking times.
*   **Cutting Outline Tool:** An innovative feature that projects visual guides onto ingredients (e.g., lines for precise cutting), enhancing accuracy and safety in food preparation.
*   **AI Hub Integration:** This module displays and controls various AI-powered features, acting as a central access point for intelligent assistance.
*   **Recipe Visualization:** A system for hands-free browsing and interaction with cooking recipes, displaying steps, ingredients, and nutritional information directly on the workspace.

For **gesture recognition and hand positioning**, Kivy leverages a sophisticated visual processing model built upon **MediaPipe technology**. MediaPipe is a versatile framework for building multimodal applied machine learning pipelines, providing highly accurate and real-time hand landmark detection. After an initial calibration phase, the precise coordinate data provided by MediaPipe is fed into a **homography algorithm**. This algorithm is paramount: it transforms the detected 2D coordinates from the camera's image plane (representing the user's hand) into the virtual coordinates of the projected interface on the kitchen surface. This precise mapping ensures that any gesture or "touch" performed above the physical workspace is accurately translated into a corresponding interaction within the projected digital environment.
`;

export default function IntroductionPage() {
  return <MarkdownRenderer content={content} />;
}
