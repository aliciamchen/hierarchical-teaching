import React from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { CanvasClicker, Canvas } from "../components/Canvas";
import { Hypotheses } from "../components/Hypotheses";

export function ShowFeedback({
  hint_state,
  teacher_hypothesis_order,
  learner_hypothesis_order,
  problem_states,
  selected_cells,
  role,
  sliderValues,
}) {
  // say thank you for finishing this problem
  // display button to go to next problem (with number of problem) and start new round

  const player = usePlayer();
  // const players = usePlayers();
  // const partner = players.filter((p) => p.id !== player.id)[0];

  function onClick() {
    player.stage.set("submit", true);
  }

  if (player.get("role") === "teacher") {
    return (
      <div id="student-betting" class="slide">
        <h1>Received bets from learner!</h1>
        <br></br>
        <p>Learner's bets highlighted in <span style={{ background: "#c9fff8" }}>LIGHT BLUE</span>. Actual correct answer highlighted in <span style={{ background: "gold" }}>GOLD</span>.</p>
        {/* <CanvasClicker
          hypothesis={hint_state}
          selected_cells={selected_cells}
          // onCellSelect={handleCellSelect}
        /> */}
        <Hypotheses
          hypothesis_order={teacher_hypothesis_order}
          problem_states={problem_states}
          role={"teacher"}
          sliderValues={sliderValues}
          highlightSlider={true}
          />
        <div style={{ display: "flex", justifyContent: "center" }}>
            <h2 style={{ padding: "10px", backgroundColor: "#c9fff8", width: "fit-content" }}>Learner's bets</h2>
        </div>
        <br></br>
        <p><strong>Click below when you are ready to advance to the next problem.</strong></p>
        <Button handleClick={() => onClick()}>Next problem</Button>
      </div>
    );
  } else if (player.get("role") === "learner") {
    // show what the right answer was
    return (
      <div id="student-betting" class="slide">
        <h1>Bets submitted! Showing your bets to teacher...</h1>
        <Canvas
          selected_cells={selected_cells}
          // onCellSelect={handleCellSelect}
        />
        <h2>Your bets so far:</h2>
        <Hypotheses
          hypothesis_order={learner_hypothesis_order}
          problem_states={problem_states}
          role={"learner"}
          disabled={true}
          sliderValues={sliderValues}
        />
        {/* <p><strong>Click below to advance to the next problem.</strong></p>
        <Button handleClick={() => onClick()}>Next problem</Button> */}
      </div>
    );
  }
}
