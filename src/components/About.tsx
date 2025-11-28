import React from 'react';
import { ExternalLink, Youtube, FileText, Github, FlaskConical, Code, History } from 'lucide-react';
import { Button } from './Button';

interface AboutProps {
    onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ onBack }) => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-50 mb-4">
                    <span className="text-yellow-400 font-mono">[</span> PROJECT_ORIGIN <span className="text-yellow-400 font-mono">]</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    From a Kickstarter dream to a molecular reality.
                </p>
            </div>

            {/* Timeline / Story */}
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">

                {/* 2015: The Beginning */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 group-[.is-active]:border-yellow-400 group-[.is-active]:bg-yellow-400/10 group-[.is-active]:text-yellow-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <History size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-200">The Kickstarter Campaign</h3>
                            <time className="font-mono text-xs text-slate-500">2015</time>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            It all started with a dream and 124 backers who pledged €10,773. They sent their favorite beers to Hackuarium's Biohackerspace in Lausanne, Switzerland, fueling the first open beer genome project.
                        </p>
                        <a
                            href="https://www.kickstarter.com/projects/489252126/beerdecoded-the-1000-beer-genomes"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-xs text-yellow-400 hover:text-yellow-300 font-mono"
                        >
                            <ExternalLink size={12} className="mr-1" /> KICKSTARTER_ARCHIVE
                        </a>
                    </div>
                </div>

                {/* The Science */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 group-[.is-active]:border-green-400 group-[.is-active]:bg-green-400/10 group-[.is-active]:text-green-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <FlaskConical size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-200">Molecular Sequencing</h3>
                            <time className="font-mono text-xs text-slate-500">2016-2017</time>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            We collected 119 beers from 21 countries. Each went into a Raman spectrometer for molecular fingerprinting. With community help, we sequenced the yeast ITS1 gene for 39 beers, identifying <i>S. cerevisiae</i> and 87 wild yeasts.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.youtube.com/watch?v=40FawbMoh9M"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-xs text-red-400 hover:text-red-300 font-mono"
                            >
                                <Youtube size={12} className="mr-1" /> WATCH_VIDEO
                            </a>
                            <a
                                href="https://f1000research.com/articles/6-1676"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 font-mono"
                            >
                                <FileText size={12} className="mr-1" /> READ_PAPER
                            </a>
                        </div>
                    </div>
                </div>

                {/* The Gap */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <Code size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-200">The App Dream</h3>
                            <time className="font-mono text-xs text-slate-500">2015-2024</time>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Back then, "There's an app for that" was the mantra. We dreamed of building one, but we were scientists, not developers, and budgets were tight. The data sat waiting for the right moment.
                        </p>
                    </div>
                </div>

                {/* The Vibe Coding Era */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 group-[.is-active]:border-purple-400 group-[.is-active]:bg-purple-400/10 group-[.is-active]:text-purple-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <Code size={20} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-200">Enter Vibe Coding</h3>
                            <time className="font-mono text-xs text-slate-500">2025</time>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Ten years later, we've entered the era of Vibe Coding. This application is our first attempt, built with <strong>Google Antigravity</strong>. Finally, the Molecular Sommelier is alive.
                        </p>
                        <div className="bg-slate-950 p-4 rounded border border-slate-800">
                            <h4 className="font-mono text-xs text-yellow-400 mb-2">BARMAN_LOGIC_V1.0</h4>
                            <p className="text-xs text-slate-500 font-mono">
                                if (selection_speed == FAST) suggest(COMFORT_ZONE)<br />
                                else suggest(WANDER_AWAY)
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="mt-16 text-center border-t border-slate-800 pt-8">
                <p className="text-slate-300 mb-6 italic">
                    "So long and thank you for all the beers."
                </p>
                <p className="text-slate-500 text-sm mb-8">
                    — Gianpaolo and the BeerDeCoded team
                </p>

                <div className="flex justify-center gap-4">
                    <Button variant="secondary" onClick={onBack}>
                        RETURN_TO_APP
                    </Button>
                    <a
                        href="https://github.com/beerdecoded"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 rounded border border-slate-700 transition-colors font-mono text-sm"
                    >
                        <Github size={16} className="mr-2" /> GITHUB_REPO
                    </a>
                </div>
            </div>
        </div>
    );
};
