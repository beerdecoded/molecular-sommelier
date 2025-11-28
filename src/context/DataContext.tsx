import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Beer {
    id: number;
    name: string;
    brewery: string;
    country: string;
    region: string;
    subregion: string;
    style: string;
    abv: number;
    has_yeast_data: boolean;
}

interface DataContextType {
    beers: Beer[];
    ramanData: Record<number, number[]>;
    yeastData: Record<number, Record<string, number>>;
    tree: any;
    loading: boolean;
    error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<Omit<DataContextType, 'loading' | 'error'>>({
        beers: [],
        ramanData: {},
        yeastData: {},
        tree: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const [beersRes, ramanRes, yeastRes, treeRes] = await Promise.all([
                    fetch('/data/beers.json'),
                    fetch('/data/raman.json'),
                    fetch('/data/yeast.json'),
                    fetch('/data/tree.json')
                ]);

                if (!beersRes.ok || !ramanRes.ok || !yeastRes.ok || !treeRes.ok) {
                    throw new Error('Failed to fetch one or more data files');
                }

                const beers = await beersRes.json();
                const ramanData = await ramanRes.json();
                const yeastData = await yeastRes.json();
                const tree = await treeRes.json();

                setData({ beers, ramanData, yeastData, tree });
                setLoading(false);
            } catch (err) {
                console.error('Data loading error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ ...data, loading, error }}>
            {children}
        </DataContext.Provider>
    );
};

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
