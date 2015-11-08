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
