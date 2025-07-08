# Code SYNC - Real-Time Code Collaborator

A real-time collaborative coding platform with built-in **video calling** and **voice chat**, powered by **Socket.IO** and **WebRTC**. Ideal for remote interviews, teaching, and pair programming.

---

## 🚀 Features

- 🧑‍💻 Real-time code editing (multi-user)
- 📹 Integrated video and voice chat via WebRTC
- 🔒 Secure room-based collaboration
- ⚙️ RESTful API backend with Express.js
- ⚡ Live socket communication with Socket.IO
- 🧠 Clean, responsive UI for smooth UX
- 🎯 Use cases: teaching, live coding interviews, pair programming

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Socket.IO client
- WebRTC
- TailwindCSS (optional)

**Backend:**
- Node.js
- Express.js
- Socket.IO server
- WebRTC signaling
- RESTful APIs

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/code-sync.git
cd code-sync

# Install backend
cd Backend
npm install

# Install frontend
cd ../Frontend
npm install

# Run both servers
npm run dev  # or use concurrently if setup
