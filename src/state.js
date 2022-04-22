// Possible Status values: 'NEW' | 'ON' | 'PAUSE' | 'ENDED'
export const initialState = {
  status: "NEW",
  interval: 500,
  snake: [[0, 0]],
  direction: "RIGHT",
  apple: [],
  score: 0
};

export const dimensions = 24;
export const equalCoordinates = ([x1, y1], [x2, y2]) => x1 === x2 && y1 === y2;

export const scoreFromSnake = (state) => {
  return state.score;
};

function collideCoordinates(md1, md2) {
  for (var x = 0; x < md2.length; x++) {
    if (equalCoordinates(md1, md2[x])) {
      return true;
    }
  }

  return false;
}

const randomNumInDimensions = () => Math.floor(Math.random() * dimensions);
const randomCoordinates = () => [
  randomNumInDimensions(),
  randomNumInDimensions()
];

const moveSnakeSegment = ([x, y], direction) => {
  switch (direction) {
    case "UP":
      return [x, y - 1];
    case "DOWN":
      return [x, y + 1];
    case "LEFT":
      return [x - 1, y];
    case "RIGHT":
      return [x + 1, y];
    default:
      return [x, y];
  }
};

const moveSnake = (state) => {
  const nextHead = moveSnakeSegment(state.snake[0], state.direction);

  if (equalCoordinates(nextHead, state.apple)) {
    const newApple = randomCoordinates();
    return {
      ...state,
      apple: newApple,
      snake: [nextHead, ...state.snake],
      score: state.score + 1,
      interval: state.interval - 5 * state.snake.length
    };
  } else {
    const snakeCopy = [...state.snake];
    snakeCopy.pop(); // remove tail
    return { ...state, snake: [nextHead, ...snakeCopy] };
  }
};

const outOfGrid = ([x, y]) =>
  x < 0 || y < 0 || x >= dimensions || y >= dimensions;

export const reducer = (state, action) => {
  console.log(`Type: ${action.type}`);

  switch (action.type) {
    case "START":
      return { ...initialState, status: "ON", apple: randomCoordinates() };

    // case "RESUME":
    //   return { ...state, status: "ON" };

    case "I QUIT":
      return { ...state, status: "ENDED" };

    case "GAME_OVER":
      return { ...state, status: "ENDED" };

    case "TICK":
      const newState = moveSnake(state);
      if (outOfGrid(newState.snake[0])) {
        return { ...state, status: "ENDED" };
      } else if (collideCoordinates(newState.snake[0], state.snake)) {
        return { ...state, status: "ENDED" };
      } else {
        return newState;
      }

    case "KEYPRESS":
      const keyToDirection = {
        ArrowUp: "UP",
        ArrowRight: "RIGHT",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT"
      };
      if (state.status !== "ENDED") {
        if (Object.keys(keyToDirection).includes(action.payload)) {
          return moveSnake({
            ...state,
            direction: keyToDirection[action.payload]
          });
        } else {
          return state;
        }
      }
      return state;

    default:
      return state;
  }
};
