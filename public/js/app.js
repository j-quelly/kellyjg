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

    // size logo
    sizeLogo();

    // display the website
    var H = document.documentElement;
    H.className = H.className.replace(/\bno-js\b/, 'js');
    H.style.opacity = 1;

    // apply animations to the intro logo
    applyAnimations();

};

window.onresize = function() {
    // size logo
    sizeLogo();

    // apply animations to the intro logo
    applyAnimations();

};

window.addEventListener("orientationchange", function() {
    // size logo
    sizeLogo();

    // apply animations to the intro logo
    applyAnimations();
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

// when the user clicks on the logo
var logo = document.getElementsByClassName('nav-logo')[0];
logo.onclick = function() {
    // scroll to introduction
    smoothScroll('intro');
};


// when the user scrolls to a certain point
window.addEventListener("scroll", function() {
    var scrollDistance = window.innerHeight,
        scrollY = currentYPosition();

    if (scrollY > (scrollDistance - 75)) {
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
    // // vars
    // var wW = window.innerWidth,
    //     jk = document.getElementById('jk-logo-fb'),
    //     bracket = document.getElementById('jk-bracket-fb');

    // // 1200 & up
    // if (wW >= 1200) {
    //     jk.src = 'images/jk-logo-white@3x.png';
    //     bracket.src = 'images/bracket-white@3x.png';
    // }
    // // 992px and up
    // else if (wW <= 1199 && wW >= 992) {
    //     jk.src = 'images/jk-logo-white@3x.png';
    //     bracket.src = 'images/bracket-white@3x.png';
    // }
    // // 768px and up
    // else if (wW <= 991 && wW >= 768) {
    //     jk.src = 'images/jk-logo-white@3x.png';
    //     bracket.src = 'images/bracket-white@3x.png';
    // }
    // // mobile
    // else {
    //     jk.src = 'images/jk-logo-white@1x.png';
    //     bracket.src = 'images/bracket-white@1x.png';
    // }

}

// a function to get the device type
function device() {
    // vars
    var wW = window.innerWidth;

    // 1200 & up
    if (wW >= 1200) {
        return 'desktop';
    }
    // 992px and up
    else if (wW <= 1199 && wW >= 992) {
        return 'desktop';
    }
    // 768px and up
    else if (wW <= 991 && wW >= 768) {
        return 'desktop';
    }
    // mobile
    else {
        return 'handheld';
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

// a function to check if the browser is safari
function isSafari() {
    var safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (safari) {
        return true;
    } else {
        return false;
    }
}

// a function to check version of IE
function isGarbage() {
    var rv = -1; // Return value assumes failure.
    console.log(navigator.appVersion);
    if (navigator.appName === 'Microsoft Internet Explorer') {

        var ua = navigator.userAgent,
            re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");

        if (re.exec(ua) !== null) {
            rv = parseFloat(RegExp.$1);
        }
    } else if (navigator.appName === "Netscape") {
        /// in IE 11 the navigator.appVersion says 'trident'
        /// in Edge the navigator.appVersion does not say trident
        if (navigator.appVersion.indexOf('Trident') === -1) rv = 12;
        else rv = 11;
    }

    return rv;
}

// a function to check if the browser support SVG
function supportsSVG() {
    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
}

// a function to intelligently apply animations to the intro logo
function applyAnimations() {

    // setup some vars
    var svg = (supportsSVG() ? true : false),
        safari = (isSafari() ? true : false),
        garbage = (isGarbage() <= 11 ? true : false),
        desktop = (device() === 'desktop' ? true : false),
        handheld = (device() === 'handheld' ? true : false);

    // does the device support SVG's?
    if (svg === true) {
        if (safari === true) {
            document.getElementById('jk-logo').className = 'animation ' + (desktop === true ? 'sf-logo-custom' : 'sm-logo-custom');
            document.getElementById('jk-bracket').className = 'animation ' + (desktop === true ? 'sf-bracket-custom' : 'sm-bracket-custom');
        } else if (isGarbage) {
            document.getElementById('jk-logo').className = 'animation ' + (desktop === true ? 'sf-logo-custom' : 'sm-logo-custom');
            document.getElementById('jk-bracket').className = 'animation ' + (desktop === true ? 'sf-bracket-custom' : 'sm-bracket-custom');
        } else {
            document.getElementById('jk-logo').className = 'animation logo-custom';
            document.getElementById('jk-bracket').className = 'animation bracket-custom';
        }
    } else {
        // do some other hacky bullshit?
    }

    document.getElementById('fed').className = 'logo-animated type-custom';

}
