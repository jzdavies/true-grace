// Step 1: Get DOM elements
let popupContactForm = document.getElementById("popupContactForm");
let contactButtons = Array.from(document.querySelectorAll("button")).filter(button => button.textContent.trim().toLowerCase() === "contact".toLowerCase());
let closeBtn = document.getElementById("closePopup");

let nextDom = document.getElementById('next');
let pauseDom = document.getElementById('pause');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeAutoNext = 7000;
let timeBiblicalStudies = 14000;
let isPaused = false;

// When the user clicks the button, open the modal 
contactButtons.forEach(button => {
    button.onclick = function() {
        isPaused = true;
        pauseDom.textContent = '►';
        clearTimeout(runNextAuto);
        popupContactForm.style.display = "flex";
    }
});

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
    popupContactForm.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == popupContactForm) {
        popupContactForm.style.display = "none";
    }
}

const form = document.getElementById("contactForm");
const formResponse = document.getElementById("formResponse");

form.onsubmit = async function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });

    if (response.ok) {
        form.style.display = "none";
        formResponse.style.display = "flex";
        formResponse.innerHTML = "Thank you for your message!";
        form.reset();
    } else {
        formResponse.style.display = "flex";
        formResponse.innerHTML = "An error occurred. Please try again.";
    }
};

nextDom.onclick = function(){
    showSlider('next');    
}

pauseDom.onclick = function(){
    isPaused = !isPaused;
    pauseDom.textContent = isPaused ? '►' : '||';
    if (!isPaused) {
        nextDom.click();
    } else {
        clearTimeout(runNextAuto);
    }
}

prevDom.onclick = function(){
    showSlider('prev');    
}

let runTimeOut;
let runNextAuto = setTimeout(() => {
    nextDom.click();
}, timeBiblicalStudies);

function showSlider(type){
    let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');
    
    if(type === 'next'){
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
    } else {
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
    }

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    }, timeRunning);

    if (!isPaused) {
        clearTimeout(runNextAuto);

        // Check if the current item is the Biblical Studies item
        let currentItem = thumbnailBorderDom.querySelector('.item:nth-child(4) .content .title').innerText;
        if (currentItem === "Biblical Studies") {
            runNextAuto = setTimeout(() => {
                nextDom.click();
            }, timeBiblicalStudies);
        } else {
            runNextAuto = setTimeout(() => {
                nextDom.click();
            }, timeAutoNext);
        }
    }
}