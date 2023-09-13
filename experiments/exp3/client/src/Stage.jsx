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
import { LearnerFeedback } from "./stages/LearnerFeedback";
import { NextProblem } from "./stages/NextProblem";
import { ShowRole } from "./stages/ShowRole";


export function Stage() {
  const game = useGame();
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();

  const teacher = players.find((player) => player.get("role") === "teacher");
  const learner = players.find((player) => player.get("role") === "learner");

  console.log(learner.round.get("sliderValuesSoFar"))
  // const problems = player.get("problems");

  console.log("Teacher hypothesis order: ", teacher.round.get("hypothesis_order"));
  console.log("Learner hypothesis order: ", learner.round.get("hypothesis_order"));

  if (player.stage.get("submit")) { // sometimes this is undefined? why
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
          hint_state={round.get("problem")["A"]}
          teacher_hypothesis_order={teacher.round.get("hypothesis_order")}
          learner_hypothesis_order={learner.round.get("hypothesis_order")}
          problem_states={round.get("problem")}
          selected_cells={teacher.round.get("selectedCellsSoFar")}
          role = {player.get("role")}
          sliderValues={learner.round.get("sliderValuesSoFar").slice(-1)[0]}
        /> // TODO: change slider values based on learner's prev guess
      );
    case "LearnerFeedback":
      return (
        <LearnerFeedback
          hint_state={round.get("problem")["A"]}
          teacher_hypothesis_order={teacher.round.get("hypothesis_order")}
          learner_hypothesis_order={learner.round.get("hypothesis_order")}
          problem_states={round.get("problem")}
          selected_cells={teacher.round.get("selectedCellsSoFar")}
          role = {player.get("role")}
          initialSliderValues={learner.round.get("sliderValuesSoFar").slice(-1)[0]} // later change to learner's prev guess aka sliderSoFar
        />
      )
    // return <TeacherExample hint_state={} hypothesis_order={} problem_states={}/>;
    case "NextProblem":
      return <NextProblem />;
    case "ShowRole":
      return <ShowRole />;
    default:
      return <div>Loading...</div>;
  }
}
