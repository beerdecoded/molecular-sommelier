# revised-spec.md (Final - Client-Side + UniFrac)

# 🍺 Molecular Beer Recommendation App: Technical Specification

## 1. Introduction & Core Concept

The goal is to build a **Static Single Page Application (SPA)** that recommends **two beers** based on molecular similarity to user-selected beers.

**Architecture Decision:**
All data (Metadata, Raman, Yeast, Phylogenetic Tree) is small enough (< 10MB total) to be bundled directly into the frontend. We will **not** use a backend API. The app will load data into memory and run the recommendation engine entirely in the browser.

---

## 2. Tech Stack

* **Architecture:** Client-Side Only (Static Site).
* **Framework:** React (Vite) or Vue 3.
* **Language:** TypeScript or JavaScript (ES6+).
* **Data Handling:** Custom ETL script to prep JSON files.
* **Math/Bio Logic:** Custom JavaScript implementation for SFEC and Weighted UniFrac.
* **Maps:** `react-simple-maps` or lightweight SVG.

---

## 3. Data Preparation (ETL Script)

**Constraint:** The AI coder must create a pre-processing script (e.g., `etl.js`) to convert raw CSVs/NWK into JSON assets.

### 3.1. Filtering Rules
* **Align Data:** Ensure Beer IDs are consistent across all files.

### 3.2. JSON Data Structures

**A. `beers.json` (Metadata)**
List of all valid beers. Derived from `beers-db.csv`.
```json
[
  {
    "id": 1,
    "name": "Wittekop",
    "brewery": "Brasserie Lefebvre",
    "has_yeast_data": false
  },
  ...
]
```

**B. `raman.json` (Spectra)**
Object Map: `ID -> Vector`. [cite_start]Derived from `raman-data.csv`[cite: 8].
* **Value:** Array of 2048 floats.
* **Optimization:** Round floats to 4 decimal places to save space.

**C. `yeast.json` (Abundance)**
Object Map: `ID -> Species Counts`. [cite_start]Derived from `yeast-data.csv`[cite: 7].
* **Value:** `{ "Saccharomyces cerevisiae": 500, "Brettanomyces...": 120 }`.
* **Note:** Only includes the ~39 beers with sequencing data.

**D. `tree.json` (Phylogenetic Tree)**
Parsed representation of `yeast-tree.nwk`.
* **Format:** A nested node structure or edge list that allows for easy traversal.
* **Goal:** Pre-parse the Newick string in the ETL step so the frontend logic is simpler. The structure must include **branch lengths** and **node names**.

---

## 4. Recommendation Engine (Client-Side)

Runs immediately when the user clicks "Recommend".

### 4.1. Similarity Metrics

**A. Raman Similarity ($S_{Raman}$)**
**Metric:** Squared First-Difference Euclidean Cosine (SFEC).
1.  **Differentiate:** $V'_i = V_{i+1} - V_i$.
2.  **Cosine:** $\text{Sim}(A, B) = \frac{A' \cdot B'}{\|A'\| \|B'\|}$.

**B. Yeast Similarity ($S_{Yeast}$)**
**Metric:** **Weighted UniFrac** (phylogenetic distance).
*Since we have the tree, we calculate the true evolutionary distance between the yeast communities.*

1.  **Normalize Counts:** Convert raw reads in `yeast.json` to relative abundances ($p_i$) for each sample.
2.  **Map to Tree:** Assign abundances to the tips (species) of the loaded phylogenetic tree.
3.  **Calculate Weighted UniFrac Distance ($D$):**
    $$D = \frac{\sum_{i=1}^n b_i \times |A_i - B_i|}{\sum_{i=1}^n b_i \times \max(A_i, B_i)}$$
    * $n$: Total branches in the tree.
    * $b_i$: Length of branch $i$.
    * $A_i, B_i$: "Mass" descending from branch $i$ for Sample A and Sample B respectively. (Sum of abundances of all leaves under this branch).
4.  **Similarity:** $S_{Yeast} = 1 - D$.

### 4.2. The "Golden Ratio" Scoring
Combine scores based on data availability.

* **Case 1: Both beers have Yeast data.**
    $$S_{Total} = (0.618 \times S_{Raman}) + (0.382 \times S_{Yeast})$$
* **Case 2: One or both missing Yeast data.**
    $$S_{Total} = 0.618 \times S_{Raman}$$
    *(Disclaimer required in UI).*

### 4.3. Barman Logic (Modes)

**Parameters:**
* **Time ($T$):** Selection duration.
* **Homogeneity ($H$):** Average $S_{Total}$ pairwise between selected beers.

**Modes:**
1.  **Wander Away (Exploration):**
    * *Trigger:* $T > 180s$ AND $H < 0.6$.
    * *Selection:* Filter candidates to **75th-90th percentile**. Pick 2 random.
2.  **Comfort Zone (Default):**
    * *Trigger:* All other cases.
    * *Selection:* Filter candidates to **90th-100th percentile**. Pick 2 random.

**Exclusions:**
* Exclude user's selections.
* Ensure Result 1 $\neq$ Result 2.

---

## 5. UI/UX Specification

### 5.1. Components
* **Global Timer:** Tracks time from mount to submission.
* **Map Nav:** Interactive SVG (Continents/Regions). Filters the beer list.
* **Beer List:** Checkbox selection (Max 3). Highlight items with `has_yeast_data` (e.g. a DNA icon).

