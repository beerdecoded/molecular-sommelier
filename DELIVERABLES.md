# Project Complete: Molecular Beer Recommendation App 🍺🧬

## Project Overview
We have successfully built a **Biohacker-themed Single Page Application** that recommends beers based on their molecular similarity (Raman spectroscopy) and yeast genetics (Phylogenetic distance).

**Current Version: v2.2 (About Page Added)**

## 🚀 Key Features

### 1. Geographic Discovery Engine
- **Interactive Map**: Explore beers by continent and subregion using a custom SVG interface.
- **Smart Navigation**: Automatically adjusts granularity based on beer density (World -> Continent -> Subregion).
- **"Pub Menu"**: A curated list view for final selection.

### 2. Molecular Recommendation Logic
- **Golden Ratio Scoring**: $0.618 \times Raman + 0.382 \times Yeast$.
- **Barman Modes**: Automatically switches between "Comfort Zone" (Top 10%) and "Wander Away" (Exploration).
- **Scientific Visualization**: Real-time "Sequencing" animations and Raman barcode visualization.

### 3. Biohacker UI/UX
- **Theme**: Dark mode (Slate-950) with vibrant yellow accents and industrial typography (Inter + JetBrains Mono).
- **Data Transparency**: Visual icons indicate available molecular data:
    - 🧬 **DNA Icon**: Yeast genomic data available.
    - 🌈 **Prism Icon**: Raman spectral data available.
- **Animations**: Smooth fade-ins, slide-ups, and data stream effects.

### 4. Project Story (NEW)
- **About Page**: A nostalgic timeline chronicling the project's journey from the 2015 Kickstarter campaign to the 2025 "Vibe Coding" era.
- **External Links**: Direct access to the Kickstarter archive, YouTube video, peer-reviewed publication, and GitHub repository.
- **Interactive Navigation**: Seamless transitions between the app and the About page.

## 🛠️ Technical Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS v4.
- **Data**: Custom ETL pipeline processing CSV and Newick files into optimized JSON.
- **Testing**: Vitest for logic verification.

## 📂 Project Structure
```
beerdecoded/
├── public/data/       # Processed JSON assets (beers, raman, yeast, tree)
├── src/
│   ├── components/    # UI Components (GeoMap, BeerCard, About, Barcode...)
│   ├── context/       # State Management (Data, Selection)
│   ├── engine/        # Recommendation Logic
│   ├── utils/         # Math & Bio Algorithms
│   └── App.tsx        # Main Application Flow
├── etl.js             # Data Processing Script
└── package.json       # Dependencies & Scripts
```

## 🏁 How to Run
1.  **Install Dependencies**: `npm install`
2.  **Process Data**: `npm run etl`
3.  **Start App**: `npm run dev`
4.  **Test Logic**: `npm test`

## 🌟 What's New in v2.2
- **About Page**: Added a beautiful timeline-based About page with project history
- **Enhanced Navigation**: Clickable logo and dedicated "ABOUT_PROJECT" button in header
- **External Resources**: Links to Kickstarter, YouTube, F1000Research paper, and GitHub

The application is ready for deployment! 🚀
