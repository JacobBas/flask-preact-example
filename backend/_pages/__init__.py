from flask import Blueprint


def factory(app):
    # creating the new blueprint context
    _pages = Blueprint("_pages", __name__)

    # registering the blueprint to the application
    app.register_blueprint(_pages, url_prefix="")
