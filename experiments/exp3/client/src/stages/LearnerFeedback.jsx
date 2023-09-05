import React, { useState } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { CanvasClicker, Canvas } from "../components/Canvas";
import { Hypotheses } from "../components/Hypotheses";

export function LearnerFeedback({
  hint_state,
  hypothesis_order,
  problem_states,
  selected_cells,
  role,
  initialSliderValues
}) {
  const player = usePlayer();
  const players = usePlayers();
  const partner = players.filter((p) => p.id !== player.id)[0];

  // Create a state variable to store slider values for all hypotheses
  const [sliderValues, setSliderValues] = useState(initialSliderValues);

  // Callback function to update slider value
  const updateSliderValue = (key, newValue) => {
    setSliderValues({
      ...sliderValues,
      [key]: newValue,
    });
  };

  function onClick() {
    player.stage.set("submit", true);
    player.stage.set("sliderValues", sliderValues);
  }
  // const [lastSelectedCell, setLastSelectedCell] = useState(null);

  // const handleCellSelect = (cellElement, rowIndex, colIndex) => {
  //   // Do something with the cell element if needed
  //   // For now, we'll just update the lastSelectedCell state
  //   setLastSelectedCell([rowIndex, colIndex]);
  // };

  // function onClick() {
  //   player.stage.set("submit", true);
  //   player.stage.set("selected_cell", lastSelectedCell);
  // }
  // hint_state might have to be passed in as a prop

  if (role === "learner") {
    // player.stage.set("submit", true);
    return (
      <div id="student-betting" class="slide">
        <h1>Problem %i/%i</h1> {/* Problem number goes here */}
        <p>Look at hypotheses send bet time</p>
        <Canvas
          selected_cells={selected_cells} // Change later to blank screen or just examples selected
          //   selected_cells={selected_cells}
        />
        <p>Bet description goes here?</p>
        <Hypotheses
          hypothesis_order={hypothesis_order}
          problem_states={problem_states}
          role={role}
          disabled={false}
          updateSliderValue={updateSliderValue}
          sliderValues={sliderValues}
        />
        <p>
          Please press Continue when you are ready to send bet{" "}
        </p>
        <Button className="m-5" handleClick={() => onClick()}>
          Continue
        </Button>
      </div>
    );
  } else if (role === "teacher") {
    return (
      <div id="student-betting" class="slide">
        <h1>Problem %i/%i</h1> {/* Problem number goes here */}
        <p>Problem description goes here</p>
        <CanvasClicker
          hypothesis={hint_state}
          selected_cells={selected_cells}
        />
        <p>Bet description goes here?</p>
        <Hypotheses
          hypothesis_order={hypothesis_order}
          problem_states={problem_states}
          role={role}
          disabled={true}
          sliderValues={sliderValues}
        />
        <p>Press continue when you are ready to see bets</p>
        {/* TODO: Save information from sliders in Hypotheses when button is clicked */}
        <Button className="m-5" handleClick={() => onClick()}>
          Send example to learner
        </Button>
        {/* Might have to add an option for the button to be disabled */}
      </div>
    );
  }
}
