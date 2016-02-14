/**
 * jQuery free js
 */


// if the browser does not support SVG
if (!supportsSVG()) {
    // place and size the svg fallbacks 
    sizeSVG();
}


/**
 * Events
 */

// once the entire website has loaded
window.onload = function() {
    // if a modern browser
    if (!oldIEV(['MSIE 9', 'MSIE 8', 'MSIE 7.'])) {
        // instantiate the WOW library
        new WOW().init();
    }

    // adjust the intro
    sizeIntro();

    // if IE9 add a class to fix some aesthetics 
    if (oldIEV(['MSIE 9'])) {
        document.documentElement.className = "ieGarbage";
    }

    // cache document element (HTML element)
    var H = document.documentElement;

    // if the window supports javascript then remove no-js class
    H.className = H.className.replace(/\bno-js\b/, 'js');

    // prevent flash of unstyled content (FOUC)    
    H.className = H.className.replace(/\bfouc\b/, 'js');

    // apply animations to the intro logo
    applyAnimations();
};

// when the screen is resized
window.onresize = function() {
    // if the browser does not support SVG
    if (!supportsSVG()) {
        // place the svg fallbacks 
        sizeSVG();
    }

    // reapply animations to the intro logo
    applyAnimations();
};

// if modern browser
if (!oldIEV(['MSIE 8', 'MSIE 7.'])) {
    // add a scroll event listener
    window.addEventListener("orientationchange", function() {
        // if the browser does not support SVG
        if (!supportsSVG()) {
            // place the svg fallbacks 
            sizeSVG();
        }

        // apply animations to the intro logo
        applyAnimations();

    }, false);
}

// cache element
var goBtn = document.getElementById('go');
// when the user clicks on the scroll down button
goBtn.onclick = function(e) {
    // if a modern browser
    if (!oldIEV()) {
        // prevent default event
        e.preventDefault();
    }

    // scroll to the about section
    smoothScrollTo('about', 800, true, fixNavbar);
};

// cache element
var resumeBtn = document.getElementById('resume');
// when the user clicks on the resume button
resumeBtn.onclick = function(e) {
    // if a modern browser
    if (!oldIEV()) {
        // prevent default event
        e.preventDefault();
    }

    // scroll to resume
    smoothScrollTo('work-experience', 800);
};

// cache element
var contactBtn = document.getElementById('contact');
// when the user clicks on the contact button
contactBtn.onclick = function(e) {
    // if a modern browser
    if (!oldIEV()) {
        // prevent default event
        e.preventDefault();
    }

    // scroll to footer, pass in some options
    smoothScrollTo('footer', 800, {
        elem: 'contact-info',
        animation: 'bounce'
    }, addAnimation);
};

// if modern browser
if (!oldIEV(['MSIE 8', 'MSIE 7.'])) {
    // when the user clicks on the logo
    var logo = document.getElementsByClassName('nav-logo')[0];
    logo.onclick = function(e) {
        // if a modern browser
        if (!oldIEV()) {
            // prevent default event
            e.preventDefault();
        }

        // scroll to introduction
        smoothScrollTo('intro', 800);
    };
}

// if modern browser
if (!oldIEV(['MSIE 8', 'MSIE 7.'])) {
    // when the user scrolls to a designated point
    window.addEventListener("scroll", function() {
        // vars
        var scrollDistance = window.innerHeight,
            scrollY = currentYPosition();

        // if the y offset is equal to the window height - 75px
        if (scrollY > (scrollDistance - 70)) {
            // display the fixed navbar
            fixNavbar(true);
        } else {
            // remove the fixed navbar
            fixNavbar(false);
        }

    }, false);
}


/**
 * Functions
 */

// a function to make the navbar fixed
function fixNavbar(arg) {
    // cache elements
    var navbar = document.getElementById('navbar');
    var body = document.getElementsByTagName('body')[0];

    // if the arg is true
    if (arg === true) {
        // apply the classes
        navbar.className = 'navbar navbar-default navbar-fixed-top animation';
    } else {
        // revert back
        navbar.className = 'navbar navbar-default';
    }
}

// get window height and adjust introduct ion panel
function sizeIntro() {
    // vars
    var wH = document.documentElement.clientHeight;

    // adjust the height
    document.getElementById('intro').style.height = wH + 'px';
}

// get current y position
function currentYPosition() {

    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) {
        return self.pageYOffset;
    }

    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
    }

    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) {
        return document.body.scrollTop;
    }

    return 0;
}

