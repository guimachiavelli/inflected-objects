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

        setClipping: function(item, itemClipper) {
            var width, height;
            width = helpers.randomInt(20) + 'vw';
            height = helpers.randomInt(20) + 'vw';

            item.style.width = width;
            item.style.height = height;

            item.style.webkitAnimationDuration = ((Math.random() * 2.5) + 1) + 's';
        },

        onItemClick: function(item, itemClipper) {
            var prevEl = document.querySelector('.is--active');

            if (prevEl && prevEl !== item) {
                prevEl.classList.remove('is--active');
            }

            item.classList.toggle('is--active');
        }

    };

    module.exports = exhibitionItems;
}());
