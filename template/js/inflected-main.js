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
            instagramFeed.init();
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
        },

        onNavClick: function(e) {
            e.preventDefault();

            var target, parent, ancestor;

            ancestor = helpers.closestAncestorWithClass(e.target, 'navigation-item--exhibition');
            parent = helpers.closestAncestorWithClass(e.target, 'subnavigation');
            target = helpers.parentAnchor(e.target);

            console.log(parent, ancestor);
            if (parent === null && ancestor !== null) {
                ancestor.classList.toggle('navigation-item--closed');
                return;
            }

            if (target === false) {
                console.warn('no enclosing anchor found');
                return;
            }

            modal.init(target.href);
        }
    };

    site.init();

}());
