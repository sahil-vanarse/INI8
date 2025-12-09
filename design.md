# Patient Portal - Design Document

## 1. Tech Stack Choices

### Q1. Frontend Framework: React with Vite

**Choice:** React 18+ with Vite as the build tool

**Reasoning:**
- **React**: Component-based architecture makes it easy to build reusable UI components (upload form, document list, etc.)
- **Vite**: Extremely fast development server with Hot Module Replacement (HMR), significantly better than Create React App
- **Developer Experience**: Vite provides instant server start and lightning-fast HMR
- **Modern Tooling**: Built-in TypeScript support, optimized builds, and ES modules support

### Q2. Backend Framework: FastAPI

**Choice:** FastAPI (Python)

**Reasoning:**
- **Performance**: Built on Starlette and Pydantic, offers async support for high-performance file operations
- **Automatic Documentation**: Auto-generates OpenAPI (Swagger) documentation
- **Type Safety**: Pydantic models provide automatic validation and serialization
- **Modern Python**: Uses Python 3.7+ type hints for better code quality
- **File Handling**: Excellent support for multipart form data and file uploads
- **Easy Integration**: Simple integration with Supabase and other services

### Q3. Database: Supabase (PostgreSQL)

**Choice:** Supabase (managed PostgreSQL)

**Reasoning:**
- **Production-Ready**: Cloud-hosted PostgreSQL with built-in authentication, storage, and real-time features
- **Scalability**: PostgreSQL handles millions of rows efficiently
- **ACID Compliance**: Ensures data integrity for critical healthcare data
- **Storage Integration**: Supabase Storage provides secure file storage with CDN
- **Free Tier**: Generous free tier for development and small-scale deployment
- **SQL Power**: Full SQL capabilities for complex queries if needed in future

**Alternative Considered:** SQLite would work for local development but lacks scalability and concurrent access handling.

### Q4. Scaling to 1,000 Users - Considerations

**Current Architecture Limitations:**
- Local file storage (`uploads/` folder) won't scale across multiple servers
- No authentication/authorization system
- No rate limiting or request throttling
- Single-instance deployment

**Changes for 1,000+ Users:**

1. **File Storage:**
   - Migrate from local storage to **Supabase Storage** or **AWS S3**
   - Implement CDN for faster file downloads globally
   - Add file size limits and quota management per user

2. **Authentication & Authorization:**
   - Implement user authentication (JWT tokens, OAuth)
   - Add role-based access control (RBAC)
   - Ensure users can only access their own documents

3. **Database Optimization:**
   - Add indexes on frequently queried columns (user_id, created_at)
   - Implement connection pooling
   - Consider read replicas for heavy read operations

4. **Performance & Reliability:**
   - Deploy behind a load balancer (multiple backend instances)
   - Implement caching (Redis) for frequently accessed metadata
   - Add rate limiting to prevent abuse
   - Implement request queuing for file uploads

5. **Monitoring & Logging:**
   - Add application performance monitoring (APM)
   - Implement structured logging
   - Set up error tracking (Sentry)
   - Monitor file storage usage

6. **Security:**
   - Implement virus scanning for uploaded files
   - Add CORS configuration
   - Enable HTTPS only
   - Implement file encryption at rest

## 2. Architecture Overview

### System Architecture

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

### Data Flow

**Components:**
1. **Frontend (React + Vite)**: User interface for file management
2. **Backend (FastAPI)**: REST API server handling business logic
3. **Database (Supabase PostgreSQL)**: Stores file metadata
4. **File Storage (Local)**: Stores actual PDF files

**Communication:**
- Frontend ↔ Backend: RESTful HTTP requests (JSON + multipart/form-data)
- Backend ↔ Database: SQL queries via Supabase client
- Backend ↔ File Storage: Direct file system operations

## 3. API Specification

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Upload Document

**Endpoint:** `POST /documents/upload`

**Description:** Upload a PDF file and store its metadata

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  ```
  file: <PDF file binary>
  ```

**Sample Request (curl):**
```bash
curl -X POST http://localhost:8000/documents/upload \
  -F "file=@prescription.pdf"
```

**Success Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "prescription.pdf",
  "filepath": "uploads/550e8400-e29b-41d4-a716-446655440000_prescription.pdf",
  "filesize": 245678,
  "created_at": "2025-12-09T14:38:37.123Z",
  "message": "File uploaded successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "detail": "Only PDF files are allowed"
}
```

---

#### 2. List All Documents

**Endpoint:** `GET /documents`

**Description:** Retrieve all uploaded documents metadata

**Request:**
- No body required

**Sample Request (curl):**
```bash
curl -X GET http://localhost:8000/documents
```

**Success Response (200 OK):**
```json
{
  "documents": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "prescription.pdf",
      "filepath": "uploads/550e8400-e29b-41d4-a716-446655440000_prescription.pdf",
      "filesize": 245678,
      "created_at": "2025-12-09T14:38:37.123Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "filename": "test_results.pdf",
      "filepath": "uploads/660e8400-e29b-41d4-a716-446655440001_test_results.pdf",
      "filesize": 512000,
      "created_at": "2025-12-09T15:20:15.456Z"
    }
  ],
  "count": 2
}
```

---

#### 3. Download Document

**Endpoint:** `GET /documents/{id}`

**Description:** Download a specific document by ID

**Path Parameters:**
- `id` (string, UUID): Document ID

**Sample Request (curl):**
```bash
curl -X GET http://localhost:8000/documents/550e8400-e29b-41d4-a716-446655440000 \
  -o downloaded_file.pdf
