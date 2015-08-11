(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    'use strict';

    require('./classlist-polyfill');

    var helpers = require('./helpers'),
        instagramFeed = require('./instagram-feed'),
        life = require('./life'),
        modal = require('./modal');

    var site = {
        container: null,
        nav: null,

        init: function() {
            this.nav = document.querySelector('.navigation');
            this.container = document.querySelector('.container');

            //old IE
            if (!!this.container.firsElementChild) {
                return;
            }

            //simpler view for mobile
            if (window.innerWidth < 480) {
                return;
            }
            this.hideExhibitionSubNav();
            this.bindEvents();
            //instagramFeed.init();
            life.init(this.container);

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

            modal.init(target.href);
        }
    };

    site.init();

}());

},{"./classlist-polyfill":3,"./helpers":6,"./instagram-feed":7,"./life":8,"./modal":9}],2:[function(require,module,exports){
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

},{"./helpers":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./helpers":6}],5:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers');

    var fontStretch;

    fontStretch = {

        init: function(el) {
            var i, len, children, size;
            children = el.children;

            for (i = 0, len = children.length; i < len; i += 1) {
                this.stretch(children[i], el);
            }
        },

        stretch: function(el, parent) {
            var y;

            y = (parent.offsetHeight - 50)/el.offsetHeight;
            y = Math.min(y, 10);
            el.style.transform = 'scaleY(' + y + ')';
        },
    };

    module.exports = fontStretch;

}());

},{"./helpers":6}],6:[function(require,module,exports){
(function(){
    'use strict';

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
        previousSiblingOfType: previousSiblingOfType
    };

}());

},{}],7:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers');

    var instagramFeed, config;

    config = {
        clientID: '050fd5a405a14c8ca6e160892ddf119a',
        accessToken: '1922142485.050fd5a.918c6442a9d04928a754532dde856033',
        endpoint: 'https://api.instagram.com/v1/users/1922142485/media/recent/',
        count: 10
    };

    instagramFeed = {
        init: function() {
            var request, URL;
            URL = config.endpoint + '?access_token=' + config.accessToken;
            URL += '&count=' + config.count;
            URL += '&callback=onFeedFetchSuccess';

            this.requestJSONP(URL)
        },

        requestJSONP: function(URL) {
            var el;

            el = document.createElement('script');
            el.src = URL;
            el.id = 'instagram-request';
            document.head.appendChild(el);
        },

        onFeedFetchSuccess: function(response) {
            var self;
            self = instagramFeed;

            if (response.meta.code !== 200) {
                self.onFeedFetchError(response.meta);
                return;
            }

            if (!response.data.length || response.data.length < 1) {
                return;
            }

            if (response.data.length === 2) {
                response.data.push(response.data[0]);
            }

            if (response.data.length === 1) {
                response.data.push(response.data[0]);
                response.data.push(response.data[0]);
            }

            self.parse(response.data);
        },

        onFeedFetchError: function(err) {
            console.warn(err);
        },

        parse: function(data) {
            var el;
            data = this.parsedData(data);
            el = this.template(data);
            this.render(el);
            this.animate(el, helpers.firstElementChild(el));
        },

        render: function(el) {
            document.querySelector('.container').appendChild(el);
        },

        animate: function(el, current, previous) {
            var next;

            if (previous) {
                previous.classList.add('photo--no-transition');
                previous.classList.remove('photo--out');

                setTimeout(function() {
                    previous.classList.remove('photo--no-transition');
                }, 300);
            }

            current.classList.remove('photo--in');
            current.classList.add('photo--out');
            next = current.nextElementSibling || helpers.firstElementChild(el);
            next.classList.add('photo--in');

            setTimeout(function() {
                this.animate(el, next, current);
            }.bind(this), 7500);
        },

        parsedData: function(data) {
            return data.map(this.simplifiedDatum);
        },

        simplifiedDatum: function(datum) {
            var caption, image;
            caption = datum.caption;
            image = datum.images;

            caption = caption ? caption.text : '';
            image = image.standard_resolution.url;

            return {
                text: caption,
                image: image
            };
        },

        template: function(photos) {
            var el, self;

            self = this;

            el = document.createElement('ol');
            el.className = 'instagram';

            photos.forEach(function(photo) {
                el.appendChild(self.photoWithCaption(photo));
            });

            return el;
        },

        photoWithCaption: function(photo) {
            var el;

            el = document.createElement('li');
            el.className = 'instagram-photo';
            el.appendChild(this.image(photo.image));
            el.appendChild(this.caption(photo.text));

            return el;
        },

        image: function(image) {
            var img;
            img = document.createElement('img');
            img.className = 'instagram-image';
            img.src = image;
            return img;
        },

        caption: function(text) {
            var caption, paragraph;
            paragraph = document.createElement('p');
            paragraph.innerHTML = text;
            caption = document.createElement('div');
            caption.className = 'instagram-caption';
            caption.appendChild(paragraph);
            return caption;
        }

    };

    window.onFeedFetchSuccess = instagramFeed.onFeedFetchSuccess;
    module.exports = instagramFeed;
}());

},{"./helpers":6}],8:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers');
    var life, config;

    config = {
        cellSize: 10,
        canvas: [400, 400],
        pixelRatio: window.devicePixelRatio || 1
    };

    life = {
        cells: [],
        rows: 0,
        columns: 0,

        init: function(container) {
            var el, canvas, ctx, audio, paragraph;
            container = container || document.body;

            el = document.createElement('div');
            el.className = 'life';

            canvas = document.createElement('canvas');
            audio = this.audio();

            paragraph = document.createElement('p');
            paragraph.className = 'life-caption';
            paragraph.innerHTML = '01.7';

            ctx = canvas.getContext('2d');
            canvas = this.configuredCanvas(canvas);
            el.appendChild(canvas);
            el.appendChild(audio);
            el.appendChild(paragraph);
            container.appendChild(el);

            ctx.scale(config.pixelRatio, config.pixelRatio);

            this.bind(canvas, audio);

            this.rows = Math.floor(config.canvas[0]/config.cellSize);
            this.columns = Math.floor(config.canvas[1]/config.cellSize);

            this.setup(ctx);
        },

        audio: function() {
            var audio, mp3, ogg;

            audio = document.createElement('audio');
            mp3 = document.createElement('source');
            ogg = document.createElement('source');

            mp3.src = 'extras/life.mp3';
            ogg.src = 'extras/life.ogg';

            audio.appendChild(mp3);
            audio.appendChild(ogg);

            return audio;
        },

        bind: function(canvas, audio) {
            canvas.addEventListener('mouseenter', this.playAudio.bind(this, audio));
            canvas.addEventListener('mouseleave', this.stopAudio.bind(this, audio));
        },

        playAudio: function(audio) {
            audio.play();
        },

        stopAudio: function(audio) {
            audio.pause();
        },

        configuredCanvas: function(canvas) {
            canvas.className = 'life-canvas';
            canvas.width = config.canvas[0] * config.pixelRatio;
            canvas.height = config.canvas[1] * config.pixelRatio;

            return canvas;
        },

        setup: function(ctx) {
            this.draw(ctx);
        },

        draw: function(ctx) {
            if (this.cells.length < 1) {
                this.cells = this.seed();
            }
            ctx.clearRect(0,0,config.canvas[0], config.canvas[1]);
            this.cells.forEach(this.drawCell.bind(this, ctx));

            setTimeout(function(){
                this.live(ctx);
            }.bind(this), 500);
        },

        live: function(ctx) {
            this.cells = this.cells.map(function(cell) {
                var livingNeighbours;
                livingNeighbours = cell.neighbours.filter(function(neighbour){
                    return neighbour.alive;
                });

                if (cell.alive === true) {
                    if (this.shouldDie(livingNeighbours)) {
                        cell.alive = false;
                    }
                } else {
                    if (livingNeighbours.length === 3) {
                        cell.alive = true;
                    }
                }
                return cell;
            }.bind(this));

            this.draw(ctx);
        },

        shouldDie: function(neighbours) {
            return neighbours.length < 2 || neighbours.length > 3;
        },

        neighbours: function(rows, columns) {
            var neighbours, distances;

            distances = [[1,0],
                         [0,1],
                         [1,1],
                         [-1,0],
                         [0,-1],
                         [1,-1],
                         [-1,1],
                         [-1,-1]
            ];
            neighbours = [];

            distances.forEach(function(distance) {
                var neighbour = [rows + distance[0], columns + distance[1]];
                neighbours.push(neighbour.join(','));
            });

            return neighbours;
        },

        seed: function() {
            var cells, rows, columns;

            rows = this.rows;
            cells = [];

            while (rows > 0) {
                rows -= 1;
                columns = this.columns;
                while (columns > 0) {
                    columns -= 1;
                    cells.push({
                        id: [rows,columns].join(','),
                        x: rows,
                        y: columns,
                        alive: Math.floor(Math.random() * 10) % 17 === 0,
                        neighbourIds: this.neighbours(rows, columns)
                    });
                }
            }

            cells.forEach(function(cell){
                cell.neighbours = cells.filter(function(filterCell){
                    return cell.neighbourIds.indexOf(filterCell.id) > -1;
                });
            });

            return cells;
        },

        drawCell: function(ctx, cell) {
            var position;

            ctx.fillStyle = cell.alive === true ? 'rgba(0,0,0,0)' : 'white';
            position = [cell.x * config.cellSize, cell.y * config.cellSize]
            ctx.fillRect(position[0], position[1], config.cellSize, config.cellSize);

        }

    };

    module.exports = life;
}());

},{"./helpers":6}],9:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers'),
        exhibitionItems = require('./exhibition-items'),
        pagination = require('./pagination'),
        carousel = require('./carousel');

    var modal;

    modal = {
        el: null,
        parent: document.body,

        init: function(url) {
            if (this.el !== null) {
                this.close();
                return;
            }

            this.fetchPage(url);
        },

        fetchPage: function(url) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = this.onPageFetchSuccess.bind(this);
            request.onerror = this.onPageFetchError;

            request.send();
        },

        onPageFetchSuccess: function(e) {
            var request, innerHTML, placeholderEl;
            request = e.target;

            if (request.status !== 200 || request.status > 400) {
                return;
            }

            innerHTML = request.responseText;
            placeholderEl = document.createElement('div');
            placeholderEl.innerHTML = innerHTML;
            placeholderEl = placeholderEl.querySelector('.content');

            this.el = this.template(placeholderEl.innerHTML);
            this.open();
            exhibitionItems.init(this.el.querySelectorAll('.item'));
            carousel.init(this.el.querySelector('.carousel'));
            pagination.init(this.el.querySelector('.content-text'));

            var feed, i, len;
            feed = this.el.querySelectorAll('.social-item');

            if (feed) {
                for (i = 0, len = feed.length; i < len; i +=1) {
                    feed[i].style.width = helpers.randomInt(15, 10) + '%';
                }
            }
        },

        template: function(innerHTML) {
            var container, content, bg;

            container = document.createElement('div');
            container.className = 'modal-container';

            bg = document.createElement('div');
            bg.className = 'modal-bg';

            content = document.createElement('div');
            content.className = 'modal-content';
            content.innerHTML = innerHTML;

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

},{"./carousel":2,"./exhibition-items":4,"./helpers":6,"./pagination":10}],10:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers'),
        fontStretch = require('./font-stretch.js');

    var pagination;

    pagination = {
        nextButton: null,
        prevButton: null,

        init: function(el) {
            if (el === null) {
                return;
            }

            fontStretch.init(el);

            if (el.querySelectorAll('p').length < 2) {
                return;
            }

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
            var next, previous, fragment;

            this.previousButton = this.button('previous');
            this.previousButton.disabled = true;
            this.nextButton = this.button('next');

            fragment = document.createDocumentFragment();
            fragment.appendChild(this.previousButton);
            fragment.appendChild(this.nextButton);

            el.parentNode.appendChild(fragment);
        },

        button: function(type){
            var btn;

            btn = document.createElement('button');
            btn.className = 'pagination-button--' + type;
            btn.innerHTML = type + ' page';

            return btn;
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
            this.updateButtons(helpers.nextSiblingOfType(next, 'P'), previous);
        },

        revert: function(el, e) {
            var target, previous, next;
            e.preventDefault();

            target = el.querySelector('.carousel--active');

            previous = helpers.previousSiblingOfType(target, 'P');
            next = helpers.nextSiblingOfType(target, 'P');

            if (previous === null) {
                return;
            }

            previous.classList.add('carousel--active');
            target.classList.remove('carousel--active');
            this.updateButtons(next, helpers.previousSiblingOfType(previous, 'P'));
        },

        updateButtons: function(next, prev) {
            this.nextButton.disabled = !next;
            this.previousButton.disabled = !prev;
            console.log(this.nextButton)
        }

    };

    module.exports = pagination;
}());

},{"./font-stretch.js":5,"./helpers":6}]},{},[1]);
