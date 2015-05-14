(function(){
    'use strict';

    var section = require('./section');

    var helpers = {
        addEventListeners: function(nodeList, event, handler) {
            var i, len;
            for (i = 0, len = nodeList.length; i < len; i += 1) {
                nodeList[i].addEventListener(event, handler);
            }
        },
        toggleClass: function(node, className) {

        }

    };

    var site = {
        container: null,
        navigation: null,
        navItemsPrimary: null,
        modal: null,

        init: function() {
            this.container = document.querySelector('.container');
            this.navigation = document.querySelector('.navigation');
            this.bindEvents();
        },

        bindEvents: function() {
            this.navigation.addEventListener('click',
                                              this.onSectionLinkClick.bind(this));
        },

        onSectionLinkClick: function(e) {
            e.preventDefault();
            var el, targetSection, sectionEl, subNav;

            if (e.target.nodeName === 'SPAN') {
                el = e.target.parentNode;
            } else {
                el = e.target;
            }

            if (el.nodeName === 'SPAN') {
                el = el.parentNode;
            }

            if (el.nodeName !== 'A') {
                return;
            }

            subNav = el.parentNode.querySelectorAll('li');

            if (subNav !== null && subNav.length > 0) {
                el.parentNode.querySelector('.navigation-subpages')
                            .classList.toggle('navigation-subpages--show');
                return;
            }

            targetSection = el.href;

            if (!targetSection || targetSection.indexOf('#') > -1) {
                return;
            }

            this.modal = section.open(targetSection, this.modalClose);

            this.container.appendChild(this.modal);
        }
    };

    site.init();

}());
