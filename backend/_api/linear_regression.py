from flask_restx import Resource, reqparse
from scipy import stats
import json


def factory(api):
    # creating the new endpoint namespace
    linearRegression = api.namespace(
        "linear-regression",
        description="microservice tools useful for completing linear regression on a set of data",
    )

    # creating the new arguments and enpoints for the linear regression service
    calcLinearRegression_parser = reqparse.RequestParser()
    calcLinearRegression_parser.add_argument(
        "x",
        type=str,
        required=True,
        location="json",
    )
    calcLinearRegression_parser.add_argument(
        "y",
        type=str,
        required=True,
        location="json",
    )

    @linearRegression.route("/calc")
    @linearRegression.expect(calcLinearRegression_parser)
    class linear_regression(Resource):
        def post(self):
            """
            Takes in x and y data and runs a linear regression on the data.
            Returns the following values to the user: slope, intercept, R/correlation, p-value, std-err
            """

            # pulling the data out of the request object
            data = calcLinearRegression_parser.parse_args()

            # converting the json array into a python array
            try:
                data["x"] = json.loads(data["x"])
                data["y"] = json.loads(data["y"])

            except json.decoder.JSONDecodeError:
                return {
                    "ok": False,
                    "status": 400,
                    "message": f"please check that x and y are both arrays of integer values: x == {data['x']}, y == {data['y']}",
                }

            # checking that the x and y data are the same length
            if len(data["x"]) != len(data["y"]):
                return {
                    "ok": False,
                    "status": 400,
                    "message": f"x length == {len(data['x'])}; y length == {len(data['y'])}; please make sure these are the same size.",
                }

            # handling any potential errors within the data
            try:
                # running the data through the linear regression function
                slope, intercept, r_value, p_value, std_err = stats.linregress(
                    data["x"], data["y"]
                )

                # returning the values from the linear regression to the client
                return {
                    "ok": True,
                    "status": 200,
                    "message": "linear regression successful!",
                    "data": {
                        "slope": slope,
                        "intercept": intercept,
                        "r_value": r_value,
                        "p_value": p_value,
                        "std_err": std_err,
                    },
                }

            except Exception as err:
                return {
                    "ok": False,
                    "status": 400,
                    "message": err,
                }
