import { sfecSimilarity } from '../utils/math';
import { calculateUniFrac } from '../utils/bio';

interface Beer {
    id: number;
    name: string;
    brewery: string;
    has_yeast_data: boolean;
    // Add other fields as needed
}

interface RecommendationResult {
    beer: Beer;
    score: number;
    mode: 'Comfort Zone' | 'Wander Away';
    missingYeastData: boolean;
}

interface RecommenderOptions {
    timeSpent: number;
}

/**
 * Recommendation Engine
 * 
 * Calculates similarity between selected beers and all candidates.
 * Applies "Golden Ratio" scoring and "Barman" mode logic.
 */
export function getRecommendations(
    selectedBeerIds: number[],
    allBeers: Beer[],
    ramanData: Record<number, number[]>,
    yeastData: Record<number, Record<string, number>>,
    tree: any,
    options: RecommenderOptions
): RecommendationResult[] {
    const { timeSpent } = options;

    // 1. Filter out selected beers
    const selectedBeers = allBeers.filter(b => selectedBeerIds.includes(b.id));
    const candidates = allBeers.filter(b => !selectedBeerIds.includes(b.id));

    // 2. Calculate Pairwise Scores
    const scoredCandidates = candidates.map(candidate => {
        let maxScore = -1;

        // Compare candidate against EACH selected beer and take the BEST match
        // (Standard approach for "find something similar to what I liked")
        // Alternatively, we could average the scores. Let's use Max for "closest neighbor".

        for (const selected of selectedBeers) {
            const score = calculatePairwiseScore(selected, candidate, ramanData, yeastData, tree);
            if (score > maxScore) {
                maxScore = score;
            }
        }

        // If no beers selected (cold start), return random score or 0
        // But UI enforces selection. If empty, maxScore is -1.
        if (selectedBeers.length === 0) maxScore = 0;

        return {
            beer: candidate,
            score: maxScore,
            missingYeastData: !candidate.has_yeast_data || selectedBeers.some(b => !b.has_yeast_data)
        };
    });

    // 3. Determine Mode (Barman Logic)
    // Calculate Homogeneity (Average pairwise similarity of selected beers)
    let homogeneity = 0;
    if (selectedBeers.length > 1) {
        let sumSim = 0;
        let count = 0;
        for (let i = 0; i < selectedBeers.length; i++) {
            for (let j = i + 1; j < selectedBeers.length; j++) {
                sumSim += calculatePairwiseScore(selectedBeers[i], selectedBeers[j], ramanData, yeastData, tree);
                count++;
            }
        }
        homogeneity = count > 0 ? sumSim / count : 1;
    } else {
        homogeneity = 1; // Single beer is perfectly homogeneous
    }

    const isWanderAway = timeSpent > 180 && homogeneity < 0.6;
    const mode = isWanderAway ? 'Wander Away' : 'Comfort Zone';

    // 4. Sort and Filter based on Mode
    scoredCandidates.sort((a, b) => b.score - a.score);

    let pool: typeof scoredCandidates = [];

    if (isWanderAway) {
        // 75th-90th percentile
        const startIdx = Math.floor(scoredCandidates.length * 0.1); // Top 10% excluded (index 0 is top)
        const endIdx = Math.floor(scoredCandidates.length * 0.25); // Up to 25%
        // Note: "Percentile" usually means higher is better. 
        // 90th percentile = top 10%. 75th = top 25%.
        // So we want the slice from index [10% of N] to [25% of N].

        // Safety check for small lists
        const safeStart = Math.min(startIdx, scoredCandidates.length - 1);
        const safeEnd = Math.min(endIdx, scoredCandidates.length);

        // If list is too small, just take top 5
        if (scoredCandidates.length < 10) {
            pool = scoredCandidates.slice(0, Math.min(5, scoredCandidates.length));
        } else {
            pool = scoredCandidates.slice(safeStart, safeEnd + 1);
        }
    } else {
        // Comfort Zone: 90th-100th percentile (Top 10%)
        const endIdx = Math.ceil(scoredCandidates.length * 0.1);
        pool = scoredCandidates.slice(0, Math.max(2, endIdx));
    }

    // 5. Pick 2 Random from Pool
    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const recommendations = shuffled.slice(0, 2);

    return recommendations.map(rec => ({
        ...rec,
        mode
    }));
}

/**
 * Helper: Calculate score between two beers
 */
function calculatePairwiseScore(
    beerA: Beer,
    beerB: Beer,
    ramanData: Record<number, number[]>,
    yeastData: Record<number, Record<string, number>>,
    tree: any
): number {
    // Raman Similarity
    const vecA = ramanData[beerA.id];
    const vecB = ramanData[beerB.id];

    let sRaman = 0;
    if (vecA && vecB) {
        try {
            sRaman = sfecSimilarity(vecA, vecB);
        } catch (e) {
            console.warn(`Error calculating Raman similarity for ${beerA.id} and ${beerB.id}`, e);
        }
    }

    // Yeast Similarity
    let sYeast = 0;
    const hasYeastA = beerA.has_yeast_data && yeastData[beerA.id];
    const hasYeastB = beerB.has_yeast_data && yeastData[beerB.id];

    if (hasYeastA && hasYeastB) {
        try {
            sYeast = calculateUniFrac(tree, yeastData[beerA.id], yeastData[beerB.id]);
        } catch (e) {
            console.warn(`Error calculating UniFrac for ${beerA.id} and ${beerB.id}`, e);
        }

        // Golden Ratio Scoring: Case 1
        return (0.618 * sRaman) + (0.382 * sYeast);
    } else {
        // Golden Ratio Scoring: Case 2 (Missing Yeast)
        return 0.618 * sRaman;
    }
}
