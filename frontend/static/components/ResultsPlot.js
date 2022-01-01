import { Hooks, html } from "../misc/imports.js";

/**
 * A Plotly plot containing a visualized result from calculated linear
 * regression.
 */
export const ResultsPlot = (props) => {
    const { data, y_hat } = props;

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
