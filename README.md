# Flask/Preact Linear Regression Example Application

The purpose of this repository is to show off how we can create an analytical web application using the simple tech stack of Flask and Preact. This tech stack is very low cost with a high amount of benefit to the designer and users.

This is personally my favorite tech stack for quick prototyping for a few different reasons:

- Quick velocity of code changes due to Python and Preact.
- Low dependency due to Flask being a minimal framework and Preact being delivered through CDN with `htm` allowing for a `JSX` like syntax. Removes the need for costly build processes.
- Easy integration with other technologies due to the *"microservice"* framework and Python backend.
- High level of extensibility due to Flask add-ons and the wide range of Preact/React projects out there.
- High level of modularity due to Flask Blueprints and Preact Components.
- Easy conversion to a production ready application.

## How to Run This Application

1. Initialize the `venv` with `python3 -m venv venv`
2. Activate `venv` with:
    - Windows Powershell: `venv\Scripts\Activate.ps1`
    - Linux/Unix/MacOS: `source venv/bin/activate`
3. Install required packages with `pip install -r requirements.txt`
4. Start up a development version of the application with `python3 main.py`

To run this in a more production ready setting, a server such as `gunicorn` should be used.
