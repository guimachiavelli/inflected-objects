(function(){
    'use strict';

    var helpers = require('./helpers');

    var instagramFeed, config;

    config = {
        clientID: '050fd5a405a14c8ca6e160892ddf119a',
        accessToken: '1922142485.050fd5a.918c6442a9d04928a754532dde856033',
        endpoint: 'https://api.instagram.com/v1/users/1922142485/media/recent/',
        count: 10
    };

    instagramFeed = {
        init: function() {
            var request, URL;
            URL = config.endpoint + '?access_token=' + config.accessToken;
            URL += '&count=' + config.count;
            URL += '&callback=onFeedFetchSuccess';

            this.requestJSONP(URL)
        },

        requestJSONP: function(URL) {
            var el;

            el = document.createElement('script');
            el.src = URL;
            el.id = 'instagram-request';
            document.head.appendChild(el);
        },

        onFeedFetchSuccess: function(response) {
            var self;
            self = instagramFeed;

            if (response.meta.code !== 200) {
                self.onFeedFetchError(response.meta);
                return;
            }

            if (!response.data.length || response.data.length < 1) {
                return;
            }

            if (response.data.length === 2) {
                response.data.push(response.data[0]);
            }

            if (response.data.length === 1) {
                response.data.push(response.data[0]);
                response.data.push(response.data[0]);
            }

            self.parse(response.data);
        },

        onFeedFetchError: function(err) {
            console.warn(err);
        },

        parse: function(data) {
            var el;
            data = this.parsedData(data);
            el = this.template(data);
            this.render(el);
            this.animate(el, helpers.firstElementChild(el));
        },

        render: function(el) {
            document.querySelector('.container').appendChild(el);
        },

        animate: function(el, current, previous) {
            var next;

            if (previous) {
                previous.classList.add('photo--no-transition');
                previous.classList.remove('photo--out');

                setTimeout(function() {
                    previous.classList.remove('photo--no-transition');
                }, 300);
            }

            current.classList.remove('photo--in');
            current.classList.add('photo--out');
            next = current.nextElementSibling || helpers.firstElementChild(el);
            next.classList.add('photo--in');

            setTimeout(function() {
                this.animate(el, next, current);
            }.bind(this), 7500);
        },

        parsedData: function(data) {
            return data.map(this.simplifiedDatum);
        },

        simplifiedDatum: function(datum) {
            var caption, image;
            caption = datum.caption;
            image = datum.images;

            caption = caption ? caption.text : '';
            image = image.standard_resolution.url;

            return {
                text: caption,
                image: image
            };
        },

        template: function(photos) {
            var el, self;

            self = this;

            el = document.createElement('ol');
            el.className = 'instagram';

            photos.forEach(function(photo) {
                el.appendChild(self.photoWithCaption(photo));
            });

            return el;
        },

        photoWithCaption: function(photo) {
            var el;

            el = document.createElement('li');
            el.className = 'instagram-photo';
            el.appendChild(this.image(photo.image));
            el.appendChild(this.caption(photo.text));

            return el;
        },

        image: function(image) {
            var img;
            img = document.createElement('img');
            img.className = 'instagram-image';
            img.src = image;
            return img;
        },

        caption: function(text) {
            var caption, paragraph;
            paragraph = document.createElement('p');
            paragraph.innerHTML = text;
            caption = document.createElement('div');
            caption.className = 'instagram-caption';
            caption.appendChild(paragraph);
            return caption;
        }

    };

    window.onFeedFetchSuccess = instagramFeed.onFeedFetchSuccess;
    module.exports = instagramFeed;
}());
