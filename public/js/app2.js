var app = {

    init: function() {
        if (!this.supportsSVG()) {
            this.sizeSVG();
        }

        window.onload = function() {
            if (!app.oldIEV(['MSIE 9', 'MSIE 8', 'MSIE 7.'])) {
                new WOW().init();
            }

            app.sizeIntro();

            if (app.oldIEV(['MSIE 9'])) {
                document.documentElement.className = "ieGarbage";
            }

            var H = document.documentElement;
            H.className = H.className.replace(/\bno-js\b/, 'js');
            H.className = H.className.replace(/\bfouc\b/, 'js');

            app.applyAnimations();
        };


        window.onresize = function() {
            if (!app.supportsSVG()) {
                app.sizeSVG();
            }

            app.applyAnimations();

        };

        // window.onscroll = function() {
        //     var currentYPos = currentYPosition();
        //     if (currentYPos > elmYPosition('work-experience', { padding: 165 })) {
        //         // apply class
        //         var _elem = document.getElementById('resume').className = 'active';
        //     }

        // };  

        if (!this.oldIEV(['MSIE 8', 'MSIE 7.'])) {
            window.addEventListener("orientationchange", function() {
                if (!app.supportsSVG()) {
                    app.sizeSVG();
                }

                app.applyAnimations();

            }, false);
        }

        this.goBtn();
        this.resumeBtn();
        this.contactBtn();
        this.logoBtn();
        this.navBar();

    },



    navBar: function() { // if modern browser
        if (!this.oldIEV(['MSIE 8', 'MSIE 7.'])) {
            // when the user scrolls to a designated point
            window.addEventListener("scroll", function() {
                // vars
                var scrollDistance = window.innerHeight,
                    scrollY = app.currentYPosition();

                // if the y offset is equal to the window height - 75px
                if (scrollY > (scrollDistance - 70)) {
                    // display the fixed navbar
                    app.fixNavbar(true);
                } else {
                    // remove the fixed navbar
                    app.fixNavbar(false);
                }

            }, false);
        }

    },

    fixNavbar: function(arg) {
        var navbar = document.getElementById('navbar'),
            body = document.getElementsByTagName('body')[0];

        if (arg === true) {
            navbar.className = 'navbar navbar-default navbar-fixed-top animation';
        } else {
            navbar.className = 'navbar navbar-default';
        }

    },

    sizeIntro: function() {
        var wH = document.documentElement.clientHeight;
        document.getElementById('intro').style.height = wH + 'px';
    },

    currentYPosition: function() {

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
    },

    oldIEV: function(versions) {
        var IE = navigator.appVersion,
            versions = (versions === undefined ? ['MSIE 9', 'MSIE 8', 'MSIE 7.'] : versions),
            oldIE = false;

        for (var i = 0; i < versions.length; i++) {
            if (IE.indexOf(versions[i]) != -1) {
                oldIE = true;
            }
        }

        return oldIE;
    },

    isSafari: function() {
        var safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (safari) {
            return true;
        } else {
            return false;
        }

    },

    isGarbage: function() {
        var rv = -1; // Return value assumes failure.

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
    },

    applyAnimations: function() {
        var svg = (this.supportsSVG() ? true : false),
            safari = (this.isSafari() ? true : false),
            garbage = (this.isGarbage() <= 11 ? true : false),
            desktop = (this.device() === 'desktop' ? true : false),
            handheld = (this.device() === 'handheld' ? true : false);

        if (svg === true) {
            if (safari === true) {
                document.getElementById('jk-logo').className = 'animation ' + (desktop === true ? 'sf-logo-custom' : 'sm-logo-custom');
                document.getElementById('jk-bracket').className = 'animation ' + (desktop === true ? 'sf-bracket-custom' : 'sm-bracket-custom');
            } else if (this.isGarbage) {
                document.getElementById('jk-logo').className = 'animation ' + (desktop === true ? 'sf-logo-custom' : 'sm-logo-custom');
                document.getElementById('jk-bracket').className = 'animation ' + (desktop === true ? 'sf-bracket-custom' : 'sm-bracket-custom');
            } else {
                document.getElementById('jk-logo').className = 'animation logo-custom';
                document.getElementById('jk-bracket').className = 'animation bracket-custom';
            }
        }

        document.getElementById('fed').className = 'type-custom';

        var timeout = 3000;

        // new animations
        setTimeout(function() {
            document.getElementById('fed').className = 'erase-custom';            
        }, timeout);

        setTimeout(function() {
            document.getElementById('fed').innerHTML = 'back-end developer <span>|</span>';            
            document.getElementById('fed').className = 'type-custom';
        }, timeout + 1750);

        setTimeout(function() {
            document.getElementById('fed').className = 'erase-custom';            
        }, timeout + 1750 + 2750);  

        setTimeout(function() {
            document.getElementById('fed').innerHTML = 'full-stack developer <span>|</span>';            
            document.getElementById('fed').className = 'type-custom';
        }, timeout + 1750 + 2750 + 1750);              

    },

    supportsSVG: function() {
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
    },

    sizeSVG: function() {
        /**
         * This function could be significantly improved 
         * if all fall backs are given the same naming convention
         * and replce the below code with a loop to replace .svg
         * with .png.  And to append @#x depending on device dimensions 
         */

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

    },

    goBtn: function() {
        var goBtn = document.getElementById('go');

        goBtn.onclick = function(e) {
            if (!app.oldIEV()) {
                e.preventDefault();
            }

            app.smoothScrollTo('about', 800, true, app.fixNavbar);
        };

    },

    resumeBtn: function() {
        var resumeBtn = document.getElementById('resume');

        resumeBtn.onclick = function(e) {
            if (!app.oldIEV()) {
                e.preventDefault();
            }

            app.smoothScrollTo('work-experience', 800, { padding: 95 });
        };

    },

    contactBtn: function() {
        var contactBtn = document.getElementById('contact');

        contactBtn.onclick = function(e) {
            if (!app.oldIEV()) {
                e.preventDefault();
            }

            // scroll to footer, pass in some options
            app.smoothScrollTo('footer', 800, {
                elem: 'contact-info',
                animation: 'bounce',
                padding: 65
            }, app.addAnimation);
        };

    },

    logoBtn: function() {
        if (!app.oldIEV(['MSIE 8', 'MSIE 7.'])) {
            var logo = document.getElementsByClassName('nav-logo')[0];

            logo.onclick = function(e) {
                if (!app.oldIEV()) {
                    e.preventDefault();
                }

                app.smoothScrollTo('intro', 800, true);
            };

        }

    },

    smoothScrollTo: function(eID, duration, options, callback) {
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
            to = this.elmYPosition(eID, options),
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
    },

    device: function() {
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
    },

    elmYPosition: function(eID, options) {
        if (typeof(options) !== 'object') {
            options = undefined;
        }

        // vars
        var elm = document.getElementById(eID),
            y = elm.offsetTop - (options !== undefined ? options.padding : 65),
            node = elm;

        while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        }

        return y;
    },

    addAnimation: function(options) {
        document.getElementById(options.elem).className = 'animated ' + options.animation;

        app.removeClasses(options, 3000);
    },

    removeClasses: function(options, timeout) {
        if (typeof timeout === 'undefined') {
            timeout = 0;
        }

        setTimeout(function() {
            document.getElementById(options.elem).className = '';
        }, timeout);

    }

};

var requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

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

app.init();

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
