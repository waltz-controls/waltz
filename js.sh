#!/bin/sh
# This script checks for arguments, if they don't exist it opens the Rhino dialog
# if arguments do exist, it loads the script in the first argument and passes the other arguments to the script
# ie: ./js jmvc/script/controller Todo

if [ $# -eq 0 ]
then
  java -jar jmvc/rhino/js.jar
  exit 127
fi

if [ $1 = "-h" -o $1 = "-?" -o $1 = "--help" ]
then
  java -jar jmvc/rhino/js.jar -e "_platform='UNIX'" -e 'load('"'jmvc/help'"')'
  exit 127
fi


if [ $1 = "-d" ]
then
	java -classpath jmvc/rhino/js.jar org.mozilla.javascript.tools.debugger.Main
	exit 127
fi

ARGS=[
for arg
do
  if [ $arg != $1 ]
  then
    ARGS=$ARGS"'$arg'",
  fi
done
ARGS=$ARGS]
$JAVA_HOME/bin/java -classpath .:jmvc/rhino/compiler.jar:jmvc/rhino/compiler-integration.jar:jmvc/rhino/js.jar org.mozilla.javascript.tools.shell.Main -e _args=$ARGS -e 'load('"'"$1"'"')'
