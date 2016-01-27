/**
 * jQuery free js
 */


window.onload = function() {
    // get window height and adjust introduction panel
    sizeIntro();

    // display the website
    var H = document.documentElement;
    H.className = H.className.replace(/\bno-js\b/, 'js');
    H.style.opacity = 1;

    // add class to intro logo
    document.getElementById('jk-logo').className = 'animation logo-custom';
    document.getElementById('jk-bracket').className = 'animation bracket-custom';

};

window.onresize = function() {
    // get window height and adjust introduction panel
    sizeIntro();
};


/**
 * Events
 */

// when the user clicks on the scroll down button
var goBtn = document.getElementById('go');
goBtn.onclick = function() {
    smoothScroll('about');
};

// when the user scrolls to a certain point
window.addEventListener("scroll", function() {
    var scrollDistance = window.innerHeight;
    if (window.scrollY > scrollDistance) {
        fixNavbar(true);
    } else {
        fixNavbar(false);
    }
}, false);


/**
 * Functions
 */

// a function to make the navbar fixed
function fixNavbar(arg) {
    // cache elements
    var navbar = document.getElementById('navbar');
    var body = document.getElementsByTagName('body')[0];

    if (arg === true) {
        navbar.className = 'navbar navbar-default navbar-fixed-top animation';
        body.className = 'fixed-navbar';
    } else {
        navbar.className = 'navbar navbar-default';
        body.className = '';
    }
    console.log('make u myne');
}

// get window height and adjust introduct ion panel
function sizeIntro() {
    var wH = window.innerHeight;
    document.getElementById('intro').style.height = wH + 'px';
}

// get current y position
function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

// get element Y position
function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    }
    return y;
}

// scroll to element
function smoothScroll(eID) {
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
        scrollTo(0, stopY);
        return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY += step;
            if (leapY > stopY) leapY = stopY;
            timer++;
        }
        return;
    }
    for (var j = startY; j > stopY; j -= step) {
        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        leapY -= step;
        if (leapY < stopY) leapY = stopY;
        timer++;
    }
}
