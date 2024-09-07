const videoElement = document.getElementById("input_video");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const outputText = document.getElementById("output_text");

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

hands.onResults(onResults);

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  videoElement.srcObject = stream;
  return new Promise((resolve) => {
    videoElement.onloadedmetadata = () => {
      resolve();
    };
  });
}

setupCamera().then(() => {
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
  });

  camera.start();
});

let lastRecognizedGesture = null;
let gestureStartTime = null;
const MIN_HOLD_TIME = 1000;
const CONFIDENCE_THRESHOLD = 0.5; // Đặt ngưỡng tin cậy là 90%
let recognitionConfidence = 0;
let isReading = false;

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });

      const recognizedGesture = recognizeGesture(landmarks);
      const currentTime = new Date().getTime();
      recognitionConfidence = calculateConfidence(landmarks);

      if (recognizedGesture) {
        if (recognizedGesture !== lastRecognizedGesture) {
          gestureStartTime = currentTime;
          isReading = false;
        }

        if (
          !isReading &&
          currentTime - gestureStartTime >= MIN_HOLD_TIME &&
          recognitionConfidence >= CONFIDENCE_THRESHOLD
        ) {
          outputText.textContent = `Nhận diện: ${recognizedGesture}`;
          speak(recognizedGesture);
          isReading = true;
        }

        lastRecognizedGesture = recognizedGesture;
      } else {
        lastRecognizedGesture = null;
        isReading = false;
      }

      // Hiển thị phần trăm nhận dạng và cử chỉ
      canvasCtx.font = "30px Arial";
      canvasCtx.fillStyle = "red";
      canvasCtx.fillText(
        `Phát hiện bàn tay: ${(recognitionConfidence * 100).toFixed(2)}%`,
        10,
        40
      );

      if (recognizedGesture) {
        canvasCtx.fillText(`Nhận diện: ${recognizedGesture}`, 10, 80);
      }
    }
  }
  canvasCtx.restore();
}

