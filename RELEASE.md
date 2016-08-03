# RELEASE NOTES

------

## Alpha v0.1.2
  - Adds build task for packaging the electron application for Distribution
  - Adds NSIS installer script for creating an EXE
  
##### Bug Fixes
  - [Fixes #11](https://github.com/ominestre/swig/issues/13) : Changes the error message to no longer refrence the Sandbox.json file
  - [Fixes #15](https://github.com/ominestre/swig/issues/15) : Hides the UI elements for refreshing and deleting a log file when no logs are currently
  active.

------

## Alpha v0.1.1
  - Adds handlebars templating support
  - Adds generic main IPC channel for fetching a template file
  - [Completes #3](https://github.com/ominestre/swig/issues/3) : Adds dialog warning box for when a user resets a file
  - [Completes #1](https://github.com/ominestre/swig/issues/1) : Adds enter key support for submitting the sandbox login form
  
##### Bug Fixes
  - [Fixes #8](https://github.com/ominestre/swig/issues/8) : When resetting a log file I create a blank file in AppData and push that to the
  remote server, which clears the log.  There was nothing setup to delete these blank files so eventually a users AppData/swig/ directory could
  become polluted with excess 0KB files.

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
