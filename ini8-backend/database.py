from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY
from typing import Optional, List, Dict, Any

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_document(filename: str, filepath: str, filesize: int) -> Dict[str, Any]:
    """Insert a new document record into the database"""
    try:
        response = supabase.table("documents").insert({
            "filename": filename,
            "filepath": filepath,
            "filesize": filesize
        }).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]
        else:
            raise Exception("Failed to create document record")
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")

def get_all_documents() -> List[Dict[str, Any]]:
    """Retrieve all documents from the database"""
    try:
        response = supabase.table("documents").select("*").order("created_at", desc=True).execute()
        return response.data if response.data else []
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")

def get_document_by_id(document_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a single document by ID"""
    try:
        response = supabase.table("documents").select("*").eq("id", document_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")

def delete_document(document_id: str) -> bool:
    """Delete a document record from the database"""
    try:
        response = supabase.table("documents").delete().eq("id", document_id).execute()
        return True
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")
