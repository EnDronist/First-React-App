if (!('main' in window)) window.main = {};
var cookie = window.main.cookie = {};
cookie.getCookie = (name) => {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};
cookie.setCookie = (name, value, options = {}) => {
    options = { path: '/', ...options };
    if (options.expires !== undefined) {
        options.expires = new Date(options.expires);
        options.expires = options.expires.toUTCString();
    }
    else if (options.maxAge !== undefined) {
        options.expires = new Date(Date.now() + options.maxAge);
        options.expires = options.expires.toUTCString();
    }
    var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (var optionKey in options) {
        updatedCookie += "; " + optionKey;
        var optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    console.log(updatedCookie);
    document.cookie = updatedCookie;
};
cookie.deleteCookie = (name) => {
    setCookie(name, "", { 'max-age': -1 });
};