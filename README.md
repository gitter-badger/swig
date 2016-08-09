# SWIG : Sandbox Workbench Infinite Groove

## About

SWIG is an Electron app built to assist in the development of Demandware web applications.

## Packaging and Distribution

1.  Ensure that all the project dependencies have been installed by using ```npm install```
2.  Use the command ```gulp release``` to compile all SASS and bundle the electron app.  This will create a new directory /releases/ which is ignored from vcs.  You will find an x86 and x64 architecture build in this directory.
3.  Manually copy swig.ico and installer-script.nsi into the release you will be bundling
4.  Using NSIS compile the installer-scripts.nsi to create your exe installer
