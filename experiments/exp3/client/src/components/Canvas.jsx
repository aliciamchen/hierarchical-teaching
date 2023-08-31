import React, { useEffect, useRef } from "react";

export function Canvas({hint_state}) {
    const tableRef = useRef(null);

    useEffect(() => {
      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
          const columns = row.querySelectorAll('td');
          columns.forEach((col, colIndex) => {
            if (hint_state[rowIndex][colIndex]) {
              col.classList.add('selected');
            } else {
              col.classList.remove('selected');
            }
          });
        });
      }
    }, [hint_state]);

    return (
        <div id = "canvas-wrapper">
        <table ref={tableRef} class = "student-canvas">
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

    )
}