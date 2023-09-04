import React, { useState } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { CanvasClicker } from "../components/Canvas";
import { Hypotheses } from "../components/Hypotheses";

export function TeacherExample({
  hint_state,
  hypothesis_order,
  problem_states,
  selected_cells,
  role
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
    player.stage.set("submit", true);
    player.stage.set("selected_cell", lastSelectedCell);
  }
  // hint_state might have to be passed in as a prop

  if (role === "learner") {
    player.stage.set("submit", true);
    return (
        <div id="student-betting" class="slide"></div>
    )
  } else if (role === "teacher") {
    return (
        <div id="student-betting" class="slide">
          <h1>Problem %i/%i</h1> {/* Problem number goes here */}
          <p>Problem description goes here</p>
          <CanvasClicker
            hypothesis={hint_state}
            selected_cells={selected_cells}
            onCellSelect={handleCellSelect}
          />
          <p>Bet description goes here?</p>
          <Hypotheses
            hypothesis_order={hypothesis_order}
            problem_states={problem_states}
            role = {role}
          />
          {/* TODO: Save information from sliders in Hypotheses when button is clicked */}
          <Button className="m-5" handleClick={() => onClick()}>
            Send example to learner
          </Button>
          {/* Might have to add an option for the button to be disabled */}
        </div>
      );
  }

}
