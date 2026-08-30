# FarFrame

FarFrame is a browser-based shared photo-booth experience for people who are apart. Create a room, send its six-character code to a friend, meet in a lobby, and start a camera session together.

The project is built with a FastAPI backend, MySQL room storage, vanilla JavaScript, Tailwind CSS, WebSockets, and browser-native WebRTC.

## Features

- Create a shareable room with a randomly generated room code.
- Join an existing room by code as a guest.
- See live participant presence in the room lobby.
- Let the host start the shared session.
- Select a local camera, mirror the local preview, and access microphone/video media.
- Exchange WebRTC offers, answers, and ICE candidates through a WebSocket signaling server.
- Responsive, custom-styled interface with bundled fonts and visual assets.

## Tech stack

| Area | Technology |
| --- | --- |
| Backend | Python, FastAPI, Uvicorn |
| Data | MySQL, SQLAlchemy, PyMySQL |
| Realtime signaling | FastAPI WebSockets |
| Peer media | WebRTC and `getUserMedia` browser APIs |
| Frontend | HTML templates and ES modules |
| Styling | Tailwind CSS 4 |

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer with npm
- A running MySQL server
- A modern browser with camera and microphone support (Chrome, Edge, or Firefox)

For camera access outside local development, serve the app over HTTPS. Browsers allow `localhost` to access media devices over HTTP, but typically block camera and microphone access on other insecure origins.

## Quick start

1. Clone the repository and enter it.

   ```bash
   git clone https://github.com/cafyrei/FarFrame.git
   cd FarFrame
   ```

2. Create and activate a Python virtual environment.

   ```bash
   python -m venv .venv
   # Windows PowerShell
   .\.venv\Scripts\Activate.ps1
   ```

3. Install the Python dependencies.

   ```bash
   pip install fastapi "uvicorn[standard]" sqlalchemy pymysql jinja2
   ```

4. Install the frontend dependencies.

   ```bash
   npm install
   ```

5. Create the MySQL database and table.

   ```sql
   CREATE DATABASE farframe;
   USE farframe;

   CREATE TABLE room (
     room_id INT AUTO_INCREMENT PRIMARY KEY,
     room_code VARCHAR(10) NOT NULL UNIQUE,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     expires_at DATETIME NOT NULL,
     status SMALLINT NOT NULL DEFAULT 0
   );
   ```

6. Configure the connection string in [`app/database.py`](app/database.py). The current local-development default is:

   ```python
   DATABASE_URL = "mysql+pymysql://root:@localhost/farframe"
   ```

   Replace the username, password, host, port, and database name as needed. Keep credentials out of source control for real deployments.

7. Build Tailwind CSS in one terminal.

   ```bash
   npm run build
   ```

   This command watches `src/input.css` and writes the generated stylesheet to `app/static/css/style.css`.

8. Start the FastAPI server in a second terminal.

   ```bash
   uvicorn app.main:app --reload
   ```

9. Open [http://127.0.0.1:8000](http://127.0.0.1:8000), create a room, then open a second browser/device and join it with the displayed code.

## How it works

1. `POST /room` creates a database room and registers its host in the in-memory session manager.
2. `POST /room/join` validates a room code and registers a guest.
3. Both users connect to `WS /ws/{room_code}/{participantId}` for lobby updates and WebRTC signaling.
4. The host starts the session. The host and guest navigate to `/session` and exchange WebRTC signaling messages over the same WebSocket connection.
5. Each browser captures local media through `navigator.mediaDevices.getUserMedia()` and renders peer media received through WebRTC.

## Routes and endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Landing page |
| `GET` | `/home` | Landing page alias |
| `GET` | `/lobby` | Session lobby page |
| `GET` | `/session` | Camera/session page |
| `POST` | `/room` | Create a room and host participant |
| `POST` | `/room/join` | Join an existing room with `{ "room_code": "ABC123" }` |
| `WS` | `/ws/{room_code}/{participantId}` | Presence updates and WebRTC signaling |

FastAPI's interactive API docs are available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) while the server is running.

## Project structure

```text
app/
|-- main.py                    # FastAPI app, static files, and router setup
|-- database.py                # SQLAlchemy connection configuration
|-- models/roomModel.py        # Room SQLAlchemy model
|-- routes/                    # Page, room REST, and WebSocket routes
|-- schemas/roomSchema.py      # Request validation models
|-- services/                  # Room, session, connection, and value managers
|-- static/
|   |-- css/style.css          # Generated Tailwind output
|   |-- js/                    # Client-side room, lobby, session, and utility modules
|   |-- images/                # Icons, avatars, and visual assets
|   `-- fonts/                 # Bundled typefaces
`-- templates/                 # Landing, lobby, and session HTML pages
src/input.css                  # Tailwind source stylesheet
package.json                   # Frontend build script and dependencies
```

## Development notes and limitations

- The WebRTC implementation currently uses one `RTCPeerConnection`; it is designed around a host and one guest rather than a multi-party mesh.
- WebSocket connections and participant registration are stored in application memory. Restarting the server clears active sessions, and multiple server instances will not share live room state.
- Room records are assigned a three-day expiration timestamp when created, but automatic cleanup/enforcement is not implemented yet.
- A database-backed room must exist before a participant can establish a WebSocket connection.
- The camera selector lists available cameras; switching the selected device is not yet wired into a new media stream.
- Production WebRTC deployments commonly need configured STUN/TURN servers. The current peer connection does not configure ICE servers, so remote connections may fail across restrictive NATs or networks.

## Useful commands

```bash
# Watch and rebuild the Tailwind stylesheet
npm run build

# Run the app with automatic Python reloads
uvicorn app.main:app --reload
```

## License

This project currently declares the ISC license in `package.json`.
