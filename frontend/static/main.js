// IMPORTS
import * as _Preact from "https://cdn.skypack.dev/preact@10.4.7"; // for preact
import * as _Hooks from "https://cdn.skypack.dev/preact@10.4.7/hooks"; // for preact hooks
import htm from "https://cdn.skypack.dev/htm@3.0.4"; // for htm

// EXPORTS
/**
 * specifying exports so that they can be used within other JavaScript scripts
 * in the application. Without these exports we tend to run into import errors with
 * the Preact library so these are essential when using JS Modules.
 */
export const html = htm.bind(_Preact.h);
export const Preact = _Preact;
export const Hooks = _Hooks;

// OTHER FUNCTIONS
/**
 * Takes in a float and the number of significant figures and returns the
 * corresponding float rounded to the specified significant figures
 *
 * @param {float} num a float number that wants to be rounded
 * @param {int} sig the number of significant figures to be returned
 * @returns a rounded number to the specified significance level
 */
function sig_round(num, sig) {
    sig = 10 ** sig;
    return Math.round(num * sig) / sig;
}

// COMPONENTS
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
const InputTable = (props) => {
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

/**
 * Contains the results from the linear regression.
 */
const ResultsTable = (props) => {
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

/**
 * A Plotly plot containing a visualized result from calculated linear
 * regression.
 */
const ResultsPlot = (props) => {
    const { data, y_hat, results } = props;

    Hooks.useEffect(() => {
        // making sure that the data in y_hat is populated
        if (data.length <= y_hat.length) {
            // creating the actual and fitted data structures
            let actual = {
                name: "Actual",
                x: data.map((row) => row.x),
                y: data.map((row) => row.y),
                type: "scatter",
                mode: "markers",
            };
            let fitted = {
                name: "Fitted",
                x: y_hat.map((row) => row.x),
                y: y_hat.map((row) => row.y_hat),
                type: "scatter",
                mode: "lines",
            };
            let plot_data = [actual, fitted];

            // setting the layout for the plot
            var layout = {
                height: 450,
                width: 675,
                title: "Actual vs. Fitted: Linear Regression",
                xaxis: {},
                yaxis: {},
            };

            // plotting the data to the DOM
            Plotly.newPlot("results-plot", plot_data, layout);
        }
    }, [y_hat]);

    return html`<div id="results-plot" style="width: 100%;"></div> `;
};

/**
 * Contains the main page component. This is the highest level component in the
 * application that contains all of the high level data being used on the page.
 */
const Page = () => {
    const [data, setData] = Hooks.useState(
        Array.from(Array(20)).map((_, i) => {
            return { x: i, y: i ** 2 };
        })
    );

    const [results, setResults] = Hooks.useState({
        intercept: 0,
        p_value: 0,
        r_value: 0,
        slope: 0,
        std_err: 0,
    });

    const [y_hat, setY_hat] = Hooks.useState([]);

    Hooks.useEffect(() => {
        // finding the min and max of the x values for our data
        let min = data
            .map((row) => row.x)
            .reduce((a, b) => Math.min(a, b), Infinity);
        let max = data
            .map((row) => row.x)
            .reduce((a, b) => Math.max(a, b), -Infinity);

        // defining how many response points we want within the data
        let n = data.length * 2;

        // creating the response values for each value of x
        setY_hat(
            Array.from(Array(n + 1)).map((_, i) => {
                let x = (max - min) * (i / n) + min;
                console.log("x =", x);
                let y_hat = x * results.slope + results.intercept;
                return { x: x, y_hat: y_hat };
            })
        );
    }, [results]);

    const setDataRow = (index, new_values) => {
        // creating a copy of the data object
        let new_data = [...data];
        // updating the index
        new_data[index] = new_values;
        // setting the new data object
        setData(new_data);
    };

    const calcResults = () => {
        // makesure that the input data looks correct
        fetch("/linear-regression/calc", {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                x: `[${data.map((row) => row.x)}]`,
                y: `[${data.map((row) => row.y)}]`,
            }),
        })
            .then((resp) => resp.json())
            .then((json) => {
                setResults(json.data);
            });
    };

    return html`
        <h1>Linear Regression Application</h1>
        <p>
            Application that can be used to calculate a linear regression using
            a Flask backend and a Preact frontend.
        </p>

        <div class="main-container">
            <section id="data-input">
                <h2>Data Input</h2>
                <p>Please input your x and y values:</p>
                <${InputTable} data=${data} setDataRow=${setDataRow} />
            </section>

            <section id="results">
                <h2>Results</h2>
                <button onClick=${calcResults}>
                    Calculate Linear Regression Results
                </button>
                <${ResultsTable} results=${results} />
                <${ResultsPlot}
                    data=${data}
                    y_hat=${y_hat}
                    results=${results}
                />
            </section>
        </div>
    `;
};

// RENDERING THE PAGE
_Preact.render(html`<${Page} />`, document.getElementById("root"));
