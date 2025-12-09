import React from 'react';
import './DocumentViewer.css';

const DocumentViewer = ({ document, onClose }) => {
    if (!document) return null;

    const viewUrl = `http://localhost:8000/documents/${document.id}/view`;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="viewer-overlay" onClick={handleBackdropClick}>
            <div className="viewer-modal">
                <div className="viewer-header">
                    <div className="viewer-title">
                        <span className="viewer-icon">📄</span>
                        <h3>{document.filename}</h3>
                    </div>
                    <button className="viewer-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="viewer-content">
                    <iframe
                        src={viewUrl}
                        title={document.filename}
                        className="pdf-viewer"
                    />
                </div>

                <div className="viewer-footer">
                    <p className="viewer-hint">
                        💡 Tip: Use your browser's PDF controls to zoom, navigate pages, or print
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;
