// src/hooks/use-passive-event.ts
import { useEffect } from 'react';
export function usePassiveEvent(element, eventName, handler, options = { passive: true }) {
    useEffect(() => {
        if (!element)
            return;
        element.addEventListener(eventName, handler, options);
        return () => {
            element.removeEventListener(eventName, handler);
        };
    }, [element, eventName, handler, options]);
}
