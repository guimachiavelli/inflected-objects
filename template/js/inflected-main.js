(function(){
    'use strict';

    require('./classlist-polyfill');

    var helpers = require('./helpers'),
        life = require('./life'),
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
            life.init(this.container);
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

            modal.init(target.href, helpers.innerText(target));
        }
    };

    site.init();

}());
