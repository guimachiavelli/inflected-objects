(function(){
    'use strict';

    var section = require('./section');

    var helpers = {
        addEventListeners: function(nodeList, event, handler) {
            var i, len;
            for (i = 0, len = nodeList.length; i < len; i += 1) {
                nodeList[i].addEventListener(event, handler);
            }
        }
    };

    var site = {
        container: null,
        navigation: null,
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
            var targetSection, sectionEl;

            targetSection = e.srcElement.href;
            if (!targetSection) {
                return;
            }

            this.modal = section.open(targetSection, this.modalClose);

            this.container.appendChild(this.modal);
        },

        modalClose: function() {

        }
    };

    site.init();

}());
