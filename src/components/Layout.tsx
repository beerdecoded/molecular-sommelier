import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    currentView: 'home' | 'about';
    onNavigate: (view: 'home' | 'about') => void;
}

/**
 * Layout Component
 * 
 * Main application shell.
 * - Fixed background texture (handled in CSS).
 * - Header with Logo and Search.
 * - Responsive container.
 */
export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavigate = (view: 'home' | 'about') => {
        onNavigate(view);
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col relative z-10">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => handleNavigate('home')}
                    >
                        <span className="text-yellow-400 font-mono text-xl font-bold group-hover:text-white transition-colors">[</span>
                        <span className="text-slate-50 font-bold text-xl tracking-tight group-hover:text-yellow-400 transition-colors">BeerDeCoded</span>
                        <span className="text-yellow-400 font-mono text-xl font-bold group-hover:text-white transition-colors">]</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onNavigate('about')}
                            className={`hidden md:block font-mono text-sm ${currentView === 'about' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'} transition-colors`}
                        >
                            ABOUT_PROJECT
                        </button>

                        <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-sm px-3 py-1.5 focus-within:border-yellow-400 transition-colors">
                            <Search size={16} className="text-slate-500 mr-2" />
                            <input
                                type="text"
                                placeholder="SEARCH_DB..."
                                className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-600 w-48 font-mono"
                            />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-400 hover:text-yellow-400 transition-colors md:hidden"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md">
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
                            <button
                                onClick={() => handleNavigate('home')}
                                className={`block w-full text-left font-mono text-sm py-2 px-4 rounded transition-colors ${currentView === 'home'
                                        ? 'bg-yellow-400/10 text-yellow-400'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                HOME
                            </button>
                            <button
                                onClick={() => handleNavigate('about')}
                                className={`block w-full text-left font-mono text-sm py-2 px-4 rounded transition-colors ${currentView === 'about'
                                        ? 'bg-yellow-400/10 text-yellow-400'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                ABOUT_PROJECT
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-600 text-xs font-mono">
                        SYSTEM_VERSION: 1.0.0 // MOLECULAR_DB_STATUS: ONLINE
                    </p>
                </div>
            </footer>
        </div>
    );
};
