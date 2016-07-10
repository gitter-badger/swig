# RELEASE NOTES

------

## Alpha v0.1.1
  - Adds handlebars templating support
  - Adds generic main IPC channel for fetching a template file
  - [Completes #3](https://github.com/ominestre/swig/issues/3) : Adds dialog warning box for when a user resets a file

------

## Alpha v0.1 : Log Utility
  - Adds login panel for setting up and testing sandbox credentials
    - Attempts a GET request to the TEMP folder on your sandbox to validate your credentials
  - Adds Logs interface for retrieving and previewing Demandware Logs
    - Adds controls for refreshing log list
    - Adds controls for refreshing currently open log file
    - Adds controls for resetting current log file to a blank state

##### Bug Fixes
  - [Fixes #2](https://github.com/ominestre/swig/issues/2) : There was a bug where the last entries in the log list and the log viewer were pushed slightly off the screen
  - [Fixes #5](https://github.com/ominestre/swig/issues/5) : The logic for testing a bad login was setup to trigger on an err in the response.  Completely forgot a 400 or 500 bad response does not also throw an error so those were not being captured.  Updated the condition to also consider bad responses.
