//slider
let currentIndex = 0;
let counter = 0;
let disabledButton;
const sliderImages = ['/resources/EverlastingSummer/1.jpg', '/resources/EverlastingSummer/2.jpg', '/resources/EverlastingSummer/3.jpg', '/resources/EverlastingSummer/4.jpg', '/resources/EverlastingSummer/5.jpg'];
let direction;
let doneByPage = false;
let pageAmount;
let pagesEnabled = true;
const sliderPages = document.querySelectorAll('.slider__page');
sliderPages.forEach((targetPage) => {
    targetPage.addEventListener('click', () => {
        if(pagesEnabled && targetPageIsNotActive(targetPage)) {
            pagesEnabled = false;
            switchImageByPage(targetPage);
            switchActivePageTo(targetPage);
        }
    });
});

function switchActivePageTo(targetPage) {
    if(targetPageIsNotActive(targetPage)) {
        disableActivePage();
        makePageActive(targetPage);
    }
}



function switchImageByPage(targetPage) {
    let activePageIndex = getActivePageIndex();
    let targetPageIndex = getPageIndex(targetPage);
    direction = targetPageIndex > activePageIndex ? "right" : "left";
    pageAmount = Math.abs(currentIndex - targetPageIndex);
    doneByPage = true;
    slider(null);
}

function targetPageIsNotActive(targetPage) {
    return targetPage != getActivePage();
}

function getActivePageIndex() {
    return getPageIndex(getActivePage());
}

function getPageIndex(page) {
    let pageIndex;
    for (let index = 0; index < sliderPages.length; index++) {
        const element = sliderPages[index];
        if(element == page) {
            pageIndex = index;
            break;
        }
    }
    return pageIndex;
}

function makePageActive(page) {
    page.classList.add('_active-page');
    page.firstElementChild.style.width = "10px";
    page.firstElementChild.style.height = "10px";
    page.firstElementChild.style.opacity = "1";
}

function disableActivePage() {
        const activePage = getActivePage();
        activePage.classList.remove('_active-page');
        activePage.firstElementChild.style.width = "0";
        activePage.firstElementChild.style.height = "0";
        activePage.firstElementChild.style.opacity = "0";
}

function getActivePage() {
    return document.querySelector('._active-page');
}

let currentImage = document.querySelector('._image-current');
let leftImage = document.querySelector('._image-left');
let rightImage = document.querySelector('._image-right');

const leftButton = document.querySelector('._button-left');
leftButton.addEventListener('click', slider);

const rightButton = document.querySelector('._button-right');
rightButton.addEventListener('click', slider);

function slider(e) {
    pagesEnabled = false;
    if(e) {
        direction = e.target == leftButton ? "left" : "right";
        pageAmount = 1;
        doneByPage = false;
    }
    leftButton.removeEventListener('click', slider);
    rightButton.removeEventListener('click', slider);
    const movedImage = direction == "right"  ? rightImage : leftImage;
    currentImage.addEventListener('transitionend', swapImages);
    const currentImageLeftSign = direction == "right" ? "-" : "";
    currentIndex = direction == "left" ? currentIndex - pageAmount : currentIndex + pageAmount;
    currentIndex = currentIndex == -1 ? sliderImages.length - 1 : currentIndex;
    currentIndex = currentIndex == sliderImages.length ? 0 : currentIndex;
    if(doneByPage) {
        assignNewSRCsToImages();
    }
    if(!doneByPage) {
        let pageIndex = currentIndex;
        if(pageIndex == -1)
            pageIndex = sliderPages.length - 1;
        else if(pageIndex == sliderPages.length)
            pageIndex = 0;
        switchActivePageTo(sliderPages[pageIndex]);
    }
    currentImage.style.left = currentImageLeftSign  + "100%";
    movedImage.style.left = "0px";
}

function swapImages() {
    currentImage.removeEventListener('transitionend', swapImages);
    if(direction == "left") {
        rightImage.style.transition = "left .00001s";
        rightImage.style.left = "-100%";
        rightImage.addEventListener('transitionend', function swapping() {
            rightImage.removeEventListener('transitionend', swapping);
            swapLinks();
            leftImage.style.transition = "left 1s";
            doneByPage = false;
            assignNewSRCsToImages();
            leftButton.addEventListener('click', slider);
            rightButton.addEventListener('click', slider);
            pagesEnabled = true;
        });

        function swapLinks() {
            let temp = currentImage;
            currentImage = leftImage;
            leftImage = temp;
            temp = leftImage;
            leftImage = rightImage;
            rightImage = temp;
        }
    }
    else {
        leftImage.style.transition = "left .00001s";
        leftImage.style.left = "100%";
        leftImage.addEventListener('transitionend', function swapping() {
            leftImage.removeEventListener('transitionend', swapping);
            swapLinks();
            rightImage.style.transition = "left 1s";
            doneByPage = false;
            assignNewSRCsToImages();
            leftButton.addEventListener('click', slider);
            rightButton.addEventListener('click', slider);
            pagesEnabled = true;
        });

        function swapLinks() {
            let temp = leftImage;
            leftImage = currentImage;
            currentImage = temp;
            temp = currentImage;
            currentImage = rightImage;
            rightImage = temp;
        }
    }
}

function assignNewSRCsToImages() {
    let leftImageSRC_index, rightImageSRC_index;
    if(!doneByPage) {
        leftImageSRC_index  = currentIndex == 0 ? sliderImages.length - 1 : currentIndex - 1;
        rightImageSRC_index = currentIndex == sliderImages.length - 1 ? 0 : currentIndex + 1;
    }
    else if(doneByPage && direction == "right"){
        leftImageSRC_index  = currentIndex - 1;
        rightImageSRC_index = currentIndex;
    }
    else if(doneByPage && direction == "left") {
        leftImageSRC_index  = currentIndex;
        rightImageSRC_index = currentIndex + 1;
    }
    leftImage.src  = sliderImages[leftImageSRC_index];
    rightImage.src = sliderImages[rightImageSRC_index];
}

setDistanceForPages();
addEventListener('resize', setDistanceForPages);

function setDistanceForPages() {
    const imageContainer = document.querySelector('.current-image-container');
    if(window.innerWidth <= 710) {
        const imgHeight = parseFloat(getComputedStyle(currentImage).getPropertyValue('height'));
        imageContainer.style.height = imgHeight + 'px';
    }
    else {
        imageContainer.style.height = 500 + 'px';
    }
}