import React, { useReducer, useContext, useEffect } from "react";
import useInterval from "./useinterval";

const GameState = React.createContext();
const GameDispatch = React.createContext();

export const useGameState = () => useContext(GameState);
export const useGameDispatch = () => useContext(GameDispatch);

export default function GameContext({ reducer, initialState, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const onKeyPress = ({ code }) => {
    dispatch({ type: "KEYPRESS", payload: code });
  };

  useInterval(
    () => {
      dispatch({ type: "TICK" });
    },
    state.interval,
    state.status === "ON"
  );

  // Add and remove Keydown event listener
  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  return (
    <GameState.Provider value={state}>
      <GameDispatch.Provider value={dispatch}>{children}</GameDispatch.Provider>
    </GameState.Provider>
  );
}
