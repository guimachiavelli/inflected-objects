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
