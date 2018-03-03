/*
 * App Class
 */
// todo: improve degredation with try/catch - see js book
// todo: improve events - - see js book
// todo: improve performance see JSBP pdfs
var App = (function() {

    /*
     * App Constructor
     */
    var App = function() {
        // if SVG's are not supported then replace with PNG based on window size
        sizeSVG();

        /*
         * Events   
         */
        this.bindEvent('load', loadApp, false);
        this.bindEvent('resize', resizeApp, false);
        this.bindEvent('orientationchange', resizeApp, false);

        // init app buttons
        btn('go', 'about', 800, true, fixNavbar);
        btn('resume', 'work-experience', 800, { padding: 95 });
        btn('contact', 'footer', 800, {
                elem: 'contact-info',
                animation: 'bounce',
                padding: 65
            },
            App.prototype.addAnimation);
        btn('nav-logo', 'intro', 800, true);

        // binds scroll event listener for displaying primary navigation
        navBar();
    };

    /*
     * Public methods
     */
    App.prototype = (function() {

        /*
            @name bindEvent 
            @desc Better event binding with IE-8 fallback
            @returns {void} 
        */
        var bindEvent = function(event, method, flow) {
            if (window.addEventListener) {
                window.addEventListener(event, method, flow);
            } else {
                window.attachEvent('on' + event, method);
            }
        };

        /*
            @name oldIEV 
            @desc Checks the current user-agent version and returns true if matches array of 
                  Internet Explorer versions passed to the function.  If no versions are passed
                  the function will default to predefined versions of IE that are not supported.

            @param {array} browsers - An array of Internet Explorer versions denoted 'MSIE #'

            @returns {boolean} 
        */
        var oldIEV = function(browsers) {
            var IE = navigator.appVersion,
                versions = (browsers === undefined ? ['MSIE 9', 'MSIE 8', 'MSIE 7.'] : browsers),
                oldIE = false;

            for (var i = 0; i < versions.length; i++) {
                if (IE.indexOf(versions[i]) !== -1) {
                    oldIE = true;
                }
            }

            return oldIE;
        };


        /*
            @name isSafari 
            @desc Checks if user-agent is Safari. Used with other methods to apply browser
                  specific fixes.

            @returns {boolean} 
        */
        var isSafari = function() {
            var safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            if (safari) {
                return true;
            } else {
                return false;
            }

        };


        /*
            @name isGarbage 
            @desc Get the current version of Internet Explorer

            @returns {int} Version number of IE; 5,6,7,8,9,10,11...
        */
        var isGarbage = function() {
            // return value assumes failure
            var rv = -1;

            if (navigator.appName === 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent,
                    re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');

                if (re.exec(ua) !== null) {
                    rv = parseFloat(RegExp.$1);
                }

            } else if (navigator.appName === 'Netscape') {
                /// in IE 11 the navigator.appVersion says 'trident'
                /// in Edge the navigator.appVersion does not say trident
                if (navigator.appVersion.indexOf('Trident') === -1) {
                    rv = 12;
                } else {
                    rv = 11;
                }
            }

            return rv;
        };


        /*
            @name device 
            @desc Determines what type of device is viewing the application.

            @returns {string} Type of device based on window size.
        */
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


        /*
            @name supportsSVG 
            @desc Checks if user-agent supports scalable vector graphics

            @returns {boolean} 
        */
        var supportsSVG = function() {
            return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
        };


        /*
            @name smoothScrollTo 
            @desc Scrolls to desired element.

            @param {string} eID - Unique identifier for the element scrolled to.
            @param {int} duration - Duration of scroll effect.
            @param {object} options - An object of options to pass to callback.
            @param {function} callback - A callback function to invoke when method completes.
        */
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

            // return current Y position
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

            // define animateScroll function
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

            // invoke animateScroll function
            animateScroll();

        };


        /*
            @name addAnimation 
            @desc Adds animation class to desired element defined in options object.

            @param {object} options - An object of options to pass to function: elem className & animation class
        */
        var addAnimation = function(options) {
            // add class to desired element
            document.getElementById(options.elem).className = 'animated ' + options.animation;

            // invoke removeClasses method
            App.prototype.removeClasses(options, 3000);
        };


        /*
            @name removeClasses 
            @desc Removes all classes from desired element defined in options object.

            @param {object} options - An object of options to pass to function. elem
            @param {int} timeout - Time to wait until class is removed from element.  Helpful for animations.
        */
        var removeClasses = function(options, timeout) {
            if (typeof timeout === 'undefined') {
                timeout = 0;
            }

            setTimeout(function() {
                document.getElementById(options.elem).className = '';
            }, timeout);

        };


        /*
            @name currentYPosition 
            @desc Get the current Y position of the device screen.

            @returns {int} Current Y position of device.
        */
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

        /*
            @name elmYPosition 
            @desc Get the Y position of the desired element.

            @param {string} eID - Unique identifier for element
            @param {options} object - Object of options

            @returns {int} Current Y position of desired element.
        */
        var elmYPosition = function(eID, options) {
            if (typeof(options) !== 'object') {
                options = undefined;
            }

            // vars
            var elm = document.getElementById(eID),
                y = elm.offsetTop - (options !== undefined ? options.padding : 65),
                node = elm;

            while (node.offsetParent && node.offsetParent !== document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            }

            return y;
        };

        /*
            @name requestAnimFrame 
            @desc TODO: Not entirely sure what this does yet...

            @returns {object} 
        */
        var requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        // make methods public
        return {
            bindEvent: bindEvent,
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

    /*
        @name sizeSVG 
        @desc Replace SVG's with .png images.
    */
    function sizeSVG() {

        // console.log('App: ', App);
        // console.log('this: ', this);
        // console.log('self: ', self);
        // console.log('window: ', window);
        // console.log(window.supportsSVG());

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
                    node = val + '@3x.png';
                }
                // 992px and up
                else if (wW <= 1199 && wW >= 992) {
                    node = val + '@3x.png';
                }
                // 768px and up
                else if (wW <= 991 && wW >= 768) {
                    node = val + '@3x.png';
                }
                // mobile
                else {
                    node = val + '@1x.png';
                }

            }
        }

    }

    /*
        @name sizeIntro 
        @desc Adjusts the height of the introduction panel of application.
    */
    function sizeIntro() {
        var wH = document.documentElement.clientHeight;
        document.getElementById('intro').style.height = wH + 'px';
    }


    /*
        @name applyAnimations 
        @desc Applies animations to the introduction logo.

        TODO: this should be improved if possible
    */
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
            } else if (garbage === true) {
                document.getElementById('jk-logo').className = 'animation ' + (desktop === true ? 'sf-logo-custom' : 'sm-logo-custom');
                document.getElementById('jk-bracket').className = 'animation ' + (desktop === true ? 'sf-bracket-custom' : 'sm-bracket-custom');
            } else {
                document.getElementById('jk-logo').className = 'animation logo-custom';
                document.getElementById('jk-bracket').className = 'animation bracket-custom';
            }
        }

        document.getElementById('fed').className = 'type-custom';

