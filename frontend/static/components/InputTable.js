import { html } from "../misc/imports.js";

/**
 * A row component that is used within the InputTable component
 */
const InputRow = (props) => {
    const { row, index, setDataRow } = props;

    return html`
        <tr>
            <td>${index + 1}</td>
            <td>
                <input
                    type="number"
                    onInput=${(e) => {
                        e.preventDefault();
                        let new_row = { ...row, x: parseInt(e.target.value) };
                        setDataRow(index, new_row);
                    }}
                    value=${row.x}
                />
            </td>
            <td>
                <input
                    type="number"
                    onInput=${(e) => {
                        e.preventDefault();
                        let new_row = { ...row, y: parseInt(e.target.value) };
                        setDataRow(index, new_row);
                    }}
                    value=${row.y}
                />
            </td>
        </tr>
    `;
};

/**
 * A collection of InputRows. No real functionality is given to this table
 * where the main purpose of having this component is to section it off
 * from the rest of the application.
 */
export const InputTable = (props) => {
    const { data, setDataRow } = props;

    return html`
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>X</th>
                    <th>Y</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((row, index) => {
                    return html`
                        <${InputRow}
                            key=${index}
                            row=${row}
                            index=${index}
                            setDataRow=${setDataRow}
                        />
                    `;
                })}
            </tbody>
        </table>
    `;
};
