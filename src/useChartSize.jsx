import { useEffect, useRef, useState } from 'react';

const useChartSize = () => {
    const containerRef = useRef();
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width } = entry.contentRect;
                setSize({
                    width,
                    height: width * 0.6
                });
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return [containerRef, size];
};

export default useChartSize;