```

**Success Response (200 OK):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="prescription.pdf"`
- Body: Binary PDF file data

**Error Response (404 Not Found):**
```json
{
  "detail": "Document not found"
}
```

---

#### 4. Delete Document

**Endpoint:** `DELETE /documents/{id}`

**Description:** Delete a document and its metadata

**Path Parameters:**
- `id` (string, UUID): Document ID

**Sample Request (curl):**
```bash
curl -X DELETE http://localhost:8000/documents/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200 OK):**
```json
{
  "message": "Document deleted successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Document not found"
}
```

## 4. Data Flow Description

### Q5. File Upload Process

**Step-by-Step Flow:**

1. **User Action**: User selects a PDF file in the frontend upload form
2. **Client Validation**: Frontend validates file type (must be PDF) and optionally file size
3. **HTTP Request**: Frontend sends POST request to `/documents/upload` with multipart/form-data
4. **Backend Reception**: FastAPI receives the file upload request
5. **Server Validation**: Backend validates:
   - File is present
   - File extension is `.pdf`
   - MIME type is `application/pdf`
6. **Generate Unique ID**: Backend generates a UUID for the document
7. **File Storage**: Backend saves file to `uploads/` directory with format: `{uuid}_{original_filename}.pdf`
8. **Database Entry**: Backend inserts metadata into Supabase `documents` table:
   - id (UUID)
   - filename (original name)
   - filepath (storage path)
   - filesize (bytes)
   - created_at (timestamp)
9. **Response**: Backend returns success response with document metadata
10. **UI Update**: Frontend displays success message and refreshes document list

### File Download Process

**Step-by-Step Flow:**

1. **User Action**: User clicks download button for a specific document
2. **HTTP Request**: Frontend sends GET request to `/documents/{id}`
3. **Database Query**: Backend queries Supabase to find document metadata by ID
4. **Validation**: Backend checks if document exists in database
5. **File Retrieval**: Backend reads the file from local storage using the filepath
6. **File Check**: Backend verifies the physical file exists
7. **Response Headers**: Backend sets appropriate headers:
   - Content-Type: `application/pdf`
   - Content-Disposition: `attachment; filename="{original_filename}"`
8. **Stream File**: Backend streams the file binary data to the client
9. **Browser Action**: User's browser triggers download dialog
10. **Save**: User saves the file to their local machine

## 5. Database Schema

### Table: `documents`

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    filesize BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
```

**Field Descriptions:**
- `id`: Unique identifier (UUID v4)
- `filename`: Original filename as uploaded by user
- `filepath`: Relative path to file in storage system
- `filesize`: File size in bytes
- `created_at`: Timestamp when document was uploaded

## 6. Assumptions

### Q6. Assumptions Made

1. **Single User System**
   - No authentication or user management required
   - All documents belong to a single user
   - No multi-tenancy considerations

2. **File Size Limits**
   - Maximum file size: 10 MB (configurable)
   - Reasonable for medical documents (prescriptions, test results)
   - Can be adjusted based on requirements

3. **File Type Restrictions**
   - Only PDF files are allowed
   - No support for images (JPEG, PNG) or other document formats
   - MIME type validation: `application/pdf`

4. **Concurrency**
   - Low concurrent upload volume expected
   - No file locking mechanisms implemented
   - Database handles concurrent reads/writes via PostgreSQL ACID properties

5. **Storage**
   - Local file system storage is sufficient for prototype
   - No backup or redundancy mechanisms
   - Files stored in `uploads/` directory relative to backend

6. **Security**
   - No virus scanning on uploaded files
   - No encryption at rest
   - CORS enabled for localhost development
   - No rate limiting implemented

7. **Error Handling**
   - Basic error messages for user feedback
   - No detailed logging or monitoring
   - Assumes stable network connection

8. **Data Retention**
   - No automatic cleanup of old files
   - No archival policy
   - Files persist indefinitely until manually deleted

9. **Browser Compatibility**
   - Modern browsers (Chrome, Firefox, Safari, Edge)
   - JavaScript enabled
   - File API support required

10. **Network**
    - Application runs on localhost
    - No HTTPS required for development
    - No CDN or caching layer

## 7. Future Enhancements

**Not in Scope (but valuable for production):**
- User authentication and authorization
- File preview functionality
- Search and filter capabilities
- Bulk upload/download
- File versioning
- Audit logs
- Email notifications
- Mobile responsive design optimization
- Accessibility (WCAG compliance)
- Internationalization (i18n)
