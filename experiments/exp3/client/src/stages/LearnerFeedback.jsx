import React, { useState } from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { CanvasClicker, Canvas } from "../components/Canvas";
import { Hypotheses } from "../components/Hypotheses";

export function LearnerFeedback({
  hint_state,
  teacher_hypothesis_order,
  learner_hypothesis_order,
  problem_states,
  selected_cells,
  role,
  initialSliderValues,
}) {

  const player = usePlayer();
  const players = usePlayers();
  const partner = players.filter((p) => p.id !== player.id)[0];

  // Create a state variable to store slider values for all hypotheses
  const [sliderValues, setSliderValues] = useState(initialSliderValues);

  // Callback function to update slider value
  const updateSliderValue = (key, newValue) => {
    setSliderValues({
      ...sliderValues,
      [key]: newValue,
    });
  };

  function onClick() {
    // if you haven't moved sliders, don't submit
    if (sliderValues === initialSliderValues) {
      alert("You must move at least one slider to submit.")
      return;
    }

    // handle case where there is a timeout


    player.stage.set("submit", true);
    partner.stage.set("submit", true);
    player.stage.set("sliderValues", sliderValues);
  }

  if (role === "learner") {
    // player.stage.set("submit", true);
    return (
      <div id="student-betting" class="slide">
        <br></br>
        <h1>Update your bets</h1> {/* Problem number goes here */}
        <p>Teacher's hints so far</p>
        <Canvas
          selected_cells={selected_cells} // Change later to blank screen or just examples selected
          //   selected_cells={selected_cells}
        />
        <h2>Submit bets below</h2>
        <Hypotheses
          hypothesis_order={learner_hypothesis_order}
          problem_states={problem_states}
          role={role}
          disabled={false}
          updateSliderValue={updateSliderValue}
          sliderValues={sliderValues}
        />
        <br></br>
        <h2>Press the button below when you're ready to submit bets</h2>
        <Button className="m-5" handleClick={() => onClick()}>
          Send bets to teacher
        </Button>
      </div>
    );
  } else if (role === "teacher") {
    return (
      <div id="student-betting" class="slide">
        <h1>Waiting for learner to submit bets...</h1>{" "}
        {/* Problem number goes here */}
        <p>Your selected hints so far</p>
        <CanvasClicker
          hypothesis={hint_state}
          selected_cells={selected_cells}
          disable_click={true}
        />
        <p>Learner bets so far</p>
        <Hypotheses
          hypothesis_order={teacher_hypothesis_order}
          problem_states={problem_states}
          role={role}
          disabled={true}
          sliderValues={sliderValues}
        />
        {/* <h2>Press continue when you are ready to see ✨new bets✨</h2> */}
      </div>
    );
  }
}
