import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel' }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className="confirm-overlay" onClick={handleBackdropClick}>
            <div className="confirm-modal">
                <div className="confirm-icon">⚠️</div>
                <h3 className="confirm-title">{title}</h3>
                <p className="confirm-message">{message}</p>

                <div className="confirm-actions">
                    <button className="confirm-btn cancel-btn" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="confirm-btn delete-confirm-btn" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
