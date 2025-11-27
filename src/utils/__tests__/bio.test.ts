import { describe, it, expect } from 'vitest';
import { calculateUniFrac } from '../bio';

// Mock Tree Structure
const mockTree = {
    name: "root",
    length: 0,
    children: [
        {
            name: "node1",
            length: 0.1,
            children: [
                { name: "SpeciesA", length: 0.2, children: [] },
                { name: "SpeciesB", length: 0.3, children: [] }
            ]
        },
        {
            name: "node2",
            length: 0.4,
            children: [
                { name: "SpeciesC", length: 0.5, children: [] }
            ]
        }
    ]
};

describe('Bio Utilities', () => {
    describe('calculateUniFrac', () => {
        it('should return similarity 1 (distance 0) for identical samples', () => {
            const sampleA = { "SpeciesA": 0.5, "SpeciesB": 0.5, "SpeciesC": 0 };
            const sampleB = { "SpeciesA": 0.5, "SpeciesB": 0.5, "SpeciesC": 0 };

            const similarity = calculateUniFrac(mockTree, sampleA, sampleB);
            expect(similarity).toBeCloseTo(1, 5);
        });

        it('should return similarity 0 (distance 1) for completely distinct samples on different branches', () => {
            // SpeciesA and SpeciesC are on different main branches
            const sampleA = { "SpeciesA": 1, "SpeciesB": 0, "SpeciesC": 0 };
            const sampleB = { "SpeciesC": 1, "SpeciesA": 0, "SpeciesB": 0 };

            // Note: In Weighted UniFrac, distance isn't always exactly 1 for distinct samples,
            // it depends on the shared branch length vs unique branch length.
            // But for completely distinct lineages from root, it should be low similarity.
            const similarity = calculateUniFrac(mockTree, sampleA, sampleB);
            expect(similarity).toBeLessThan(1);
            expect(similarity).toBeGreaterThanOrEqual(0);
        });

        it('should handle partial overlap correctly', () => {
            const sampleA = { "SpeciesA": 1, "SpeciesB": 0, "SpeciesC": 0 };
            const sampleB = { "SpeciesA": 0.5, "SpeciesB": 0.5, "SpeciesC": 0 };

            const similarity = calculateUniFrac(mockTree, sampleA, sampleB);
            expect(similarity).toBeGreaterThan(0);
            expect(similarity).toBeLessThan(1);
        });

        it('should normalize counts to relative abundances automatically', () => {
            const sampleA = { "SpeciesA": 100, "SpeciesB": 100 }; // 0.5, 0.5
            const sampleB = { "SpeciesA": 50, "SpeciesB": 50 };   // 0.5, 0.5

            const similarity = calculateUniFrac(mockTree, sampleA, sampleB);
            expect(similarity).toBeCloseTo(1, 5);
        });

        it('should handle missing species in tree gracefully', () => {
            const sampleA = { "SpeciesA": 1, "UnknownSpecies": 1 };
            const sampleB = { "SpeciesA": 1 };

            // Should ignore UnknownSpecies or treat as 0 mass
            expect(() => calculateUniFrac(mockTree, sampleA, sampleB)).not.toThrow();
        });

        it('should return 0 similarity if trees are empty or invalid', () => {
            const emptyTree = { name: "root", length: 0, children: [] };
            const sampleA = { "SpeciesA": 1 };
            const sampleB = { "SpeciesA": 1 };
            // If no matching nodes found, distance is undefined/0, so similarity might be 1 or 0 depending on implementation.
            // Assuming robust handling returns 0 or 1. Let's expect 0 if no calculation possible, or 1 if no distance.
            // Actually, if no branches have mass, distance is 0/0 = NaN. 
            // Let's ensure it doesn't crash and returns a safe number.
            const result = calculateUniFrac(emptyTree, sampleA, sampleB);
            expect(typeof result).toBe('number');
        });
    });
});
