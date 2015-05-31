(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers'),
        exhibitionItems = require('./exhibition-items'),
        modal = require('./modal');

    var site = {
        container: null,
        nav: null,

        init: function() {
            this.nav = document.querySelector('.navigation');
            this.container = document.querySelector('.container');
            this.bindEvents();
        },

        bindEvents: function() {
            if (this.nav) {
                this.nav.addEventListener('click', this.onNavClick.bind(this));
            }
        },

        onNavClick: function(e) {
            e.preventDefault();

            var target;

            target = helpers.parentAnchor(e.target);

            if (target === false) {
                console.warn('no enclosing anchor found');
                return;
            }

            modal.init(target.href);
        }
    };

    site.init();

}());

},{"./exhibition-items":3,"./helpers":4,"./modal":5}],2:[function(require,module,exports){
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

},{"./helpers":4}],3:[function(require,module,exports){
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
                this.setClipping(item, itemClipper);
                item.addEventListener('click',
                                      this.onItemClick.bind(this,
                                                            item,
                                                            itemClipper));
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
            var prevEl, container, target, targetAncestor;

            target = e.srcElement;
            targetAncestor = helpers.closestAncestorWithClass(target, 'item--active');

            if (target.nodeName === 'IMG' && targetAncestor !== null) {
                return;
            }

            prevEl = document.querySelector('.item--active');
            container = item.querySelector('.item-container');

            if (prevEl) {
                this.hideItem(prevEl, container);
                return;
            }

            this.showItem(item, container);
        },

        hideItem: function(item, container) {
            item.classList.remove('item--show');
            container.style.transform = '';
            setTimeout(function(){
                item.classList.remove('item--active');
            }, 300);
        },

        showItem: function(item, container) {
            var offset = [
                this.distanceFromViewport(item, container),
                this.distanceFromViewport(item, container, 'offsetTop')
            ];

            offset = this.addImageMargin(offset).join(',');

            item.classList.add('item--active');
            item.classList.add('item--show');
            container.style.transform = 'translate(' + offset + ')';
            setTimeout(function(){
                //item.classList.remove('item--showing');
            }, 300);
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

},{"./helpers":4}],4:[function(require,module,exports){
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
        randomInt: randomInt,
        closestAncestorWithClass: closestAncestorWithClass,
        firstElementChild: firstElementChild
    };

}());

},{}],5:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers'),
        exhibitionItems = require('./exhibition-items'),
        carousel = require('./carousel');


    var modal;

    modal = {
        el: null,
        parent: document.body,

        init: function(url) {
            console.log('modal:init:' + url);

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
            console.log('modal:close');

            frame = this.el.querySelector('.modal-content');
            frame.className = 'modal-content';

            setTimeout(function(){
                this.remove();
            }.bind(this), 300);
        },

        open: function() {
            var frame;
            console.log('modal:open');

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

},{"./carousel":2,"./exhibition-items":3,"./helpers":4}]},{},[1]);
