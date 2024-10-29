// Kiểm tra hỗ trợ API giọng nói
if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();
  function speakText(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = "vi-VN";
    speech.text = text;
    window.speechSynthesis.speak(speech);
  }

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
    if (command.includes("mở trang chủ")) {
      trangchu();
    }    
    else if (command.includes("nhận dạng cử chỉ tay")) {
      nhan_dang_cu_chi();
    } else if (command.includes("mở mô tả khung cảnh")) {
      motakhungcanh();
    } else if (command.includes("mở nhận diện tiền")) {
      nhandientien();
    } else if (command.includes("mở giọng nói thành chữ viết")) {
      giongnoithanhchuviet();
    }else if (command.includes("mở cảnh báo nguy hiểm")) {
      canhbaonguyhiem();
    } 
    else if (command.includes("mở nhận diện màu sắc")) {
      nhandienmausac();
    }   
    else if (command.includes("mở nhận diện chữ viết")) {
      docchu();
    } else {
      status.textContent = "Không nhận diện được lệnh.";
    }
  }



} else {
  alert("Trình duyệt của bạn không hỗ trợ Web Speech API");
}

// Hàm sử dụng cho các trang khác
function trangchu() {
  window.location.href = "index.html";
  speakText("Đã mở trang chủ");
}

function timdovat() {
  window.location.href = "tim_do_vat.html";
  speakText("Đã mở tìm đồ vật");
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
function nhandienmausac() {
  window.location.href = "nhan_dien_mau_sac.html";
  speakText("Đã mở nhận diện màu sắc");
}
function giongnoithanhchuviet() {
  window.location.href = "giong_noi_thanh_chu_viet.html";
  speakText("Đã mở giọng nói thành chữ viết");
}

function canhbaonguyhiem(){
  window.location.href = "canh_bao_nguy_hiem.html";
  speakText("Đã mở cảnh báo nguy hiểm");
}

document.getElementById("nhan_dien_chu_viet").addEventListener("click", () => {
  docchu();
});

document.getElementById("mo_ta_khung_canh").addEventListener("click", () => {
  motakhungcanh();
});

document.getElementById("tim_do_vat").addEventListener("click", () => {
  timdovat();
});

document.getElementById("nhan_dien_tien").addEventListener("click", () => {
  nhandientien();
});

document
  .getElementById("giong_noi_thanh_chu_viet")
  .addEventListener("click", () => {
    giongnoithanhchuviet();
  });
  
document.getElementById("canh_bao_nguy_hiem").addEventListener("click", () => {
    canhbaonguyhiem();
});
document.getElementById("trang_chu").addEventListener("click", () => {
  trangchu();
});
document.getElementById("nhan_dien_mau_sac").addEventListener("click", () => {
  nhandienmausac();
});