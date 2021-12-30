from flask_restx import Api
from .linear_regression import factory as linear_regression_factory


def factory(app):
    # creating the api context onto the application
    api = Api(
        app,
        doc="/doc",
        version="0.1",
        title="Example microservice application",
        description="microservice application for the use of teaching how to use python and how to create well documented code",
    )

    # adding on the linear regression endpoints
    linear_regression_factory(api)
