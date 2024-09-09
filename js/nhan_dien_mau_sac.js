document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const colorDisplay = document.getElementById('colorDisplay');
    const colorThief = new ColorThief();

    // Khởi tạo camera
    async function initCamera() {
        try {
            // Kiểm tra nếu là thiết bị di động
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // Nếu là thiết bị di động, sử dụng camera sau
            const constraints = {
                video: isMobile
                    ? { facingMode: { exact: 'environment' } } // Camera sau cho điện thoại
                    : 'user' // Camera mặc định cho laptop
            };

            // Yêu cầu quyền truy cập camera
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            video.play();
        } catch (error) {
            console.error('Error accessing the camera', error);
        }
    }

    // 

    // Tạo danh sách màu và các tên màu
    const colors = {
        "#FFFFFF": "Trắng",
        "#000000": "Đen",
        "#FF0000": "Đỏ",
        "#00FF00": "Xanh lá cây",
        "#0000FF": "Xanh dương",
        "#FFFF00": "Vàng",
        "#FFA500": "Cam",
        "#800080": "Tím",
        "#FFC0CB": "Hồng",
        "#A52A2A": "Nâu",
        "#808080": "Xám",
        "#00FFFF": "Xanh ngọc",
        "#8B4513": "Nâu đậm",
        "#FFD700": "Vàng ánh kim",
        "#FF6347": "Đỏ cà chua",
        "#4682B4": "Xanh da trời",
        "#D3D3D3": "Xám nhạt",
        "#ADFF2F": "Xanh lá mạ",
        "#2E8B57": "Xanh rêu",
        "#B22222": "Đỏ đậm",
        "#D2691E": "Cam đất",
        "#FFFFE0": "Vàng nhạt",
        "#F0E68C": "Vàng nghệ",
        "#191970": "Xanh midnight",
        "#DAA520": "Vàng hoàng gia",
        "#FF4500": "Đỏ cam",
        "#8A2BE2": "Tím xanh",
        "#FF1493": "Hồng đậm",
        "#7FFF00": "Xanh chartreuse",
        "#DC143C": "Đỏ yên chi",
        "#B0E0E6": "Xanh nhạt",
        "#F5DEB3": "Vàng nâu",
        "#FA8072": "Đỏ cam nhạt",
        "#E9967A": "Đỏ san hô nhạt",
        "#20B2AA": "Xanh biển nhạt",
        "#C71585": "Hồng tía",
        "#FF69B4": "Hồng đậm",
        "#BDB76B": "Vàng đậm",
        "#32CD32": "Xanh lime",
        "#F08080": "Hồng nhạt",
        "#9932CC": "Tím đậm",
        "#FF7F50": "Cam san hô",
        "#B0C4DE": "Xanh slate nhạt",
        "#EE82EE": "Tím violet",
        "#9400D3": "Tím sẫm",
        "#00CED1": "Xanh đậm",
        "#FAFAD2": "Vàng nhạt chanh",
        "#7B68EE": "Xanh tím đậm",
        "#F4A460": "Nâu gỗ",
        "#2F4F4F": "Xanh tối",
        "#E0FFFF": "Xanh lơ nhạt",
        "#FFDAB9": "Cam đào",
        "#778899": "Xám xanh",
        "#5F9EA0": "Xanh cadet",
        "#FF00FF": "Hồng fuchsia",
        "#FF8C00": "Cam đậm",
        "#6495ED": "Xanh cornflower",
        "#CD5C5C": "Đỏ Ấn Độ",
        "#B8860B": "Vàng tối",
        "#BA55D3": "Tím orchid",
        "#006400": "Xanh rêu đậm",
        "#6A5ACD": "Xanh tím slate",
        "#FFFACD": "Vàng chanh nhạt",
        "#FFDEAD": "Nâu Navajo",
        "#4B0082": "Tím chàm",
        "#AFEEEE": "Xanh lơ nhạt",
        "#8B008B": "Tím tối",
        "#E6E6FA": "Tím lavender",
        "#B0E57C": "Xanh nhạt",
        "#468499": "Xanh lam nhạt",
        "#DC143C": "Đỏ crimson",
        "#40E0D0": "Xanh ngọc lam",
        "#FF6347": "Đỏ tomato",
        "#8FBC8F": "Xanh sage nhạt",
        "#48D1CC": "Xanh đậm",
        "#FFB6C1": "Hồng nhạt",
        "#800000": "Nâu đỏ",
        "#00FF7F": "Xanh xuân",
        "#DA70D6": "Tím orchid nhạt",
        "#D8BFD8": "Tím thistle",
        "#4169E1": "Xanh hoàng gia",
        "#FFFAF0": "Trắng kem",
        "#DEB887": "Nâu vàng nhạt",
        "#BC8F8F": "Hồng xám",
        "#FFE4C4": "Vàng kem",
        "#9ACD32": "Vàng xanh",
        "#FF4500": "Cam đỏ",
        "#66CDAA": "Xanh trung bình",
        "#FDF5E6": "Vàng kem nhạt",
        "#2E8B57": "Xanh hải quân",
        "#FF00FF": "Hồng cánh sen",
        "#7CFC00": "Xanh lục nhạt",
        "#00FA9A": "Xanh mạ nhạt",
        "#696969": "Xám tối",
        "#F5FFFA": "Xanh bạc hà",
        "#9932CC": "Tím trung bình",
        "#FFE4B5": "Nâu sáng",
        "#87CEFA": "Xanh da trời nhạt"
    };


    // Khởi tạo camera
    initCamera();

    // Bắt sự kiện click hoặc touchstart vào thẻ main
    document.querySelector('main').addEventListener('click', processImage);
    document.querySelector('main').addEventListener('touchstart', processImage);

    // Lấy ảnh từ video và xử lý màu sắc khi click
    function processImage() {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const img = new Image();
            img.src = canvas.toDataURL('image/png');
            img.onload = function () {
                const dominantColor = colorThief.getColor(img);
                displayColor(dominantColor);
            };
        } else {
            console.error('Video dimensions are not available.');
        }
    }

    // Hiển thị màu sắc và tên màu
    function displayColor(color) {
        const colorHex = rgbToHex(color[0], color[1], color[2]);
        const closestColorName = getClosestColorName(colorHex);
        colorDisplay.style.backgroundColor = colorHex;
        colorDisplay.innerText = `Màu: ${closestColorName} (${colorHex})`;

        // Đọc tên màu ra âm thanh
        speakColor("màu chủ đạo là "+closestColorName);
    }

    // Chuyển đổi RGB sang HEX
    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    // Tìm tên màu gần nhất
    function getClosestColorName(hex) {
        let closestColor = 'Không xác định';
        let minDistance = Infinity;

        for (const [colorHex, colorName] of Object.entries(colors)) {
            const colorDistance = getColorDistance(hex, colorHex);
            if (colorDistance < minDistance) {
                minDistance = colorDistance;
                closestColor = colorName;
            }
        }

        return closestColor;
    }

    // Chuyển đổi từ HEX sang RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    // Tính khoảng cách giữa hai màu trong hệ RGB
    function getColorDistance(hex1, hex2) {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);

        const rDiff = rgb1[0] - rgb2[0];
        const gDiff = rgb1[1] - rgb2[1];
        const bDiff = rgb1[2] - rgb2[2];

        return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    }

    // Chức năng đọc tên màu bằng Web Speech API
    function speakColor(colorName) {
        const utterance = new SpeechSynthesisUtterance(colorName);
        utterance.lang = 'vi-VN';  // Đặt ngôn ngữ tiếng Việt
        window.speechSynthesis.speak(utterance);
    }
});