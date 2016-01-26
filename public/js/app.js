window.onload = function() {
    // get window height and adjust introduction panel
    sizeIntro();

    // display the website
    var H = document.documentElement;
    H.className = H.className.replace(/\bno-js\b/, 'js');
    H.style.opacity = 1;

    // add class to intro logo
    document.getElementById('jk-logo').className = 'logo-animated logo-custom';
    document.getElementById('jk-bracket').className = 'logo-animated bracket-custom';

};

window.onresize = function() {
    sizeIntro();
};


/**
 * Events
 */

// when the user clicks on the scroll down button
var goBtn = document.getElementById('scrollDown');
goBtn.onclick = function() {
    window.smoothScroll('navbar');
};


/**
 * Functions
 */

// get window height and adjust introduction panel
function sizeIntro() {
    var wH = window.innerHeight;
    document.getElementById('intro').style.height = wH + 'px';
}

// scroll to element
window.smoothScroll = function(target) {
    alert();
    var scrollContainer = document.getElementById(target);
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop === 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    scroll = function(c, a, b, i) {
        i++;
        if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function() {
            scroll(c, a, b, i);
        }, 20);
    };

    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
};
