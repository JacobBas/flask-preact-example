from flask import Flask, render_template
from ._api import factory as api_factory
from ._pages import factory as pages_factory


def app_factory(template_dir, static_dir):
    # initalizing the application
    app = Flask(
        __name__,
        static_folder=static_dir,
        template_folder=template_dir,
    )

    # creating the main route to the application
    @app.route("/", methods=["GET"])
    def main():
        return render_template("index.html")

    # registering the api context to the application
    api_factory(app)

    # registering the blueprint context to the application
    pages_factory(app)

    # returning out the application
    return app


# running the application in debug mode
if __name__ == "__main__":
    app = app_factory()
    app.run(debug=True)
