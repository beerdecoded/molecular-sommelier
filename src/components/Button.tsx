import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

/**
 * Industrial Button Component
 * 
 * Primary: Solid Vibrant Yellow, Black Text, Uppercase.
 * Secondary: Outline or Muted.
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    className = '',
    ...props
}) => {
    const baseStyles = "font-bold uppercase tracking-wider px-6 py-3 rounded-sm transition-all duration-200 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-yellow-400 text-black hover:bg-yellow-300 active:bg-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.2)] hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]",
        secondary: "bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
