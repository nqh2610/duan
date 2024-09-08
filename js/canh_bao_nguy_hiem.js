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

  // Access the webcam
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      video.onloadedmetadata = () => {
        window.requestAnimationFrame(loop);
      };
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

  // Find the highest prediction with probability > 80%
  let maxProbability = 0;
  highestPrediction = "";
  highestProbability = 0;

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability > maxProbability) {
      maxProbability = prediction[i].probability;
      highestPrediction = prediction[i].className;
      highestProbability = prediction[i].probability;
    }
  }

  // Show the highest prediction only if it meets the condition
  if (highestProbability >= 0.8) {
    document.getElementById("label-container").innerHTML = 
      "Kết quả: " + highestPrediction + " (" + (highestProbability * 100).toFixed(2) + "%)";

    // Check if the 5-second delay has passed since the last spoken alert
    const currentTime = new Date().getTime();
    if (currentTime - lastSpokenTime > 9000) {
      // Dynamically announce object detection only if enough time has passed
      const detectedSpeech = new SpeechSynthesisUtterance("Cẩn thận, phát hiện có " + highestPrediction);
      window.speechSynthesis.speak(detectedSpeech);
      lastSpokenTime = currentTime; // Update the last spoken time
    }
  } 
}
