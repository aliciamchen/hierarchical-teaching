import React, { useEffect, useRef, useState } from "react";

export function CanvasClicker({ hypothesis, selected_cells }) {
  // For the teacher to select cells to show learner
  // Select cells when clicked
  // selected_cells is a list of [row, col] pairs
  // Cells not part of the hypothesis should be greyed out
  // selected_cells should also be greyed out
  // Keep a record of clicked cells in [row, col] format

  // TODO: make it that you can only select one cell

  const tableRef = useRef(null);
  let lastSelectedCell = null; // To keep track of the last selected cell

  useEffect(() => {
    if (tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tr");
      rows.forEach((row, rowIndex) => {
        const columns = row.querySelectorAll("td");
        columns.forEach((col, colIndex) => {
          if (hypothesis[rowIndex][colIndex]) {
            col.classList.add("pos");
          }

          if (
            selected_cells.some(
              (cell) => cell[0] === rowIndex && cell[1] === colIndex
            )
          ) {
            col.classList.add("past");
          }

          // Event listener to toggle selected state
          // col.addEventListener("click", () => {
          //   if (!col.classList.contains("past")) {
          //     col.classList.toggle("selected");
          //   }
          // });

          col.addEventListener("click", () => {
            if (col.classList.contains("past")) {
              return; // Do nothing for 'past' cells
            }

            // If another cell was previously selected, deselect it
            if (lastSelectedCell) {
              lastSelectedCell.classList.remove("selected");
            }

            // Select the clicked cell and update the lastSelectedCell reference
            col.classList.add("selected");
            lastSelectedCell = col;
          });
        });
      });
    }
  }, [hypothesis, selected_cells]);

  return (
    <div id="canvas-wrapper">
      <table ref={tableRef} className="canvas">
        <tbody>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Display canvas to learner based on the example(s) selected by the teacher
export function Canvas({ hint_state }) {
  // TODO: maybe change hint_state to selected_cells
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tr");
      rows.forEach((row, rowIndex) => {
        const columns = row.querySelectorAll("td");
        columns.forEach((col, colIndex) => {
          if (hint_state[rowIndex][colIndex]) {
            col.classList.add("selected");
          } else {
            col.classList.remove("selected");
          }

          // col.addEventListener('click', () => {
          //   col.classList.add('selected');
          // });
        });
      });
    }
  }, [hint_state]);

  return (
    <div id="canvas-wrapper">
      <table ref={tableRef} className="student-canvas">
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </div>
  );
}
