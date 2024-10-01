# React + Vite


# Flight Delay Predictor - Tech Rats Team (Armin - Abdur Rahman - Raghav)

This project is a flight delay prediction system consisting of a machine learning backend, a bridge API, and a React frontend.

## Project Structure

```
.
├── backend/
├── bridge/
├── frontend/
└── README.md
```

## Setup and Installation

### Backend

1. Create and activate a virtual environment:

   **Linux/macOS:**
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```

   **Windows:**
   ```
   python -m venv venv
   venv\Scripts\activate
   ```

2. Install requirements:
   ```
   pip install -r requirements.txt
   ```

3. Run the app:
   - For production on VPS:
     ```
     gunicorn app:app
     ```
   - For local testing:
     ```
     python3 app.py
     ```

4. Note the port and address where the app is running.

### Bridge API

1. Navigate to the bridge directory:
   ```
   cd bridge
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Run the bridge:
   ```
   node index.js
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Set up the environment:
   - Set the bridge API URL inside `.env`:
     ```
     VITE_API_URL=http://your-bridge-api-url
     ```

3. Install dependencies and run the development server:
   ```
   npm install
   npm run dev
   ```

## Usage

The frontend sends requests to the bridge API, which then forwards them to the Flask backend. This setup allows for secure communication between the Vercel-hosted frontend and the VPS-hosted backend, bypassing SSL complexities.

## Why a Bridge API?
The bridge API was implemented to solve a specific hosting and communication issue:

The React frontend is hosted on Vercel.
The Flask API (backend) is hosted on a VPS using Gunicorn.
Due to the complexity and errors encountered when trying to obtain an SSL certificate for the VPS, a direct connection between the frontend and backend was problematic.

To resolve this, a bridge API was set up on Heroku, which provides SSL by default. The communication flow works as follows:

The React website on Vercel sends requests to the bridge API on Heroku.
The bridge API code redirects these requests to the Flask API on the VPS.
The response from the Flask API travels back through the bridge to the client.

This setup allows secure communication between the frontend and backend while avoiding the SSL certificate issues on the VPS.

## Local Development

For local development, you can bypass the bridge API:

1. Run only the Flask backend.
2. In the frontend's `.env` file, set `VITE_API_URL` to your local Flask API address (e.g., `http://127.0.0.1:5000`).

## Notes

- The bridge API is hosted on Heroku for SSL support.
- The frontend is configured to use the bridge API by default but can directly communicate with the Flask API in a local setup.

# You can visit the website at <i>https://flight-delay-predictor.vercel.app</i>
## ⚠️ Please do not spam the website as we highly trained our regression model causing high cpu usage for each prediction. for this reason repeatedly (spam clicking the predict button) using the website may cause a SIGKILL signal to the api and cause it to shut down.

## For more information on my background please feel free to visit my portfolio at <i>https://arminamiri.me</i> which outlines the past 5 years of my programming and development background. 

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
