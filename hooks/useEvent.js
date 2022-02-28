import { useEffect, useRef } from "react";

export default function useKeyPress(event, handler, dependencies) {
  const funcRef = useRef(handler);

  useEffect(() => {
    funcRef.current = handler;
  }, dependencies);

  useEffect(() => {
    const localHandler = (event) => {
        funcRef.current(event);
    }

    // Add event listener
    window.addEventListener(event, localHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener(event, localHandler);
    };
  }, [event]);
}