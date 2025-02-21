# Parser Fix Plan

## Issue
The generate_dashboards.py script is failing because it expects a `parse_wuppiefuzz_results` function that returns a tuple of (report, dashboard), but we have a `WuppieFuzzParser` class with a `parse_results` method that only returns the dashboard data.

## Required Changes

1. Create a `parse_wuppiefuzz_results` function in parser.py that:
   - Creates an instance of WuppieFuzzParser
   - Calls parse_results
   - Returns a tuple of (report, dashboard) as expected by generate_dashboards.py

2. Update __init__.py to expose the new function:
   ```python
   from .parser import WuppieFuzzParser, parse_wuppiefuzz_results
   __all__ = ['WuppieFuzzParser', 'parse_wuppiefuzz_results']
   ```

3. Modify parser.py to add the new function:
   ```python
   def parse_wuppiefuzz_results(input_path: str) -> tuple[dict, dict]:
       """Parse WuppieFuzz results and return report and dashboard data.
       
       Args:
           input_path: Path to directory containing extracted files
           
       Returns:
           Tuple of (report, dashboard) dictionaries
       """
       parser = WuppieFuzzParser()
       dashboard = parser.parse_results(input_path)
       # For now, return the same data as both report and dashboard
       # Can be modified later if report needs different structure
       return dashboard, dashboard
   ```

## Implementation Steps

1. Add the parse_wuppiefuzz_results function to parser.py
2. Update __init__.py to expose the new function
3. Test the changes by running generate_dashboards.py again

## Expected Outcome

- The ImportError should be resolved
- The dashboard generation script should be able to process WuppieFuzz results
- This should allow the script to continue and process Restler results as well