# Patient Portal Frontend

Modern React application for managing patient medical documents with a beautiful, responsive UI.

## Features

- 📤 Upload PDF files with drag-and-drop support
- 📋 View all uploaded documents in a clean card layout
- ⬇️ Download documents
- 🗑️ Delete documents with confirmation
- ✨ Real-time notifications for all actions
- 🎨 Modern glassmorphism design with gradient backgrounds
- 📱 Fully responsive design

## Prerequisites

- Node.js 16+ and npm

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
ini8-frontend/
├── src/
│   ├── components/
│   │   ├── UploadForm.jsx       # File upload component
│   │   ├── UploadForm.css
│   │   ├── DocumentList.jsx     # Document list component
│   │   ├── DocumentList.css
│   │   ├── Notification.jsx     # Toast notifications
│   │   └── Notification.css
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── App.jsx                  # Main application component
│   ├── App.css
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Design Features

### Modern UI/UX
- **Smooth Animations**: Micro-interactions and transitions
- **Responsive Design**: Works seamlessly on all screen sizes

### Components

#### UploadForm
- Drag-and-drop file upload
- File type validation (PDF only)
- File size validation (max 10MB)
- Upload progress indication

#### DocumentList
- Card-based layout for documents
- File metadata display (size, upload date)
- Download and delete actions
- Empty state handling

#### Notification
- Toast-style notifications
- Auto-dismiss after 5 seconds
- Success and error states

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000`:

- `POST /documents/upload` - Upload document
- `GET /documents` - List all documents
- `GET /documents/{id}` - Download document
- `DELETE /documents/{id}` - Delete document

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Modern styling with custom properties
- **Google Fonts (Inter)** - Typography
