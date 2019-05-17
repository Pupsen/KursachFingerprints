document.addEventListener('getIdentity', function (e) {
    chrome.runtime.sendMessage('ahbdbchhncdilceaggnhbmnhlndnjcfj', 'getIdentity', function(response) {
        var event = new CustomEvent('setIdentity', {detail: response});
        document.dispatchEvent(event);
    });
});

var s = document.createElement('script');
s.src = chrome.runtime.getURL('script.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);