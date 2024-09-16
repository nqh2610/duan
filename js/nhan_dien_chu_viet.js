document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const resultElement = document.getElementById("result");
  const statusMessageElement = document.getElementById("status-message");

  // Hàm kiểm tra xem thiết bị có phải là di động không
  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  // Yêu cầu quyền truy cập vào camera
  const videoConstraints = isMobileDevice()
    ? { facingMode: { exact: "environment" } } // Camera phía sau cho thiết bị di động
    : "user"; // Camera trước cho thiết bị không phải di động

  navigator.mediaDevices
    .getUserMedia({ video: videoConstraints })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("Lỗi khi truy cập camera: ", err);
    });

  // Chụp ảnh và thực hiện OCR
  const captureImage = () => {
    // Hiển thị thông báo trạng thái
    statusMessageElement.style.display = "block";
    // Thông báo bắt đầu nhận dạng chữ
    const startRecognitionUtterance = new SpeechSynthesisUtterance(
      "Bắt đầu nhận dạng chữ"
    );
    startRecognitionUtterance.lang = "vi"; // Đặt ngôn ngữ là Tiếng Việt
    window.speechSynthesis.speak(startRecognitionUtterance);

    // Đợi một chút để đảm bảo thông báo hoàn tất trước khi chụp ảnh
    setTimeout(() => {
      // Đặt kích thước canvas phù hợp với kích thước video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Vẽ khung hình video hiện tại lên canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Chuyển đổi hình ảnh canvas thành ma trận OpenCV để xử lý thêm
      let img = cv.imread(canvas);

      // Chuyển đổi thành ảnh đen trắng
      cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);

      // Áp dụng GaussianBlur để giảm nhiễu
      let ksize = new cv.Size(5, 5);
      cv.GaussianBlur(img, img, ksize, 0, 0, cv.BORDER_DEFAULT);

      // Áp dụng ngưỡng nhị phân để tăng cường độ tương phản giữa văn bản và nền
      cv.threshold(img, img, 128, 255, cv.THRESH_BINARY);

      // Vẽ lại hình ảnh đã xử lý lên canvas
      cv.imshow(canvas, img);

      // Giải phóng bộ nhớ bằng cách xóa ma trận img
      img.delete();

      // Thực hiện OCR bằng Tesseract.js
      Tesseract.recognize(
        canvas,
        "eng+vie", // Bao gồm ngôn ngữ Tiếng Anh và Tiếng Việt
        {
          logger: (info) => console.log(info),
        }
      )
        .then(({ data: { text } }) => {
          resultElement.textContent = text;

          // Tự động phát hiện ngôn ngữ
          detectLanguage(text)
            .then((lang) => {
              // Đọc văn bản bằng SpeechSynthesis API với ngôn ngữ đã phát hiện
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = lang;
              window.speechSynthesis.speak(utterance);
            })
            .catch((err) => {
              console.error("Lỗi khi phát hiện ngôn ngữ: ", err);
            });
        })
        .catch((err) => {
          console.error("Lỗi khi thực hiện OCR: ", err);
        })
        .finally(() => {
          // Ẩn thông báo trạng thái sau khi quá trình OCR hoàn tất
          statusMessageElement.style.display = "none";
        });
    }, 1000); // Điều chỉnh độ trễ nếu cần
  };
  const mainElement = document.querySelector("main");

  // Thêm sự kiện cho các sự kiện click và touch
  mainElement.addEventListener("click", (event) => {
    captureImage();
  });

  mainElement.addEventListener("touchstart", (event) => {
    captureImage();
  });

  // Khởi tạo Hammer.js để phát hiện doubletap
  const hammer = new Hammer(mainElement);
  hammer.on("doubletap", (e) => {
    window.speechSynthesis.cancel();    
  });

  // Hàm phát hiện ngôn ngữ
  function detectLanguage(text) {
    return new Promise((resolve, reject) => {
      // Phát hiện ngôn ngữ đơn giản dựa trên sự hiện diện của các ký tự hoặc mẫu nhất định
      if (/[\u00C0-\u017F]/.test(text)) {
        resolve("vi"); // Phát hiện ký tự Tiếng Việt
      } else {
        resolve("en"); // Mặc định là Tiếng Anh nếu không phát hiện được
      }
    });
  }
});

window.addEventListener("beforeunload", (event) => {
  // Dừng bất kỳ tổng hợp giọng nói nào đang diễn ra
  window.speechSynthesis.cancel();
});
