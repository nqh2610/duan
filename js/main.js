// Kiểm tra hỗ trợ API giọng nói
if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "vi-VN";
  recognition.continuous = false;
  recognition.interimResults = false;

  const status = document.getElementById("status");
  const content = document.getElementById("content");

  recognition.onstart = () => {
    status.textContent = "Đang nghe...";
  };

  recognition.onend = () => {
    recognition.start(); // Tự động bắt đầu nghe lại
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    status.textContent = "Bạn đã nói: " + transcript;
    handleCommand(transcript);
  };

  recognition.start();

  // Hàm xử lý lệnh giọng nói
  function handleCommand(command) {
    if (command.includes("mở tìm đồ vật")) {
      tim_do_vat();
    } else if (command.includes("nhận dạng cử chỉ tay")) {
      nhan_dang_cu_chi();
    } else if (command.includes("mở mô tả khung cảnh")) {
      motakhungcanh();
    } else if (command.includes("mở nhận diện tiền")) {
      nhandientien();
    } else if (command.includes("mở giọng nói thành chữ viết")) {
      giongnoithanhchuviet();
    } else if (command.includes("mở nhận diện chữ viết")) {
      docchu();
    } else {
      status.textContent = "Không nhận diện được lệnh.";
    }
  }

  function speakText(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = "vi-VN";
    speech.text = text;
    window.speechSynthesis.speak(speech);
  }
} else {
  alert("Trình duyệt của bạn không hỗ trợ Web Speech API");
}

// Hàm sử dụng cho các trang khác
function tim_do_vat() {
  window.location.href = "tim_kiem.html";
  speakText("Đã mở tìm đồ vật");
}

function nhan_dang_cu_chi() {
  window.location.href = "nhan_dang_cu_chi.html";
  speakText("Đã mở nhận dạng cử chỉ bàn tay");
}

function docchu() {
  window.location.href = "nhan_dien_chu_viet.html";
  speakText("Đã mở nhận diện chữ viết");
}

function motakhungcanh() {
  window.location.href = "mo_ta_khung_canh.html";
  speakText("Đã mở mô tả khung cảnh");
}
function nhandientien() {
  window.location.href = "nhan_dien_tien.html";
  speakText("Đã mở nhận diện tiền");
}

function giongnoithanhchuviet() {
  window.location.href = "giong_noi_thanh_chu_viet.html";
  speakText("Đã mở giọng nói thành chữ viết");
}
// Thêm sự kiện cho các nút
document.getElementById("tim_do_vat").addEventListener("click", () => {
  tim_do_vat();
});

document.getElementById("nhan_dien_chu_viet").addEventListener("click", () => {
  docchu();
});

document.getElementById("mo_ta_khung_canh").addEventListener("click", () => {
  motakhungcanh();
});

document.getElementById("nhan_dien_tien").addEventListener("click", () => {
  nhandientien();
});

document
  .getElementById("giong_noi_thanh_chu_viet")
  .addEventListener("click", () => {
    giongnoithanhchuviet();
  });
