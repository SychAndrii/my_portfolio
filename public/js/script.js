//lang switcher
const lang_switchers = document.querySelectorAll('.lang-switcher');
const switcher_flags = getSwitcherFlagsArray();
let i = 0;
lang_switchers.forEach((lang_switcher) => {
    const lang_container = lang_switcher.nextElementSibling;
    const switcher_index = i++;
    lang_switcher.addEventListener('click', (e) => {
        e.preventDefault();
        if(!switcher_flags[switcher_index]) 
            displayLangContainer(lang_container);
        else 
            hideLangContainer(lang_container);
        switcher_flags[switcher_index] = !switcher_flags[switcher_index];
    });
});

document.body.addEventListener('click', (e) => {
    if(notLangSwitcher(e.target)) {
        const openedSwitcherIndex = getOpenedLangSwitcherFlag();
        if(openedSwitcherIndex != -1) {
            switcher_flags[openedSwitcherIndex] = false;
            hideLangContainer(lang_switchers[openedSwitcherIndex].nextElementSibling);
        }
    }
}); 

function getOpenedLangSwitcherFlag() {
    return switcher_flags.findIndex(flag => flag);
}

function notLangSwitcher(element) {
    return !element.classList.contains('lang-switcher') && !element.classList.contains('lang-container__item');
}

function getSwitcherFlagsArray() {
    const switcher_flags = [];
    for (let index = 0; index < lang_switchers.length; index++) 
        switcher_flags.push(false);
    return switcher_flags;
}

function hideLangContainer(lang_container) {
    lang_container.style.opacity = '0';
    lang_container.style.display = "none";
}

function displayLangContainer(lang_container) {
    lang_container.style.display = "block";
    lang_container.style.opacity = '1';
    for (const child of lang_container.children) {
        child.children[0].style.opacity = 1;
    }
}

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
    disableScrollEvent();
}

function hideRightMenu(e) {
    rightMenu.style.display = 'none';
    blackCover.style.display = 'none';
    enableScrollEvent();
}

document.body.addEventListener('click', (e) => {
    if(notRightMenu(e.target)) {
        hideRightMenu();
    }
}); 

function notRightMenu(element) {
    return element.classList.contains('right-menu-black-cover');
}

window.addEventListener('resize', () => {
    if(window.innerWidth > 710) {
        hideRightMenu();
    }
});

//intro
const entireCover = document.querySelector('.entire-screen-cover');
const targetLogo = getTargetLogo();
const introContainer = document.querySelector('.intro-container');
const andriiBlock = document.querySelector('.intro-container__andrii'); 
const sychBlock = document.querySelector('.intro-container__sych'); 
const andriiText = document.querySelector('.andrii__text');
const sychText = document.querySelector('.sych__text');
const sychCurtian = document.querySelector('.sych-curtain');
const left = document.querySelector('.header__header__left');
const right = document.querySelector('.header__header__right');
let widthHelper;

window.addEventListener('resize', () => {
    removeIntro();
    setStaticHeaderChildren();
});

startIntro();

function startIntro() {
    disableScrollEvent();
    setIntroSizes();
    setTextSizes();
    setIntroInitialPosition();
    increaseIntro();
    moveIntroBlocksAside();
    moveIntroToTarget();
}

function showEntirePage() {
    setTimeout(() => {
        startMakingPageStatic();
        animateHeaderChildren();
        entireCover.addEventListener('transitionend', () => {
            enableScrollEvent();
            removeIntro();
        });
    }, 1000);
}

function startMakingPageStatic() {
    const entireCover = document.querySelector('.entire-screen-cover');
    entireCover.style.opacity = 0;
    andriiText.style.color = 'rgba(0,0,0,0.8)';
    sychBlock.style.backgroundColor = 'transparent';
    introContainer.style.backgroundColor = 'transparent';
}

function removeIntro() {
    entireCover.remove();
    introContainer.remove();
}

function animateHeaderChildren() {
    right.classList.add('animated-header-children');
    left.classList.add('animated-header-children');
    left.addEventListener('animationend', setStaticHeaderChildren);
}

function setStaticHeaderChildren() {
    if(left.classList.contains('animated-header-children'))
        left.classList.remove('animated-header-children');
    if(right.classList.contains('animated-header-children'))
        right.classList.remove('animated-header-children');
    left.style.flex = '1';
    right.style.flex = '1';
}

function moveIntroToTarget() {
    sychCurtian.addEventListener('transitionend', () => {
        moveIntroContainerToTarget();
        moveBlocksToTarget();
        moveTextsToTarget();
    });
}

function moveIntroContainerToTarget() {
    const targetCoords = targetLogo.getBoundingClientRect();
    introContainer.style.top = targetCoords.top + 'px';
    introContainer.style.left = targetCoords.left + 'px';
    introContainer.style.width = targetCoords.width + 'px';
    introContainer.style.height = targetCoords.height + 'px';
}

function moveBlocksToTarget() {
    const blockWidth = getTargetBlockCoords().width;
    const blockTransition = "left .3s, width .3s";
    sychBlock.style.transition = blockTransition;
    andriiBlock.style.transition = blockTransition;
    sychBlock.style.width = blockWidth + 'px';
    sychBlock.style.left = blockWidth + 5 + 'px';
    andriiBlock.style.width = blockWidth + 'px';
    andriiBlock.style.left = '0px';
    andriiBlock.addEventListener('transitionend', showEntirePage);
}

