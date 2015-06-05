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