/*        var timeout = 3000,
            minDelay = 1750,
            maxDelay = 2750;

        // new animations
        setTimeout(function() {
            document.getElementById('fed').className = 'erase-custom';
        }, timeout);

        setTimeout(function() {
            document.getElementById('fed').innerHTML = 'back-end engineer <span>|</span>';
            document.getElementById('fed').className = 'type-custom';
        }, timeout + minDelay);

        setTimeout(function() {
            document.getElementById('fed').className = 'erase-custom';
        }, timeout + minDelay + maxDelay);

        setTimeout(function() {
            document.getElementById('fed').innerHTML = 'full-stack engineer <span>|</span>';
            document.getElementById('fed').className = 'type-custom';
        }, timeout + minDelay + maxDelay + minDelay);*/

    }


    /*
        @name loadApp 
        @desc Loads the application: Initializes WOW animations, sizes introduction, applies IE classes
              prevents FOUC, adds class for javascript support, applies animations to logo.
    */
    function loadApp() {
        // check if modern browser
        if (!App.prototype.oldIEV(['MSIE 9', 'MSIE 8', 'MSIE 7.'])) {
            new WOW().init();
        }

        // size the intro
        sizeIntro();

        // apply ieGarbage class when IE9
        if (App.prototype.oldIEV(['MSIE 9'])) {
            document.documentElement.className = 'ieGarbage';
        }

        // apply fouc and no-js class
        var H = document.documentElement;
        H.className = H.className.replace(/\bno-js\b/, 'js');
        H.className = H.className.replace(/\bfouc\b/, 'js');

        applyAnimations();

    }


    /*
        @name resizeApp 
        @desc Invokes set of functions when resize event occurs.
    */
    function resizeApp() {
        // resize svg's
        sizeSVG();

        // apply animations to logo
        applyAnimations();

    }


    /*
        @name fixNavbar 
        @desc Fixes the primary navigation in place and adds animation effect to primary navigation.

        @param {boolean} arg - Fixes nav bar when true.
    */
    function fixNavbar(arg) {
        var navbar = document.getElementById('navbar'),
            body = document.getElementsByTagName('body')[0];

        if (arg === true) {
            navbar.className = 'navbar navbar-default navbar-fixed-top animation';
        } else {
            navbar.className = 'navbar navbar-default';
        }

    }


    /*
        @name btn 
        @desc Binds click event listener to a button, scrolls to desired element and 
              invokes a callback if passed to function.

        @param {str} elem - Unique identifier of element or first element of specified class name.
        @param {str} scrollTo - Element to scroll to when click event is fired.
        @param {int} timeout - Passed to smoothScroll function, see documentation.
        @param {object} options - Object of optional arguments for callback function.
        @param {function} cb - Callback function invoked by smoothScrollTo function.  See documentation.
    */
    function btn(elem, scrollTo, timeout, options, cb) {
        var btnElem = document.getElementById(elem) || document.getElementsByClassName(elem)[0];
        // console.log('this: ', this);
        // console.log('self: ', self);   

        if (window.addEventListener) {
            btnElem.addEventListener('click', function(e) {
                if (!App.prototype.oldIEV()) {
                    e.preventDefault();
                }

                App.prototype.smoothScrollTo(scrollTo, timeout, options, cb);

            }, false);
        } else {
            // todo: test that this works and that e arg is not null
            btnElem.attachEvent('onclick', function(e) {
                if (!App.prototype.oldIEV()) {
                    e.preventDefault();
                }

                App.prototype.smoothScrollTo(scrollTo, timeout, options, cb);
            });
        }

        // bind listener for active class in primary navigation
        // activePage(scrollTo);
    }


    function activePage(elem) {
        if (window.addEventListener) {
            // on scroll add active class to primary navigation
            window.addEventListener('scroll', function() {
                // vars
                var currentYPos = App.prototype.currentYPosition() + 42,
                    elemYPos = App.prototype.elmYPosition(elem),
                    navBtn = document.querySelector('a[href="#' + elem + '"]');

                console.log('current y pos: ' + currentYPos);
                // console.log('elem y pos: ' + elemYPos);

                var body = document.body,
                    html = document.documentElement;

                var height = Math.max(body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight);


                // console.log('wh: ' + h);
                // console.log('current y pos: ' + currentYPos);

                // if currentYPos is greater than or equal elemYPos
                // subtract window height

                // if current Y == elemY
                // if (currentYPos >= (elemYPos - (h / 1.5))) {
                if (currentYPos >= elemYPos) {
                    navBtn.className = 'active';
                } else {
                    navBtn.className = '';
                }

                console.log(height);


                if (currentYPos === height) {
                    alert('bottom');
                }

            }, false);
        } else {

        }
    }


    /*
        @name navBar 
        @desc Displays primary navigation if users has scrolled to desired position.

        TODO: this can be improved to pass an argument for desired position?
    */
    function navBar() {
        // if modern browser
        if (window.addEventListener) {
            // when the user scrolls to a designated point
            window.addEventListener('scroll', function() {
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
            window.attachEvent('onscroll', function() {
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

    // make class available to global scope
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
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-73387302-1', 'auto');
ga('send', 'pageview');

// instantiate new app
var derp = new App();
