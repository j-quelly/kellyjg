// todo: event listener fallbacks for older browsers // orientation change?
// todo: comment
// todo: lint/hint/style guide
var App = (function() {

    /*
     * Constructor
     */
    var App = function() {
        // size SVG's
        sizeSVG();

        /*
         * Events 
         */
        if (window.addEventListener) {
            window.addEventListener('load', loadApp, false);
            window.addEventListener('resize', resizeApp, false);
            window.addEventListener('orientationchange', resizeApp, false);
        } else {            
            window.attachEvent('onload', loadApp);
            window.attachEvent('onresize', resizeApp);
            window.attachEvent('orientationchange', resizeApp);
        }

        // init buttons
        btn('go', 'about', 800, true, fixNavbar);
        btn('resume', 'work-experience', 800, { padding: 95 });
        btn('contact', 'footer', 800, {
                elem: 'contact-info',
                animation: 'bounce',
                padding: 65
            },
            App.prototype.addAnimation);
        btn('nav-logo', 'intro', 800, true);

        // init navbar?
        // todo: confirm what this is for
        navBar();

    };

    /*
     * Public methods
     */
    App.prototype = (function() {

        // public - check version of IE
        var oldIEV = function(versions) {
            var IE = navigator.appVersion,
                versions = (versions === undefined ? ['MSIE 9', 'MSIE 8', 'MSIE 7.'] : versions),
                oldIE = false;

            for (var i = 0; i < versions.length; i++) {
                if (IE.indexOf(versions[i]) != -1) {
                    oldIE = true;
                }
            }

            return oldIE;
        };

        // public - check if client is safari
        var isSafari = function() {
            var safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            if (safari) {
                return true;
            } else {
                return false;
            }

        };

        // public - check if garbage client
        var isGarbage = function() {
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
        };

        // public - get type of device
        var device = function() {
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
        };

        // public - check if the client supports SVG's
        var supportsSVG = function() {
            return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
        };

        // public - scrollTo Method
        var smoothScrollTo = function(eID, duration, options, callback) {
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
                to = App.prototype.elmYPosition(eID, options),
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

        };

        // public method - add animation to elem
        var addAnimation = function(options) {
            // todo: should be checking options object...

            document.getElementById(options.elem).className = 'animated ' + options.animation;

            // todo: is this correct?
            App.prototype.removeClasses(options, 3000);
        };

        // public method - remove class from element
        var removeClasses = function(options, timeout) {
            if (typeof timeout === 'undefined') {
                timeout = 0;
            }

            setTimeout(function() {
                document.getElementById(options.elem).className = '';
            }, timeout);

        };

        // public - get Y POS
        var currentYPosition = function() {

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

        };

        var elmYPosition = function(eID, options) {
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
        };

        var requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        // make methods public
        return {
            oldIEV: oldIEV,
            device: device,
            isGarbage: isGarbage,
            isSafari: isSafari,
            supportsSVG: supportsSVG,
            smoothScrollTo: smoothScrollTo,
            addAnimation: addAnimation,
            removeClasses: removeClasses,
            currentYPosition: currentYPosition,
            elmYPosition: elmYPosition,
            requestAnimFrame: requestAnimFrame
        };

    })();


    /*
     * Private methods
     */

    // private - size SVGs if not supported
    function sizeSVG() {
        // if the client does not support SVG's then resize
        if (!App.prototype.supportsSVG()) {
            var wW = window.innerWidth,
                vectors = document.getElementsByTagName('img');

            // loop thru collection of vectors
            for (var i = 0; i < vectors.length; i++) {
                var node = vectors[i].attributes.src.nodeValue,
                    val = node.slice(0, node.length - 4);

                // 1200 & up
                if (wW >= 1200) {
                    node = val + '@3x.png'
                }
                // 992px and up
                else if (wW <= 1199 && wW >= 992) {
                    node = val + '@3x.png'
                }
                // 768px and up
                else if (wW <= 991 && wW >= 768) {
                    node = val + '@3x.png'
                }
                // mobile
                else {
                    node = val + '@1x.png'
                }

            }
        }

    }

    // private - size the intro
    function sizeIntro() {
        var wH = document.documentElement.clientHeight;
        document.getElementById('intro').style.height = wH + 'px';
    }

    // private - apply intro animations
    function applyAnimations() {
        var svg = (App.prototype.supportsSVG() ? true : false),
            safari = (App.prototype.isSafari() ? true : false),
            garbage = (App.prototype.isGarbage() <= 11 ? true : false),
            desktop = (App.prototype.device() === 'desktop' ? true : false),
            handheld = (App.prototype.device() === 'handheld' ? true : false);

        if (svg === true) {
            if (safari === true) {
                document.getElementById('jk-logo').className = 'animation ' + (desktop === true ? 'sf-logo-custom' : 'sm-logo-custom');
                document.getElementById('jk-bracket').className = 'animation ' + (desktop === true ? 'sf-bracket-custom' : 'sm-bracket-custom');
            } else if (garbage) {
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

    }

    // private - prepare application
    function loadApp() {
        // check if modern browser
        if (!App.prototype.oldIEV(['MSIE 9', 'MSIE 8', 'MSIE 7.'])) {
            new WOW().init();
        }

        // size the intro
        sizeIntro();

        // apply ieGarbage class when IE9
        if (App.prototype.oldIEV(['MSIE 9'])) {
            document.documentElement.className = "ieGarbage";
        }

        // apply fouc and no-js class
        var H = document.documentElement;
        H.className = H.className.replace(/\bno-js\b/, 'js');
        H.className = H.className.replace(/\bfouc\b/, 'js');

        applyAnimations();

    }

    // private - invoke when resizing the application
    function resizeApp() {
        // resize svg's
        sizeSVG();

        applyAnimations();

    }

    // private - fixes navbar
    function fixNavBar(arg) {
        var navbar = document.getElementById('navbar'),
            body = document.getElementsByTagName('body')[0];

        if (arg === true) {
            navbar.className = 'navbar navbar-default navbar-fixed-top animation';
        } else {
            navbar.className = 'navbar navbar-default';
        }

    }

    // private method replaces 4 methods for buttons
    function btn(elem, scrollTo, timeout, options, cb) {
        var btn = document.getElementById(elem) || document.getElementsByClassName(elem)[0];

        if (window.addEventListener) {
	        btn.addEventListener('click', function(e) {
	            if (!App.prototype.oldIEV()) {
	                e.preventDefault();
	            }

	            App.prototype.smoothScrollTo(scrollTo, timeout, options, cb);

	        }, false);        	
        } else {
        	// todo: test that this works and that e arg is not null
        	btn.attachEvent('onclick', function(e) {
	            if (!App.prototype.oldIEV()) {
	                e.preventDefault();
	            }

	            App.prototype.smoothScrollTo(scrollTo, timeout, options, cb);        		
        	});
        }

    }

    // private - nav bar
    function navBar() { // if modern browser
    	if (window.addEventListener) {
            // when the user scrolls to a designated point
            window.addEventListener("scroll", function() {
                // vars
                var scrollDistance = window.innerHeight,
                    scrollY = App.prototype.currentYPosition();

                // if the y offset is equal to the window height - 75px
                if (scrollY > (scrollDistance - 70)) {
                    // display the fixed navbar
                    fixNavbar(true);
                } else {
                    // remove the fixed navbar
                    fixNavbar(false);
                }

            }, false);
    	} else {
            window.attachEvent("onscroll", function() {
                // vars
                var scrollDistance = window.innerHeight,
                    scrollY = App.prototype.currentYPosition();

                // if the y offset is equal to the window height - 75px
                if (scrollY > (scrollDistance - 70)) {
                    // display the fixed navbar
                    fixNavbar(true);
                } else {
                    // remove the fixed navbar
                    fixNavbar(false);
                }

            });
    	}
    }

    // private - fix nav bar
    function fixNavbar(arg) {
        var navbar = document.getElementById('navbar'),
            body = document.getElementsByTagName('body')[0];

        if (arg === true) {
            navbar.className = 'navbar navbar-default navbar-fixed-top animation';
        } else {
            navbar.className = 'navbar navbar-default';
        }

    }

    return App;

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

// analytics
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

// instantiate new app
var derp = new App();