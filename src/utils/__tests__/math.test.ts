import { describe, it, expect } from 'vitest';
import { cosineSimilarity, sfecSimilarity } from '../math';

describe('Math Utilities', () => {
    describe('cosineSimilarity', () => {
        it('should return 1 for identical vectors', () => {
            const vecA = [1, 2, 3, 4, 5];
            const vecB = [1, 2, 3, 4, 5];
            expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1, 5);
        });

        it('should return 0 for orthogonal vectors', () => {
            const vecA = [1, 0, 0];
            const vecB = [0, 1, 0];
            expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(0, 5);
        });

        it('should return -1 for opposite vectors', () => {
            const vecA = [1, 2, 3];
            const vecB = [-1, -2, -3];
            expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(-1, 5);
        });

        it('should handle vectors with different magnitudes', () => {
            const vecA = [1, 2, 3];
            const vecB = [2, 4, 6]; // Same direction, different magnitude
            expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1, 5);
        });

        it('should calculate correct similarity for arbitrary vectors', () => {
            const vecA = [3, 4];
            const vecB = [4, 3];
            // cos(θ) = (3*4 + 4*3) / (5 * 5) = 24/25 = 0.96
            expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(0.96, 2);
        });

        it('should throw error for vectors of different lengths', () => {
            const vecA = [1, 2, 3];
            const vecB = [1, 2];
            expect(() => cosineSimilarity(vecA, vecB)).toThrow();
        });

        it('should throw error for zero vectors', () => {
            const vecA = [0, 0, 0];
            const vecB = [1, 2, 3];
            expect(() => cosineSimilarity(vecA, vecB)).toThrow();
        });
    });

    describe('sfecSimilarity', () => {
        it('should return 1 for identical vectors', () => {
            const vecA = [1, 2, 3, 4, 5];
            const vecB = [1, 2, 3, 4, 5];
            expect(sfecSimilarity(vecA, vecB)).toBeCloseTo(1, 5);
        });

        it('should differentiate vectors correctly', () => {
            // For vectors with constant slope, differentiated vectors should be identical
            const vecA = [1, 2, 3, 4, 5]; // diff: [1, 1, 1, 1]
            const vecB = [2, 3, 4, 5, 6]; // diff: [1, 1, 1, 1]
            expect(sfecSimilarity(vecA, vecB)).toBeCloseTo(1, 5);
        });

        it('should detect different patterns', () => {
            const vecA = [1, 2, 3, 4, 5]; // linear increase
            const vecB = [1, 1, 1, 1, 1]; // constant (diff will be zeros)
            // This should have low similarity since one has constant derivative
            const similarity = sfecSimilarity(vecA, vecB);
            expect(similarity).toBeLessThan(0.5);
        });

        it('should work with Raman-like spectra', () => {
            // Simulate two similar Raman spectra with slight shift
            const vecA = [0.1, 0.2, 0.5, 0.8, 0.5, 0.2, 0.1];
            const vecB = [0.1, 0.2, 0.5, 0.8, 0.5, 0.2, 0.1];
            expect(sfecSimilarity(vecA, vecB)).toBeCloseTo(1, 5);
        });

        it('should handle vectors with noise', () => {
            const vecA = [1.0, 2.1, 2.9, 4.1, 5.0];
            const vecB = [1.1, 1.9, 3.1, 3.9, 5.1];
            const similarity = sfecSimilarity(vecA, vecB);
            expect(similarity).toBeGreaterThan(0.8); // Should still be similar
        });

        it('should throw error for vectors too short', () => {
            const vecA = [1];
            const vecB = [2];
            expect(() => sfecSimilarity(vecA, vecB)).toThrow();
        });

        it('should throw error for vectors of different lengths', () => {
            const vecA = [1, 2, 3, 4];
            const vecB = [1, 2, 3];
            expect(() => sfecSimilarity(vecA, vecB)).toThrow();
        });
    });
});
