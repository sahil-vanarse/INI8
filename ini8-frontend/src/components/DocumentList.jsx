import React, { useState } from 'react';
import { downloadDocument, deleteDocument } from '../services/api';
import ConfirmModal from './ConfirmModal';
import './DocumentList.css';

const DocumentList = ({ documents, onDelete, onError, onView }) => {
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleView = (doc) => {
        onView(doc);
    };

    const handleDownload = async (doc) => {
        try {
            await downloadDocument(doc.id, doc.filename);
        } catch (error) {
            onError('Failed to download document');
        }
    };

    const handleDelete = (doc) => {
        setConfirmDelete(doc);
    };

    const confirmDeleteAction = async () => {
        if (!confirmDelete) return;

        setDeletingId(confirmDelete.id);
        setConfirmDelete(null);

        try {
            await deleteDocument(confirmDelete.id);
            onDelete(confirmDelete.id);
        } catch (error) {
            onError('Failed to delete document');
        } finally {
            setDeletingId(null);
        }
    };

    const cancelDelete = () => {
        setConfirmDelete(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (documents.length === 0) {
        return (
            <div className="document-list">
                <h2 className="list-title">Your Documents</h2>
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p className="empty-text">No documents uploaded yet</p>
                    <p className="empty-hint">Upload your first medical document to get started</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ConfirmModal
                isOpen={!!confirmDelete}
                title="Delete Document?"
                message={`Are you sure you want to delete "${confirmDelete?.filename}"? This action cannot be undone.`}
                onConfirm={confirmDeleteAction}
                onCancel={cancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
            />

            <div className="document-list">
                <h2 className="list-title">
                    Your Documents
                    <span className="document-count">{documents.length}</span>
                </h2>

                <div className="documents-grid">
                    {documents.map((doc) => (
                        <div key={doc.id} className="document-card">
                            <div className="document-header">
                                <div className="document-icon">📄</div>
                                <div className="document-info">
                                    <h3 className="document-name" title={doc.filename}>
                                        {doc.filename}
                                    </h3>
                                    <div className="document-meta">
                                        <span className="meta-item">
                                            <span className="meta-icon">📊</span>
                                            {formatFileSize(doc.filesize)}
                                        </span>
                                        <span className="meta-item">
                                            <span className="meta-icon">📅</span>
                                            {formatDate(doc.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="document-actions">
                                <button
                                    className="action-btn view-btn"
                                    onClick={() => handleView(doc)}
                                    title="View document"
                                >
                                    <span className="btn-icon">👁</span>
                                    View
                                </button>
                                <button
                                    className="action-btn download-btn"
                                    onClick={() => handleDownload(doc)}
                                    title="Download document"
                                >
                                    <span className="btn-icon">⬇</span>
                                    Download
                                </button>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(doc)}
                                    disabled={deletingId === doc.id}
                                    title="Delete document"
                                >
                                    {deletingId === doc.id ? (
                                        <>
                                            <span className="spinner-small"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <span className="btn-icon">🗑</span>
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default DocumentList;
