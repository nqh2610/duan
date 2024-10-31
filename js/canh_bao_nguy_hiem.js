//const URL = "https://teachablemachine.withgoogle.com/models/nNHhnhCqW/";
//const URL = "https://teachablemachine.withgoogle.com/models/g7vAykMkm/"
let model, webcam, labelContainer, maxPredictions, highestPrediction, highestProbability;
let lastSpokenTime = 0; // Theo dõi thời gian của cảnh báo được nói lần cuối

// Tự động gọi hàm init khi trang được tải
window.onload = init;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Tải mô hình và metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Cài đặt webcam
  const video = document.createElement("video");
  video.setAttribute("playsinline", "true");
  video.setAttribute("autoplay", "true");
  video.setAttribute("muted", "true");
  video.width = 640;
  video.height = 480;
  video.setAttribute("hidden", "true");
  document.body.appendChild(video);

  // Phát hiện nếu người dùng đang sử dụng thiết bị di động
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Truy cập camera phù hợp: camera phía sau cho di động, camera mặc định cho desktop
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
      console.error("Lỗi khi truy cập camera:", error);
    });

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Vòng lặp dự đoán và vẽ webcam
  async function loop() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    await predict();
    window.requestAnimationFrame(loop);
  }
}

async function predict() {
  const canvas = document.getElementById("canvas");
  const prediction = await model.predict(canvas);

  // Mảng chứa các đối tượng phát hiện với xác suất >= 80%
  let detectedObjects = [];

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability >= 0.8 && prediction[i].className !== "0") {
      detectedObjects.push({
        name: prediction[i].className,
        probability: prediction[i].probability,
      });
    }
  }

  // Hiển thị các đối tượng phát hiện với xác suất >= 80%
  if (detectedObjects.length > 0) {
    let resultText = "";
    let detectedSpeechText = "Cẩn thận, phát hiện có ";

    detectedObjects.forEach((obj, index) => {    
      resultText += obj.name + " (" + (obj.probability * 100).toFixed(2) + "%)<br>";

      // Thêm từng đối tượng vào văn bản nói
      if (index === detectedObjects.length - 1) {
        detectedSpeechText += obj.name + "."; // Thêm dấu chấm sau đối tượng cuối cùng
      } else {
        detectedSpeechText += obj.name + ", "; // Thêm dấu phẩy giữa các đối tượng
      }    
    });

    document.getElementById("label-container").innerHTML = resultText;

    // Tổng hợp giọng nói cho tất cả các đối tượng phát hiện
    const currentTime = new Date().getTime();
    if (currentTime - lastSpokenTime > 9000) {
      speakText(detectedSpeechText);     
      lastSpokenTime = currentTime;
    }
  } else {
    // Xóa nội dung label container nếu không phát hiện đối tượng với độ chính xác cao
    document.getElementById("label-container").innerHTML = "Không phát hiện nguy hiểm";
  }
}
