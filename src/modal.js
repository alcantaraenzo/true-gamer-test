import React, { useState } from "react";
import "./modal.css";

export default function Modal() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      <button onClick={toggleModal} className="btn-modal">
        HOW TO PLAY
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Hello</h2>
            <h4>So pano ito laruin?</h4>
            <p>
              {" "}
              Kailangan mo magsagot ng questions habang inaalagaan snake mo. Use
              directional keys to move snake. Answer sa text box tas 'Enter
              lang'.
            </p>
            <h4>Bat ganon kapag magbback-track snake ko namamatay siya?</h4>
            <p>
              2D lang snake natin, kapag binack-track mo masisira leeg niya.
            </p>
            <h4>Ang hirap naman ng mga tanong</h4>
            <p>
              Wag mo ko sisihin, yun binibigay ng https://the-trivia-api.com/
            </p>
            <p>Partida na yung ginawa kong lowercase yung mga answers</p>
            <h4>Pano 'to naging True Gamer Test?</h4>
            <p>Kasi kailangan mo mag-isip habang ginagalaw snake mo</p>

            <h3>GOOD LUCK</h3>
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
