import React, { useState } from "react";
import { Button } from "../components/Button";
import Quiz from "./Comprehension";
import { CanvasClicker } from "../components/Canvas";
import { Hypotheses } from "../components/Hypotheses";

export function Instructions({ next }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const instructionComponents = [
    <Introduction1 />,
    <Introduction2 />,
    <Introduction3 />,
    <Introduction4 />,
    <Introduction5 />,
    <Quiz next={next} />,

    // Add more instruction components as needed
  ];

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextPage = () => {
    if (currentIndex < instructionComponents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (currentIndex === instructionComponents.length - 1) {
    // get rid of next button on last page
    return (
      <div className="instructions">
        {instructionComponents[currentIndex]}
        <div className="flex w-sw justify-center">
          <Button handleClick={prevPage} autoFocus>
            Prev
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="instructions">
        {/* <h1>How to play</h1> */}
        {instructionComponents[currentIndex]}
        <div className="flex w-sw justify-center">
          <Button handleClick={prevPage} autoFocus>
            Prev
          </Button>
          <Button handleClick={nextPage} autoFocus>
            {/* <Button handleClick={currentIndex === instructionComponents.length - 1 ? next : nextPage} autoFocus> */}
            Next
          </Button>
        </div>
      </div>
    );
  }
}

export function Introduction1({ next }) {
  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h1>How to play</h1>
      {/* <h3 className="text-lg leading-6 font-medium text-gray-900">
        Sample header
      </h3> */}
      <p>
        Please pay attention to the instructions! There is a quiz at the end. If
        your answers indicate that you have not read the instructions, you will
        not be able to continue.
      </p>
      <div>
        <span>
          <img
            className="image-centered"
            src="images/player_intro.png"
            style={{ height: "300px" }}
          />
        </span>
      </div>
    </div>
  );
}

export function Introduction2({ next }) {
  return (
    <div className="mt-1 sm:mt-3 p-20">
      <h1>How to play</h1>
      {/* <div className="mt-2 mb-6"> */}
      <p>
        In this game, you're going to be paired up with another player to play a
        series of <strong>teaching games</strong>.
      </p>
      <p>
        When the game starts, one of you will be randomly assigned the{" "}
        <strong>teacher</strong> role and one of you will be randomly assigned
        the <strong>learner</strong> role.
      </p>
      <br></br>
      <h2>Learner role</h2>
      <p>
        If you are the <strong>learner</strong>, your job is to bet on multiple
        choice questions like the one below.
      </p>
      {/* TODO: add the version of the problem with the sliders */}
      <p>
        On each trial, we'll give you 100 'chips', and you'll place bets by
        distributing those chips among the four options using the sliders below.
        The higher the value on the slider, the more chips we'll place on that
        option.
      </p>
      <p>
        <strong>
          The more chips you place on the right answer, the bigger your bonus
          will be.
        </strong>
      </p>

      {/* <div id="canvas-wrapper">
        <table class="student-canvas">
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </div> */}
      <div id="hypothesis-space">
        <div class="hypothesis-wrapper">
          <h2>A</h2>
          <table class="hypothesis">
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
          <br></br>
          <div className="slider-container">
            <input type="range" min="0" max="100" />
          </div>
        </div>

        <div class="hypothesis-wrapper">
          <h2>B</h2>
          <table class="hypothesis">
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
          <br></br>
          <div className="slider-container">
            <input type="range" min="0" max="100" />
          </div>
        </div>

        <div class="hypothesis-wrapper">
          <h2>C</h2>
          <table class="hypothesis">
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
          <br></br>
          <div className="slider-container">
            <input type="range" min="0" max="100" />
          </div>
        </div>

        <div class="hypothesis-wrapper">
          <h2>D</h2>
          <table class="hypothesis">
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
          <br></br>
          <div className="slider-container">
            <input type="range" min="0" max="100" />
          </div>
        </div>
      </div>

      <br></br>

      <p>
        You might be wondering, how do I know which answer is the right one?
      </p>
      {/* <div id="canvas-wrapper">
          <table class="student-canvas">
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
        </div>
        <div id="hypothesis-space">
          <div class="hypothesis-wrapper">
            <h2>A</h2>
            <table class="hypothesis true">
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </div>

          <div class="hypothesis-wrapper">
            <h2>B</h2>
            <table class="hypothesis">
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </div>

          <div class="hypothesis-wrapper">
            <h2>C</h2>
            <table class="hypothesis">
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </div>

          <div class="hypothesis-wrapper">
            <h2>D</h2>
            <table class="hypothesis">
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td class="pos">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </div>
        </div> */}
      <br></br>
      {/* </div> */}
    </div>
  );
}

export function Introduction3({ next }) {
  return (
    <div className="mt-1 sm:mt-3 p-20">
      <h1>How to play</h1>
      <h2>Learner role (continued)</h2>
      <br></br>
      <p>
        If you are the learner, you will be shown hints from the teacher. Here
        is an example of a set of hints you might see:{" "}
      </p>
      <div id="canvas-wrapper">
        <table class="student-canvas">
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td class="selected">&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td class="selected">&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </div>
      <p>
        Given the teacher's hints, you will use the sliders to indicate what you
        think the right answer is.
      </p>
      <p>
        If you think an option is <em>definitely wrong</em>, move the slider all
        the way to the left;
      </p>
      <p>
        If you think an option is <em>definitely right</em>, you should go “all
        in” and move the slider all the way to the right.
      </p>
      <p>If there's a chance that several options could be right,
        you can improve your chances of getting a bonus by distributing the
        chips among multiple options.</p>
      <p>Try it now!</p>
      <div id="hypothesis-space">
        <div class="hypothesis-wrapper">
          <h2>A</h2>
          <table class="hypothesis">
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
          <br></br>
          <div className="slider-container">
            <input type="range" min="0" max="100" />
          </div>
        </div>

        <div class="hypothesis-wrapper">
          <h2>B</h2>
          <table class="hypothesis">
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
          <br></br>
          <div className="slider-container">
            <input type="range" min="0" max="100" />
          </div>
        </div>

        <div class="hypothesis-wrapper">
          <h2>C</h2>
          <table class="hypothesis">
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
          <br></br>
          <div className="slider-container">
            <input type="range" min="0" max="100" />
          </div>
        </div>

        <div class="hypothesis-wrapper">
          <h2>D</h2>
          <table class="hypothesis">
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td class="pos">&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
          <br></br>
          <div className="slider-container">
            <input type="range" min="0" max="100" />
          </div>
        </div>
      </div>

      <br></br>
    </div>
  );
}

export function Introduction4({ next }) {
  return (
    <div>
      <h1>How to play</h1>
      <h2>Teacher role</h2>
      <p>
        If you are the <strong>teacher</strong>, you will be shown the correct
        answer to the question, highlighted in <strong>yellow</strong> below.
        You will also see the learner's current bets for what they think the
        right answer is. Your job is to give hints to the learner to help them
        pick out the right answer.
      </p>
      <p>
        You can give hints by clicking on the canvas below. The learner will see
        the hints you pick out when you submit them. You can give one hint at a
        time. Try clicking on the canvas now!
      </p>
      <CanvasClicker
        hypothesis={[
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 0],
          [0, 0, 0, 1, 1, 0],
          [0, 0, 0, 1, 1, 0],
          [0, 0, 0, 1, 1, 0],
          [0, 0, 0, 0, 0, 0],
        ]}
        selected_cells={[]}
        // onCellSelect={handleCellSelect}
      />
      <Hypotheses
        hypothesis_order={["A", "B", "C", "D"]}
        problem_states={{
          A: [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0],
          ],
          B: [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
          ],
          C: [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
          ],
          D: [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0],
          ],
        }}
        role={"teacher"}
        sliderValues={{ A: 50, B: 75, C: 10, D: 0 }}
      />
      <p>
        <strong>
          Working together, both you and your partner will win more money if the
          learner picks out the right answers.
        </strong>
      </p>
      <br></br>
    </div>
  );
}

