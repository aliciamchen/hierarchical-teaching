import React from "react";

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

function HypothesisTable({ title, data }) {
    return (
      <div className="hypothesis-wrapper">
        <h2> {title} </h2>
        <table className="hypothesis">
          <tbody>
            {data.map((row, index) => (
              <Row key={index} rowData={row} />
            ))}
          </tbody>
        </table>
        <input
          id={`${title}-betting-slider`}
          data-slider-id="betting-slider"
          type="text"
          data-slider-min="0"
          data-slider-max="100"
          data-slider-step="1"
        />
      </div>
    );
  }

export function Hypotheses({ hypothesis_order, problem_states }) {
    return (
      <div id="hypothesis-space">
        {hypothesis_order.map((key) => (
          <HypothesisTable key={key} title={key} data={problem_states[key]} />
        ))}
      </div>
    );
  }


