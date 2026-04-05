import React from 'react';

const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-2 group ${className}`}>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/20 overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-md">
                        <path d="M7 4H13.5C16.5 4 18 5.5 18 8.5C18 10.5 17 12 15.5 12.5C17.5 13 19 14.5 19 17C19 20 17 21 14 21H7V4Z" fill="currentColor" fillOpacity="0.2"/>
                        <path d="M7 4H13.5C16.5 4 18 5.5 18 8.5C18 10.5 17 12 15.5 12.5C17.5 13 19 14.5 19 17C19 20 17 21 14 21H7V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 12.5H15.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400 group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300">
                BreshUP
            </span>
        </div>
    );
};

export default Logo;
