import React, { useState } from "react";
import ReactBootstrapSlider from "react-bootstrap-slider";

function Cell({ value }) {
  return <td className={value > 0 ? "pos" : ""}>&nbsp;</td>;
}

function Row({ rowData }) {
  return (
    <tr>
      {rowData.map((cell, index) => (
        <Cell key={index} value={cell} />
      ))}
    </tr>
  );
}

function HypothesisTable({_key, title, data, role }) {
    // draw one hypothesis table

  // role is either "learner" or "teacher"
  // if role is "learner", then the slider should be disabled
  // if role is "teacher", then the slider should be enabled and the true hypothesis is selected

  // data is a list of lists of 0s and 1s, aka the current hypothesis

  const [sliderValue, setSliderValue] = useState(30);

  // add class 'true' for the hypothesis with key 'A'


  return (
    <div className="hypothesis-wrapper">
        <div className={_key === 'A' && role === 'teacher' ? 'true' : ''}>
      <h2> {title} </h2>
      <table className="hypothesis">
        <tbody>
          {data.map((row, index) => (
            <Row key={index} rowData={row} />
          ))}
        </tbody>
      </table>
      </div>
      <br></br>
      <div><SliderComponent enabled={role != "teacher"}/></div>
    </div>
  );
}

export function Hypotheses({ hypothesis_order, problem_states, role}) {
    // draw all hypothesis tables
    // if role is "teacher", then the true hypothesis (A) is selected
    const labels = ["A", "B", "C", "D"]
  return (
    <div id="hypothesis-space">
      {hypothesis_order.map((key, index) => (
        <HypothesisTable key={key} _key={key} title={labels[index]} data={problem_states[key]} role={role} />
      ))}
    </div>
  );
}

export function SliderComponent({ enabled }) {
  // State to keep track of the current slider value
  const [sliderValue, setSliderValue] = useState(0);

  // Function to handle slider value changes
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  return (
    <div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={handleSliderChange}
        disabled={!enabled}
      />
      <p>Current value: {sliderValue}</p>
    </div>
  );
}
