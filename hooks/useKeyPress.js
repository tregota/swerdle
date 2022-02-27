import { useEffect, useRef } from "react";

export default function useKeyPress(handler, dependencies) {
  const funcRef = useRef(handler);

  useEffect(() => {
    funcRef.current = handler;
  }, dependencies);

  function downHandler({ key, keyCode }) {
      funcRef.current(key, keyCode);
  }

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []);
}