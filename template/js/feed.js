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
            var id, type, link, i, len, el;

            for (i = 0, len = els.length; i < len; i +=1) {
                el = els[i];
                type = el.id.split('-')[0];
                id = el.id.split('-')[1];
                link = el.getAttribute('data-link');
                el.innerHTML = '';
                if (type === 'tweet') {
                    window.twttr.widgets.createTweet(id, el,
                                                    { conversation: 'none',
                                                      cards: ''}
                    );
                }

                if (type === 'instagram') {
                    el.innerHTML = this.instagramEmbed(link);
                }
            }

            window.instgrm.Embeds.process();
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
        },

        loadInstagramScript: function() {
            var scriptId, el, t;
            scriptId = 'instagram-script';

            el = document.getElementById(scriptId);
            t = window.instgrm || {};

            if (el) {
                return t;
            }

            el = document.createElement('script');
            el.id = scriptId;
            el.src = 'https://platform.instagram.com/en_US/embeds.js';
            document.body.appendChild(el);

            t._e = [];

            t.ready = function(f) {
                t._e.push(f);
            };

            return t;

        },

        instagramEmbed: function(linkID) {
            var template;

            template = '<blockquote class="instagram-media" data-instgrm-version="6" style=" background:#FFF; border: 1px solid lightgrey; border-radius:3px; padding:0;"><a href="{{link}}" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank"></blockquote>';

            return template.replace('{{link}}', linkID);
        }

    };


    module.exports = feed;
}());
