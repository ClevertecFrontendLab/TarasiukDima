import { useEffect, useState } from 'react';

export const useIsMobile = () => {
    const [width, setWidth] = useState(window.innerWidth);

    const changeWindowSize = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', changeWindowSize);

        return () => {
            window.removeEventListener('resize', changeWindowSize);
        };
    }, []);

    return width <= 768;
};
