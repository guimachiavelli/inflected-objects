(function(){
    'use strict';

    var helpers = require('./helpers');

    var modal;

    modal = {
        el: null,
        parent: document.body,

        init: function(url) {
            console.log('modal:init:' + url);
            if (this.el !== null) {
                this.close();
                return;
            }

            this.el = this.template(url);
            this.open();
        },

        close: function() {
            console.log('modal:close');
            this.remove();
        },

        open: function() {
            console.log('modal:open');
            this.render();
        },

        render: function() {
            this.bind();
            this.parent.appendChild(this.el);
        },

        remove: function() {
            this.parent.removeChild(this.el);
            this.el = null;
        },

        template: function(url) {
           var container, iframe;

           container = document.createElement('div');
           container.className = 'modal-container';

           iframe = document.createElement('iframe');
           iframe.className = 'modal-content'
           iframe.src = url;

           container.appendChild(iframe);

           return container;
        },

        bind: function() {
            this.el.addEventListener('click', this.close.bind(this));
        }

    };

    module.exports = modal;

}());
