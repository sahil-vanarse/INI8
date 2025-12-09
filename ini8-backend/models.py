from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentResponse(BaseModel):
    id: str
    filename: str
    filepath: str
    filesize: int
    created_at: datetime

class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]
    count: int

class UploadResponse(BaseModel):
    id: str
    filename: str
    filepath: str
    filesize: int
    created_at: datetime
    message: str

class DeleteResponse(BaseModel):
    message: str
    id: str

class ErrorResponse(BaseModel):
    detail: str