// get element Y position
function elmYPosition(eID) {
    // vars
    var elm = document.getElementById(eID),
        y = elm.offsetTop - 65,
        node = elm;

    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    }

    return y;
}

// a function to size the SVG graphics
function sizeSVG() {
    /**
     * This function could be significantly improved 
     * if all fall backs are given the same naming convention
     * and replce the below code with a loop to replace .svg
     * with .png.  And to append @#x depending on device dimensions 
     */

    // vars
    var wW = window.innerWidth,
        jk = document.getElementById('jk-logo'),
        bracket = document.getElementById('jk-bracket'),
        navJK = document.getElementById('nav-jk'),
        navBracket = document.getElementById('nav-bracket');

    // 1200 & up
    if (wW >= 1200) {
        // intro SVG's
        jk.src = 'images/jk-logo-white@3x.png';
        bracket.src = 'images/bracket-white@3x.png';

        // nav SVG's
        navJK.src = 'images/jk-logo-black@1x.png';
        navBracket.src = 'images/bracket-black@1x.png';
    }
    // 992px and up
    else if (wW <= 1199 && wW >= 992) {
        // intro SVG's
        jk.src = 'images/jk-logo-white@3x.png';
        bracket.src = 'images/bracket-white@3x.png';

        // nav SVG's
        navJK.src = 'images/jk-logo-black@1x.png';
        navBracket.src = 'images/bracket-black@1x.png';
    }
    // 768px and up
    else if (wW <= 991 && wW >= 768) {
        // intro SVG's
        jk.src = 'images/jk-logo-white@3x.png';
        bracket.src = 'images/bracket-white@3x.png';

        // nav SVG's
        navJK.src = 'images/jk-logo-black@1x.png';
        navBracket.src = 'images/bracket-black@1x.png';
    }
    // mobile
    else {
        // intro SVG's
        jk.src = 'images/jk-logo-white@1x.png';
        bracket.src = 'images/bracket-white@1x.png';

        // nav SVG's
        navJK.src = 'images/jk-logo-black@1x.png';
        navBracket.src = 'images/bracket-black@1x.png';
    }



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
    // add class
    document.getElementById(options.elem).className = 'animated ' + options.animation;

    // remove class
    removeClasses(options, 3000);
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
    // console.log(navigator.appVersion);
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
    }

    document.getElementById('fed').className = 'type-custom';

}

// a function to check version of IE
function oldIEV(versions) {
    // vars
    var IE = navigator.appVersion;
    if (versions === undefined) {
        versions = ['MSIE 9', 'MSIE 8', 'MSIE 7.'];
    }
    var oldIE = false;

    // loop thru versions
    for (var i = 0; i < versions.length; i++) {
        if (IE.indexOf(versions[i]) != -1) {
            oldIE = true;
        }
    }

    return oldIE;
}

// easing functions http://goo.gl/5HLl8
Math.easeInOutQuad = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
        return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

Math.easeInCubic = function(t, b, c, d) {
    var tc = (t /= d) * t * t;
    return b + c * (tc);
};

Math.inOutQuintic = function(t, b, c, d) {
    var ts = (t /= d) * t,
        tc = ts * t;
    return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
var requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

function smoothScrollTo(eID, duration, options, callback) {
    if (typeof options === 'undefined') {
        options = {};
    }

    // because it's so fucking difficult to detect the scrolling element, just move them all
    function move(amount) {
        document.documentElement.scrollTop = amount;
        document.body.parentNode.scrollTop = amount;
        document.body.scrollTop = amount;
    }

    function position() {
        return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
    }

    // vars
    var start = position(),
        to = elmYPosition(eID),
        change = to - start,
        currentTime = 0,
        increment = 20;
    duration = (typeof(duration) === 'undefined') ? 500 : duration;
    var animateScroll = function() {
        // increment the time
        currentTime += increment;
        // find the value with the quadratic in-out easing function
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        // move the document.body
        move(val);
        // do the animation unless its over
        if (currentTime < duration) {
            requestAnimFrame(animateScroll);
        } else {
            if (callback && typeof(callback) === 'function') {
                // the animation is done so lets callback
                callback(options);
            }
        }
    };
    animateScroll();
}


/**
 * Google Analytics
 */
/*jshint ignore:start */
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-73387302-1', 'auto');
ga('send', 'pageview');
