# Project Complete: Molecular Beer Recommendation App 🍺🧬

## Project Overview
We have successfully built a **Biohacker-themed Single Page Application** that recommends beers based on their molecular similarity (Raman spectroscopy) and yeast genetics (Phylogenetic distance).

## 🚀 Final Deliverables

### 1. Core Logic & Engine
- **Math Utilities**: `sfecSimilarity` (Raman shape analysis) and `cosineSimilarity`.
- **Bio Utilities**: `calculateUniFrac` (Weighted UniFrac for phylogenetic distance).
- **Recommendation Engine**:
    - **Golden Ratio Scoring**: $0.618 \times Raman + 0.382 \times Yeast$.
    - **Barman Modes**: Automatically switches between "Comfort Zone" (Top 10%) and "Wander Away" (Exploration) based on user indecision and selection homogeneity.

### 2. User Interface (Biohacker Theme)
- **Design System**:
    - **Colors**: Slate-950 canvas, Vibrant Yellow (#FACC15) accents, Green data text.
    - **Typography**: Inter (UI) + JetBrains Mono (Data).
    - **Visuals**: Diffraction grating background, industrial borders, glowing hover effects.
- **Components**:
    - `BeerCard`: Interactive card with integrated `Barcode` visualization of Raman spectra.
    - `SequencingLoader`: Scientific "DNA processing" animation during analysis.
    - `Layout`: Responsive shell with sticky header and system status footer.

### 3. State Management
- **Context API**:
    - `DataContext`: Loads 4 JSON datasets (~1.5MB) in parallel.
    - `SelectionContext`: Manages user selection (max 3), timer, and analysis flow.

### 4. Data Pipeline
- **ETL Script**: `etl.js` processes raw CSV/Newick files into optimized JSON assets.
- **Assets**:
    - `beers.json` (118 samples)
    - `raman.json` (Spectral data)
    - `yeast.json` (Genomic profiles)
    - `tree.json` (Phylogenetic tree)

## 🧪 Verification
- **Unit Tests**: 25/25 tests passed covering Math, Bio, and Engine logic.
- **UI Verification**: Verified layout, selection states, and theming via screenshots.
- **Browser Check**: App loads and runs on `http://localhost:5173`.

## 📂 Project Structure
```
beerdecoded/
├── public/data/       # Processed JSON assets
├── src/
│   ├── components/    # UI Components (BeerCard, Barcode, Loader...)
│   ├── context/       # State Management (Data, Selection)
│   ├── engine/        # Recommendation Logic
│   ├── utils/         # Math & Bio Algorithms
│   ├── App.tsx        # Main Application Flow
│   └── index.css      # Tailwind & Custom Animations
├── etl.js             # Data Processing Script
└── package.json       # Dependencies & Scripts
```

## 🏁 How to Run
1.  **Install Dependencies**: `npm install`
2.  **Process Data** (Optional, already done): `npm run etl`
3.  **Start App**: `npm run dev`
4.  **Test Logic**: `npm test`

The application is ready for deployment! 🚀
