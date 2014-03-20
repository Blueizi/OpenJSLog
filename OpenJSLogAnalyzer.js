/**
 OpenJSLogAnalyzer
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
 * pad: Pads numbers to a specific amount of digits
 * @param num   number to pad
 * @param size  number of digits
 * @returns {string}    The output
 */
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

/**
 * Builds the List with the Object's items
 * @param parentObject  The Object to (further) Analyze. (Can also be the LogBuffer directly)
 * @param parentElement The element to host the list in.
 */
function buildList(parentObject, parentElement) {
    var rEl, rParent;

    //generate a new unordered list to hold it's children
    rParent = document.createElement('ul');

    //append children to parent
    for (var key in parentObject) {
        rEl = document.createElement('li');

        //if the child is a Object/Array it needs to be handled
        //different to map it's possible children aswell
        if (typeof parentObject[key] == "object") {
            //If it is an Array set true, otherwhise false
            var isArray = parentObject[key] instanceof Array;
            rEl.className = isArray ? 'parent array' : 'parent'; //Set up some styling
            //Prefix with the Type of Object (Object|Array) and it's corresponding indicator ({|[)
            //'key' is the key of the Object. If it is a direct child of 'data' this will get replaced with the timestamp.
            rEl.innerHTML = '<span class="key">' + key + '</span>: ' + ((isArray === true) ? ('[Array] [') : ('[Object] {'));
            //Do all the same stuff again for the Object's children. Recursion FTW!
            buildList(parentObject[key], rEl);
            //Add the closing parentheses:
            closingparantheses = (document.createElement('li'));
            closingparantheses.className = "closing " + (isArray ? 'array' : 'object');
            closingparantheses.innerHTML = isArray ? ']' : '}';
            rEl.appendChild(closingparantheses);
        } else {
            //Prefix with the Type (e.g. "[String]")
            //'key' is the key of the Object. If it is a direct child of 'data' this will get replaced with the timestamp.
            rEl.innerHTML = '<span class="key">' + key + '</span>: [' + typeof parentObject[key] + '] <span class="value">' + parentObject[key] + '</span>';
        }
        //add the lowercase type as a css-class to be able to style each type individually.
        rEl.className += " " + (typeof parentObject[key]).toLowerCase();

        //finally append the new element to it's parent (the new unordered list).
        rParent.appendChild(rEl);
    }
    //append the new unordered list to it's parent (the given 'parentElement').
    parentElement.appendChild(rParent);
}

/**
 * OJSLanalyze: Builds the complete minimizeable List for a browsable LogBuffer.
 * @param object    The (parsed JSON) Object to Analyze. (Can also be the LogBuffer directly)
 * @param element   The element to host the container in.
 */
function OJSLanalyze(object, element) {

    if (!verifyOJSL(object)) {
        //If the given object is not valid display an error.
        element.innerHTML = 'Invalid OpenJSLog!';
        element.className = 'loganalyzer notLoaded';
        return;
    } else {
        //Make sure the container is empty and able to be styled.
        element.innerHTML = '';
        element.className = "loganalyzer";
    }

    //Add listeners to the minizizeable objects.
    element.addEventListener('click', function (e) {
        if (e.target.classList.contains('parent')) {
            e.target.classList.toggle('expanded')
        }
    });

    /*
     * Create the browsable tree.
     * We need to pass object.data, because we are not
     * interested in also indexing the timestamps in this stage.
     */
    buildList(object.data, element);
    //Weired for loop, but it does not work otherwhise.. Hints are welcome!
    var nodeindex = 0;
    for (var notUsed in element.childNodes[0].childNodes) {
        try {
            //Setup the timestamp for the current node/element.
            var date = new Date(Number(object.timestamps[nodeindex]));
            var title = "";
            //The timestamp can only be built if the date-elements are Numbers.
            if (isNaN(date.getFullYear())) {
                title = "no timestamp provided";
            } else {
                title = date.getFullYear() + "-" + pad(date.getMonth(), 2) + "-" + pad(date.getDate(), 2) + " " + pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2) + ":" + pad(date.getSeconds(), 2) + "." + pad(date.getMilliseconds(), 3);
            }
            //This weired thing is the path to the "title" of the element in the DOM.
            //Just set the .innerHTML and we are golden :)
            element.childNodes[0].childNodes[nodeindex].childNodes[0].innerHTML = title;
            //Finally increase the counter for the next iteration
            nodeindex++;
        } catch (err) {
        }
    }
}

//Specs: data is mandatory, timestamp can be omitted.

/**
 * verifyOJSL: Verifies the compliance of an object or JSON-encoded string
 * with OJSL specifications
 *
 * Specs: data is mandatory, timestamp may be omitted.
 *
 * @param input JSON String
 * @returns {boolean} Wherther or not it matches the OpenJSLog specs.
 */
function verifyOJSL(input, isJSON) {
    try {
        //If input is Json then parse it first
        var tmp = isJSON ? JSON.parse(input) : input;
        //If  the object contains the Data-portion it is fine!
        if (tmp.data != null) {
            tmp = {};
            return true;
        } else {
            //if not throw an error.
            tmp = {};
            throw ReferenceError;
        }
    } catch (err) {
        //This catches the errors where the data-portion is
        // not found and where the JSON could not be parsed
        tmp = {};
        return false;
    }
}
