import { all_problems, problem_indices, max_block_bonus } from "./constants.js";
import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import _ from "lodash";

export const Empirica = new ClassicListenersCollector();
// console.log(problems)
const problems = all_problems.filter((problem, i) => problem_indices.includes(i)); // does it work here?

Empirica.onGameStart(({ game }) => {
  console.log("game started");
  const { feedback } = game.get("treatment");
  console.log("feedback condition: " + feedback);

  const players = game.players;
  const roles = ["teacher", "learner"];

  // filter all_problems to only include problems that are in problem_indices


  const problems_shuffled = _.shuffle(problems);
  console.log(problems_shuffled.length);

  players.forEach((player, i) => {
    player.set("playerIndex", i);
    player.set("role", roles[i]);
    player.set("problems", problems);
    player.set("problems_shuffled", problems_shuffled);
  });

  // add a first round with only one stage where participant is told their role
  const round = game.addRound({
    name: `Role`,
  });
  round.addStage({ name: "ShowRole", duration: 60 });

  // Add a round for each problem
  problems_shuffled.forEach((problem, i) => {
    const round = game.addRound({
      idx: i,
      name: `Problem ${i + 1}`,
      problem: problem,
      // save the index of the problem in the original list
      problem_idx: problems.indexOf(problem),
      original_problem_idx: problem_indices[problems.indexOf(problem)], // 0 to 39 in Natalia's paper
    });


    if (feedback === "no") {
    round.addStage({ name: "LearnerFeedback", duration: 90, stageIdx: 0});
    round.addStage({ name: "TeacherExample", duration: 90, stageIdx: 1});
    round.addStage({ name: "LearnerFeedback", duration: 90, stageIdx: 1});
    round.addStage({ name: "TeacherExample", duration: 90, stageIdx: 2});
    round.addStage({ name: "LearnerFeedback", duration: 90, stageIdx: 2 });
    round.addStage({ name: "TeacherExample", duration: 90, stageIdx: 3 });
    round.addStage({ name: "LearnerFeedback", duration: 90, stageIdx: 3 });
    round.addStage({ name: "NextProblem", duration: 90 });
    } else if (feedback === "yes") {
      round.addStage({ name: "LearnerFeedback", duration: 90, stageIdx: 0});
      round.addStage({ name: "ShowFeedback", duration: 90, stageIdx: 1});
      round.addStage({ name: "TeacherExample", duration: 90, stageIdx: 1});
      round.addStage({ name: "LearnerFeedback", duration: 90, stageIdx: 1});
      round.addStage({ name: "ShowFeedback", duration: 90, stageIdx: 1});
      round.addStage({ name: "TeacherExample", duration: 90, stageIdx: 2});
      round.addStage({ name: "LearnerFeedback", duration: 90, stageIdx: 2 });
      round.addStage({ name: "ShowFeedback", duration: 90, stageIdx: 1});
      round.addStage({ name: "TeacherExample", duration: 90, stageIdx: 3 });
      round.addStage({ name: "LearnerFeedback", duration: 90, stageIdx: 3 });
      round.addStage({ name: "NextProblem", duration: 90 });
    }
  });
});

