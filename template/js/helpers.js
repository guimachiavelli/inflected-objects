(function(){
    'use strict';

    function innerText(node) {
        var text;

        text = node.textContent !== undefined ?
                                            node.textContent : node.innerText;

        return text.replace(/\s+/g, ' ');
    }

    function debounce(func, wait, immediate) {
	var timeout;
	return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
	};
};

    function addEventListeners(nodeList, event, handler) {
        var i, len;
        for (i = 0, len = nodeList.length; i < len; i += 1) {
            nodeList[i].addEventListener(event, handler);
        }
    }

    function findArrayItem(haystack, needle) {
        var i, len;

        for (i = 0, len = haystack.length; i < len; i += 1) {
            if (haystack[i][0] === needle[0] && haystack[i][1] === needle[1]) {
                return i;
            }
        }

        return false;
    }

    function capitalisedString(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function updatePrefixedStyle(el, property, style) {
        var prefixes;

        prefixes = ['moz', 'webkit', 'o', 'ms'];

        prefixes.forEach(function(prefix){
            el.style[prefix + capitalisedString(property)] = style;
        });
    }

    function randomInt(max, min) {
        min = min || 5;
        return Math.floor(Math.random() * max) + min;
    }

    function firstElementChild(parentNode, index, children) {
        children = children || parentNode.childNodes;
        index = index || 0;

        if (children[index].nodeName === '#text') {
            return firstElementChild(parentNode, index + 1, children);
        }

        return children[index];
    }

    function closestAncestorWithClass(el, className) {
        if (el.classList.contains(className)) {
            return el;
        }

        if (el.nodeName === 'BODY') {
            return null;
        }

        return closestAncestorWithClass(el.parentNode, className);
    }

    function nextSiblingOfType(el, nodeName) {
        if (el.nextSibling === null) {
            return null;
        }

        if (el.nextSibling.nodeName === nodeName) {
            return el.nextSibling;
        }

        return nextSiblingOfType(el.nextSibling, nodeName);
    }

    function previousSiblingOfType(el, nodeName) {
        if (el.previousSibling === null) {
            return null;
        }

        if (el.previousSibling.nodeName === nodeName) {
            return el.previousSibling;
        }

        return previousSiblingOfType(el.previousSibling, nodeName);
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
        debounce: debounce,
        parentAnchor: parentAnchor,
        randomInt: randomInt,
        closestAncestorWithClass: closestAncestorWithClass,
        firstElementChild: firstElementChild,
        findArrayItem: findArrayItem,
        updatePrefixedStyle: updatePrefixedStyle,
        nextSiblingOfType: nextSiblingOfType,
        previousSiblingOfType: previousSiblingOfType,
        innerText: innerText
    };

}());
