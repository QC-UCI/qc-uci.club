document.addEventListener('DOMContentLoaded', (event) => {
    const textElement = document.getElementById('qcText');

    setTimeout(() => {
        textElement.style.opacity = 1; // Fade in the text after 4 seconds
    }, 4000); // Wait for 4 seconds before starting the fade-in
});
