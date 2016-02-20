:: This script checks for arguments, if they don't exist it opens the Rhino dialog
:: if arguments do exist, it loads the script in the first argument and passes the other arguments to the script
:: ie: js jmvc\script\controller Todo
@echo off
SETLOCAL ENABLEDELAYEDEXPANSION
if "%1"=="" (
	java -jar jmvc\rhino\js.jar
	GOTO END
)
if "%1"=="-h" GOTO PRINT_HELP
if "%1"=="-?" GOTO PRINT_HELP
if "%1"=="--help" GOTO PRINT_HELP

if "%1"=="-d" (
	java -classpath jmvc/rhino/js.jar org.mozilla.javascript.tools.debugger.Main
	GOTO END
)

SET ARGS=[
SET FILENAME=%1
SET FILENAME=%FILENAME:\=/%
::haven't seen any way to loop through all args yet, so for now this goes through arg 2-7
for %%a in (%2 %3 %4 %5 %6 %7) do (
	if not "%%a"=="" SET ARGS=!ARGS!'%%a',
)
SET ARGS=%ARGS%]
java -classpath jmvc/rhino/compiler.jar;jmvc/rhino/compiler-integration.jar;jmvc\rhino\js.jar org.mozilla.javascript.tools.shell.Main -e _args=%ARGS% -e load('%FILENAME%')
GOTO END

:PRINT_HELP
java -jar jmvc\rhino\js.jar -e _platform='WIN' -e load('jmvc\\help')
:END