### 5.2. Output
* **Cards:** Display details for the 2 recommended beers.
* **Score:** Show match % ($S_{Total}$).
* **Data Disclaimer:** "Yeast data unavailable for one or more selections. Score based on Raman spectra (61.8% weight)."

---
## 6. UI/UX & Visual Identity (Biohacker Theme)

**Design Philosophy:** "The Lab Terminal." The interface should feel like a piece of scientific equipment—precise, high-contrast, and data-dense, but accessible. It balances the raw "Cyberpunk/Biohacker" aesthetic of the original project with modern usability standards.

### 6.1. Color Palette (Tailwind CSS)
The palette is built around a high-contrast "Dark Mode" foundation with a specific "Hazard Yellow" accent.

| Role | Tailwind Class | Hex Value | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas** | `bg-slate-950` | `#020617` | Main background. Deepest blue-black to reduce eye strain. |
| **Surface** | `bg-slate-900` | `#0f172a` | Card backgrounds, sticky headers, input fields. |
| **Primary Accent** | `bg-yellow-400` | `#FACC15` | **"Vibrant Yellow"**. Primary buttons, active borders, progress bars. |
| **Text (Primary)** | `text-slate-50` | `#f8fafc` | Headings, Beer Names, Body text. |
| **Text (Data)** | `text-green-400` | `#4ade80` | Monospace data values (optional matrix vibe), success states. |
| **Text (Muted)** | `text-slate-400` | `#94a3b8` | Secondary labels, units of measurement (e.g., "IBU"). |
| **Spectral Colors** | *Custom Gradients* | *Various* | **Only** used for the DNA/Raman visualization charts (Cyan, Magenta, Lime) to contrast with the UI. |

### 6.2. Typography
A strict separation between "Interface" and "Data".

* **Interface (Headings & Navigation):**
    * *Font Family:* **Inter** or **Roboto**.
    * *Style:* Bold, often Uppercase for section headers. Clean and readable.
* **Data (Specs, IDs, Scores):**
    * *Font Family:* **JetBrains Mono**, **Fira Code**, or **Courier Prime**.
    * *Usage:* Every numerical value (ABV, IBU, Similarity %, ID) must be rendered in monospace.
    * *Effect:* Reinforces the scientific nature of the data.

### 6.3. Component Styling

#### **A. The Beer Card**
* **Shape:** Rectangular, sharp corners (0px or 2px radius). No soft "app-like" rounded corners.
* **Background:** `bg-slate-900` with a subtle 1px border `border-slate-800`.
* **Beer Avatar (Brewery Logo):**
    * Since logos vary in color, place them inside a **White Square or Circle container** (`bg-white p-2`) within the dark card to ensure they are legible.
* **Hover State:** The card border changes to **Vibrant Yellow** (`border-yellow-400`) with a slight glow effect (`shadow-[0_0_15px_rgba(250,204,21,0.3)]`).

#### **B. Primary Action ("Pour" / "Analyze")**
* **Style:** Solid **Vibrant Yellow** background.
* **Text:** **Black** (`text-black`), Bold, Uppercase.
* **Feel:** Industrial tactile button.
* **Feedback:** When clicked, it should feel instant.

#### **C. Data Visualization (The "Barcode")**
* **Context:** Used in the background headers or as a visual separator.
* **Visual:** Vertical stripes of varying width and color (from the "Spectral" palette) representing the molecular fingerprint.
* **Animation:** Subtle opacity pulse to make the app feel "alive" / processing.

#### **D. Loading States**
* **Avoid:** Generic spinning circles.
* **Use:** "Sequencing..." text effect.
    * *Example:* A progress bar that looks like a DNA sequence filling up, or text that rapidly cycles through characters before settling on the result.

### 6.4. Layout Structure
* **Header:** Minimalist. Logo on the left (Monospace text `[BeerDeCoded]`), Search bar on the right.
* **Main Grid:** Responsive Grid (`grid-cols-1 md:grid-cols-3`).
* **Background Texture:** A very low opacity (5%) fixed background pattern resembling a **Diffraction Grating** (fine vertical lines) to add depth to the black canvas without distracting from the content.
## 7. Implementation Steps for AI Coding

1.  **`etl.js` (Node):**
    * Read `yeast-data.csv`, `beers-db.csv`, `raman-data.csv`.
    * Read `yeast_ITS1_phylogenetic_tree.nwk`.
    * **Action:** Use a Newick parser library in the ETL script to convert the tree to a JSON object (Nodes with `length` and `children`).
    * Output optimized JSONs.
2.  **`math.ts` (Logic):**
    * Implement `cosineSimilarity(vecA, vecB)`.
    * Implement `calculateUniFrac(tree, sampleA, sampleB)`. *Tip: This function needs to traverse the tree JSON, summing abundances ($A_i, B_i$) for every node.*
3.  **`App.tsx` (UI):**
    * Load JSONs into Context.
    * Handle user interactions & "Barman" logic state.

---

## 8. Testing Scenarios

* **UniFrac Check:** Compare Beer X with itself. $D_{UniFrac}$ should be 0. $S_{Yeast}$ should be 1.
* **Tree Parsing:** Ensure the ETL script correctly maps species names in `yeast-data.csv` to the tip names in `tree.json`. Mismatched names should be logged or cleaned.
* **Performance:** Ensure the "Recommend" button doesn't freeze the browser for >1 second (UniFrac tree traversal is $O(N)$ nodes, should be fast for this small tree).