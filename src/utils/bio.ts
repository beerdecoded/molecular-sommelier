/**
 * Biological utilities for phylogenetic distance calculations.
 */

interface TreeNode {
    name: string;
    length: number;
    children: TreeNode[];
}

interface Sample {
    [species: string]: number;
}

/**
 * Calculates the Weighted UniFrac distance between two samples given a phylogenetic tree.
 * 
 * Formula: D = Sum(b_i * |A_i - B_i|) / Sum(b_i * max(A_i, B_i))
 * where:
 * - b_i is the length of branch i
 * - A_i, B_i are the "mass" (cumulative abundance) descending from branch i for samples A and B
 * 
 * @param tree The phylogenetic tree (root node)
 * @param sampleA Abundance map for sample A { "SpeciesX": 10, ... }
 * @param sampleB Abundance map for sample B
 * @returns Similarity score (1 - Distance)
 */
export function calculateUniFrac(tree: TreeNode, sampleA: Sample, sampleB: Sample): number {
    // 1. Normalize counts to relative abundances
    const normA = normalizeSample(sampleA);
    const normB = normalizeSample(sampleB);

    // 2. Traverse tree to calculate weighted distance
    let numerator = 0;
    let denominator = 0;

    // Helper function to traverse tree and calculate mass
    // Returns the mass of [sampleA, sampleB] for the current node
    function traverse(node: TreeNode): [number, number] {
        let massA = 0;
        let massB = 0;

        // If leaf node, check if it matches a species in our samples
        if (node.children.length === 0) {
            if (node.name) {
                massA = normA[node.name] || 0;
                massB = normB[node.name] || 0;
            }
        } else {
            // If internal node, sum mass from children
            for (const child of node.children) {
                const [childMassA, childMassB] = traverse(child);
                massA += childMassA;
                massB += childMassB;
            }
        }

        // Calculate contribution to UniFrac distance for the branch LEADING to this node
        // Note: The root's "length" is usually 0 or irrelevant as it has no parent branch in this context,
        // but if the tree format assigns length to root, we might include it. 
        // Standard UniFrac sums over all branches.
        if (node.length > 0) {
            numerator += node.length * Math.abs(massA - massB);
            denominator += node.length * Math.max(massA, massB);
        }

        return [massA, massB];
    }

    traverse(tree);

    // Avoid division by zero
    if (denominator === 0) {
        // If denominator is 0, it means no branches with length had any mass.
        // This implies either empty samples or a tree that doesn't match samples.
        // If samples are identical (both empty), distance is 0 -> similarity 1.
        // If samples are different but no tree match, it's ambiguous. 
        // For safety, if both are empty/no-match, return 1 (identical in their nothingness).
        return 1;
    }

    const distance = numerator / denominator;

    // Return Similarity (1 - Distance)
    // Ensure we clamp between 0 and 1 just in case
    return Math.max(0, Math.min(1, 1 - distance));
}

/**
 * Normalize sample counts to relative abundances (sum to 1)
 */
function normalizeSample(sample: Sample): Sample {
    const normalized: Sample = {};
    let total = 0;

    for (const key in sample) {
        total += sample[key];
    }

    if (total === 0) return {};

    for (const key in sample) {
        normalized[key] = sample[key] / total;
    }

    return normalized;
}
