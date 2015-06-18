(function(){
    'use strict';

    var helpers = require('./helpers'),
        exhibitionItems = require('./exhibition-items'),
        carousel = require('./carousel');

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

            this.fetchPage(url);
        },

        fetchPage: function(url) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = this.onPageFetchSuccess.bind(this);
            request.onerror = this.onPageFetchError;

            request.send();
        },

        onPageFetchSuccess: function(e) {
            var request, innerHTML, placeholderEl;
            request = e.target;

            if (request.status !== 200 || request.status > 400) {
                return;
            }

            innerHTML = request.responseText;
            placeholderEl = document.createElement('div');
            placeholderEl.innerHTML = innerHTML;
            placeholderEl = placeholderEl.querySelector('.content');

            this.el = this.template(placeholderEl.innerHTML);
            this.open();
            exhibitionItems.init(this.el.querySelectorAll('.item'));
            carousel.init(this.el.querySelector('.carousel'));
        },

        template: function(innerHTML) {
            var container, content, bg;

            container = document.createElement('div');
            container.className = 'modal-container';

            bg = document.createElement('div');
            bg.className = 'modal-bg';

            content = document.createElement('div');
            content.className = 'modal-content';
            content.innerHTML = innerHTML;

            container.appendChild(bg);
            container.appendChild(content);

            return container;
        },

        onPageFetchError: function(err) {
            console.error(err);
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

        bind: function() {
            //FIXME should probably cache these elements?
            var bg, content;
            bg = this.el.querySelector('.modal-bg');
            content = this.el.querySelector('.modal-content');
            bg.addEventListener('click', this.close.bind(this));
            content.addEventListener('click',
                                     this.onContentClick.bind(this, content));
        },

        onContentClick: function(self, e) {
            if (e.target !== self) {
                return;
            }
            this.close();
        }

    };

    module.exports = modal;

}());
