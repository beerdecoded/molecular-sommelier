import React, { createContext, useContext, useState, useEffect } from 'react';
import { useData } from './DataContext';
import { getRecommendations } from '../engine/recommender';

interface Beer {
    id: number;
    name: string;
    brewery: string;
    has_yeast_data: boolean;
}

interface RecommendationResult {
    beer: Beer;
    score: number;
    mode: 'Comfort Zone' | 'Wander Away';
    missingYeastData: boolean;
}

interface SelectionContextType {
    selectedIds: number[];
    toggleSelection: (beerId: number) => void;
    recommendations: RecommendationResult[];
    analyze: () => void;
    reset: () => void;
    isAnalyzing: boolean;
    timeSpent: number;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { beers, ramanData, yeastData, tree } = useData();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [timeSpent, setTimeSpent] = useState(0);

    // Timer for "Barman" logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSpent((Date.now() - startTime) / 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const toggleSelection = (beerId: number) => {
        if (selectedIds.includes(beerId)) {
            setSelectedIds(prev => prev.filter(id => id !== beerId));
        } else {
            if (selectedIds.length < 3) {
                setSelectedIds(prev => [...prev, beerId]);
            }
        }
    };

    const analyze = () => {
        if (selectedIds.length === 0) return;

        setIsAnalyzing(true);

        // Simulate processing time for "Sequencing" effect
        setTimeout(() => {
            const results = getRecommendations(
                selectedIds,
                beers,
                ramanData,
                yeastData,
                tree,
                { timeSpent }
            );

            setRecommendations(results);
            setIsAnalyzing(false);
        }, 1500);
    };

    const reset = () => {
        setSelectedIds([]);
        setRecommendations([]);
        setStartTime(Date.now());
        setTimeSpent(0);
    };

    return (
        <SelectionContext.Provider value={{
            selectedIds,
            toggleSelection,
            recommendations,
            analyze,
            reset,
            isAnalyzing,
            timeSpent
        }}>
            {children}
        </SelectionContext.Provider>
    );
};

export function useSelection() {
    const context = useContext(SelectionContext);
    if (context === undefined) {
        throw new Error('useSelection must be used within a SelectionProvider');
    }
    return context;
}
