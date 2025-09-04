import React, { useEffect, useState, useRef, useCallback } from 'react';

interface Petal {
    id: number;
    x: number;
    y: number;
    rotation: number;
    size: number;
    speed: number;
    opacity: number;
    color: string;
}

interface FloatingPetalsProps {
    count?: number;
    colors?: string[];
}

export const FloatingPetals: React.FC<FloatingPetalsProps> = ({
                                                                  count = 50,
                                                                  colors = ['#f8b4cb', '#f687b3', '#ed64a6', '#d53f8c', '#b83280']
                                                              }) => {
    const [petals, setPetals] = useState<Petal[]>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const animationRef = useRef<number>(0);
    const petalsRef = useRef<Petal[]>([]);

    // Update window dimensions
    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Initialize petals only once when dimensions are available
    useEffect(() => {
        if (dimensions.width > 0 && dimensions.height > 0 && petals.length === 0) {
            const initialPetals = Array.from({ length: count }, (_, index) => ({
                id: index,
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height - dimensions.height,
                rotation: Math.random() * 360,
                size: Math.random() * 15 + 10,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.6 + 0.3,
                color: colors[Math.floor(Math.random() * colors.length)]
            }));

            setPetals(initialPetals);
            petalsRef.current = initialPetals;
        }
    }, [dimensions.width, dimensions.height, count, colors, petals.length]);

    // Animation function using ref to avoid stale closures
    const animate = useCallback(() => {
        petalsRef.current = petalsRef.current.map(petal => {
            let newY = petal.y + petal.speed;
            let newX = petal.x + Math.sin(newY * 0.01) * 0.5;
            const newRotation = petal.rotation + 1;

            // Reset petal when it goes off screen
            if (newY > dimensions.height + 50) {
                newY = -50;
                newX = Math.random() * dimensions.width;
            }

            // Keep petals within screen bounds horizontally
            if (newX < -25) newX = dimensions.width + 25;
            if (newX > dimensions.width + 25) newX = -25;

            return {
                ...petal,
                x: newX,
                y: newY,
                rotation: newRotation
            };
        });

        setPetals([...petalsRef.current]);
        animationRef.current = requestAnimationFrame(animate);
    }, [dimensions.width, dimensions.height]);

    // Start animation when petals are ready
    useEffect(() => {
        if (petals.length > 0) {
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [petals.length, animate]);

    if (dimensions.width === 0 || petals.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
            {petals.map(petal => (
                <div
                    key={petal.id}
                    className="absolute will-change-transform"
                    style={{
                        left: petal.x,
                        top: petal.y,
                        transform: `rotate(${petal.rotation}deg)`,
                        opacity: petal.opacity
                    }}
                >
                    {/* Simple petal shape using CSS instead of SVG for better performance */}
                    <div
                        style={{
                            width: petal.size,
                            height: petal.size,
                            backgroundColor: petal.color,
                            borderRadius: '50% 0 50% 0',
                            transform: 'rotate(45deg)'
                        }}
                    />
                </div>
            ))}
        </div>
    );
};