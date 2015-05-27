(function(){
    'use strict';

    function addEventListeners(nodeList, event, handler) {
        var i, len;
        for (i = 0, len = nodeList.length; i < len; i += 1) {
            nodeList[i].addEventListener(event, handler);
        }
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
        parentAnchor: parentAnchor
    };

}());
