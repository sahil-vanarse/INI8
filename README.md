# Patient Portal - Medical Document Management System

A full-stack web application for managing patient medical documents (PDFs). Built with FastAPI backend and React frontend, featuring a modern, secure interface for uploading, viewing, downloading, and deleting medical documents.

# Video Demo

https://drive.google.com/file/d/1a360s8yvX5sV8wmVb6DKqNVTU-2LKLBJ/view?usp=sharing

![Patient Portal](https://img.shields.io/badge/Status-Ready-success)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.5-009688)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E)

## 🌟 Features

- **📤 File Upload**: Drag-and-drop PDF upload with validation
- **📋 Document Management**: View all uploaded documents in a clean, card-based layout
- **⬇️ Download**: Download any document with a single click
- **🗑️ Delete**: Remove documents with confirmation dialog
- **✨ Real-time Notifications**: Success/error messages for all operations
- **🎨 Modern UI**: Glassmorphism design with gradient backgrounds
- **📱 Responsive**: Works seamlessly on all devices
- **🔒 Secure**: File validation and error handling

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)

## 🏗️ Architecture

```
┌─────────────────┐
│   React Frontend│
│   (Vite)        │
│   Port: 5173    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  FastAPI Backend│
│  Port: 8000     │
└────┬────────┬───┘
     │        │
     │        └──────────────┐
     │                       │
┌────▼────────┐    ┌────────▼────────┐
│  Supabase   │    │  Local File     │
│  PostgreSQL │    │  Storage        │
│  (Metadata) │    │  (uploads/)     │
└─────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **Supabase** - PostgreSQL database (cloud-hosted)
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Modern styling with custom properties

## ✅ Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Supabase Account** (free tier works)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sahil-vanarse/INI8
cd ini8
```

### 2. Backend Setup

```bash
cd ini8-backend
python -m venv env

env\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# The .env file is already configured with Supabase credentials
# If needed, you can modify it with your own credentials
```

### 3. Database Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Run the migration script from `ini8-backend/migrations/init.sql`:

```sql
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    filesize BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
```

### 4. Frontend Setup

```bash
cd ../ini8-frontend

# Install Node dependencies
npm install
```

## 🚀 Running Locally

You'll need **two terminal windows** - one for backend, one for frontend.

### Terminal 1: Start Backend

```bash
cd ini8-backend
uvicorn main:app --reload
```

Backend will be available at: `http://localhost:8000`
- API Docs (Swagger): `http://localhost:8000/docs`
- Alternative Docs (ReDoc): `http://localhost:8000/redoc`

### Terminal 2: Start Frontend

```bash
cd ini8-frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 🎉 Access the Application

Open your browser and navigate to: **http://localhost:5173**

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Upload Document

```bash
POST /documents/upload

# Example using curl
curl -X POST http://localhost:8000/documents/upload \
  -F "file=@prescription.pdf"

# Response (201 Created)
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "prescription.pdf",
  "filepath": "uploads/550e8400-e29b-41d4-a716-446655440000_prescription.pdf",
  "filesize": 245678,
  "created_at": "2025-12-09T14:38:37.123Z",
  "message": "File uploaded successfully"
}
```

#### 2. List All Documents

```bash
GET /documents

# Example using curl
curl http://localhost:8000/documents

# Response (200 OK)
{
  "documents": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "prescription.pdf",
      "filepath": "uploads/550e8400-e29b-41d4-a716-446655440000_prescription.pdf",
      "filesize": 245678,
      "created_at": "2025-12-09T14:38:37.123Z"
    }
  ],
  "count": 1
}
```

#### 3. Download Document

```bash
GET /documents/{id}

# Example using curl
curl http://localhost:8000/documents/550e8400-e29b-41d4-a716-446655440000 \
  -o downloaded_file.pdf

# Response: Binary PDF file
```

#### 4. Delete Document

```bash
DELETE /documents/{id}

# Example using curl
curl -X DELETE http://localhost:8000/documents/550e8400-e29b-41d4-a716-446655440000

# Response (200 OK)
{
  "message": "Document deleted successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Using Postman

1. Import the API into Postman using the OpenAPI spec at `http://localhost:8000/openapi.json`
2. Or manually create requests using the examples above

## 📁 Project Structure

```
ini8/
├── design.md                    # Design document with architecture and decisions
├── README.md                    # This file
│
├── ini8-backend/               # FastAPI Backend
│   ├── main.py                 # FastAPI application and endpoints
│   ├── config.py               # Configuration settings
│   ├── database.py             # Supabase database operations
│   ├── models.py               # Pydantic models
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   ├── migrations/
│   │   └── init.sql           # Database schema
│   ├── uploads/               # Local file storage (auto-created)
│   └── README.md              # Backend documentation
│
└── ini8-frontend/             # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── UploadForm.jsx      # File upload component
    │   │   ├── DocumentList.jsx    # Document list component
    │   │   └── Notification.jsx    # Toast notifications
    │   ├── services/
    │   │   └── api.js              # API service layer
    │   ├── App.jsx                 # Main application
    │   ├── main.jsx                # Entry point
    │   └── index.css               # Global styles
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── README.md                   # Frontend documentation
```

## 🎨 Design Decisions

For detailed design decisions, architecture, and scaling considerations, please refer to [design.md](./design.md).

### Key Highlights:

1. **FastAPI** - Chosen for its performance, automatic API documentation, and excellent async support
2. **Supabase PostgreSQL** - Production-ready database with ACID compliance and scalability
3. **React + Vite** - Modern frontend stack with fast HMR and optimized builds
4. **Glassmorphism UI** - Modern, premium design with gradient backgrounds and smooth animations

## 🔒 Security Considerations

- PDF-only file validation (extension + MIME type)
- File size limits (10MB max)
- Input validation with Pydantic
- CORS configuration for localhost
- SQL injection protection via Supabase client

## 🚀 Future Enhancements

- User authentication and authorization
- File preview functionality
- Search and filter capabilities
- Bulk upload/download
- File versioning
- Cloud storage migration (AWS S3/Supabase Storage)
- Virus scanning
- Audit logs


---

**Note**: This application is designed to run locally for development and demonstration purposes. For production deployment, additional security measures, authentication, and cloud storage should be implemented.
