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
