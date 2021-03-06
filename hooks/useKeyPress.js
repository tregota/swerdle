import { useEffect, useRef } from "react";

export default function useKeyPress(handler, dependencies) {
  const funcRef = useRef(handler);

  useEffect(() => {
    funcRef.current = handler;
  }, dependencies);

  useEffect(() => {
    const localHandler = ({ key, keyCode }) => {
      funcRef.current(key, keyCode);
    }

    // Add event listener
    window.addEventListener("keydown", localHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", localHandler);
    };
  }, []);
}