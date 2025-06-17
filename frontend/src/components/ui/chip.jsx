import * as React from "react"
import { Bookmark } from 'lucide-react';
import { Button } from "@/components/ui/button";
function Chip({
    className,
    title,
    href,
    ...props
}) {
    return (
        <a className="group border border-slate-800 bg-slate-900 p-2.5 sm:p-3.5 block no-underline rounded-lg relative text-slate-400 font-regular text-md hover:border-slate-600 hover:text-slate-100 overflow-hidden" href={href}>
            <span className="relative z-20 text-slate-400"> {title} </span>
            <button aria-label="Add to favorites" tabIndex="-1" className="absolute right-1.5 top-1.5 z-30 focus:outline-0 opacity-30 hover:opacity-100" data-is-favorite="false">
                <Bookmark />
            </button>

            <span data-progress="" className="absolute bottom-0 left-0 top-0 z-10 w-0 bg-[#172a3a] transition-[width] duration-300"></span>
        </a>
    )
}
export { Chip }