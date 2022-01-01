import { Hooks, html } from "../misc/imports.js";
import { sig_round } from "../misc/funcs.js";

/**
 * Contains the results from the linear regression.
 */
export const ResultsTable = (props) => {
    const { results } = props;

    const [sigFigs, setSigFigs] = Hooks.useState(5);

    return html`
        <table>
            <tbody>
                <tr>
                    <th>Slope</th>
                    <td>${sig_round(results.slope, sigFigs)}</td>
                </tr>
                <tr>
                    <th>Intercept</th>
                    <td>${sig_round(results.intercept, sigFigs)}</td>
                </tr>
                <tr>
                    <th>Standard Error</th>
                    <td>${sig_round(results.std_err, sigFigs)}</td>
                </tr>
                <tr>
                    <th>r-value</th>
                    <td>${sig_round(results.r_value, sigFigs)}</td>
                </tr>
                <tr>
                    <th>p-value</th>
                    <td>${sig_round(results.p_value, sigFigs)}</td>
                </tr>
            </tbody>
        </table>
    `;
};
