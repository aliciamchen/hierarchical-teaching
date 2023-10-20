import React from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { CanvasClicker, Canvas } from "../components/Canvas";
import { Hypotheses } from "../components/Hypotheses";

export function NextProblem({
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
      <div>
        <h1>Problem finished</h1>
        <p>Finished problem! Correct answer shown to learner.</p>
        <p>
          You have earned ${player.round.get("thisRoundBonus").toFixed(2)} for this
          teaching problem. You have earned ${player.get("bonus").toFixed(2)} so far.
        </p>
        <p>Click below to advance to the next problem.</p>
        <Button handleClick={() => onClick()}>Next problem</Button>
      </div>
    );
  } else if (player.get("role") === "learner") {
    // show what the right answer was
    return (
      <div id="student-betting" class="slide">
        <h1>Problem finished!</h1>
        <Canvas
          selected_cells={selected_cells}
          // onCellSelect={handleCellSelect}
        />
        <h2>Here's what the right answer was:</h2>
        <Hypotheses
          hypothesis_order={teacher_hypothesis_order}
          problem_states={problem_states}
          role={"teacher"}
          sliderValues={sliderValues}
        />
        <p>
          You have earned <strong>${player.round.get("thisRoundBonus").toFixed(2)}</strong>{" "}
          for this teaching problem. You have earned{" "}
          <strong>${player.get("bonus").toFixed(2)}</strong> so far.
        </p>
        <p>Click below to advance to the next problem.</p>
        {/* TODO: Save information from sliders in Hypotheses when button is clicked */}
        <Button handleClick={() => onClick()}>Next problem</Button>
        {/* Might have to add an option for the button to be disabled */}
      </div>
    );
  }
  // return (
  //   <div>
  //     <h1>Problem finished</h1>
  //     <p>Finished problem! Click below to advance to the next problem.</p>
  //     <Button handleClick={() => onClick()}>Next problem</Button>
  //   </div>
  // );
}
