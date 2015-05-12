(function() {
    'use strict';

    var el, content, bg, callback;

    function open(targetSection, closeCallback) {
        callback = closeCallback;
        if (el) {
            close();
        }

        render(targetSection);
        bindEvents();

        return el;
    }

    function render(targetSection) {
        el = document.createElement('div');
        el.className = 'modal-section';

        content = document.createElement('iframe');
        content.src = targetSection;
        content.className = 'section-frame';

        bg = document.createElement('div');
        bg.className = 'modal-bg';

        el.appendChild(bg);
        el.appendChild(content);
    }

    function bindEvents() {
        bg.addEventListener('click', close);
    }

    function close() {
        callback();
    }

    function unbindEvents() {

    }


    module.exports = {
        open: open
    };
}());
