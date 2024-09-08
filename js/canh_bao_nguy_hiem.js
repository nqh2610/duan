const URL = "https://teachablemachine.withgoogle.com/models/s5TLjVsw2/";

let model, webcam, labelContainer, maxPredictions, highestPrediction, highestProbability;
let lastSpokenTime = 0; // Track the time of the last spoken alert

// Automatically call init when the page loads
window.onload = init;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load the model and metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup webcam
  const video = document.createElement("video");
  video.setAttribute("playsinline", "true");
  video.setAttribute("autoplay", "true");
  video.setAttribute("muted", "true");
  video.width = 640;
  video.height = 480;
  video.setAttribute("hidden", "true");
  document.body.appendChild(video);

  // Detect if the user is on a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Access the appropriate camera: rear for mobile, default for desktop
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: isMobile ? { exact: "environment" } : "user",
      },
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      video.onloadedmetadata = () => {
        window.requestAnimationFrame(loop);
      };
    })
    .catch((error) => {
      console.error("Error accessing camera:", error);
    });

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Prediction and webcam drawing loop
  async function loop() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    await predict();
    window.requestAnimationFrame(loop);
  }
}

async function predict() {
  const canvas = document.getElementById("canvas");
  const prediction = await model.predict(canvas);

  // Array to hold detected objects with probability >= 80%
  let detectedObjects = [];

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability >= 0.8) {
      detectedObjects.push({
        name: prediction[i].className,
        probability: prediction[i].probability,
      });
    }
  }

  // Display detected objects with probability >= 80%
  if (detectedObjects.length > 0) {
    let resultText = "";
    let detectedSpeechText = "Cẩn thận, phát hiện có ";

    detectedObjects.forEach((obj, index) => {
      resultText += obj.name + " (" + (obj.probability * 100).toFixed(2) + "%)<br>";

      // Add each object to the speech text
      if (index === detectedObjects.length - 1) {
        detectedSpeechText += obj.name + "."; // Add period after the last object
      } else {
        detectedSpeechText += obj.name + ", "; // Add comma between objects
      }
    });

    document.getElementById("label-container").innerHTML = resultText;

    // Speech synthesis for all detected objects
    const currentTime = new Date().getTime();
    if (currentTime - lastSpokenTime > 9000) {
      const detectedSpeech = new SpeechSynthesisUtterance(detectedSpeechText);
      window.speechSynthesis.speak(detectedSpeech);
      lastSpokenTime = currentTime;
    }
  } else {
    // Clear label container if no object is detected with high accuracy
    document.getElementById("label-container").innerHTML = "Không phát hiện có nguy hiểm";
  }
}
