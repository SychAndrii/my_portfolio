//lang switcher
const lang_switchers = document.querySelectorAll('.lang-switcher');
lang_switchers.forEach((lang_switcher) => {
    const lang_container = lang_switcher.nextElementSibling;
    let container_is_shown = false;
    lang_switcher.addEventListener('click', (e) => {
        e.preventDefault();
        if(!container_is_shown) {
            lang_container.style.display = "block";
            lang_container.style.opacity = '1';
        }
        else {
            lang_container.style.opacity = '0';
            lang_container.style.display = "none";
        }
        container_is_shown = !container_is_shown;
    });
});

//page translation
document.querySelectorAll('.lang-container__item').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        sendJSON(getSwitchLanguageObject(link), '/choose-lang')
        .then((response) => response.json())
        .then((obj) => translatePage(obj))
        .catch((err) => console.log(err))
    })
})

function getSwitchLanguageObject(link) {
    const obj = {};
    obj.language = link.dataset.lang;
    obj.address = location.pathname;
    return obj;
}

function translatePage(translation) {
    for (const selector in translation) {
        if (Object.hasOwnProperty.call(translation, selector)) {
            const elements = document.querySelectorAll(selector);
            for (let index = 0; index < translation[selector].length; index++) {
                elements[index].innerHTML = translation[selector][index];
            }
        }
    }
}

//right menu
const rightMenuButton = document.querySelector('.header__menu-button');
const rightMenu = document.querySelector('.right-menu');
const blackCover = document.querySelector('.right-menu-black-cover');
rightMenuButton.addEventListener('click', showRightMenu);

const hideMenuButton = document.querySelector('.right-menu__hide-button');
hideMenuButton.addEventListener('click', hideRightMenu);

function showRightMenu(e) {
    rightMenu.style.display = 'block';
    blackCover.style.display = 'block';
    blackCover.style.opacity = 0.5;
    disableScroll();
}

function hideRightMenu(e) {
    rightMenu.style.display = 'none';
    blackCover.style.display = 'none';
    enableScroll();
}

window.addEventListener('resize', () => {
    if(window.innerWidth > 710) {
        hideRightMenu();
    }
});


//general
function sendJSON(obj, href) {
    const request = new Request(href, { 
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        } 
    });
    return fetch(request);
}

//disabling scrolling
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.removeEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}