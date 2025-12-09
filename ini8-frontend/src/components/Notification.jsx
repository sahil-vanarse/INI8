import React from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div className={`notification notification-${type}`}>
            <div className="notification-content">
                <span className="notification-icon">
                    {type === 'success' ? '✓' : '✕'}
                </span>
                <span className="notification-message">{message}</span>
            </div>
            <button className="notification-close" onClick={onClose}>
                ×
            </button>
        </div>
    );
};

export default Notification;
