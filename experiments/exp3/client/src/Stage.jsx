import React from "react";
import {
  useGame,
  usePlayer,
  usePlayers,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import { TeacherExample } from "./stages/TeacherExample";

export function Stage() {
  const game = useGame();
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();

  const teacher = players.find((player) => player.get("role") === "teacher");

  const problems = player.get("problems");

  if (player.stage.get("submit")) {
    if (players.length === 1) {
      return <Loading />;
    }

    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player(s).
      </div>
    );


  }

  // console.log(player.round.get("selectedCellsSoFar"))

  switch (stage.get("name")) {
    case "TeacherExample":
      return (
        <TeacherExample
          hint_state={problems[0]["A"]}
          hypothesis_order={["B", "A", "C", "D"]}
          problem_states={problems[0]}
          selected_cells={teacher.round.get("selectedCellsSoFar")}
          role = {player.get("role")}
        />
      );
    // return <TeacherExample hint_state={} hypothesis_order={} problem_states={}/>;
    default:
      return <div>Loading...</div>;
  }
}