function recognizeGesture(landmarks) {
  // Kiểm tra vị trí của các ngón tay theo trục y
  const thumbIsUp = landmarks[4].y < landmarks[3].y;
  const thumbIsDown = landmarks[4].y > landmarks[3].y;  // Added for clarity
  const indexIsUp = landmarks[8].y < landmarks[6].y;
  const middleIsUp = landmarks[12].y < landmarks[10].y;
  const ringIsUp = landmarks[16].y < landmarks[14].y;
  const pinkyIsUp = landmarks[20].y < landmarks[18].y;

  // Kiểm tra khoảng cách giữa các ngón tay và sử dụng ngưỡng xác định
  const thumbToIndexDistance = Math.hypot(
    landmarks[4].x - landmarks[8].x,
    landmarks[4].y - landmarks[8].y
  );
  const indexToMiddleDistance = Math.hypot(
    landmarks[8].x - landmarks[12].x,
    landmarks[8].y - landmarks[12].y
  );
  const middleToRingDistance = Math.hypot(
    landmarks[12].x - landmarks[16].x,
    landmarks[12].y - landmarks[16].y
  );
  const ringToPinkyDistance = Math.hypot(
    landmarks[16].x - landmarks[20].x,
    landmarks[16].y - landmarks[20].y
  );

  const THRESHOLD_DISTANCE = 0.09; // Ngưỡng cho khoảng cách giữa các ngón tay
  const CLENCHED_FIST_THRESHOLD = 0.1; // Ngưỡng cho khoảng cách giữa các ngón tay và lòng bàn tay
  const HEART_SHAPE_THRESHOLD = 0.15; // Ngưỡng cho hình dạng trái tim

  // Kiểm tra cử chỉ "Tôi yêu bạn"
  if (thumbIsUp && indexIsUp && !middleIsUp && !ringIsUp && pinkyIsUp &&
      thumbToIndexDistance > THRESHOLD_DISTANCE && indexToMiddleDistance > THRESHOLD_DISTANCE) {
    return "Tôi yêu bạn";
  }
  // Kiểm tra cử chỉ "Xin chào"
  if (thumbIsUp && indexIsUp && middleIsUp && !ringIsUp && !pinkyIsUp &&
      indexToMiddleDistance < THRESHOLD_DISTANCE && middleToRingDistance > THRESHOLD_DISTANCE) {
    return "Xin chào";
  }
  // Kiểm tra cử chỉ "Tạm biệt"
  if (thumbIsUp && indexIsUp && middleIsUp && ringIsUp && pinkyIsUp &&
      indexToMiddleDistance < THRESHOLD_DISTANCE) {
    return "Tạm biệt";
  }
  // Kiểm tra cử chỉ "Cảm ơn"
  if (thumbIsUp && !indexIsUp && !middleIsUp && !ringIsUp && pinkyIsUp) {
    return "Cảm ơn";
  }
  // Kiểm tra cử chỉ "Tôi nhớ bạn"
  if (!thumbIsUp && indexIsUp && middleIsUp && ringIsUp && pinkyIsUp) {
    return "Tôi nhớ bạn";
  }
  // Kiểm tra cử chỉ "tuyệt vời"
  if (thumbIsUp && !indexIsUp && !middleIsUp && !ringIsUp && !pinkyIsUp) {
    return "Tuyệt vời";
  }

  // Kiểm tra cử chỉ "Không thích"
  if (thumbIsDown && !indexIsUp && !middleIsUp && !ringIsUp && !pinkyIsUp) {
    return "Không thích";
  }

  // Check "OK" gesture
  const thumbIsCloseToIndex = thumbToIndexDistance < THRESHOLD_DISTANCE * 2; // Adjust threshold if necessary
  const fingersExtended = middleIsUp && ringIsUp && pinkyIsUp;
  if (thumbIsCloseToIndex && fingersExtended) {
    return "Đồng ý";
  }

  if (thumbIsUp && indexIsUp && middleIsUp && ringIsUp && pinkyIsUp) {
    return "Tôi xin lỗi";
  }

  // Kiểm tra cử chỉ "Thả tim" (Heart Shape)
  const thumbToIndexDistanceClose = thumbToIndexDistance < HEART_SHAPE_THRESHOLD; // Ngưỡng cho hình dạng trái tim
  const allFingersCurled = indexIsUp && !middleIsUp && !ringIsUp && !pinkyIsUp;
  if (thumbToIndexDistanceClose && allFingersCurled) {
    return "Bắn tim";
  }

  return null; // Không nhận diện được cử chỉ
}


function calculateConfidence(landmarks) {
  if (!landmarks || landmarks.length < 21) return 0;

  // Tính độ tin cậy dựa trên sự hiện diện của các điểm mốc
  let validLandmarks = 0;
  landmarks.forEach((landmark) => {
    if (
      landmark.x !== undefined &&
      landmark.y !== undefined &&
      landmark.z !== undefined
    ) {
      validLandmarks++;
    }
  });
  // Đoạn code này đảm bảo tỷ lệ phần trăm nhận dạng từ 0 đến 100%
  return validLandmarks / landmarks.length;
}

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "vi-VN";

  const voices = window.speechSynthesis.getVoices();
  speech.voice = voices[0];

  window.speechSynthesis.speak(speech);
}

function listVoices() {
  // Lấy danh sách các giọng đọc
  const voices = window.speechSynthesis.getVoices();

  // Nếu danh sách giọng đọc chưa được tải, hãy đợi
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = listVoices;
    return;
  }

  // Hiển thị danh sách các giọng đọc
  voices.forEach((voice, index) => {
    console.log(`Voice ${index}:`);
    console.log(`  Name: ${voice.name}`);
    console.log(`  Lang: ${voice.lang}`);
    console.log(`  Default: ${voice.default ? "Yes" : "No"}`);
    console.log("---------------------------");
  });
}
listVoices();
