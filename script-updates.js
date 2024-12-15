const contactButtons = Array.from(document.querySelectorAll("button"))
    .filter(button => button.textContent.trim().toLowerCase() === "contact");
const giveButtons = Array.from(document.querySelectorAll("button"))
    .filter(button => button.textContent.trim().toLowerCase() === "giving");
const closeContactBtn = document.getElementById("closeContact");
const popupContactForm = document.getElementById("popupContactForm");
const formResponse = document.getElementById("formResponse");
const closeGivingBtn = document.getElementById("closeGiving");
const popupGiving = document.getElementById("popupGiving");
const closeMenuBtn = document.getElementById("closeMenu");
const form = document.getElementById("contactForm");
const menuBtn = document.getElementById("menu");

contactButtons.forEach(button => {
    button.addEventListener('click', () => {
        popupContactForm.style.display = "flex";
    });
});

giveButtons.forEach(button => {
    button.addEventListener('click', () => {
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



