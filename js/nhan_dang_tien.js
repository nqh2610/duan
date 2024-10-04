const URL = "https://teachablemachine.withgoogle.com/models/_VoeOrhBw/";

let model, webcam, labelContainer, maxPredictions, highestPrediction, highestProbability;

// Automatically call init when the page loads
window.onload = init;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
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

  // Kiểm tra thiết bị có hỗ trợ cảm ứng hay không
  const isTouchDevice = 'ontouchstart' in document.documentElement;

  // Hàm đọc kết quả dự đoán
  const handlePrediction = () => {
    if (highestPrediction && highestProbability >= 0.8 && highestPrediction!=="0") {
      const text = highestPrediction
      speakText(text)
    } else {      
      const text = "Chưa nhận ra số tiền";        
      speakText(text)
    }
  };

  // Xử lý sự kiện cho cả thiết bị cảm ứng và máy tính
  const mainElement = document.querySelector('main');
  if (isTouchDevice) {
    mainElement.addEventListener('touchstart', handlePrediction);
  }
  mainElement.addEventListener('click', handlePrediction);
}

async function predict() {
  const canvas = document.getElementById("canvas");
  const prediction = await model.predict(canvas);

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

  
  if (highestProbability >= 0.8 && highestPrediction!=="0") {
    document.getElementById("label-container").innerHTML = 
      "Kết quả: " + highestPrediction + " (" + (highestProbability * 100).toFixed(2) + "%)";      
  } else {
    document.getElementById("label-container").innerHTML = 
      "Chưa nhận diện số tiền";
  }
}
