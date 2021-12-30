from backend import app_factory
import pathlib

# running the application in debug mode
if __name__ == "__main__":
    # getting the absolute file path to the current file
    file_path = pathlib.Path(__file__).absolute().parent

    # creating the new application
    app = app_factory(
        template_dir=file_path.joinpath("frontend"),
        static_dir=file_path.joinpath("frontend", "static"),
    )

    # running the application
    app.run(debug=True)
