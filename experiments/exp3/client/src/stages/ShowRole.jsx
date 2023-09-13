import React from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";

export function ShowRole() {
  // show participant whether they are the teacher or the learner


  const player = usePlayer();

  function onClick() {
    player.stage.set("submit", true);
  }

  return (
    <div>
      <h3>Your role</h3>
      <p>You are the <strong>{player.get("role")}</strong></p>
      <Button handleClick={() => onClick()}>Begin first problem</Button>
    </div>
  );
}
