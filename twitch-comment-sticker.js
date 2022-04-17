// ==UserScript==
// @name         Twitch Comment Sticker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==

var commentIdentifier = (function() {
    return {
        identify: function(node) {
            var inner = node.innerHTML;

            if(inner.search("Moderator badge") !== -1){
                monitor.stickComment(node);
            }
        }
    }
}());

var monitor = (function(){
    return {
        setupWindow: function() {
            // This creates a window at the top of the live chat window 
            // where translations and spanner comments will appear.
            let sticky = document.createElement('div');
            let ticker = document.querySelector('.chat-scrollable-area__message-container').parentNode.parentNode.parentNode;
            
            sticky.id = 'sticky';
            sticky.style.maxHeight = '30%';
            sticky.style.overflow = 'auto';
            sticky.style.border = '1px solid red';
            sticky.style.left = '0';
            sticky.style.width = 'auto';
            sticky.style.zIndex = '9999';

            ticker.parentNode.insertBefore(sticky, ticker);
        },
        init: function(){
            let chatItems = document.querySelector('.chat-scrollable-area__message-container');

            // stick items that exist on load
            chatItems.querySelectorAll('chat-line__message').forEach(commentIdentifier.identify); 

            // stick mutations
            let observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach(commentIdentifier.identify);
                });
            });

            // start the observer
            observer.observe(chatItems, { childList: true });
        },
        stickComment: function(node){
            let sticky = document.getElementById('sticky');
            var newNode= document.importNode(node,true);

            sticky.appendChild(newNode);

            sticky.scrollTop = sticky.scrollHeight;
        }
    }
}());

(function(){    
    monitor.setupWindow();    
    window.top.addEventListener('load', monitor.init());
})();
