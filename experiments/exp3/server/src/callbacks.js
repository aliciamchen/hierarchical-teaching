import { problems } from "./constants.js";
import { ClassicListenersCollector } from "@empirica/core/admin/classic";

export const Empirica = new ClassicListenersCollector();
// console.log(problems)

Empirica.onGameStart(({ game }) => {
  console.log("game started")
  console.log(problems)
  // console.log(game.get("problems"))
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
  round.addStage({ name: "TeacherExample", duration: 10000 });
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {
  // This is where I log the example(s) the teacher selected
  // or the bets the students made
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
