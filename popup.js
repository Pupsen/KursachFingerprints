var identities = [document.getElementById('identity0'), document.getElementById('identity1'), document.getElementById('identity2'), document.getElementById('identity3'), document.getElementById('identity4'), document.getElementById('identity5')];

var setIdentity = function(idx) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'chrome.storage.local.set({identity: "'+ idx + '"});'}
        );
        chrome.tabs.reload(tabs[0].id, {}, function() {window.location.reload()});
    });
};

chrome.storage.local.get('identity', function(data) {
    var idx = data.identity || 0;
    identities[idx].style.backgroundColor = '#a5a5a6';
});

for (var i in identities) {
    identities[i].onclick = setIdentity.bind(this, i)
}
