var requestFilter = {urls: [ "<all_urls>"]};
var extraInfoSpec = ["blocking", "requestHeaders", "extraHeaders"];
var currentIdentity = '0';

var requestHandler = function(details) {
    var headers = details.requestHeaders || [];
    var blockingResponse = {};
    var identity = identityValues[currentIdentity] || {};
    for (var i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name === 'User-Agent') {
            headers[i].value = identity.userAgent || headers[i].value;
        } else if (headers[i].name === 'Accept-Language') {
            headers[i].value = identity.language || headers[i].value;
        } else if (headers[i].name === 'Accept') {
            headers[i].value = identity.accept || headers[i].value
        } else if (headers[i].name === 'Accept-Encoding') {
            headers[i].value = identity.acceptEncoding || headers[i].value;
        }
    }

    blockingResponse.requestHeaders = headers;
    return blockingResponse;
};

chrome.storage.onChanged.addListener(function(changes) {
    for (var key in changes) {
        var storageChange = changes[key];

        if (key === 'identity') {
            currentIdentity = storageChange.newValue;
        }
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.name === 'getIdentity') {
            sendResponse(identityValues[currentIdentity])
        } else if (request.name === 'setUA') {
            identityValues[1].userAgent = request.userAgent1;
            identityValues[2].userAgent = request.userAgent2;
            identityValues[3].userAgent = request.userAgent3;
            identityValues[4].userAgent = request.userAgent4;
            identityValues[5].userAgent = request.userAgent5;
        }
    }
);

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get('identity', function(data) {
        currentIdentity = data && data.identity || '0';
        chrome.webRequest.onBeforeSendHeaders.addListener(requestHandler, requestFilter, extraInfoSpec);
    }.bind(this));
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {schemes: ['https']}
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
