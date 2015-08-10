(function(){
    'use strict';

    var helpers = require('./helpers'),
        fontStretch = require('./font-stretch.js');

    var pagination;

    pagination = {
        init: function(el) {
            this.addButtons(el);
            this.bind(el);

            fontStretch.init(el);
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
            var next, prev, fragment;

            fragment = document.createDocumentFragment();
            fragment.appendChild(this.button('previous'));
            fragment.appendChild(this.button('next'));

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
            var target, next;
            e.preventDefault();

            target = el.querySelector('.carousel--active');

            next = helpers.nextSiblingOfType(target, 'P');

            if (next === null) {
                return;
            }

            next.classList.add('carousel--active');
            target.classList.remove('carousel--active');
        },

        revert: function(el, e) {
            var target, previous;
            e.preventDefault();

            target = el.querySelector('.carousel--active');

            previous = helpers.previousSiblingOfType(target, 'P');

            if (previous === null) {
                return;
            }

            previous.classList.add('carousel--active');
            target.classList.remove('carousel--active');
        }

    };

    module.exports = pagination;
}());
