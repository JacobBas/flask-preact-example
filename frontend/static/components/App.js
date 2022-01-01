import { Hooks, html } from "../misc/imports.js";
import { InputTable } from "./InputTable.js";
import { ResultsPlot } from "./ResultsPlot.js";
import { ResultsTable } from "./ResultsTable.js";

/**
 * Contains the main application component. This is the highest level component in the
 * application that contains all of the high level data being used on the page.
 */
export const App = () => {
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

    /**
     * Calculates the y_hat values given the results from the linear regression.
     * To make sure that the line is visually smooth we always plot 2 times more
     * points than are input. Due to this we must interpolate between the min
     * and max x values that are given in the data by the user.
     */
    Hooks.useEffect(() => {
        // finding the min and max of the x values for our data
        let min = data.map((row) => row.x).reduce((a, b) => Math.min(a, b), Infinity);
        let max = data.map((row) => row.x).reduce((a, b) => Math.max(a, b), -Infinity);

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

    /**
     * sets the state of the data by replacing a given index with new data
     * so that changes within the UI persist throughout the application.
     *
     * @param {int} index the index of the value that we want to replace
     * @param {object} new_values the new values for the given index
     */
    const setDataRow = (index, new_values) => {
        // creating a copy of the data object
        let new_data = [...data];
        // updating the index
        new_data[index] = new_values;
        // setting the new data object
        setData(new_data);
    };

    /**
     * Calls the API microservice used to calculate the linear regression with the
     * python backend. This sends data, recieves the results, and sets the state of
     * the application so that the results cascade through the components.
     */
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
            An application that can be used to calculate a linear regression using a Flask
            backend and a Preact frontend.
        </p>
        <p>
            While this is a very simple implementation, this can be further extended to call
            data from other microservices and data providers such as REST API's or CSV files so
            that the data can be larger and analysis can be more complex.
        </p>

        <div class="main-container">
            <section id="data-input">
                <h2>Data Input</h2>
                <p>Please input your x and y values:</p>
                <${InputTable} data=${data} setDataRow=${setDataRow} />
            </section>

            <section id="results">
                <h2>Results</h2>
                <button onClick=${calcResults}>Calculate Linear Regression Results</button>
                <${ResultsTable} results=${results} />
                <${ResultsPlot} data=${data} y_hat=${y_hat} results=${results} />
            </section>
        </div>
    `;
};
