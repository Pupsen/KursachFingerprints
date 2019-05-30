function xmlToJson(xml) {
    var obj = {};
    if (xml.nodeType == 1) { // element
        if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }
    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};

setInterval(function () {
    var res;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://techblog.willshouse.com/2012/01/03/most-common-user-agents/', true);
    xhr.responseType = 'document';
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) { return;}
        if (xhr.status == 200) {
            var parentUA = xmlToJson(xhr.responseXML.documentElement).BODY.DIV.DIV[1].DIV[0].DIV.DIV[1].DIV[1].TABLE.TBODY;
            chrome.runtime.sendMessage('',{name : 'setUA',
            userAgent1 : JSON.stringify(parentUA.TR[0].TD[1]["#text"]).replace(/['"«»]/g, ''),
            userAgent2 : JSON.stringify(parentUA.TR[1].TD[1]["#text"]).replace(/['"«»]/g, ''),
            userAgent3 : JSON.stringify(parentUA.TR[2].TD[1]["#text"]).replace(/['"«»]/g, ''),
            userAgent4 : JSON.stringify(parentUA.TR[3].TD[1]["#text"]).replace(/['"«»]/g, ''),
            userAgent5 : JSON.stringify(parentUA.TR[4].TD[1]["#text"]).replace(/['"«»]/g, '')});
        }
    }
}, 60000);

document.addEventListener('getIdentity', function (e) {
    chrome.runtime.sendMessage('jhjijpejjbkfkhcagbpbflofeocimchk', {name : 'getIdentity'}, function(response) {
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
