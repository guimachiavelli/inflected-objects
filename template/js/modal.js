(function(){
    'use strict';

    var helpers = require('./helpers'),
        exhibitionItems = require('./exhibition-items'),
        pagination = require('./pagination'),
        feed = require('./feed'),
        carousel = require('./carousel');

    var modal;

    modal = {
        el: null,
        parent: document.body,

        init: function(url, title) {
            if (this.el !== null) {
                this.close();
                return;
            }

            this.fetchPage(url, title);
        },

        fetchPage: function(url, title) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = this.onPageFetchSuccess.bind(this, title);
            request.onerror = this.onPageFetchError;

            request.send();
        },

        onPageFetchSuccess: function(title, e) {
            var request, innerHTML, placeholderEl;
            request = e.target;

            if (request.status !== 200 || request.status > 400) {
                return;
            }

            innerHTML = request.responseText;
            placeholderEl = document.createElement('div');
            placeholderEl.innerHTML = innerHTML;
            placeholderEl = placeholderEl.querySelector('.content');

            this.el = this.template(placeholderEl.innerHTML, title);
            this.open();
            exhibitionItems.init(this.el.querySelectorAll('.item'));
            carousel.init(this.el.querySelector('.carousel'));
            pagination.init(this.el.querySelector('.content-text'));
            feed.init(this.el.querySelectorAll('.social-item'));
        },

        template: function(innerHTML, title) {
            var container, content, bg, contentTitle;

            container = document.createElement('div');
            container.className = 'modal-container';

            bg = document.createElement('div');
            bg.className = 'modal-bg';

            content = document.createElement('div');
            content.className = 'modal-content';
            content.innerHTML = innerHTML;

            if (content.querySelector('.content-text') !== null) {
                contentTitle = document.createElement('h2');
                contentTitle.innerHTML = title;
                contentTitle.className = 'modal-title';
                content.insertBefore(contentTitle, content.firstChild);
            }

            container.appendChild(bg);
            container.appendChild(content);

            return container;
        },

        onPageFetchError: function(err) {
            console.error(err);
        },

        close: function() {
            var frame;

            frame = this.el.querySelector('.modal-content');
            frame.className = 'modal-content';

            setTimeout(function(){
                this.remove();
                document.body.className = document.body.className.replace('no-scroll', '');
            }.bind(this), 300);
        },

        onResize: function() {
            if (!this.el) {
                return;
            }

            this.close();
        },

        open: function() {
            var frame;

            this.render();
            frame = this.el.querySelector('.modal-content');

            setTimeout(function(){
                frame.className += ' transition-in';
                document.body.className += ' no-scroll';
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
