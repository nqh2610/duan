document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const resultElement = document.getElementById("result");
  const statusMessageElement = document.getElementById("status-message");

  // Function to check if the device is mobile
  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  // Request access to the camera
  const videoConstraints = isMobileDevice()
    ? { facingMode: { exact: "environment" } }
    : "user";

  navigator.mediaDevices
    .getUserMedia({ video: videoConstraints })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("Error accessing camera: ", err);
    });

  // Capture image and perform OCR
  const captureImage = () => {
    // Show the status message
    statusMessageElement.style.display = "block";
    // Announce the start of text recognition
    const startRecognitionUtterance = new SpeechSynthesisUtterance(
      "Bắt đầu nhận dạng chữ"
    );
    startRecognitionUtterance.lang = "vi"; // Set language to Vietnamese
    window.speechSynthesis.speak(startRecognitionUtterance);

    // Delay the image capture slightly to ensure the announcement finishes
    setTimeout(() => {
      // Set canvas size to match video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas image to OpenCV matrix for further processing
      let img = cv.imread(canvas);

      // Apply grayscale conversion
      cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);

      // Apply GaussianBlur to reduce noise
      let ksize = new cv.Size(5, 5);
      cv.GaussianBlur(img, img, ksize, 0, 0, cv.BORDER_DEFAULT);

      // Apply binary thresholding to enhance contrast between text and background
      cv.threshold(img, img, 128, 255, cv.THRESH_BINARY);

      // Draw the processed image back onto the canvas
      cv.imshow(canvas, img);

      // Free up memory by deleting the img matrix
      img.delete();

      // Perform OCR using Tesseract.js
      Tesseract.recognize(
        canvas,
        "eng+vie", // Include English and Vietnamese languages
        {
          logger: (info) => console.log(info),
        }
      )
        .then(({ data: { text } }) => {
          resultElement.textContent = text;

          // Automatically detect language
          detectLanguage(text)
            .then((lang) => {
              // Read text using SpeechSynthesis API with detected language
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = lang;
              window.speechSynthesis.speak(utterance);
            })
            .catch((err) => {
              console.error("Error detecting language: ", err);
            });
        })
        .catch((err) => {
          console.error("Error performing OCR: ", err);
        })
        .finally(() => {
          // Hide the status message after OCR process completes
          statusMessageElement.style.display = "none";
        });
    }, 1000); // Adjust the delay as needed
  };
  const mainElement = document.querySelector("main");

  // Add event listener for click and touch events
  mainElement.addEventListener("click", (event) => {
    captureImage();
  });

  mainElement.addEventListener("touchstart", (event) => {
    captureImage();
  });

  // Initialize Hammer.js for doubletap detection
  const hammer = new Hammer(mainElement);
  hammer.on("doubletap", (e) => {
    window.speechSynthesis.cancel();    
  });

  // Function to detect language
  function detectLanguage(text) {
    return new Promise((resolve, reject) => {
      // Simple language detection based on the presence of certain characters or patterns
      if (/[\u00C0-\u017F]/.test(text)) {
        resolve("vi"); // Detects Vietnamese characters
      } else if (/[\u0400-\u04FF]/.test(text)) {
        resolve("ru"); // Example for Russian
      } else {
        resolve("en"); // Default to English if not detected
      }
    });
  }
});

window.addEventListener("beforeunload", (event) => {
  // Stop any ongoing speech synthesis
  window.speechSynthesis.cancel();
});
