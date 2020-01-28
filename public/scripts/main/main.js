$(document).ready(() => {
    // content
    $('article#page_options #page_numbers div a').click(window.main.content.pageNumberOnClick)
        .css('cursor', 'pointer');
    window.main.content.pageNumber = $('article#page_options #page_numbers div a.selected').text();
    $('article#page_options #posts_display_counts div a').click(window.main.content.postsDisplayCountOnClick)
        .css('cursor', 'pointer');
    window.main.content.postsDisplayCount = $('article#page_options #posts_display_counts div a.selected').text();
    // authorization
    var authorization = $('aside #authorization_form');
    authorization.find('input[name]').on('input', window.main.authorization.fieldTextInputCheck);
    authorization.find('#sign_in_button').click(window.main.authorization.signInButtonOnClick)
        .css('cursor', 'pointer');
    authorization.find('#sign_up_button').click(window.main.authorization.signUpButtonOnClick)
        .css('cursor', 'pointer');
    authorization.find('#log_out_button').click(window.main.authorization.logOutButtonOnClick)
        .css('cursor', 'pointer');
    authorization.submit(function(event) {
        var onSubmit = window.main.authorization.onSubmit.bind(this);
        onSubmit(event); return false;
    });
});