(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers');

    var carousel;

    carousel = {
        init: function(el) {
            if (el === null) {
                return;
            }

            this.bind(el);

            el.querySelector('.carousel-image').classList.add('carousel--active');
        },

        bind: function(el) {
            el.addEventListener('click', this.advance.bind(this, el));
        },

        advance: function(el, e) {
            var target, next;
            e.preventDefault();

            target = e.target;
            target = helpers.closestAncestorWithClass(target, 'carousel-image');

            next = target.nextElementSibling;

            if (next === null) {
                next = helpers.firstElementChild(target.parentNode);
            }

            next.classList.add('carousel--active');
            target.classList.remove('carousel--active');
        }

    };

    module.exports = carousel;

}());

},{"./helpers":6}],2:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}
}

},{}],3:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers');

    var exhibitionItems;

    exhibitionItems = {
        init: function(items) {
            if (items === null || items.length < 1) {
                return;
            }

            var item, itemClipper, i, len;
            for (i = 0, len = items.length; i < len; i += 1) {
                item = items[i];
                itemClipper = item.querySelector('.item-container');
                //this.setClipping(item, itemClipper);
                //item.addEventListener('click',
                                      //this.onItemClick.bind(this,
                                                            //item,
                                                            //itemClipper));
           }
        },

        clearItem: function() {
            var el, container;

            el = document.querySelector('.item--active');

            if (!el) {
                return;
            }

            container = el.querySelector('.item-container');

            this.hideItem(el, container);
        },

        setClipping: function(item, itemClipper) {
            var width, height;
            width = helpers.randomInt(35) + 'vw';
            height = helpers.randomInt(35) + 'vw';

            item.style.width = width;
            item.style.height = height;

            itemClipper.style.clip = this.generateClip(width, height);
        },

        generateClip: function(width, height) {
            return 'rect(0 ' + width + ' ' + height + ' 0)';
        },

        onItemClick: function(item, itemClipper, e) {
            console.log('click')
            var prevEl, container, target, targetAncestor;

            target = e.srcElement;
            targetAncestor = helpers.closestAncestorWithClass(target, 'item--active');

            if (target.nodeName === 'IMG' && targetAncestor !== null) {
                return;
            }

            prevEl = document.querySelector('.item--active');
            container = item.querySelector('.item-container');

            if (prevEl) {
                container = prevEl.querySelector('.item-container');
                this.hideItem(prevEl, container);
                return;
            }

            this.showItem(item, container);
        },

        hideItem: function(item, container) {
            item.classList.remove('item--show');
            helpers.updatePrefixedStyle(container, 'transform', '');
            setTimeout(function(){
                item.classList.remove('item--active');
            }, 300);
        },

        showItem: function(item, container) {
            var offset;

            offset = [
                this.distanceFromViewport(item, container),
                this.distanceFromViewport(item, container, 'offsetTop')
            ];

            offset = this.addImageMargin(offset).join(',');
            offset = 'translate(' + offset + ')';

            item.classList.add('item--active');
            item.classList.add('item--show');
            helpers.updatePrefixedStyle(container, 'transform', offset);
        },

        distanceFromViewport: function(item, container, offset) {
            var distance;
            distance = 0;
            offset = offset || 'offsetLeft';

            while(item) {
                distance -= item[offset];
                item = item.offsetParent;
            }

            return distance + 'px';
        },

        addImageMargin: function(offset) {
            return offset.map(function(axis){
                return 'calc(' + axis + ' + 5vh)';
            });
        }



    };

    module.exports = exhibitionItems;
}());

},{"./helpers":6}],4:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers');
    var feed;

    feed = {
        init: function(els) {
            if (!els) {
                return;
            }

            this.setSizes(els);
            this.setStyles(els);
        },

        setStyles: function(els) {
            var id, type, link, i, len, el;

            for (i = 0, len = els.length; i < len; i +=1) {
                el = els[i];
                type = el.id.split('-')[0];
                id = el.id.split('-')[1];
                link = el.getAttribute('data-link');
                el.innerHTML = '';
                if (type === 'tweet') {
                    window.twttr.widgets.createTweet(id, el,
                                                    { conversation: 'none',
                                                      cards: ''}
                    );
                }

                if (type === 'instagram') {
                    el.innerHTML = this.instagramEmbed(link);
                }
            }

            window.instgrm.Embeds.process();
        },

        setSizes: function(els) {
            var i, len;
            for (i = 0, len = els.length; i < len; i +=1) {
                els[i].style.width = helpers.randomInt(16, 12) + '%';
            }
        },

        loadTwitterScript: function() {
            var scriptId, el, t;
            scriptId = 'twitter-script';

            el = document.getElementById(scriptId);
            t = window.twttr || {};

            if (el) {
                return t;
            }

            el = document.createElement('script');
            el.id = scriptId;
            el.src = 'https://platform.twitter.com/widgets.js';
            document.body.appendChild(el);

            t._e = [];

            t.ready = function(f) {
                t._e.push(f);
            };

            return t;
        },

        loadInstagramScript: function() {
            var scriptId, el, t;
            scriptId = 'instagram-script';

            el = document.getElementById(scriptId);
            t = window.instgrm || {};

            if (el) {
                return t;
            }

            el = document.createElement('script');
            el.id = scriptId;
            el.src = 'https://platform.instagram.com/en_US/embeds.js';
            document.body.appendChild(el);

            t._e = [];

            t.ready = function(f) {
                t._e.push(f);
            };

            return t;

        },

        instagramEmbed: function(linkID) {
            var template;

            template = '<blockquote class="instagram-media" data-instgrm-version="6" style=" background:#FFF; border: 1px solid lightgrey; border-radius:3px; padding:0;"><a href="{{link}}" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank"></blockquote>';

            return template.replace('{{link}}', linkID);
        }

    };


    module.exports = feed;
}());

},{"./helpers":6}],5:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers');

    var fontStretch;

    fontStretch = {

        init: function(el) {
            var i, len, children;
            children = el.children;

            for (i = 0, len = children.length; i < len; i += 1) {
                this.stretch(children[i], el);
            }
        },

        stretch: function(el, parent) {
            var y;
            y = (parent.offsetHeight - 50)/el.offsetHeight;
            y = Math.min(y, 6.5);
            y = Math.max(0.7, y);
            helpers.updatePrefixedStyle(el, 'transform', 'scaleY(' + y + ')');
        },
    };

    module.exports = fontStretch;

}());

},{"./helpers":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
(function(){
    'use strict';

    require('./classlist-polyfill');

    var helpers = require('./helpers'),
        feed = require('./feed'),
        modal = require('./modal');

    var site = {
        container: null,
        nav: null,

        init: function() {
            this.nav = document.querySelector('.navigation');
            this.container = document.querySelector('.container');


            //old IE
            if (!this.container.firstElementChild) {
                return;
            }

            //simpler view for mobile
            if (window.innerWidth < 480) {
                return;
            }

            this.hideExhibitionSubNav();
            this.bindEvents();
            feed.loadTwitterScript();
            feed.loadInstagramScript();
        },

        hideExhibitionSubNav: function() {
            var exhibitionItems, i, len;
            exhibitionItems = this.nav.querySelectorAll('.navigation-item--exhibition');
            for (i = 0, len = exhibitionItems.length; i < len; i += 1) {
                exhibitionItems[i].className += ' navigation-item--closed';
            }
        },

        bindEvents: function() {
            if (this.nav) {
                this.nav.addEventListener('click', this.onNavClick.bind(this));
            }

            window.addEventListener('resize', helpers.debounce(
                modal.onResize.bind(modal), 300));

        },

        onNavClick: function(e) {
            var target, parent, ancestor;

            e.preventDefault();

            ancestor = helpers.closestAncestorWithClass(e.target,
                                                'navigation-item--exhibition');
            parent = helpers.closestAncestorWithClass(e.target,
                                                      'subnavigation');
            target = helpers.parentAnchor(e.target);

            if (parent === null && ancestor !== null) {
                ancestor.classList.toggle('navigation-item--closed');
                return;
            }

            if (target === false) {
                return;
            }

            var type = this.linkType(e.target);

            modal.init(target.href, helpers.innerText(target));
        },

        linkType: function(node) {
            var ancestor, type, searchString, typeIndex;

            searchString = 'navigation-item--';

            ancestor = helpers.closestAncestorWithClass(node,
                                                        'navigation-item');
            typeIndex = ancestor.className.indexOf(searchString);

            console.log(ancestor.className.substr(typeIndex + searchString.length));
        }
    };

    site.init();

}());

},{"./classlist-polyfill":2,"./feed":4,"./helpers":6,"./modal":8}],8:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers'),
        exhibitionItems = require('./exhibition-items'),
        pagination = require('./pagination'),
        feed = require('./feed'),
        carousel = require('./carousel');

    var modal;

    modal = {
        el: null,
        parent: document.body,

        init: function(url, title) {
            if (this.el !== null) {
                this.close();
                return;
            }

            this.fetchPage(url, title);
        },

        fetchPage: function(url, title) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = this.onPageFetchSuccess.bind(this, title);
            request.onerror = this.onPageFetchError;

            request.send();
        },

        onPageFetchSuccess: function(title, e) {
            var request, innerHTML, placeholderEl;
            request = e.target;

            if (request.status !== 200 || request.status > 400) {
                return;
            }

            innerHTML = request.responseText;
            placeholderEl = document.createElement('div');
            placeholderEl.innerHTML = innerHTML;
            placeholderEl = placeholderEl.querySelector('.content');

            this.el = this.template(placeholderEl.innerHTML, title);
            this.open();
            exhibitionItems.init(this.el.querySelectorAll('.item'));
            carousel.init(this.el.querySelector('.carousel'));
            pagination.init(this.el.querySelector('.content-text'));
            feed.init(this.el.querySelectorAll('.social-item'));
        },

        template: function(innerHTML, title) {
            var container, content, bg, contentTitle;

            container = document.createElement('div');
            container.className = 'modal-container';

            bg = document.createElement('div');
            bg.className = 'modal-bg';

            content = document.createElement('div');
            content.className = 'modal-content';
            content.innerHTML = innerHTML;

            if (content.querySelector('.content-text') !== null) {
                contentTitle = document.createElement('h2');
                contentTitle.innerHTML = title;
                contentTitle.className = 'modal-title';
                content.insertBefore(contentTitle, content.firstChild);
            }

            container.appendChild(bg);
            container.appendChild(content);

            return container;
        },

        onPageFetchError: function(err) {
            console.error(err);
        },

        close: function() {
            var frame;

            frame = this.el.querySelector('.modal-content');
            frame.className = 'modal-content';

            setTimeout(function(){
                this.remove();
                document.body.className = document.body.className.replace('no-scroll', '');
            }.bind(this), 300);
        },

        onResize: function() {
            if (!this.el) {
                return;
            }

            this.close();
        },

        open: function() {
            var frame;

            this.render();
            frame = this.el.querySelector('.modal-content');

            setTimeout(function(){
                frame.className += ' transition-in';
                document.body.className += ' no-scroll';
            //fixme: 100ms delay so the http request does not affect
            //       the slide-in animation
            }.bind(this), 100);
        },

        render: function() {
            this.bind();
            this.parent.appendChild(this.el);
        },

        remove: function() {
            this.parent.removeChild(this.el);
            this.el = null;
        },

        bind: function() {
            //FIXME should probably cache these elements?
            var bg, content;
            bg = this.el.querySelector('.modal-bg');
            content = this.el.querySelector('.modal-content');
            bg.addEventListener('click', this.close.bind(this));
            content.addEventListener('click',
                                     this.onContentClick.bind(this, content));
        },

        onContentClick: function(self, e) {
            if (e.target !== self) {
                return;
            }
            this.close();
        }

    };

    module.exports = modal;

}());

},{"./carousel":1,"./exhibition-items":3,"./feed":4,"./helpers":6,"./pagination":9}],9:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers'),
        fontStretch = require('./font-stretch.js');

    var pagination;

    pagination = {
        nextButton: null,
        prevButton: null,
        paginationCounter: null,
        paginationCurrent: null,
        total: 0,
        current: 0,

        init: function(el) {
            var pNumber;

            if (el === null) {
                return;
            }

            fontStretch.init(el);

            pNumber = el.querySelectorAll('p').length;

            if (pNumber < 2) {
                return;
            }

            this.setup(el, pNumber);
        },

        setup: function(el, pNumber) {
            this.total = pNumber;
            this.current = 1;

            this.addButtons(el);
            this.bind(el);

            el.querySelector('p').classList.add('carousel--active');
            el.className += ' pagination';
        },

        bind: function(el) {
            var parent, next, previous;
            parent = el.parentNode;

            next = parent.querySelector('.pagination-button--next');
            next.addEventListener('click', this.advance.bind(this, el));

            previous = parent.querySelector('.pagination-button--previous');
            previous.addEventListener('click', this.revert.bind(this, el));
        },

        addButtons: function(el) {
            var fragment;

            this.previousButton = this.button('previous');
            this.previousButton.disabled = true;
            this.nextButton = this.button('next');
            this.paginationCounter = this.counter();
            this.paginationCurrent = this.paginationCounter
                                .querySelector('.pagination-counter__current');


            fragment = document.createDocumentFragment();
            fragment.appendChild(this.previousButton);
            fragment.appendChild(this.nextButton);
            fragment.appendChild(this.paginationCounter);

            el.parentNode.appendChild(fragment);
        },

        button: function(type){
            var btn;

            btn = document.createElement('button');
            btn.className = 'pagination-button--' + type;
            btn.innerHTML = type === 'next' ? 'Continue reading' : 'Previous';

            return btn;
        },

        counter: function() {
            var counter, current, total;

            counter = document.createElement('div');
            current = document.createElement('span');
            total = document.createElement('span');

            total.innerHTML = '/' + this.total;
            total.className = 'pagination-counter__total';

            current.innerHTML = this.current;
            current.className = 'pagination-counter__current';

            counter.appendChild(current);
            counter.appendChild(total);
            counter.className = 'pagination-counter';

            return counter;
        },

        advance: function(el, e) {
            var target, next, previous;
            e.preventDefault();

            target = el.querySelector('.carousel--active');

            next = helpers.nextSiblingOfType(target, 'P');
            previous = helpers.previousSiblingOfType(next, 'P');

            if (next === null) {
                return;
            }

            next.classList.add('carousel--active');
            target.classList.remove('carousel--active');

            this.updateCounter(1);
            this.updateButtons(helpers.nextSiblingOfType(next, 'P'), previous);
        },

        revert: function(el, e) {
            var target, previous, next;
            e.preventDefault();

            target = el.querySelector('.carousel--active');

            previous = helpers.previousSiblingOfType(target, 'P');

            if (previous === null) {
                return;
            }

            next = helpers.nextSiblingOfType(previous, 'P');

            previous.classList.add('carousel--active');
            target.classList.remove('carousel--active');

            this.updateCounter(-1);
            this.updateButtons(next, helpers.previousSiblingOfType(previous, 'P'));
        },

        updateButtons: function(next, prev) {
            this.nextButton.disabled = !next;
            this.previousButton.disabled = !prev;
        },

        updateCounter: function(increment) {
            this.current += increment;
            this.paginationCurrent.innerHTML = this.current;
        }

    };

    module.exports = pagination;
}());

},{"./font-stretch.js":5,"./helpers":6}]},{},[7]);
