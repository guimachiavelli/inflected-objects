(function(){
    'use strict';

    var helpers = require('./helpers');

    var fontStretch;

    fontStretch = {

        init: function(el) {
            var i, len, children;
            children = el.children;

            for (i = 0, len = children.length; i < len; i += 1) {
                this.stretch(children[i], el);
            }
        },

        stretch: function(el, parent) {
            var y;
            y = (parent.offsetHeight - 50)/el.offsetHeight;
            el.style.transform = 'scaleY(' + y + ')';
        },
    };

    module.exports = fontStretch;

}());
