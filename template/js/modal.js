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
            var frame;

            console.log('modal:close');

            frame = this.el.querySelector('.modal-content');
            frame.className = 'modal-content';

            setTimeout(function(){
                this.remove();
            }.bind(this), 300);
        },

        open: function() {
            var frame;
            console.log('modal:open');

            this.render();
            frame = this.el.querySelector('.modal-content');

            setTimeout(function(){
                frame.className += ' transition-in';
            //fixme: 100ms delay so the http request does not affect
            //       the slide-in animation
            }.bind(this), 100);
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
           var container, content, iframe;

           container = document.createElement('div');
           container.className = 'modal-container';

           content = document.createElement('div');
           content.className = 'modal-content';

           iframe = document.createElement('iframe');
           iframe.className = 'modal-frame'
           iframe.src = url;

           content.appendChild(iframe);
           container.appendChild(content);

           return container;
        },

        bind: function() {
            this.el.addEventListener('click', this.close.bind(this));
        }

    };

    module.exports = modal;

}());
