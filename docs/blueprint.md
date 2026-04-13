# **App Name**: SkillBridge

## Core Features:

- Scroll-Driven Animation Display: Implement the fixed sticky canvas and frame-scrubbing logic to display the career path animation seamlessly based on user scroll progress from the provided image sequence.
- Hero Content Overlay: Display minimalist typographic content, including large, bold headings, overlaid on the initial 10% of the scroll animation.
- Interactive Skill-Gap Analyzer: Develop a glassmorphism UI panel that slides into view from the bottom, synchronized with the 'Bridge' animation frames, allowing users to initiate a skill-gap analysis.
- Dynamic Roadmap Section: Present an asymmetrical layout where text panels appear on the right side of the screen, dynamically revealing content alongside the 'Staircase' animation frames in the background.
- Analyzer Data Submission: Integrate the 'Analyzer' upload button to send user-submitted data to the specified 'analyses' collection in Firestore for storage and processing.
- Analysis Feedback & Results: Implement a UI to display a 'Computing' state with a spinning purple loader while analysis is in progress, then reveal the analysis results over the final frames of the animation.

## Style Guidelines:

- Background: A deep, desaturated violet representing a 'Space Gray' equivalent (#1F102D), providing a dark, sophisticated canvas.
- Primary Color: A luminous violet (#B37DE8) that provides a 'subtle purple glow' for key terms and interactive elements against the dark background.
- Accent Color: A bright, clear blue (#9393EC) analogous to the primary, used for additional highlights and creating visual hierarchy consistent with a 'Titanium White' aesthetic in accents.
- UI cards and panels will feature a heavy 'backdrop-blur-xl' effect, accented with a 1px silver border for a refined, modern, and translucent appearance.
- Body and headline font: 'Inter' (sans-serif) for its clean, modern, and highly readable qualities, fitting the Apple aesthetic. Headings will use large, bold weights with tight tracking, and key terms will subtly feature the primary purple glow.
- Minimalist and sleek, system-style icons should be used throughout the interface, adhering to the sophisticated and understated Apple aesthetic.
- Animations should be fluid and high-fidelity; frame transitions for the main scroll animation should be instantaneous. UI elements like panels and loaders will slide in and out smoothly or provide subtle, engaging feedback.