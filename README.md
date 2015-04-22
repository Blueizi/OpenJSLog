# OpenJSLog

OpenJSLog is a sophisticated Logging utility with Timestamping and Log-Analysis.

It is based on JSON-Explorer by kadjar: https://github.com/kadjar/json-explorer

__Now with Node.JS support & MIT Licensed!__

## Usage

 - Node.JS:

  A simple `npm install openjslog` within you commandline (or adding a dependency to `openjslog` in your `package.json` followeg by a simple `npm install`) and a `var Log = require('openjslog');` in your application suffices to be able to use `Log(myAwesomeVariable);`

  Available methods: *(`Log` will be the name of your variable!)*
   - `Log(log, force, spit, emptyAfterSpit)`
   - `Log.Group(groupName, collapsed)`
   - `Log.GroupEnd()`
   - `Log.toString()`


 - Browser:

   Simply include the file somewhere in your html and use one of the following available methods:
   - `Log(log, force, spit, emptyAfterSpit)`
   - `Log.group(groupName, collapsed)`
   - `Log.groupEnd()`
   - `Log.toString()`
   - `Log.setDevmode(value)`

## Code-docs:

`Log(log, force, spit, emptyAfterSpit)`:

``` text
Log: Logs the given input with a timestamp

  @param log               The Object to log.
  @param force             Whether or not to force a log to console.
  @param spit              Output the Logbuffer to the Console
  @param emptyAfterSpit    Wether or not to empty the Logbuffer after outputting it.
```

`Log.setDevmode(value)`: (**Unavailable in Node.JS**, legacy available via `OJSLsetDevmode(...)`)

``` text
Log.setDevmode: Sets the devmode to either true or false

  @param value            true or false
```

`Log.group(groupName, collapsed)`: (legacy available via `OJSLGroup(...)`)

``` text
Log.group: Marks the beginning of a group of logs

  @param groupName       The name of the group
  @param collapsed       Collapse the Group?
```

`Log.groupEnd()`: (legacy available via `OJSLGroupEnd()`)

``` text
Log.group: Marks the end of a group of logs
```

`Log.toString()`:

``` text
Log.toString: Return the contents of the LogBuffer as JSON

  @returns string        Contents of the LogBuffer as JSON
```