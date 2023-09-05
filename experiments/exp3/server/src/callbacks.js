import { problems } from "./constants.js";
import { ClassicListenersCollector } from "@empirica/core/admin/classic";

export const Empirica = new ClassicListenersCollector();
// console.log(problems)

Empirica.onGameStart(({ game }) => {
  console.log("game started")
  const players = game.players;
  const roles = ["teacher", "learner"]

  players.forEach((player, i) => {
    player.set("playerIndex", i);
    player.set("role", roles[i]);
    player.set("problems", problems)
  })

  const round = game.addRound({
    name: `test round`,
  });

  round.addStage({ name: "TeacherExample", duration: 100000 });
  round.addStage({ name: "LearnerFeedback", duration: 100000 });
  round.addStage({ name: "TeacherExample", duration: 100000 });
  round.addStage({ name: "LearnerFeedback", duration: 100000 });
  round.addStage({ name: "TeacherExample", duration: 100000 });
  round.addStage({ name: "LearnerFeedback", duration: 100000 });
});

Empirica.onRoundStart(({ round }) => {
  console.log("round started")
  const players = round.currentGame.players;
  const teacher = players.find((player) => player.get("role") === "teacher");
  const learner = players.find((player) => player.get("role") === "learner");
  teacher.round.set("selectedCellsSoFar", []);
  learner.round.set("sliderValuesSoFar", [{A: 0, B: 0, C: 0, D: 0}]);

});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {
  // This is where I log the example(s) the teacher selected
  // or the bets the students made
  if (stage.get("name") === "TeacherExample") {
    console.log("teacher example")
    const players = stage.currentGame.players;
    const teacher = players.find((player) => player.get("role") === "teacher");

    const selected_cell = teacher.stage.get("selected_cell") || []
    console.log(selected_cell)

    const selectedCellsSoFar = teacher.round.get("selectedCellsSoFar") || [];
    console.log(selectedCellsSoFar)
    // console.log(selectedCellsSoFar.push(selected_cell))

    teacher.round.set("selectedCellsSoFar", pushAndReturn(selectedCellsSoFar, selected_cell));

    console.log(teacher.round.get("selectedCellsSoFar"))
  }

  if (stage.get("name") === "LearnerFeedback") {
    console.log("learner feedback")
    const players = stage.currentGame.players;
    const teacher = players.find((player) => player.get("role") === "teacher");
    const learner = players.find((player) => player.get("role") === "learner");

    const sliderValues = learner.stage.get("sliderValues");
    console.log(sliderValues)
    const sliderValuesSoFar = learner.round.get("sliderValuesSoFar") || [];
    learner.round.set("sliderValuesSoFar", pushAndReturn(sliderValuesSoFar, sliderValues));
  }
});

Empirica.onRoundEnded(({ round }) => {
  // This is where I log
});


Empirica.onGameEnded(({ game }) => {});


function calculateJellyBeansScore(stage) {
  if (
    stage.get("name") !== "Answer" ||
    stage.round.get("task") !== "jellybeans"
  ) {
    return;
  }

  for (const player of stage.currentGame.players) {
    let roundScore = 0;

    const playerGuess = player.round.get("guess");

    if (playerGuess) {
      const deviation = Math.abs(playerGuess - jellyBeansCount);
      const score = Math.round((1 - deviation / jellyBeansCount) * 10);
      roundScore = Math.max(0, score);
    }

    player.round.set("score", roundScore);

    const totalScore = player.get("score") || 0;
    player.set("score", totalScore + roundScore);
  }
}

function pushAndReturn(arr, value) {
  arr.push(value);
  return arr;
}
