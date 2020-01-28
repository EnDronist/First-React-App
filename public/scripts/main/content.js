if (!('main' in window)) window.main = {};
var content = window.main.content = {};
content.pageNumber;
content.postsDisplayCount;
content.pageNumberOnClick = function() {
    console.log('pageNumberOnClick');
    var pageNumber = content.pageNumber;
    var postsDisplayCount = content.postsDisplayCount;
    pageNumber = $(this).text();
    location.href = `?pageNumber=${pageNumber}&postsDisplayCount=${postsDisplayCount}`;
};
content.postsDisplayCountOnClick = function() {
    console.log('postsDisplayCountOnClick');
    var pageNumber = content.pageNumber;
    var postsDisplayCount = content.postsDisplayCount;
    var pageFirstPostNumber = (pageNumber - 1) * postsDisplayCount + 1;
    console.log('pageFirstPostNumber ' + pageFirstPostNumber);
    postsDisplayCount = $(this).text();
    pageNumber = Math.floor((pageFirstPostNumber - 1) / postsDisplayCount + 1);
    console.log('pageNumber ' + pageNumber);
    location.href = `?pageNumber=${pageNumber}&postsDisplayCount=${postsDisplayCount}`;
};