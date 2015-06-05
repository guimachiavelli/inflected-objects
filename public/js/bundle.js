(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    'use strict';

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
            this.bindEvents();
            //instagramFeed.init();
            life.init(this.container);
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

},{"./helpers":4,"./instagram-feed":5,"./life":6,"./modal":7}],2:[function(require,module,exports){
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

    function findArrayItem(haystack, needle) {
        var i, len;

        for (i = 0, len = haystack.length; i < len; i += 1) {
            if (haystack[i][0] === needle[0] && haystack[i][1] === needle[1]) {
                return i;
            }
        }

        return false;
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
        firstElementChild: firstElementChild,
        findArrayItem: findArrayItem
    };

}());

},{}],5:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers');

    var instagramFeed, config;

    config = {
        clientID: '050fd5a405a14c8ca6e160892ddf119a',
        accessToken: '10295251.050fd5a.0df78a1ec668433c981c2d6cbc626e97',
        endpoint: 'https://api.instagram.com/v1/users/10295251/media/recent/',
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
            var caption;
            caption = document.createElement('p');
            caption.className = 'instagram-caption';
            caption.innerHTML = text;
            return caption;
        }

    };

    window.onFeedFetchSuccess = instagramFeed.onFeedFetchSuccess;
    module.exports = instagramFeed;
}());

},{"./helpers":4}],6:[function(require,module,exports){
(function(){
    'use strict';

    var helpers = require('./helpers');
    var life, config;

    config = {
        cellSize: 20,
        canvas: [500, 500]
    };

    life = {
        canvas: null,
        ctx: null,
        cells: [],
        rows: 0,
        columns: 0,

        init: function(container) {
            container = container || document.body;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvas = this.configuredCanvas(this.canvas);
            container.appendChild(this.canvas);

            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            this.rows = Math.floor(config.canvas[0]/config.cellSize);
            this.columns = Math.floor(config.canvas[1]/config.cellSize);

            this.setup(this.ctx);
        },

        configuredCanvas: function(canvas) {
            canvas.className = 'life';
            canvas.width = config.canvas[0] * window.devicePixelRatio;
            canvas.height = config.canvas[1] * window.devicePixelRatio;

            return canvas;
        },

        setup: function(ctx) {
            this.setGrid(ctx);
            this.draw(ctx);
        },

        draw: function(ctx) {
            if (this.cells.length < 1) {
                this.cells = this.seed();
            }
            //ctx.fillStyle = 'white';
            ctx.fillRect(0,0,config.canvas[0], config.canvas[1]);

            this.cells.forEach(this.drawCell.bind(this, ctx));

            setInterval(function(){
                this.live(ctx);
            }.bind(this), 500);
        },

        live: function(ctx) {
            this.cells = this.cells.map(function(cell) {
                var livingNeighbours;
                livingNeighbours = cell.neighbours.filter(function(neighbour){
                    var neighbourCell;
                    neighbourCell = this.cells.filter(function(nCell) {
                        return nCell.id === neighbour;
                    });
                    if (neighbourCell.length === 0) {
                        return false;
                    }
                    return neighbourCell[0].alive;
                }.bind(this));

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

            this.cells.forEach(this.drawCell.bind(this, ctx));
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
                        neighbours: this.neighbours(rows, columns)
                    });
                }
            }

            return cells;
        },


        setGrid: function(ctx) {
            var rows, columns;
            rows = this.rows;
            columns = this.columns;

            ctx.beginPath();
            while(rows > 0) {
                ctx.moveTo(0, rows * config.cellSize);
                ctx.lineTo(config.canvas[0], rows * config.cellSize);
                ctx.stroke();
                rows -= 1;
            }
            while(columns > 0) {
                ctx.moveTo(columns * config.cellSize, 0);
                ctx.lineTo(columns * config.cellSize, config.canvas[1]);
                ctx.stroke();
                columns -= 1;
            }
            ctx.closePath();
        },

        drawCell: function(ctx, cell) {
            var position;

            ctx.fillStyle = cell.alive === true ? 'black' : 'white';
            position = [cell.x * config.cellSize, cell.y * config.cellSize]
            ctx.fillRect(position[0], position[1], config.cellSize, config.cellSize);

        }


    };

    module.exports = life;
}());

},{"./helpers":4}],7:[function(require,module,exports){
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