Empirica.onRoundStart(({ round }) => {
  console.log("round started");
  console.log("problem idx " + round.get("original_problem_idx"))
  const players = round.currentGame.players;
  const teacher = players.find((player) => player.get("role") === "teacher");
  const learner = players.find((player) => player.get("role") === "learner");

  const teacher_hypothesis_order = _.shuffle(["A", "B", "C", "D"]);
  const learner_hypothesis_order = _.shuffle(["A", "B", "C", "D"]);

  teacher.round.set("hypothesis_order", teacher_hypothesis_order);
  learner.round.set("hypothesis_order", learner_hypothesis_order);

  // set the original problem index for each player (hope this works)
  teacher.round.set("original_problem_idx", round.get("original_problem_idx"));
  learner.round.set("original_problem_idx", round.get("original_problem_idx"));

  teacher.round.set("selectedCellsSoFar", []);

  learner.round.set("sliderValuesSoFar", [{ A: 0, B: 0, C: 0, D: 0 }]); // initial slider values for each teaching problem
});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {


  // This is where I log the example(s) the teacher selected
  // or the bets the students made
  if (stage.get("name") === "TeacherExample") {
    console.log("teacher example");
    const players = stage.currentGame.players;
    const teacher = players.find((player) => player.get("role") === "teacher");

    const selected_cell = teacher.stage.get("selected_cell") || [];

    const selectedCellsSoFar = teacher.round.get("selectedCellsSoFar") || [];
    // console.log(selectedCellsSoFar);
    // console.log(selectedCellsSoFar.push(selected_cell))

    teacher.round.set(
      "selectedCellsSoFar",
      pushAndReturn(selectedCellsSoFar, selected_cell)
    );

    console.log(teacher.round.get("selectedCellsSoFar"));
  }

  if (stage.get("name") === "LearnerFeedback") {
    console.log("learner feedback");
    const players = stage.currentGame.players;
    const teacher = players.find((player) => player.get("role") === "teacher");
    const learner = players.find((player) => player.get("role") === "learner");

    const sliderValues =
    learner.stage.get("sliderValues") || {A: null, B: null, C: null, D: null}


    const sliderValuesSoFar = learner.round.get("sliderValuesSoFar") || [];
    learner.round.set(
      "sliderValuesSoFar",
      pushAndReturn(sliderValuesSoFar, sliderValues)
    );

    console.log(sliderValuesSoFar)

    // after last LearnerFeedback stage, calculate bonus
    if (stage.get("stageIdx") == 3) {

      // choose a random slider value from the last 3 rounds; rescale
      const randomSliderItem = _.sample(sliderValuesSoFar.slice(1));
      const sliderValuesSum = _.sum(Object.values(randomSliderItem));
      const sliderValuesRescaled = _.mapValues(
        randomSliderItem,
        (value) => value / sliderValuesSum
      );

      const thisRoundBonus = sliderValuesRescaled['A'] * max_block_bonus || 0;
      console.log("this round bonus: " + thisRoundBonus);
      learner.round.set("thisRoundBonus", thisRoundBonus);
      teacher.round.set("thisRoundBonus", thisRoundBonus);

      const bonusSoFar = (learner.get("bonus") && teacher.get("bonus")) || 0;
      learner.round.set("bonusSoFar", bonusSoFar + thisRoundBonus);
      teacher.round.set("bonusSoFar", bonusSoFar + thisRoundBonus);

      learner.set("bonus", bonusSoFar + thisRoundBonus);
      teacher.set("bonus", bonusSoFar + thisRoundBonus);

      // Add info about condition (so I don't have to dig in a bunch of csvs)
      // console.log(stage.currentGame)
      const treatment = stage.currentGame.get("treatment");
      // console.log(treatment)
      const feedback = treatment.feedback;
      // console.log("feedback: " + feedback)
      learner.round.set("feedback", feedback);
      teacher.round.set("feedback", feedback);
    }
  }
});

Empirica.onRoundEnded(({ round }) => {
  // If it's the last round, set for the player that it is finished
  if (round.get("idx") == problems.length - 1) {
    const players = round.currentGame.players;
    players.forEach((player) => {
      player.set("ended", "finished");
    });

    // set final bonus for each player in game, because it sometimes doesn't show up in player
    // round.game.set("finalBonus", players[0].get("bonus")); // this doesn't work, it has to be currentGame
    round.currentGame.set("finalBonus", players[0].get("bonus"));
  }

});

Empirica.onGameEnded(({ game }) => {
  console.log("game ended")
  // console.log(game.players)
  // const players = game.players;

  // players.forEach((player, i) => {
  //   player.set("endedReason", game.get("endedReason"));
  // });

});

function pushAndReturn(arr, value) {
  arr.push(value);
  return arr;
}
