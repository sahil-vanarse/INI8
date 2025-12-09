from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
from pathlib import Path
from typing import List

from config import UPLOAD_DIR, MAX_FILE_SIZE, ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES
from models import DocumentResponse, DocumentListResponse, UploadResponse, DeleteResponse
from database import create_document, get_all_documents, get_document_by_id, delete_document

app = FastAPI(
    title="Patient Portal API",
    description="API for managing patient medical documents",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Patient Portal API is running", "status": "healthy"}

@app.post("/documents/upload", response_model=UploadResponse, status_code=201)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a PDF document
    
    - **file**: PDF file to upload (max 10MB)
    
    Returns the uploaded document metadata
    """
    # Validate file is provided
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Validate MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed")
    
    # Read file content
    file_content = await file.read()
    file_size = len(file_content)
    
    # Validate file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE / (1024*1024)}MB")
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="File is empty")
    
    # Generate unique filename
    unique_id = str(uuid.uuid4())
    safe_filename = f"{unique_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    try:
        # Save file to disk
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        # Save metadata to database
        db_record = create_document(
            filename=file.filename,
            filepath=file_path,
            filesize=file_size
        )
        
        return UploadResponse(
            id=db_record["id"],
            filename=db_record["filename"],
            filepath=db_record["filepath"],
            filesize=db_record["filesize"],
            created_at=db_record["created_at"],
            message="File uploaded successfully"
        )
    
    except Exception as e:
        # Clean up file if database operation fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@app.get("/documents", response_model=DocumentListResponse)
async def list_documents():
    """
    Get all uploaded documents
    
    Returns a list of all document metadata
    """
    try:
        documents = get_all_documents()
        return DocumentListResponse(
            documents=documents,
            count=len(documents)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve documents: {str(e)}")

@app.get("/documents/{document_id}/view")
async def view_document(document_id: str):
    """
    View/Preview a specific document by ID (inline in browser)
    
    - **document_id**: UUID of the document to view
    
    Returns the file for inline viewing in browser
    """
    try:
        # Get document metadata from database
        document = get_document_by_id(document_id)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        file_path = document["filepath"]
        
        # Check if file exists on disk
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found on server")
        
        # Return file for inline viewing
        return FileResponse(
            path=file_path,
            media_type="application/pdf",
            filename=document["filename"],
            headers={
                "Content-Disposition": f'inline; filename="{document["filename"]}"'
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to view file: {str(e)}")

@app.get("/documents/{document_id}")
async def download_document(document_id: str):
    """
    Download a specific document by ID
    
    - **document_id**: UUID of the document to download
    
    Returns the file for download
    """
    try:
        # Get document metadata from database
        document = get_document_by_id(document_id)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        file_path = document["filepath"]
        
        # Check if file exists on disk
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found on server")
        
        # Return file for download
        return FileResponse(
            path=file_path,
            media_type="application/pdf",
            filename=document["filename"],
            headers={
                "Content-Disposition": f'attachment; filename="{document["filename"]}"'
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download file: {str(e)}")

@app.delete("/documents/{document_id}", response_model=DeleteResponse)
async def delete_document_endpoint(document_id: str):
    """
    Delete a document by ID
    
    - **document_id**: UUID of the document to delete
    
    Deletes both the file and database record
    """
    try:
        # Get document metadata from database
        document = get_document_by_id(document_id)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        file_path = document["filepath"]
        
        # Delete file from disk
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Delete record from database
        delete_document(document_id)
        
        return DeleteResponse(
            message="Document deleted successfully",
            id=document_id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
