window.onload = function() {
    // get window height and adjust introduction panel
    sizeIntro();

    // display the website
    var H = document.documentElement;
    H.className = H.className.replace(/\bno-js\b/, 'js');
    H.style.opacity = 1;

    // add class to intro logo
    document.getElementById('jk-logo').className = 'animated fadeInDown';
};

window.onresize = function() {
    sizeIntro();
};

function sizeIntro() {
    // get window height and adjust introduction panel
    var wH = window.innerHeight;
    document.getElementById('intro').style.height = wH + 'px';
}
