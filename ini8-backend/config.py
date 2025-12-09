import os
from dotenv import load_dotenv

load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://elcebjwzqhbqieveqvtm.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsY2Viand6cWhicWlldmVxdnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODY2NTAsImV4cCI6MjA4MDg2MjY1MH0.s3L13VAE4MCs5PXgx3pZIvD-E44k_Krecq883J1uhk4")

# File Upload Configuration
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".pdf"}
ALLOWED_MIME_TYPES = {"application/pdf"}

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
