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
            y = Math.min(y, 6.5);
            y = Math.max(0.7, y);
            helpers.updatePrefixedStyle(el, 'transform', 'scaleY(' + y + ')');
        },
    };

    module.exports = fontStretch;

}());
