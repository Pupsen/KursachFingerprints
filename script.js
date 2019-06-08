var toDataURLOld = HTMLCanvasElement.prototype.toDataURL;

document.addEventListener('setIdentity', function (e) {
    var identity = e.detail || {};

    if (identity.userAgent)
        navigator.__defineGetter__('userAgent', function(){
            return identity.userAgent;
        });
    if (identity.language)
        navigator.__defineGetter__('language', function(){
            return identity.language;
        });
    if (identity.languages && identity.languages.length)
        navigator.__defineGetter__('languages', function(){
            return identity.languages;
        });
    if (identity.width)
        screen.__defineGetter__("width", function() {
            return identity.width;
        });
    if (identity.height)
        screen.__defineGetter__("height", function() {
            return identity.height;
        });
    if (identity.availWidth)
        screen.__defineGetter__("availWidth", function() {
            return identity.availWidth;
        });
    if (identity.availHeight)
        screen.__defineGetter__("availHeight", function() {
            return identity.availHeight;
        });
    if (identity.depth)
        screen.__defineGetter__("depth", function() {
            return identity.depth;
        });

    HTMLCanvasElement.prototype.toDataURL = function () {
        var width = this.width;
        var height = this.height;
        var context = this.getContext("2d");
        var imageData = context.getImageData(0, 0, width, height);
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var index = ((i * (width * 4)) + (j * 4));
                imageData.data[index] = imageData.data[index] + 1;
                imageData.data[index + 1] = imageData.data[index + 1] + 0;
                imageData.data[index + 2] = imageData.data[index + 2] - 1;
                imageData.data[index + 3] = imageData.data[index + 3] + 0;
            }
        }
        context.putImageData(imageData, 0, 0);
        return toDataURLOld.apply(this, arguments)
    };
});

var event = new Event('getIdentity');
document.dispatchEvent(event);
