import "./styles.css";
import { useState, useEffect } from "react";
import GameContext, { useGameState, useGameDispatch } from "./gamecontext";
import { initialState, reducer, dimensions, equalCoordinates } from "./state";
import Modal from "./modal.js";

const statusAction = {
  NEW: "START",
  ENDED: "START",
  ON: "I QUIT",
  PAUSED: "RESUME"
};

let qnaIndex = 0;

const Cell = ({ coordinates }) => {
  const { snake, apple } = useGameState();
  let classNames = ["cell"];
  if (snake.find((segment) => equalCoordinates(segment, coordinates))) {
    classNames.push("snake");
  }
  if (equalCoordinates(apple, coordinates)) {
    classNames.push("apple");
  }
  return <div className={classNames.join(" ")}> </div>;
};

const Row = ({ yIndex }) => {
  return (
    <div className="row">
      {[...Array(dimensions)].map((_, xIndex) => (
        <Cell key={xIndex} coordinates={[xIndex, yIndex]} />
      ))}
    </div>
  );
};

const Grid = () =>
  [...Array(dimensions)].map((_, yIndex) => (
    <Row key={yIndex} yIndex={yIndex} />
  ));

export default function App() {
  const [questionList, setQuestionList] = useState([]);
  const [inputAnswer, setAnswer] = useState("");

  const [questionView, setQuestionView] = useState("Questions Appear Here");
  const [answerView, setAnswerView] = useState("");
  const [scoreCurrent, setScore] = useState(0);
  const [currentGameStatus, setGameStatus] = useState("");
  const [previousQuestionView, setPrevQuestionView] = useState(
    "Previous Questions Appear Here"
  );
  const [previousAnswerView, setPrevAnswerView] = useState(
    "Along with their Answer"
  );
  const [isCorrect, setifCorrect] = useState("");
  const [scoreFinal, setFinalScore] = useState(0);

  const GameOverBanner = () => {
    const { status } = useGameState();
    setGameStatus(status);
    return status === "ENDED" ? (
      <div className="game-over">
        <h1>GAME OVER</h1>
        <p>Binali mo leeg ng snake mo</p>
      </div>
    ) : null;
  };

  const Header = () => {
    const dispatch = useGameDispatch();
    const { status, score } = useGameState();
    let scoreFromSnake = score;
    console.log(status);
    return (
      <div>
        <h2> Score: {scoreFromSnake + scoreCurrent} </h2>

        <div>
          <button
            onClick={() => {
              dispatch({ type: statusAction[status] });
              if (statusAction[status] === "I QUIT") {
                endGameQuestionAnswer();
                // setFinalScore(scoreFromSnake + scoreCurrent);
                // console.log(scoreFromSnake);
                // console.log(scoreCurrent);
                // scoreFromSnake = 0;
                // setScore(0);
              } else if (statusAction[status] === "START") {
                scoreFromSnake = 0;
                setScore(0);
                updateQuestionAnswer();
              } else {
                updateQuestionAnswer();
              }
            }}
          >
            {statusAction[status]}
          </button>
        </div>
      </div>
    );
  };

  const handleInputChange = (event) => {
    event.preventDefault();
  };

  async function getQuestionList() {
    const url = "https://the-trivia-api.com/questions?limit=50&difficulty=easy";
    const response = await fetch(url);
    console.log(response);
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    setQuestionList(jsonResponse);
  }

  const SetInitialQuestionAnswer = () => {
    setQuestionView(questionList[0].question);
    setAnswerView(questionList[0].correctAnswer);
  };

  useEffect(() => {
    getQuestionList();
  }, []);

  const updateQuestionAnswer = () => {
    qnaIndex++;
    setPrevQuestionView(questionView);
    setPrevAnswerView(answerView);
    setQuestionView(questionList[qnaIndex].question);
    setAnswerView(questionList[qnaIndex].correctAnswer);
    setAnswer("");
  };

  const addScore = () => {
    setScore(scoreCurrent + 1);
  };

  const deductScore = () => {
    setScore(scoreCurrent - 1);
  };

  const endGameQuestionAnswer = () => {
    setPrevQuestionView(questionView);
    setPrevAnswerView(answerView);
    setQuestionView("");
    setAnswerView("");
    setAnswer("");
  };

  const checkAnswer = () => {
    if (inputAnswer === answerView.toLowerCase()) {
      updateQuestionAnswer();
      console.log("answer is correct");
      addScore();
      setifCorrect("CORRECT!");
    } else {
      updateQuestionAnswer();
      console.log("answer is incorrect");
      deductScore();
      setifCorrect("INCORRECT!");
    }
  };

  return (
    <div className="App">
      <GameContext initialState={initialState} reducer={reducer}>
        <center>
          <h1>The True Gamer Test</h1>
          <Modal />
          <Header />
        </center>
        <div className="row">
          <GameOverBanner />
          <div className="column">
            <center>
              <h3>{questionView}</h3>
              <form onSubmit={handleInputChange}>
                <div>
                  <label htmlFor="Answer">Answer: </label>
                  <span></span>
                  <input
                    type="text"
                    id="answer"
                    value={inputAnswer}
                    autoComplete="off"
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
                <span></span>
                <button
                  className=""
                  disabled={
                    currentGameStatus === "ENDED" || currentGameStatus === "NEW"
                  }
                  onClick={() => checkAnswer()}
                >
                  Submit
                </button>
              </form>
              <div>
                <h2>{isCorrect}</h2>
                <h3> {previousQuestionView} </h3>
                <h4>{previousAnswerView}</h4>
              </div>
            </center>
          </div>
          {/* put snake game here */}

          <div className="column">
            <p></p>
            <span> </span>
            <Grid />
          </div>
        </div>
      </GameContext>
    </div>
  );
}
