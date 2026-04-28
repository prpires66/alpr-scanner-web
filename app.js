// Configuration
const API_URL = 'https://alpr-api-vsuu.onrender.com/read-plate';
// Use this for local testing with the backend running locally:
// const API_URL = 'http://127.0.0.1:8000/read-plate';

// DOM Elements
const video = document.getElementById('cameraStream');
const canvas = document.getElementById('captureCanvas');
const captureBtn = document.getElementById('captureBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const historyList = document.getElementById('historyList');

// State
let stream = null;
const history = [];

// Initialize Camera
async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: 'environment', // Prefer rear camera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Could not access camera. Please check permissions and ensure you are on HTTPS or localhost.');
    }
}

// Capture and Process
async function captureImage() {
    if (!stream) {
        alert("Camera stream not available. Please allow camera permissions.");
        return;
    }

    // Show loading
    loadingOverlay.classList.remove('hidden');

    // Draw video frame to canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to Blob
    canvas.toBlob(async (blob) => {
        if (!blob) {
            handleResult({ error: "Failed to create image blob" });
            return;
        }

        const formData = new FormData();
        formData.append('file', blob, 'capture.jpg');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            handleResult(data);
        } catch (error) {
            console.error('API Error:', error);
            handleResult({ error: error.message });
        }
    }, 'image/jpeg', 0.8);
}

// Handle API Result
function handleResult(data) {
    loadingOverlay.classList.add('hidden');

    const timestamp = new Date().toLocaleTimeString();
    let statusClass = 'error';
    let plateText = 'Not Found';
    let rawText = '';

    if (data.error) {
        plateText = 'Error';
        rawText = data.error;
    } else if (data.plate) {
        statusClass = 'success';
        plateText = data.plate;
        rawText = data.raw_text || '';
    } else {
        // Plate not found in response
        rawText = data.raw_text || 'No text detected';
    }

    const item = {
        plate: plateText,
        time: timestamp,
        raw: rawText,
        status: statusClass
    };

    history.unshift(item);
    renderHistory();
}

// Render History List
function renderHistory() {
    if (history.length === 0) return;

    historyList.innerHTML = '';
    
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = `history-item ${item.status}`;
        
        div.innerHTML = `
            <div class="item-info">
                <h3>${item.plate}</h3>
                <p>${item.time}</p>
            </div>
            <div class="item-badge">
                ${item.status === 'success' ? 'MATCH' : (item.status === 'error' ? 'ERR' : 'NO MATCH')}
            </div>
        `;
        historyList.appendChild(div);
    });
}

// Event Listeners
captureBtn.addEventListener('click', captureImage);

// Start
document.addEventListener('DOMContentLoaded', startCamera);
