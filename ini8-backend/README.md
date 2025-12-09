# Patient Portal Backend

FastAPI backend for managing patient medical documents (PDFs).

## Features

- Upload PDF files with validation
- List all uploaded documents
- Download documents
- Delete documents
- Supabase PostgreSQL database integration
- Automatic API documentation (Swagger)

## Prerequisites

- Python 3.8+
- Supabase account with project setup

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables (optional - defaults are provided):
Create a `.env` file in the backend directory:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

3. Run the database migration:
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Run the SQL script from `migrations/init.sql`

## Running the Server

Start the development server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### 1. Upload Document
```bash
POST /documents/upload
Content-Type: multipart/form-data

curl -X POST http://localhost:8000/documents/upload \
  -F "file=@prescription.pdf"
```

### 2. List Documents
```bash
GET /documents

curl http://localhost:8000/documents
```

### 3. Download Document
```bash
GET /documents/{id}

curl http://localhost:8000/documents/{document-id} -o downloaded.pdf
```

### 4. Delete Document
```bash
DELETE /documents/{id}

curl -X DELETE http://localhost:8000/documents/{document-id}
```

## Project Structure

```
ini8-backend/
├── main.py              # FastAPI application and endpoints
├── config.py            # Configuration settings
├── database.py          # Supabase database operations
├── models.py            # Pydantic models
├── requirements.txt     # Python dependencies
├── migrations/          # Database migrations
│   └── init.sql
└── uploads/            # Local file storage (auto-created)
```

## Configuration

- **Max File Size**: 10 MB
- **Allowed File Types**: PDF only
- **Upload Directory**: `uploads/`

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created (upload success)
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error
