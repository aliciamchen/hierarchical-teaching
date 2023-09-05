import React from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";

export function NextProblem() {
  // say thank you for finishing this problem
  // display button to go to next problem (with number of problem) and start new round

  const player = usePlayer();
  // const players = usePlayers();
  // const partner = players.filter((p) => p.id !== player.id)[0];

  function onClick() {
    player.stage.set("submit", true);
  }

  return (
    <div>
      <h1>Problem finished</h1>
      <p>Finished problem! Click below to advance to the next problem.</p>
      <Button handleClick={() => onClick()}>Next problem</Button>
    </div>
  );
}
