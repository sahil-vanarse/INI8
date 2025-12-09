import React, { useState } from 'react';
import { uploadDocument } from '../services/api';
import './UploadForm.css';

const UploadForm = ({ onUploadSuccess, onUploadError }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        validateAndSetFile(file);
    };

    const validateAndSetFile = (file) => {
        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            onUploadError('Only PDF files are allowed');
            return;
        }

        // Validate file size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            onUploadError('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        validateAndSetFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            onUploadError('Please select a file first');
            return;
        }

        setIsUploading(true);
        try {
            await uploadDocument(selectedFile);
            onUploadSuccess(`${selectedFile.name} uploaded successfully`);
            setSelectedFile(null);
            // Reset file input
            document.getElementById('file-input').value = '';
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Failed to upload file';
            onUploadError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="upload-form">
            <h2 className="upload-title">Upload Medical Document</h2>

            <div
                className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="upload-icon">📄</div>
                <p className="upload-text">
                    Drag and drop your PDF file here, or
                </p>
                <label htmlFor="file-input" className="upload-button-label">
                    Browse Files
                    <input
                        id="file-input"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileSelect}
                        className="upload-input"
                    />
                </label>
                <p className="upload-hint">Maximum file size: 10MB</p>
            </div>

            {selectedFile && (
                <div className="selected-file">
                    <div className="file-info">
                        <span className="file-icon">📋</span>
                        <div className="file-details">
                            <p className="file-name">{selectedFile.name}</p>
                            <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                        </div>
                    </div>
                    <button
                        className="remove-file-btn"
                        onClick={() => {
                            setSelectedFile(null);
                            document.getElementById('file-input').value = '';
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <button
                className="upload-submit-btn"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
            >
                {isUploading ? (
                    <>
                        <span className="spinner"></span>
                        Uploading...
                    </>
                ) : (
                    <>
                        <span>⬆</span>
                        Upload Document
                    </>
                )}
            </button>
        </div>
    );
};

export default UploadForm;
