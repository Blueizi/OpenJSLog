/**
 OpenJSLog
 Copyright (C) 2014 Hendrik 'Xendo' Meyer

 This file is part of OpenJSLog

 OpenJSLog is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 2 of the License, or
 (at your option) any later version.

 OpenJSLog is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Foobar. If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * This is the Object you want to stringify to analyze it with the Analyzer.
 * @type {{data: Array, timestamps: Array}}
 */
var LogBuffer = {data: [], timestamps: []};

/**
 * Specifies the Devmode setting.
 * @type {boolean}
 */
OJSLdevmode = (OJSLgetCookie("OJSLdevmode") == "1");

/**
 * OpenJSLog: Logs the given input with a timestamp
 *
 * @param log               The Object to log.
 * @param force             Whether or not to force a log to console.
 * @param spit              Output the Logbuffer to the Console
 * @param emptyAfterSpit    Wether or not to empty the Logbuffer after outputting it.
 */
function Log(log, force, spit, emptyAfterSpit) {
    //Force a log to console if the devmode is set
    //or the 'force'-parameter has been set to true.
    var directlog = (OJSLdevmode) ? true : force;
    if (directlog) {
        console.log(log);
    }

    //Create a timestamp (milliseconds since 1970-01-01, 00:00:00 UTC)
    var timestamp = new Date().getTime();

    //Push Data and timestamp into the LogBufer.
    LogBuffer.data.push(log);
    LogBuffer.timestamps.push(timestamp);

    //If  'spit' is set to true output the LogBuffer to the
    //console and if 'emptyAfterSpit' is also true delete/clear
    //the buffer afterwards
    if (spit === true) {
        for (var index in LogBuffer) {
            console.log(LogBuffer.data[index]);
        }
        if (emptyAfterSpit === true) {
            LogBuffer = {data: [], timestamps: []};
        }
    }
}

/**
 * OJSLsetCookie: Set a cookie
 * @param cname     The name the cookie is saved as
 * @param cvalue    The value of the cookie
 * @param exdays    The expirationdate in days(!)
 */
function OJSLsetCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

/**
 * OJSLgetCookie: Gets a cookie
 * @param cname The name of the cookie to get
 * @returns {string}    The value of the cookie
 */
function OJSLgetCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

/**
 * setDevmode: Sets the devmode to either true or false
 * @param value
 */
function OJSLsetDevmode(value) {
    if (value === true) {
        OJSLsetCookie("OJSLdevmode", "1", 36500);
        OJSLdevmode = true;
    } else {
        OJSLsetCookie("OJSLdevmode", "0", 36500);
        OJSLdevmode = false;
    }
}