function getTargetTextCoords() {
    return targetLogo.querySelector('.andrii').getBoundingClientRect();
}

function moveTextsToTarget() {
    const targetTextCoords = getTargetTextCoords();
    const blockWidth = getTargetBlockCoords().width;
    const fontSize = getTargetFontSize();
    sychText.style.fontSize = fontSize + 'px'
    if(getCurrentLogoModifer() == "._small-screen")
        sychText.style.top = '1px';
    andriiText.style.fontSize = fontSize + 'px';
    andriiText.style.left = (blockWidth - targetTextCoords.width) / 2 + 'px';
}

function getTargetBlockCoords() {
    return targetLogo.children[0].getBoundingClientRect();
}

function getTargetFontSize() {
    return getElementProperty(targetLogo.querySelector('.andrii'), 'fontSize');
}

function moveIntroBlocksAside() {
    introContainer.addEventListener('transitionend', function outer() {
        introContainer.removeEventListener('transitionend', outer);
        introContainer.style.backgroundColor = 'black';
        const introWidthHalf = widthHelper / 2;
        andriiBlock.style.left = -introWidthHalf - 5 + 'px';
        sychBlock.style.left = introWidthHalf  + 5 + 'px';
        moveAndriiTextToBlock();
        andriiText.addEventListener('transitionend', function inner() {
            andriiText.removeEventListener('transitionend', inner);
            hideSychCurtain();
        });
    });
}

function hideSychCurtain() {
    if(getCurrentLogoModifer() == "._small-screen") {
        setTimeout(() => {
            sychText.style.opacity = 1;
            sychCurtian.style.height = '0px';
        }, 300);
    }
    else {
        sychText.style.opacity = 1;
        sychCurtian.style.height = '0px';
    }
}

function moveAndriiTextToBlock() {
    andriiText.style.left = (widthHelper - getElementWidth(andriiText)) / 2 + 'px';
}

function increaseIntro() {
    let tempWidth, tempHeight;
    if(window.innerWidth > 500) {
        tempWidth = getElementWidth(targetLogo) * 1.5;
        tempHeight = getElementHeight(targetLogo) * 2;
    }
    else {
        tempWidth = 130;
        tempHeight = 70;
    }
    introContainer.style.width = tempWidth + 'px';
    introContainer.style.height = tempHeight + 'px';
    introContainer.style.opacity = 1;
    if(window.innerWidth > 500)
        introContainer.style.left = getElementProperty(introContainer, 'left') - getElementWidth(introContainer)  + 'px';
    else 
        introContainer.style.left = getElementProperty(introContainer, 'left')  - getElementWidth(introContainer) / 2 + 'px';
    introContainer.style.top = getElementProperty(introContainer, 'top') - getElementHeight(introContainer) * 1.5  + 'px';
}

function getTargetLogo() {
    const modifierClass = getCurrentLogoModifer();
    const targetLogo = document.querySelector('.header__logo' + modifierClass);
    return targetLogo;
}

function getCurrentLogoModifer() {
    return window.innerWidth > 1074 ? "._big-screen" : "._small-screen";
}

function setIntroInitialPosition() {
    const introWidth  = getElementWidth(introContainer);
    const introHeight = getElementHeight(introContainer);
    introContainer.style.left = window.innerWidth / 2 - introWidth / 2 + 'px';
    introContainer.style.top  = window.innerHeight / 2 - introHeight / 2 + 'px';
    console.log('first: ' + introWidth);
    setTextInitialPosition();
}

function setTextSizes() {
    const fontSize = getIntroFontSize();
    andriiText.style.fontSize = fontSize;
    sychText.style.fontSize = fontSize;
}

function getIntroFontSize() {
    if(window.innerWidth > 1074)
        return '6rem';
    if(window.innerWidth <= 1074 && window.innerWidth > 500)
        return '4rem';
    if(window.innerWidth <= 500)
        return '2.5rem';
}

function setIntroSizes() {
    introContainer.style.width  = getElementWidth(targetLogo) * 0.47 + 'px';
    introContainer.style.height = getElementHeight(targetLogo) * 0.625 + 'px';
    introContainer.addEventListener('transitionend', function name() {
        introContainer.removeEventListener('transitionend', name);
        widthHelper = parseFloat(introContainer.style.width);
    });
}

function getIntroWidth() {
    if(window.innerWidth > 1074)
        return 345;
    if(window.innerWidth <= 1074 && window.innerWidth > 500)
        return 225;
    if(window.innerWidth <= 500)
        return 100;
}

function getIntroHeight() {

}

function setTextInitialPosition() {
    andriiText.style.left = -getElementWidth(introContainer) * 4 + 'px';
}

function getElementProperty(element, selector) {
    return parseFloat(getComputedStyle(element)[selector]);
}

function getElementWidth(element) {
    return getElementProperty(element, 'width');
}

function getElementHeight(element) {
    return getElementProperty(element, 'height');
}

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

function enableScrollEvent() {
    $('body').off('scroll mousewheel', disablingScrolling);
}

function disableScrollEvent() {
    $('body').on('scroll mousewheel', disablingScrolling);
}

function disablingScrolling(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}