export function Introduction5({ next }) {
  return (
    <div>
      <h1>Structure of the game</h1>
      <p>
        We are interested in how teachers and learners communicate hints and
        bets to teach and learn effectively. Here is how the game will go!
        Please read the following information carefully.
      </p>
      {/* <h2 style={{ textAlign: 'left' }}>Three 3️⃣ hints per problem</h2> */}
      <p>
        You will see a total of 23 problems. For each problem, the teacher will
        send <strong>three</strong> 3️⃣ hints to the learner.
      </p>
      <p>
        Before the teacher sends their first hint, the learner will use their
        sliders to place bets on what they think the right answer is,{" "}
        <em>before</em> seeing any information from the teacher.
      </p>
      <p>
        Then, the teacher will see the learner's bets, and send their first
        hint.
      </p>
      <p>
        The learner will then update their bets based on the teacher's hint. The
        teacher will then see the learner's updated bets, and send another hint.
        The learner will see the teacher's additional hint and then update their
        bets again. Finally, the teacher sends a third hint. The learner will
        then see the teacher's third hint and update their bets one last time.
      </p>

      <hr></hr>
      <h2>To summarize, for each teaching problem:</h2>
      {/* <p>To summarize, here's how each teaching problem will go:</p> */}
      <br></br>
      <div className="center">
        <ol>
          <li>
            Learner places bets on what they think the right answer is, before
            seeing any hints
          </li>
          <li>Teacher sees learner's bets and sends first hint</li>
          <li>Learner sees teacher's first hint and updates their bets</li>
          <li>Teacher sees updated learner bets and sends a second hint</li>
          <li>Learner sees teacher's second hint and updates their bets</li>
          <li>Teacher sees updated learner bets and sends a third hint</li>
        </ol>

        {/* Maybe add a box around this */}
      </div>
      <br></br>
      <hr></hr>

      <h2 style={{ textAlign: "left" }}>How to earn a bonus</h2>
      <p>
        At the end of the experiment, we will calculate your bonus based on the
        bets the learner placed on 15 random trials across the experiment. So
        regardless of which role you're in, make sure that you do as well as
        possible on each trial (regardless of how many examples the teacher has
        sent) on each teaching problem!
      </p>
      <br></br>
    </div>
  );
}
