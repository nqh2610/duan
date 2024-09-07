// Kiểm tra hỗ trợ API giọng nói
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    const status = document.getElementById('status');
    const content = document.getElementById('content');

    recognition.onstart = () => {
        status.textContent = 'Đang nghe...';
    };

    recognition.onend = () => {
        recognition.start(); // Tự động bắt đầu nghe lại
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        status.textContent = 'Bạn đã nói: ' + transcript;
        handleCommand(transcript);
    };

    recognition.start();

    // Hàm xử lý lệnh giọng nói
    function handleCommand(command) {
        if (command.includes('tìm đồ vật')) {
            tim_do_vat()
        } else if (command.includes('nhận dạng cử chỉ')) {
            nhan_dang_cu_chi()
        }
        else if (command.includes('đọc chữ')) {
            docchu()
        }
        else {
            status.textContent = 'Không nhận diện được lệnh.';
        }
    }    

    function speakText(text) {
        const speech = new SpeechSynthesisUtterance();
        speech.lang = 'vi-VN';
        speech.text = text;
        window.speechSynthesis.speak(speech);
    }

} else {
    alert('Trình duyệt của bạn không hỗ trợ Web Speech API');
}

// Hàm sử dụng cho các trang khác
function tim_do_vat() {
    window.location.href='tim_kiem.html';
    speakText('Đã tìm đồ vật');
}

function nhan_dang_cu_chi() {
    window.location.href='nhan_dang_cu_chi.html';
    speakText('Nhận dạng cử chỉ tay');
}

function docchu() {
    window.location.href='docchu.html';
    speakText('Đã đọc chữ hình ảnh');
}
// Thêm sự kiện cho các nút
document.getElementById('tim_do_vat').addEventListener('click', () => {
    tim_do_vat();
});

document.getElementById('nhan_dang_cu_chi').addEventListener('click', () => {
    nhan_dang_cu_chi();
});

document.getElementById('docchu').addEventListener('click', () => {
    docchu();
});