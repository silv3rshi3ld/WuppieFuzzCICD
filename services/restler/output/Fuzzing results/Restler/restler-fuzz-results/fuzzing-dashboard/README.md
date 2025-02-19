# Fuzzing Dashboard Generator

This script generates a locally viewable dashboard to visualize the results of a fuzzing run. It accepts a fuzzing result zip file as input and processes the data to create an interactive HTML dashboard with charts, statistics, and detailed information about the identified issues.

## Prerequisites

- Python 3.x (https://www.python.org/downloads/)
  - Download and install the latest version of Python 3 from the official website
  - During installation, make sure to select the option to add Python to the system's PATH
- Jinja2 template engine

## Installation

1. Clone or download this repository.
2. Navigate to the `fuzzing-dashboard` directory.
3. Install the required Python dependencies:

```
pip install -r requirements.txt
```

## Usage

1. Run the script with the path to your fuzzing result zip file:

```
python generate_dashboard.py /path/to/fuzzing-results.zip
```

2. The script will generate an `output` directory containing the dashboard files (`index.html`, `dashboard.js`, `styles.css`).
3. Open `output/index.html` in a web browser to view the generated dashboard.

## Dependencies

- Python 3.x
- Jinja2 template engine

## Customization

The dashboard's appearance and included sections can be customized by modifying the `config.py` file. Available options include:

- Chart colors and styles
- Included sections (e.g., metadata, endpoint details, bug list)
- Filtering and search options

Refer to the comments in `config.py` for more information.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.