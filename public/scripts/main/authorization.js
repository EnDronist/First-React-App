if (!('main' in window)) window.main = {};
var authorization = window.main.authorization = {};
// Submit type
authorization.signTypes = Object.freeze({
    signIn: { url: '/sign-in' },
    signUp: { url: '/sign-up' },
    logOut: { url: '/log-out' }
});
authorization.signType = null;
authorization.fieldCheck = {
    login: str => str.match(/^[a-zA-Z][a-zA-Z0-9-]{3,31}$/),
    password: str => str.match(/^[a-zA-Z0-9_-]{8,32}$/),
};
// Callbacks
authorization.fieldTextInputCheck = function() {
    if (!authorization.fieldCheck[$(this).attr('name')]($(this).val()))
        $(this).addClass('incorrect');
    else $(this).removeClass('incorrect');
};
authorization.signInButtonOnClick = function() {
    console.log('signInButtonOnClick');
    authorization.signType = authorization.signTypes.signIn;
};
authorization.signUpButtonOnClick = function() {
    console.log('signUpButtonOnClick');
    authorization.signType = authorization.signTypes.signUp;
};
authorization.logOutButtonOnClick = function() {
    console.log('logOutButtonOnClick');
    authorization.signType = authorization.signTypes.logOut;
    window.location.href = authorization.signTypes.logOut.url;
};
authorization.onSubmit = async function(event) {
    if (authorization.signType === authorization.signTypes.logOut) return;
    // Getting data
    var unsortedValues = $(this).serializeArray();
    var values = {};
    for (var i in unsortedValues) values[unsortedValues[i].name] = unsortedValues[i].value;
    var inputs = {
        login: $(this).find('input[name=login]'),
        password: $(this).find('input[name=password]'),
    };
    // Validation
    var isCorrectForm = true;
    if (!authorization.fieldCheck.login(values.login)) {
        inputs.login.addClass('incorrect');
        isCorrectForm = false;
    }
    else inputs.login.removeClass('incorrect');
    if (!authorization.fieldCheck.password(values.password)) {
        inputs.password.addClass('incorrect');
        isCorrectForm = false;
    }
    else inputs.password.removeClass('incorrect');
    if (!isCorrectForm) return false;
    // Password encrypting
    var buffer = new TextEncoder("utf-8").encode(values.password);
    if (window.crypto.subtle === undefined) {
        console.log('Connection not secure, cannot encode password');
        return false;
    }
    values.password = await window.crypto.subtle.digest("SHA-256", buffer);
    values.password = Array.prototype.map.call(
        new Uint8Array(values.password), x => ('00' + x.toString(16)).slice(-2)
    ).join('');
    // values.password = new TextDecoder("utf-8").decode(values.password);
    // Sending data
    if (authorization.signType === null) {
        console.log('POST URL is not specified.');
        return;
    }
    var jsonedData = JSON.stringify(values);
    console.log(authorization.signType);
    var responce = await fetch(authorization.signType.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: jsonedData,
        credentials: 'include',
    });
    if (responce.redirected === true) {
        window.location.href = responce.url;
        return;
    }
    responce = await responce.json();
    // Checking form for errors
    if (!responce.isCorrectForm) {
        for (var element in values) {
            if (responce[element] === undefined) inputs[element].addClass('incorrect');
        }
        return false;
    }
    if (responce.errorDescription !== undefined) {
        var error_description = $(this).find('a.error_description');
        if (error_description.length === 0) {
            $(this).append(`<a class="error_description">${responce.errorDescription}</a>`);
        }
        else error_description.text(responce.errorDescription);
    }
    // Setting cookie
    // for (var cookieName in responce.cookies) {
    //     var cookie = responce.cookies[cookieName];
    //     window.main.cookie.setCookie(cookieName, cookie.value, cookie.options);
    // }
    // Updating page
    // window.location.href = '/authorization';
};