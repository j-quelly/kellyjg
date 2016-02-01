/**
 * jQuery free js
 */


/**
 * Events
 */

// once the entire website has loaded
window.onload = function() {
    // instantiate WOW library
    new WOW().init();


    // get window height and adjust introduction panel
    sizeIntro();

    // display the website
    var H = document.documentElement;
    H.className = H.className.replace(/\bno-js\b/, 'js');
    H.style.opacity = 1;

    // add class to intro logo
    document.getElementById('jk-logo').className = 'animation logo-custom';
    document.getElementById('jk-bracket').className = 'animation bracket-custom';
    document.getElementById('fed').className = 'logo-animated text-custom';

};

window.onresize = function() {
    // get window height and adjust introduction panel
    // sizeIntro();

    // size logo
    sizeLogo();
};

window.addEventListener("orientationchange", function() {
    // sizeIntro();

    // size logo?
    sizeLogo();
}, false);

// when the user clicks on the scroll down button
var goBtn = document.getElementById('go');
goBtn.onclick = function() {
    // maybe?
    // document.getElementById('about').style.paddingTop = '203.5px';

    // scroll to the about section
    smoothScroll('about');
};

// when the user clicks on the resume button
var resumeBtn = document.getElementById('resume');
resumeBtn.onclick = function() {
    // scroll to resume
    smoothScroll('work-experience');
};

// when the user clicks on the resume button
var contactBtn = document.getElementById('contact');
contactBtn.onclick = function() {
    // scroll to footer, pass in some options
    smoothScroll('footer', {
        elem: 'contact-info',
        animation: 'bounce'
    }, addAnimation);
};

// when the user scrolls to a certain point
window.addEventListener("scroll", function() {
    var scrollDistance = window.innerHeight;
    if (window.scrollY > (scrollDistance - 75)) {
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
    } else {
        navbar.className = 'navbar navbar-default';
    }
}

// get window height and adjust introduct ion panel
function sizeIntro() {
    var wH = document.documentElement.clientHeight;
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
    var y = elm.offsetTop - 70;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    }
    return y;
}

// scroll to element
function smoothScroll(eID, options, cb) {
    // vars
    if (typeof options === 'undefined') {
        options = {};
    }
    var r = false;

    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
        scrollTo(0, stopY);
        r = true;
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
        r = true;
    }
    for (var j = startY; j > stopY; j -= step) {
        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        leapY -= step;
        if (leapY < stopY) leapY = stopY;
        timer++;
    }

    if (r === true) {
        if (typeof cb === "function") {
            cb(options);
        }
        return;
    }
}

// a function to size the logo
function sizeLogo() {
    // get width of window
    var wW = window.innerWidth;

    // 1200 & up
    if (wW >= 1200) {
        console.log('large desktop');
    }
    // 992px and up
    else if (wW <= 1199 && wW >= 992) {
        console.log('desktop');
    }
    // 768px and up
    else if (wW <= 991 && wW >= 768) {
        console.log('tablet');
    }
    // mobile
    else {
        console.log('mobile');
    }
}

// a function to add an animation to an elemet
function addAnimation(options) {
    // wait for the page to scroll down
    setTimeout(function() {
        // add class
        document.getElementById(options.elem).className = 'animated ' + options.animation;

        // remove class
        removeClasses(options, 3000);

    }, 400);
}

// a function to remove animation classes
function removeClasses(options, timeout) {
    // vars
    if (typeof timeout === 'undefined') {
        timeout = 0;
    }

    // add a timeout in the event you want a delay when removing a class
    setTimeout(function() {
        // remove class
        document.getElementById(options.elem).className = '';
    }, timeout);
}
