// DOM Elements
const form = document.getElementById("contactForm");
const formResponse = document.getElementById("formResponse");

const popupContactForm = document.getElementById("popupContactForm");
const popupGiving = document.getElementById("popupGiving");
const menuBtn = document.getElementById("menu");
const contactButtons = Array.from(document.querySelectorAll("button"))
    .filter(button => button.textContent.trim().toLowerCase() === "contact");
const giveButtons = Array.from(document.querySelectorAll("button"))
    .filter(button => button.textContent.trim().toLowerCase() === "giving");

const closeContactBtn = document.getElementById("closeContact");
const closeGivingBtn = document.getElementById("closeGiving");
const closeMenuBtn = document.getElementById("closeMenu");

const nextBtn = document.getElementById('next');
const pauseBtn = document.getElementById('pause');
const prevBtn = document.getElementById('prev');

const carousel = document.querySelector('.carousel');
const slider = carousel.querySelector('.list');
const thumbnailBorder = document.querySelector('.carousel .thumbnail');
const thumbnailItems = Array.from(thumbnailBorder.querySelectorAll('.item'));
const timeDisplay = document.querySelector('.carousel .time');

// Timer settings
const TIME_RUNNING = 3000;
const TIME_AUTO_NEXT = 30000;
const TIME_PRIORITY = 60000;
let isPaused = false;
let autoNextTimeout;

// Initialize
const initializeAutoNext = () => {
    return setTimeout(() => {
        nextBtn.click();
    }, TIME_PRIORITY);
};

let runNextAuto = initializeAutoNext();

// Event Listeners
nextBtn.addEventListener('click', () => showSlider('next'));
prevBtn.addEventListener('click', () => showSlider('prev'));

pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '►' : '||';
    if (!isPaused) {
        nextBtn.click();
    } else {
        clearTimeout(runNextAuto);
    }
});

thumbnailItems.forEach((item) => {
    item.addEventListener('click', () => {
        const currentIndex = Array.from(thumbnailBorder.querySelectorAll('.item')).indexOf(item);
        showSlider('thumb', currentIndex + 1);
    });
});


contactButtons.forEach(button => {
    button.addEventListener('click', () => {
        isPaused = true;
        pauseBtn.textContent = '►';
        clearTimeout(runNextAuto);
        popupContactForm.style.display = "flex";
    });
});

giveButtons.forEach(button => {
    button.addEventListener('click', () => {
        isPaused = true;
        pauseBtn.textContent = '►';
        clearTimeout(runNextAuto);
        popupGiving.style.display = "flex";
    });
});

menuBtn.addEventListener('click', () => {
    popupMenu.style.display = "flex";
})

closeContactBtn.addEventListener('click', () => {
    popupContactForm.style.display = "none";
});

closeGivingBtn.addEventListener('click', () => {
    popupGiving.style.display = "none";
});

closeMenuBtn.addEventListener('click', () => {
    popupMenu.style.display = "none";
});

document.querySelectorAll('.menu-link, .menu-button').forEach(item => {
    item.addEventListener('click', function() {
        popupMenu.style.display = "none";
    });
});

window.addEventListener('click', event => {
    if (event.target === popupContactForm) {
        popupContactForm.style.display = "none";
    } else if (event.target === popupGiving) {
        popupGiving.style.display = "none";
    }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        form.style.display = "none";
        formResponse.style.display = "flex";
        formResponse.textContent = response.ok 
            ? "Thank you for your message!" 
            : "An error occurred. Please try again.";
        form.reset();
    } catch (error) {
        formResponse.style.display = "flex";
        formResponse.textContent = "An error occurred. Please try again.";
    }
});

let cycleCount = 0;
let holdSwipe = false;

// Functions
function showSlider(type, index) {
    const sliderItems = Array.from(slider.querySelectorAll('.item'));
    const currentThumbnails = Array.from(thumbnailBorder.querySelectorAll('.item'));

    if (type === 'next') {
        cycleCount = 0;
        slider.appendChild(sliderItems[0]);
        thumbnailBorder.appendChild(currentThumbnails[0]);
        carousel.classList.add('next');
        holdSwipe = true;
    } else if (type === 'prev') {
        cycleCount = 0;
        slider.prepend(sliderItems[sliderItems.length - 1]);
        thumbnailBorder.prepend(currentThumbnails[currentThumbnails.length - 1]);
        carousel.classList.add('prev');
        holdSwipe = true;
    } else {
        handleThumbnailClick(index, sliderItems, currentThumbnails); 
    }

    resetSliderState();
    if (!isPaused) {
        resetAutoNext();
    }
}

function handleThumbnailClick(index, sliderItems, thumbnailItems) {
    const classes = ['next', 'second', 'third'];

    // Clear the carousel's previous class
    carousel.className = carousel.className.replace(/\bnext|second|third|prev\b/g, '');

    for (let i = 0; i < index; i++) {
        slider.appendChild(sliderItems[i]);
        thumbnailBorder.appendChild(thumbnailItems[i]);
    }
    carousel.classList.add(classes[index - 1]);
    holdSwipe = true;
}

function resetSliderState() {
    clearTimeout(autoNextTimeout);
    autoNextTimeout = setTimeout(() => {
        carousel.classList.remove('next', 'prev', 'second', 'third');
        holdSwipe = false;
    }, TIME_RUNNING);
}

function resetAutoNext() {
    clearTimeout(runNextAuto);
    const currentItem = thumbnailBorder.querySelector('.item:nth-child(4) .content .title').innerText;
    const nextTime = currentItem === "Biblical Studies" ? TIME_PRIORITY : TIME_AUTO_NEXT;

    runNextAuto = setTimeout(() => {
        nextBtn.click();
    }, nextTime);
}

// Ensure the first item is at the back on initialization
thumbnailBorder.appendChild(thumbnailItems[0]);

/*
document.addEventListener('DOMContentLoaded', function () {
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        let startX, startY, endX, endY;
        const SWIPE_THRESHOLD = 50;

        carousel.addEventListener('touchstart', function (e) {
            if (holdSwipe) return; // Ignore if a swipe/transition is already in progress
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        carousel.addEventListener('touchmove', function (e) {
            if (holdSwipe) return; // Ignore if a swipe/transition is already in progress
            e.preventDefault(); // Prevent scrolling while swiping
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
        });

        carousel.addEventListener('touchend', function () {
            if (holdSwipe) return; // Ignore if a swipe/transition is already in progress
            if (typeof startX !== 'undefined' && typeof endX !== 'undefined') {
                const diffX = startX - endX;
                const diffY = startY - endY;

                if (Math.abs(diffX) > Math.abs(diffY)) { // Detect horizontal swipe
                    if (diffX > SWIPE_THRESHOLD) {
                        moveToNextItem(); // Swipe left
                    } else if (diffX < -SWIPE_THRESHOLD) {
                        moveToPreviousItem(); // Swipe right
                    }
                }
            }
            // Reset values
            startX = null;
            startY = null;
            endX = null;
            endY = null;
        });

        function moveToNextItem() {
            if (holdSwipe) return; // Prevent multiple transitions
            showSlider('next');
        }

        function moveToPreviousItem() {
            if (holdSwipe) return; // Prevent multiple transitions
            showSlider('prev');
        }
    } else {
        console.log('Touch events not supported on this device.');
    }
});
*/