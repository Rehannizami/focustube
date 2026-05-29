# FocusTube

FocusTube is a distraction-free, academic-focused video platform designed to facilitate focused learning by stripping away the algorithm-driven clutter of traditional video platforms. Built with a full-stack JavaScript architecture, it bridges a responsive front-end with a custom Node.js/Express back-end.

---

## 🏗️ Architecture & Technology Stack

FocusTube utilizes a decoupled architecture where the client communicates with a custom API layer, which in turn acts as a secure proxy to external video data.

### Front-End (Client-Side)

* **Vanilla JavaScript (ES6+ Modules):** Utilizes `type="module"` to maintain a clean, component-like structure without the bloat of heavy frameworks.
* **CSS3:** Implements modern design patterns including glassmorphism and custom CSS variables for light/dark mode support.
* **Dynamic Configuration:** The `config.js` layer automatically detects the runtime environment (Localhost vs. Production) to route API calls dynamically via relative paths (`/api`).

### Back-End (Server-Side)

* **Node.js & Express.js:** A robust, asynchronous server that handles requests, enforces API security, and serves static files.
* **Middleware Stack:**
* `cors()`: Handles cross-origin requests.
* `express.json()`: Parses incoming payload data.
* `express.static()`: Serves the front-end assets (HTML, CSS, JS) directly from the server.


* **Dotenv:** Manages secure environment variables (API Keys), ensuring secrets are never hardcoded in the source code.

---

## 🛠️ How it Works

### 1. The Request Lifecycle

When a user types a query into the Search bar:

1. **Frontend Request:** `search.js` triggers a `fetch` call to the relative endpoint `/api/youtube/search?query=...`.
2. **Server Routing:** The Express server receives the request on `app.use('/api/youtube', youtubeRoutes)`.
3. **Proxy & Auth:** The server extracts the `YOUTUBE_API_KEY` from the environment, attaches it to the request header, and queries the official Data API.
4. **Response Handling:** The back-end filters the raw JSON data, extracts video metadata, and returns a clean object to the front-end.

### 2. Environment Configuration

Security is handled through a tiered environment system:

* **`.env`:** A git-ignored file containing sensitive API keys.
* **Render Environment:** During deployment, keys are injected into the server process memory, which `dotenv` then maps to `process.env`.
* **Dynamic Config:** `config.js` uses `window.location.hostname` to ensure that whether you are developing locally or running in the cloud, the application points to the correct endpoint without manual URL updates.

---

## 🚀 Deployment Strategy

The application is deployed on **Render** via a continuous integration pipeline:

1. **Push:** Any commit to the `main` branch triggers an automatic build.
2. **Dependency Injection:** Render runs `npm install` to build the node environment.
3. **Process Binding:** The server dynamically binds to the port provided by the host (`process.env.PORT`) and explicitly listens on `0.0.0.0` to accept incoming external traffic.

---

## 📂 Project Structure

```text
/
├── server/
│   ├── routes/        # API endpoint definitions
│   └── server.js      # Express entry point & middleware logic
├── js/
│   ├── config.js      # Environment-aware URL management
│   ├── search.js      # Frontend search logic & DOM manipulation
│   └── youtube-api.js # API communication & data extraction
├── assets/            # Static media and images
├── .gitignore         # Security configuration (ignoring node_modules & .env)
├── index.html         # Main application entry
└── package.json       # Project dependencies & ES Module configuration

```

---

## 📝 Setup for Local Development

To run this project on your local machine:

1. **Clone the repository:** `git clone https://github.com/YourUsername/focustube.git`
2. **Install dependencies:** `npm install`
3. **Configure environment:** Create a `.env` file in the root directory and add `YOUTUBE_API_KEY=your_key_here`.
4. **Start the server:** `npm run start`
5. **Access:** Open `http://localhost:3000` in your browser.

---

## 💡 Key Challenges Overcome

* **Module System Conflicts:** Migrated from CommonJS (`require`) to ES Modules (`import/export`) to ensure modern JavaScript standard compliance.
* **Production Routing:** Resolved 404 errors by consolidating redundant route prefixes and aligning frontend `fetch` paths with backend middleware mounts.
* **API Security:** Implemented server-side API proxying to hide the YouTube API Key from client-side inspection.

---

*FocusTube © 2026 - Built for Academic Excellence.*
