import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import DocumentViewer from './components/DocumentViewer';
import Notification from './components/Notification';
import { getDocuments } from './services/api';
import './App.css';

function App() {
    const [documents, setDocuments] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [viewingDocument, setViewingDocument] = useState(null);

    const fetchDocuments = async () => {
        try {
            const data = await getDocuments();
            setDocuments(data.documents);
        } catch (error) {
            showNotification('Failed to load documents', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };

    const handleUploadSuccess = (message) => {
        showNotification(message, 'success');
        fetchDocuments();
    };

    const handleUploadError = (message) => {
        showNotification(message, 'error');
    };

    const handleDelete = (documentId) => {
        setDocuments(documents.filter(doc => doc.id !== documentId));
        showNotification('Document deleted successfully', 'success');
    };

    const handleError = (message) => {
        showNotification(message, 'error');
    };

    const handleView = (document) => {
        setViewingDocument(document);
    };

    const handleCloseViewer = () => {
        setViewingDocument(null);
    };

    return (
        <div className="app">
            <div className="background-gradient"></div>

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />

            <DocumentViewer
                document={viewingDocument}
                onClose={handleCloseViewer}
            />

            <div className="container">
                <header className="app-header">
                    <div className="header-icon">🏥</div>
                    <div>
                        <h1 className="app-title">Patient Portal</h1>
                        <p className="app-subtitle">Manage Your Medical Documents Securely</p>
                    </div>
                </header>

                <div className="content-grid">
                    <div className="upload-section">
                        <UploadForm
                            onUploadSuccess={handleUploadSuccess}
                            onUploadError={handleUploadError}
                        />
                    </div>

                    <div className="documents-section">
                        {isLoading ? (
                            <div className="loading-state">
                                <div className="spinner-large"></div>
                                <p>Loading documents...</p>
                            </div>
                        ) : (
                            <DocumentList
                                documents={documents}
                                onDelete={handleDelete}
                                onError={handleError}
                                onView={handleView}
                            />
                        )}
                    </div>
                </div>

                <footer className="app-footer">
                    <p>Secure document management for healthcare professionals and patients</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
