import { useRef, useCallback } from "react";

export default function useLongPress(callback, delay = 600) {
    const timerRef = useRef(null);
    const triggeredRef = useRef(false);

    const start = useCallback((event) => {
        // Prevent default to avoid context menu on long press
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        triggeredRef.current = false;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            triggeredRef.current = true;
            callback();
        }, delay);
    }, [callback, delay]);

    const clear = useCallback(() => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }, []);

    return {
        onPointerDown: start,
        onPointerUp: clear,
        onPointerLeave: clear,
        onTouchStart: start,
        onTouchEnd: clear,
        onTouchCancel: clear,
    };
}
