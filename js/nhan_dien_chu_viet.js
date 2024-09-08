document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
   
    const resultElement = document.getElementById('result');

    // Request access to the camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Error accessing camera: ', err);
        });

    // Capture image and perform OCR
    document.querySelector('main').addEventListener('click', () => {
        // Set canvas size to match video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Perform OCR using Tesseract.js
        Tesseract.recognize(
            canvas,
            'eng+vie', // Include English and Vietnamese languages
            {
                logger: info => console.log(info),
            }
        ).then(({ data: { text } }) => {
            resultElement.textContent = text;

            // Automatically detect language
            detectLanguage(text).then(lang => {
                // Read text using SpeechSynthesis API with detected language
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                window.speechSynthesis.speak(utterance);
            }).catch(err => {
                console.error('Error detecting language: ', err);
            });
        }).catch(err => {
            console.error('Error performing OCR: ', err);
        });
    });

    // Function to detect language (improved implementation)
    function detectLanguage(text) {
        return new Promise((resolve, reject) => {
            // Simple language detection based on the presence of certain characters or patterns
            if (/[\u00C0-\u017F]/.test(text)) {
                resolve('vi'); // Detects Vietnamese characters
            } else if (/[\u0400-\u04FF]/.test(text)) {
                resolve('ru'); // Example for Russian
            } else {
                resolve('en'); // Default to English if not detected
            }
        });
    }
});