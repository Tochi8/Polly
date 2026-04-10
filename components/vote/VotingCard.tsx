'use client';
import { useState } from "react";

export default function VotingCard() {

    const [selected, setSelected] = useState({});

    const toBeDecided = "";

    return (
        <div className={`
        flex items-center gap-3 p-4 rounded-2xl
        border-2 cursor-pointer transition-all
        ${selected
            ? 'bg-lime/10 border-lime-dk'
            : 'bg-surface border-transparent'
        }
        `}>
            <input 
            type="radio" 
            name="choice"
            id="voting-card"
            value={toBeDecided}
            checked={selected === 'toBeDecided'}
            onChange={(e) => setSelected(e.target.value)}
            /> {/* poll candidate */}
        </div>
    );
}