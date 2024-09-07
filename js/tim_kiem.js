const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const objectNameDiv = document.getElementById("object-name");
const readButton = document.getElementById("read-object");

let predictions = [];
let readingQueue = [];
let isReading = false;

async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve();
      };
    });
  } catch (error) {
    console.error('Error accessing the camera:', error);
  }
}

async function detectObject() {
  let model;
  try {
    model = await cocoSsd.load();
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
    return;
  }

  async function frameDetection() {
    try {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      predictions = await model.detect(video);
      console.log('Predictions:', predictions);

      const filteredPredictions = applyNMS(predictions);
      console.log('Filtered Predictions:', filteredPredictions);

      if (filteredPredictions.length > 0) {
        const classCounts = countClasses(filteredPredictions);

        filteredPredictions.forEach((prediction) => {
          const [x, y, width, height] = prediction.bbox;
          context.beginPath();
          context.rect(x, y, width, height);
          context.lineWidth = 2;
          context.strokeStyle = "green";
          context.fillStyle = "red";
          context.font = "20px Arial";
          context.stroke();

          // Display object class and confidence score
          const confidence = (prediction.score * 100).toFixed(2);
          context.fillText(`${prediction.class} (${confidence}%)`, x, y > 10 ? y - 5 : 10);
        });

        objectNameDiv.textContent = `Những đồ vật được phát hiện: ${Object.entries(classCounts)
          .map(([className, count]) => `${count} ${className}`)
          .join(", ")}`;
      }

      requestAnimationFrame(frameDetection);
    } catch (error) {
      console.error('Error during detection:', error);
    }
  }

  frameDetection();
}

function countClasses(predictions) {
  const classCounts = {};
  predictions.forEach(prediction => {
    const className = prediction.class;
    classCounts[className] = (classCounts[className] || 0) + 1;
  });
  return classCounts;
}

function applyNMS(predictions, threshold = 0.3) {
  const boxes = predictions.map(p => p.bbox);
  const scores = predictions.map(p => p.score);
  const indices = nonMaxSuppression(boxes, scores, threshold);
  return indices.map(index => predictions[index]);
}

function nonMaxSuppression(boxes, scores, threshold) {
  const indices = [];
  const sortedIndices = scores
    .map((score, index) => ({ score, index }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.index);

  while (sortedIndices.length > 0) {
    const index = sortedIndices.shift();
    const box = boxes[index];
    indices.push(index);

    for (let i = sortedIndices.length - 1; i >= 0; i--) {
      const compareIndex = sortedIndices[i];
      const compareBox = boxes[compareIndex];
      const iou = calculateIoU(box, compareBox);

      if (iou > threshold) {
        sortedIndices.splice(i, 1);
      }
    }
  }

  return indices;
}

function calculateIoU(box1, box2) {
  const [x1, y1, w1, h1] = box1;
  const [x2, y2, w2, h2] = box2;

  const xIntersect = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2));
  const yIntersect = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2));
  const intersection = xIntersect * yIntersect;
  
  const area1 = w1 * h1;
  const area2 = w2 * h2;
  const union = area1 + area2 - intersection;

  return intersection / union;
}

function speak(text) {
  return new Promise((resolve) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.onend = resolve; // Resolve the promise when speech ends
    window.speechSynthesis.speak(speech);
  });
}

async function readAllObjects() {
  if (predictions.length > 0 && !isReading) {
    const classCounts = countClasses(predictions);
    readingQueue = Object.entries(classCounts).map(([className, count]) => `${count} ${className}`);
    isReading = true;
    await speakNextObject();
    isReading = false;
  }
}

async function speakNextObject() {
  if (readingQueue.length > 0) {
    const object = readingQueue.shift();
    await speak(object);
    await speakNextObject(); // Continue to read the next object
  }
}

async function main() {
  await setupCamera();
  detectObject();
}

document.addEventListener("click", readAllObjects);

main();
