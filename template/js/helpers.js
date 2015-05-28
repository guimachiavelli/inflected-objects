(function(){
    'use strict';

    function addEventListeners(nodeList, event, handler) {
        var i, len;
        for (i = 0, len = nodeList.length; i < len; i += 1) {
            nodeList[i].addEventListener(event, handler);
        }
    }

    function randomInt(max, min) {
        min = min || 5;
        return Math.floor(Math.random() * max) + min;
    }

    function parentAnchor(el) {
        if (el.nodeName === 'A') {
            return el;
        }

        if (el.nodeName === 'BODY') {
            return false;
        }

        return parentAnchor(el.parentNode);
    }

    module.exports = {
        addEventListeners: addEventListeners,
        parentAnchor: parentAnchor,
        randomInt: randomInt
    };

}());
