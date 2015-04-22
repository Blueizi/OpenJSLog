/**
The MIT License (MIT)

Copyright (c) 2015 OpenJSLog Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

/**
 * This is the Object you want to stringify to analyze it with the Analyzer.
 * @type {{data: Array, timestamps: Array}}
 */
var LogBuffer = {data: [], timestamps: [], runBy: []};
var isNode = (typeof window === 'undefined');

if (isNode) {	
	module.exports = exports = Log;
	module.exports.Log = exports.Log = Log;
	module.exports.group = exports.group = Log.group;
	module.exports.groupEnd = exports.group = Log.groupEnd;
}

/**
 * Specifies the Devmode setting.
 * @type {boolean}
 */
OJSLdevmode =  isNode ? true : OJSLgetCookie("OJSLdevmode") == "1";

/**
 * Log: Logs the given input with a timestamp
 *
 * @param log               The Object to log.
 * @param force             Whether or not to force a log to console.
 * @param spit              Output the Logbuffer to the Console
 * @param emptyAfterSpit    Wether or not to empty the Logbuffer after outputting it.
 */
function Log(log, force, spit, emptyAfterSpit) {

    //If  'spit' is set to true output the LogBuffer to the
    //console and if 'emptyAfterSpit' is also true delete/clear
    //the buffer afterwards
    if (spit === true) {
        for (var key in LogBuffer.data) {
            if (LogBuffer.data[key].ojslGroup) {
                if (LogBuffer.data[key].name) {
                    if (LogBuffer.data[key].collapsed) {
                        if (!isNode) console.groupCollapsed(LogBuffer.data[key].name);
                    } else {
                        if (!isNode) console.group(LogBuffer.data[key].name);
                    }
                } else if (LogBuffer.data[key].endGroup === true) {
                    if (!isNode) console.groupEnd();
                }
            } else {
                console.log(LogBuffer.runBy[key], LogBuffer.data[key]);
            }
        }
        if (emptyAfterSpit === true) {
            LogBuffer = {data: [], timestamps: [], runBy: []};
        }
    }

    //Force a log to console if the devmode is set
    //or the 'force'-parameter has been set to true.
    var directlog = (OJSLdevmode) ? true : force;
    if((log !== null || log !== undefined)){
        if(log.hasOwnProperty('ojslGroup')) {
            directog = false;
        }
    }

    //Create a timestamp (milliseconds since 1970-01-01, 00:00:00 UTC)
    var timestamp = new Date().getTime();

    //Extract the name of the calling function.
    var fn = null;
    fn = arguments.callee.caller;
    if (fn === null) {
        fn = "NONE";
    } else {
        fn = fn.toString();
        fn = fn.substr('function '.length);
        fn = fn.substr(0, fn.indexOf('('));
        if (fn === "") {
            fn = "ANON";
        } else {
            fn += "()"
        }
    }

    if (directlog) {
        console.log(fn, log);
    }
    
    //Push Data and timestamp into the LogBufer.
    LogBuffer.data.push(log);
    LogBuffer.timestamps.push(timestamp);
    LogBuffer.runBy.push(fn);
}

/**
 * Log.toString: Return the contents of the LogBuffer as JSON
 *
 * @returns {string}        Contents of the LogBuffer as JSON
*/
Log.toString = function(){
	return JSON.stringify(LogBuffer);
}

/**
 * OJSLsetCookie: Set a cookie
 * @param cname     The name the cookie is saved as
 * @param cvalue    The value of the cookie
 * @param exdays    The expirationdate in days(!)
 */
function OJSLsetCookie(cname, cvalue, exdays) {
	if(!isNode){
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
}

/**
 * OJSLgetCookie: Gets a cookie
 * @param cname The name of the cookie to get
 * @returns {string}    The value of the cookie
 */
function OJSLgetCookie(cname) {
	if(!isNode){
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return "";
	} else { return "1"; }
}

/**
 * Log.setDevmode: Sets the devmode to either true or false
 * @param value
 */
Log.setDevmode = function(value) {
	if(!isNode){
		if (value === true) {
			OJSLsetCookie("OJSLdevmode", "1", 36500);
			OJSLdevmode = true;
		} else {
			OJSLsetCookie("OJSLdevmode", "0", 36500);
			OJSLdevmode = false;
		}
	}
}

/**
 * Log.group: Marks the beginning of a group of logs
 * @param groupName The name of the group
 * @param collapsed Collapse the Group?
 */
Log.group = function(groupName, collapsed){
    if(collapsed){
        Log({ojslGroup: true, name: groupName, collapsed: true});
        if (OJSLdevmode && !isNode) console.groupCollapsed(groupName);
    }else {
        Log({ojslGroup: true, name: groupName});
        if (OJSLdevmode && !isNode) console.group(groupName);
    }
}

/**
 * Log.groupEnd: Marks the end of a group of logs
 */
Log.groupEnd = function(){
    Log({ojslGroup: true, endGroup: true});
    if(!isNode){
		console.groupEnd();
	}
}

//Legacy fallbacks:
var OJSLGroup = Log.group,
    OJSLGroupEnd = Log.groupEnd,
    OJSLsetDevmode = Log.setDevmode;