import React, { useState } from "react";

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

function HypothesisTable({
  _key,
  title,
  data,
  role,
  disabled,
  updateSliderValue,
  initialSliderValue,
}) {
  // draw one hypothesis table

  // role is either "learner" or "teacher"
  // if role is "learner", then the slider should be disabled
  // if role is "teacher", then the slider should be enabled and the true hypothesis is selected

  // data is a list of lists of 0s and 1s, aka the current hypothesis

  //   const [sliderValue, setSliderValue] = useState(30);

  // add class 'true' for the hypothesis with key 'A'

  return (
    <div className="hypothesis-wrapper">
      <div className={_key === "A" && role === "teacher" ? "true" : ""}>
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
      <div>
        <SliderComponent
          enabled={role != "teacher" && !disabled}
          updateSliderValue={(newValue) => updateSliderValue(_key, newValue)}
          initialSliderValue={initialSliderValue}
        />
      </div>
    </div>
  );
}

export function Hypotheses({
  hypothesis_order,
  problem_states,
  role,
  disabled,
  updateSliderValue,
  sliderValues,
}) {
  // draw all hypothesis tables
  // if role is "teacher", then the true hypothesis (A) is selected
  const labels = ["A", "B", "C", "D"];
  return (
    <div id="hypothesis-space">
      {hypothesis_order.map((key, index) => (
        <HypothesisTable
          key={key}
          _key={key}
          title={labels[index]}
          data={problem_states[key]}
          role={role}
          disabled={disabled}
          updateSliderValue={updateSliderValue}
          initialSliderValue={sliderValues[key]}
        />
      ))}
    </div>
  );
}

export function SliderComponent({
  enabled,
  updateSliderValue,
  initialSliderValue,
}) {
  // State to keep track of the current slider value
  const [sliderValue, setSliderValue] = useState(initialSliderValue);

  // Function to handle slider value changes
  const handleSliderChange = (event) => {
    const newValue = event.target.value;
    setSliderValue(newValue);
    updateSliderValue(newValue);
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
