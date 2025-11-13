// Các phần tử DOM chính (Sử dụng ID nên không bị ảnh hưởng bởi thay đổi class)
const fileInput = document.getElementById('fileInput');
const audioPlayer = document.getElementById('audioPlayer');
const playlistUl = document.getElementById('playlist');
const currentTrackName = document.getElementById('currentTrackName');
const noSongsMessage = document.getElementById('noSongsMessage');
// ... (các biến đã có)
const uploadButton = document.getElementById('uploadButton');

// ...

// Mảng lưu trữ các đối tượng File (hoặc URL/Blob) của bài hát
let tracks = [];
let currentTrackIndex = -1;

// Kích hoạt trường file khi nhấn nút giao diện
uploadButton.addEventListener('click', () => {
    fileInput.click();
});

// --- Xử lý tải file ---
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    
    if (files.length === 0) {
        return;
    }

    // Vòng lặp thêm file
    for (const file of files) {
        if (file.type.startsWith('audio/')) {
            tracks.push(file);
            addTrackToPlaylist(file);
        }
    }

    // Ẩn thông báo "Chưa có bài hát" (sử dụng ID 'noSongsMessage' vẫn OK)
    if (tracks.length > 0) {
        noSongsMessage.style.display = 'none';
    }

    // Tự động phát bài hát đầu tiên
    if (currentTrackIndex === -1 && tracks.length > 0) {
        playTrack(0);
    }
});

// --- Thêm bài hát vào danh sách phát (giao diện) ---
function addTrackToPlaylist(file) {
    const listItem = document.createElement('li');
    // Lưu trữ index của bài hát trong thuộc tính data
    listItem.setAttribute('data-index', tracks.length - 1); 
    listItem.textContent = file.name;

    // Xử lý sự kiện click để phát bài hát
    listItem.addEventListener('click', () => {
        const index = parseInt(listItem.getAttribute('data-index'));
        playTrack(index);
    });

    // Thêm vào danh sách UL (sử dụng ID 'playlist' vẫn OK)
    playlistUl.appendChild(listItem);
}

// --- Phát bài hát theo index ---
function playTrack(index) {
    if (index < 0 || index >= tracks.length) {
        return;
    }

    currentTrackIndex = index;
    const trackFile = tracks[index];
    
    // Tạo URL đối tượng từ File Blob (cốt lõi của việc tải file từ máy lên)
    const objectURL = URL.createObjectURL(trackFile);
    
    // Gán và phát trên phần tử AUDIO (sử dụng ID 'audioPlayer' vẫn OK)
    audioPlayer.src = objectURL;
    audioPlayer.play();
    
    // Cập nhật thông tin bài hát đang phát (sử dụng ID 'currentTrackName' vẫn OK)
    currentTrackName.textContent = trackFile.name;
    
    // Cập nhật trạng thái 'active' cho danh sách phát
    updateActiveTrackInPlaylist(index);
}

// --- Cập nhật trạng thái bài hát đang phát ---
function updateActiveTrackInPlaylist(activeIndex) {
    // Xử lý class 'active' trên các phần tử LI (Class 'active' này được sử dụng trong CSS Glassmorphism)
    const listItems = playlistUl.querySelectorAll('li');
    listItems.forEach(item => item.classList.remove('active'));

    const activeItem = playlistUl.querySelector(`[data-index="${activeIndex}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// --- Chức năng tự động chuyển bài khi kết thúc ---
audioPlayer.addEventListener('ended', () => {
    const nextIndex = currentTrackIndex + 1;
    
    if (nextIndex < tracks.length) {
        playTrack(nextIndex);
    } else {
        currentTrackIndex = -1;
        currentTrackName.textContent = "Đã kết thúc danh sách phát";
        updateActiveTrackInPlaylist(-1);
    }
});

// Khởi tạo ban đầu
if (tracks.length === 0) {
    noSongsMessage.style.display = 'block';
}