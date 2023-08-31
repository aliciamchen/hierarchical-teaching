import React from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { Canvas } from "../components/Canvas";
import { Hypotheses } from "../components/Hypotheses";

export function TeacherExample({
  hint_state,
  hypothesis_order,
  problem_states,
}) {
  const player = usePlayer();
  const players = usePlayers();
  const partner = players.filter((p) => p.id !== player.id)[0];

  function onClick() {
    player.stage.set("submit", true);
  }


  // hint_state might have to be passed in as a prop
  return (
    <div id="student-betting" class="slide">
      <h1>Problem %i/%i</h1> {/* Problem number goes here */}
      <p>Problem description goes here</p>
      <Canvas hint_state={hint_state} />
      <p>Bet description goes here?</p>
      <Hypotheses
        hypothesis_order={hypothesis_order}
        problem_states={problem_states}
      />

    {/* TODO: Save information from sliders in Hypotheses when button is clicked */}
      <Button className="m-5" handleClick={() => onClick()}>
        Place bets
      </Button>{/* Might have to add an option for the button to be disabled */}



    </div>
  );
}
