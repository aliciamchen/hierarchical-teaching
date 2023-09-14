import React, { useState } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { CanvasClicker, Canvas } from "../components/Canvas";
import { Hypotheses } from "../components/Hypotheses";

export function TeacherExample({
  hint_state,
  teacher_hypothesis_order,
  learner_hypothesis_order,
  problem_states,
  selected_cells,
  role,
  sliderValues,
}) {
  const player = usePlayer();
  const players = usePlayers();
  const partner = players.filter((p) => p.id !== player.id)[0];

  const [lastSelectedCell, setLastSelectedCell] = useState(null);

  const handleCellSelect = (cellElement, rowIndex, colIndex) => {
    // Do something with the cell element if needed
    // For now, we'll just update the lastSelectedCell state
    setLastSelectedCell([rowIndex, colIndex]);
  };

  function onClick() {
    if (role === "teacher") {
        // only submit if teacher has selected a cell
        if (lastSelectedCell === null) {
            alert("You must select an example to submit.")
            return;
        }

    }
    player.stage.set("submit", true);
    partner.stage.set("submit", true);
    // partner.stage.set("submit", true);
    player.stage.set("selected_cell", lastSelectedCell);
  }
  // hint_state might have to be passed in as a prop

  if (role === "learner") {
    // player.stage.set("submit", true);
    return (
      <div id="student-betting" class="slide">
        <h1>Waiting for teacher to select a hint...</h1>
        <Canvas
          selected_cells={selected_cells} // Change later to blank screen or just examples selected
          //   selected_cells={selected_cells}
        />
        <h2>Your current bets</h2>
        <Hypotheses
          hypothesis_order={learner_hypothesis_order}
          problem_states={problem_states}
          role={role}
          disabled={true}
          sliderValues={sliderValues}
        />
        <br></br>
        {/* paragraph with bold style */}
      </div>
    );
  } else if (role === "teacher") {
    return (
      <div id="student-betting" class="slide">
        <h1>Submit hint for learner</h1>
        <p>Select hint below</p>
        <CanvasClicker
          hypothesis={hint_state}
          selected_cells={selected_cells}
          onCellSelect={handleCellSelect}
        />
        <h2>Learner's current bets</h2>
        <Hypotheses
          hypothesis_order={teacher_hypothesis_order}
          problem_states={problem_states}
          role={role}
          sliderValues={sliderValues}
        />
        {/* TODO: Save information from sliders in Hypotheses when button is clicked */}
        <Button className="m-5" handleClick={() => onClick()}>
          Send hint to learner
        </Button>
        {/* Might have to add an option for the button to be disabled */}
      </div>
    );
  }
}
