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
    // Sắp xếp từ khóa theo chiều dài giảm dần để đảm bảo thay thế chính xác
    const sortedKeywords = Object.keys(punctuationMap).sort((a, b) => b.length - a.length);

    for (const keyword of sortedKeywords) {
        const punctuation = punctuationMap[keyword];
        // Sử dụng biểu thức chính quy để thay thế từ khóa trong văn bản
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        text = text.replace(regex, punctuation);
    }

    return text;
}

// Kiểm tra hỗ trợ Web Speech API
let recognition;
if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "vi-VN"; // Ngôn ngữ Tiếng Việt
    recognition.continuous = false; // Dừng khi không còn nghe thấy gì
    recognition.interimResults = false; // Chỉ lấy kết quả cuối cùng

    const resultDiv = document.getElementById("result");
    let currentText = ""; // Biến lưu trữ nội dung hiện tại

    // Hàm bắt đầu nhận diện giọng nói
    function startRecognition() {
        if (recognition) {
            recognition.start(); // Bắt đầu nghe giọng nói
        }
    }

    // Hàm dừng nhận diện giọng nói
    function stopRecognition() {
        if (recognition) {
            recognition.stop(); // Dừng nhận diện giọng nói
        }
    }
    const mainElement = document.querySelector("main");
    const isTouchDevice = () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    if(isTouchDevice()) {
        // Add touchstart event listener for touch devices
        mainElement.addEventListener("touchstart", startRecognition);
    } else {
        // Add click event listener for non-touch devices
        mainElement.addEventListener("click", startRecognition);
    }

    // Sự kiện khi nhận dạng hoàn thành
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Lấy nội dung giọng nói

        // Thay thế từ khóa bằng dấu câu trong nội dung mới từ giọng nói
        const textWithPunctuation = replacePunctuationKeywords(transcript);

        // Kiểm tra nếu nội dung chứa dấu câu để không thêm khoảng trắng không cần thiết
        if (
            textWithPunctuation.includes(".") ||
            textWithPunctuation.includes(",") ||
            textWithPunctuation.includes("!") ||
            textWithPunctuation.includes("?") ||
            textWithPunctuation.includes(":")
        ) {
            // Nếu có dấu câu, không thêm khoảng trắng trước dấu câu
            currentText += textWithPunctuation;
        } else {
            // Nếu không có dấu câu, thêm khoảng trắng
            currentText += " " + textWithPunctuation.trim();
        }

        // Cập nhật nội dung mới vào resultDiv
        resultDiv.textContent = currentText.trim();
    };

    // Xử lý lỗi
    recognition.onerror = (event) => {
        console.error(event.error);
        resultDiv.textContent = "Có lỗi xảy ra: " + event.error;
    };

    // Hàm đọc văn bản
    function readText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "vi-VN"; // Ngôn ngữ Tiếng Việt
        window.speechSynthesis.speak(utterance);
    }

    const hammer = new Hammer(mainElement);
    //hammer.get('doubletap').set({ enable: true, taps: 2 });
    hammer.on('doubletap', () => {
        stopRecognition(); // Dừng việc nhận diện giọng nói
        const text = document.getElementById("result").textContent;
        readText(text); // Đọc văn bản
    });

} else {
    alert("Trình duyệt của bạn không hỗ trợ Web Speech API");
}