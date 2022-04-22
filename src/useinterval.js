// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
import { useEffect, useRef } from "react";

function useInterval(callback, delay, start = true) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (start && delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [start, delay]);
}

export default useInterval;
