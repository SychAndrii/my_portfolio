const buttons = document.querySelectorAll('.skill-button');
buttons.forEach(b => {
    let openedBlock = false;
    let canUse = true;
    const initialBlockHeight = parseFloat(getComputedStyle(b.parentElement).height);
    b.addEventListener('click', () => {

        processBlock();
    
        function processBlock() {
            if(canUse) {
                if(!openedBlock)
                    increaseBlock();
                else 
                    decreaseBlock();
        
                openedBlock = !openedBlock;
            }
        }
    
        function decreaseBlock() {
                canUse = false;
                const arrow = b.querySelector('.skill-button__arrow');
                arrow.style.transform = 'rotate(0deg)';
                const list = b.nextElementSibling;
                list.style.maxHeight = null;
                list.addEventListener('transitionend', function func() {
                    list.removeEventListener('transitionend', func);
                    canUse = true;
                });
        }
    
        function increaseBlock() {
                canUse = false;
                const arrow = b.querySelector('.skill-button__arrow');
                arrow.style.transform = 'rotate(-180deg)';
                const list = b.nextElementSibling;
                list.style.display = "block";
                if (list.style.maxHeight) {
                    list.style.maxHeight = null;
                } else {
                    list.style.maxHeight = list.scrollHeight + 50 + "px";
                } 
                list.addEventListener('transitionend', function func() {
                    list.removeEventListener('transitionend', func);
                    canUse = true;
                })
        }
    });
});