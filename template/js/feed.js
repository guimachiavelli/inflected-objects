(function(){
    'use strict';

    var helpers = require('./helpers');
    var feed;

    feed = {
        init: function(els) {
            if (!els) {
                return;
            }

            this.setSizes(els);
            this.setStyles(els);
        },

        setStyles: function(els) {
            var id, type, i, len, el;

            for (i = 0, len = els.length; i < len; i +=1) {
                el = els[i];
                type = el.id.split('-')[0];
                id = el.id.split('-')[1];
                el.innerHTML = '';
                if (type === 'tweet') {
                    window.twttr.widgets.createTweet(id, el, {conversation: 'none', cards: ''});
                }
            }
        },

        setSizes: function(els) {
            var i, len;
            for (i = 0, len = els.length; i < len; i +=1) {
                els[i].style.width = helpers.randomInt(16, 12) + '%';
            }
        },

        loadTwitterScript: function() {
            var scriptId, el, t;
            scriptId = 'twitter-script';

            el = document.getElementById(scriptId);
            t = window.twttr || {};

            console.log(123);

            if (el) {
                return t;
            }

            el = document.createElement('script');
            el.id = scriptId;
            el.src = 'https://platform.twitter.com/widgets.js';
            document.body.appendChild(el);

            t._e = [];

            t.ready = function(f) {
                t._e.push(f);
            };

            return t;
        }

    };


    module.exports = feed;
}());
