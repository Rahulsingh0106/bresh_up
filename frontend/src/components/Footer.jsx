"use client";
import React from 'react'

export default function Footer() {
    return (
        <div className="bg-slate-900 py-6 text-white sm:py-12 border-t border-slate-800">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="text-center md:text-left">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                            BreshUP
                        </span>
                        <p className="mt-2 text-sm text-gray-400">
                            AI-powered developer interview preparation platform.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4 md:items-end">
                        <div className="flex gap-4">
                            <a href="https://github.com/Rahulsingh0106" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                GitHub
                            </a>
                            <a href="https://www.linkedin.com/in/rahulsingh0106/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                LinkedIn
                            </a>
                        </div>
                        <p className="text-sm text-gray-400">
                            © 2025 BreshUP. Built by Rahul Singh
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}