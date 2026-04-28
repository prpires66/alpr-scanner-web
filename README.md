# PlateScanner Web - ALPR Frontend

A mobile-first web application for capturing vehicle license plates using the device's camera. Designed for simplicity and high usability.

## Related Projects
- **Backend API**: [alpr-api](https://github.com/prpires66/alpr-api)

## Features
- **Real-time Camera Feed**: Accesses the device's rear camera with a focus guide.
- **Single-tap Capture**: Instantly captures a frame and sends it for processing.
- **Premium UI**: Dark mode design with glassmorphism and smooth animations.
- **Scan History**: Keeps track of recent scans in a local in-memory list.

## Tech Stack
- **Vanilla HTML5 & CSS3**: Modern styling with CSS variables and Flexbox/Grid.
- **Vanilla JavaScript**: Standard `MediaDevices API` and `Fetch API`.
- **Google Fonts**: Uses "Outfit" for a modern, tech-focused look.

## Local Setup
1. Open `frontend/app.js` and ensure the `API_URL` points to your backend (e.g., `http://127.0.0.1:8000/read-plate`).
2. Serve the directory using any local web server:
   - Using Python: `python -m http.server 3000`
   - Using VS Code: Live Server extension.
3. Access the app via `http://localhost:3000`.

**Note**: Camera access (`getUserMedia`) requires a secure context (HTTPS or localhost).

## Deployment (Vercel)
The project is ready for zero-config deployment on Vercel.
1. Create a new project in Vercel.
2. Connect your GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Deploy! Vercel will provide an HTTPS URL required for mobile camera access.

## Configuration
Before deploying for production, update the `API_URL` constant in `app.js` with your live backend endpoint.
