document.addEventListener("DOMContentLoaded", function() {
  // Danh sách từ khóa và dấu câu tương ứng
  const punctuationMap = {
      "dấu chấm": ".",
      "dấu phẩy": ",",
      "dấu chấm than": "!",
      "dấu chấm hỏi": "?",
      "dấu hai chấm": ":",
  };

  // Hàm thay thế từ khóa bằng dấu câu thực tế
  function replacePunctuationKeywords(text) {
      const sortedKeywords = Object.keys(punctuationMap).sort((a, b) => b.length - a.length);
      for (const keyword of sortedKeywords) {
          const punctuation = punctuationMap[keyword];
          const regex = new RegExp(`\\b${keyword}\\b`, "gi");
          text = text.replace(regex, punctuation);
      }
      return text;
  }

  // Kiểm tra hỗ trợ Web Speech API
  let recognition;
  if ("webkitSpeechRecognition" in window) {
      recognition = new webkitSpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      const resultDiv = document.getElementById("result");
      let currentText = "";

      // Hàm bắt đầu nhận diện giọng nói
      function startRecognition() {
          if (recognition) {
              recognition.start();
          }
      }

      // Hàm dừng nhận diện giọng nói
      function stopRecognition() {
          if (recognition) {
              recognition.stop();
          }
      }

      // Xử lý kết quả nhận diện
      recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          const textWithPunctuation = replacePunctuationKeywords(transcript);
          
          // Xử lý lệnh điều khiển và chuyển hướng nếu cần
          handleCommand(textWithPunctuation);

          // Ghi lại kết quả nhận diện vào văn bản nếu không phải lệnh điều khiển
          if (!textWithPunctuation.includes("mở trang chủ") &&
              !textWithPunctuation.includes("nhận diện cử chỉ tay") &&
              !textWithPunctuation.includes("mở mô tả khung cảnh") &&
              !textWithPunctuation.includes("mở nhận diện tiền") &&
              !textWithPunctuation.includes("mở giọng nói thành chữ viết") &&
              !textWithPunctuation.includes("mở cảnh báo nguy hiểm") &&
              !textWithPunctuation.includes("mở nhận diện màu sắc")) {
              currentText += " " + textWithPunctuation.trim();
              resultDiv.textContent = currentText.trim();
          }
      };

      // Xử lý lỗi
      recognition.onerror = (event) => {
          console.error(event.error);
          resultDiv.textContent = "Có lỗi xảy ra: " + event.error;
      };

      // Hàm đọc văn bản
      function readText(text) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "vi-VN";
          window.speechSynthesis.speak(utterance);
      }

      const mainElement = document.querySelector("main");
      const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      if (isTouchDevice()) {
          mainElement.addEventListener("touchstart", startRecognition);
      } else {
          mainElement.addEventListener("click", startRecognition);
      }

      // Sử dụng Hammer.js để nhận diện doubletap
      const hammer = new Hammer(mainElement);
      hammer.on('doubletap', () => {
          stopRecognition();
          const text = resultDiv.textContent;
          readText(text);
      });

      // Hàm xử lý lệnh giọng nói và điều hướng trang
      function handleCommand(command) {
          if (command.includes("mở trang chủ")) {
              window.location.href = "index.html";
          } else if (command.includes("nhận diện cử chỉ tay")) {
              window.location.href = "nhan_dang_cu_chi.html";
          } else if (command.includes("mở mô tả khung cảnh")) {
              window.location.href = "mo_ta_khung_canh.html";
          } else if (command.includes("mở nhận diện tiền")) {
              window.location.href = "nhan_dien_tien.html";
          } else if (command.includes("mở giọng nói thành chữ viết")) {
              window.location.href = "giong_noi_thanh_chu_viet.html";
          } else if (command.includes("mở cảnh báo nguy hiểm")) {
              window.location.href = "canh_bao_nguy_hiem.html";
          } else if (command.includes("mở nhận diện màu sắc")) {
              window.location.href = "nhan_dien_mau_sac.html";
          } else {
              resultDiv.textContent = "Không nhận diện được lệnh.";
          }
      }

      // Gán sự kiện click vào các nút để thực hiện lệnh
      document.getElementById("trang_chu").addEventListener("click", () => {
          window.location.href = "index.html";
      });

      document.getElementById("nhan_dien_chu_viet").addEventListener("click", () => {
          window.location.href = "nhan_dien_chu_viet.html";
      });

      document.getElementById("mo_ta_khung_canh").addEventListener("click", () => {
          window.location.href = "mo_ta_khung_canh.html";
      });

      document.getElementById("nhan_dien_tien").addEventListener("click", () => {
          window.location.href = "nhan_dien_tien.html";
      });

      document.getElementById("giong_noi_thanh_chu_viet").addEventListener("click", () => {
          window.location.href = "giong_noi_thanh_chu_viet.html";
      });

      document.getElementById("canh_bao_nguy_hiem").addEventListener("click", () => {
          window.location.href = "canh_bao_nguy_hiem.html";
      });

      document.getElementById("nhan_dien_mau_sac").addEventListener("click", () => {
          window.location.href = "nhan_dien_mau_sac.html";
      });
  } else {
      alert("Trình duyệt của bạn không hỗ trợ Web Speech API");
  }
});