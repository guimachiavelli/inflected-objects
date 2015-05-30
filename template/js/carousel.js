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
