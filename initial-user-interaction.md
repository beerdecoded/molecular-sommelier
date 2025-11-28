

## 9. Geographic Map Interface & User Flow

The initial presentation of the beer catalog must be a visual, geographic map interface to avoid choice paralysis and leverage the `Country`, `Region`, and `Un-Subregion` data available in `beers-db.csv`.

### 9.1. Map Specifications (Vector-Based)

- **Type:** Must be a **Scalable Vector Map (SVG)** with built-in zoom functionality.

- **Dependency:** **Not dependent on external map APIs** (e.g., Google Maps, Mapbox).

- **Styling:** Adhere to the **"Hazard Lab"** visual identity: Dark backgrounds (e.g., `bg-slate-950`), with interactive/highlighted regions using the **Vibrant Yellow** accent color.

- **Layout:** The design is optimized for user navigation. The zoom functionality must preserve region shapes, but individual regions **do not need to be geographically contiguous** on the screen if this simplifies navigation on smaller devices.

### 9.2. Initial View and Grouping

1. **Initial State:** The user is presented with a global map.

2. **Granularity:** The dataset is grouped by the following six **Continental Regions** to avoid choice paralysis:
   
   - North America
   
   - South America
   
   - Europe
   
   - Africa
   
   - Oceania
   
   - Asia

3. **Display:** Each Continental Region must visually display a number indicating **"how many beers are available in the region"** from the dataset.

### 9.3. Map Interaction Flow

The user's action to trigger a view of the beer names is a **click** on a region. The subsequent flow is determined by the number of beers in the clicked region (maximum 20 beers displayed per list to maintain usability).

#### **Scenario A: Low Beer Count ($\text{Count} \le 20$)**

1. **Action:** User **clicks** on a Continental Region (e.g., "North America").

2. **Navigation:** The map immediately **zooms in** to focus on the selected region.

3. **Display:** The map view is replaced by the final "Pub Menu" list view, showing the $\le 20$ available beers.

#### **Scenario B: High Beer Count ($\text{Count} > 20$)**

1. **Action:** User **clicks** on a Continental Region (e.g., "Europe").

2. **Navigation:** The map immediately **zooms in** to focus on the selected region.

3. **Intermediate Grouping:** The view shifts to display the next level of **UN Geoscheme Subregions** (e.g., "Western Europe", "Northern Europe").

4. **Display:** Each Subregion displays a number indicating the count of beers available inside that subregion.

### 9.4. Final Selection View ("The Pub Menu")

- **Trigger:** Clicking on a subregion in **Scenario B** (e.g., "Western Europe") moves the user to the final display list.

- **Content:** This final list (containing $\le 20$ beers) must display the following data for each beer:
  
  - **Flag** (Country Flag)
  
  - **Beer Name**
  
  - **Brewery**
  
  - **Alcohol %** (`ABV`)
  
  - **Style**

### 9.5. Beer Selection and Navigation

- **Selection:** The user can **select a beer** from the "Pub Menu" list to move it to the global selection area (for the recommendation engine).

- **Zoom Out:** At any point, the user must be able to **zoom out** of the current view (subregion or continent) to return to the previous map level to select a beer from another region.


