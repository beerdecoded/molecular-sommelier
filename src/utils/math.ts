/**
 * Mathematical utilities for vector similarity calculations.
 */

/**
 * Calculates the Cosine Similarity between two vectors.
 * Sim(A, B) = (A . B) / (||A|| * ||B||)
 * 
 * @param vecA First vector
 * @param vecB Second vector
 * @returns Cosine similarity (between -1 and 1)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error(`Vectors must have the same length. Got ${vecA.length} and ${vecB.length}.`);
    }

    if (vecA.length === 0) {
        throw new Error("Vectors cannot be empty.");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) {
        throw new Error("Vectors cannot be zero vectors.");
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculates the Squared First-Difference Euclidean Cosine (SFEC) similarity.
 * 
 * 1. Differentiate vectors: V'_i = V_{i+1} - V_i
 * 2. Calculate Cosine Similarity of the differentiated vectors.
 * 
 * This metric is useful for spectral data (like Raman) as it emphasizes 
 * the shape/slope of the peaks rather than absolute intensity.
 * 
 * @param vecA First vector
 * @param vecB Second vector
 * @returns SFEC similarity
 */
export function sfecSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error(`Vectors must have the same length. Got ${vecA.length} and ${vecB.length}.`);
    }

    if (vecA.length < 2) {
        throw new Error("Vectors must have at least 2 elements for differentiation.");
    }

    // Step 1: Differentiate vectors
    const diffA: number[] = [];
    const diffB: number[] = [];

    for (let i = 0; i < vecA.length - 1; i++) {
        diffA.push(vecA[i + 1] - vecA[i]);
        diffB.push(vecB[i + 1] - vecB[i]);
    }

    // Step 2: Calculate Cosine Similarity of differentiated vectors
    // We handle the potential zero-vector case in differentiation (e.g., flat line)
    try {
        return cosineSimilarity(diffA, diffB);
    } catch (error) {
        // If differentiation results in zero vectors (e.g., constant input), 
        // similarity is undefined. Return 0 in this context.
        return 0;
    }
}
