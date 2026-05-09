import React from 'react';

const toys = ['🧸', '🎮', '🎯', '🪀', '🎨', '🚂', '🎠', '🪁', '🎪', '🎁'];

function ToyRain() {
    const drops = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        toy: toys[i % toys.length],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${4 + Math.random() * 4}s`,
        size: `${18 + Math.floor(Math.random() * 18)}px`,
    }));

    return (
        <>
            <style>{`
                @keyframes fall {
                    0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
                .toy-drop {
                    position: fixed;
                    top: 0;
                    pointer-events: none;
                    animation: fall linear infinite;
                    z-index: 0;
                    user-select: none;
                }
            `}</style>
            {drops.map(d => (
                <span
                    key={d.id}
                    className="toy-drop"
                    style={{
                        left: d.left,
                        animationDuration: d.duration,
                        animationDelay: d.delay,
                        fontSize: d.size,
                    }}
                >
                    {d.toy}
                </span>
            ))}
        </>
    );
}

export default ToyRain;