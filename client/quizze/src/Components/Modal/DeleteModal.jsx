import React from 'react';
import './DeleteModal.css'; // Ensure correct path to your CSS file

const DeleteModal = ({ isOpen, onClose, onConfirm, quizID }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(quizID); // Pass quizID to onConfirm
        onClose(); // Close the modal after confirmation
    };

    return (
        <div className="modal-overlay-delete">
            <div className="modal-content-delete">
                <h2>Are you Confirm you <span >want to delete?</span></h2>
                <div className="button-group">
                <div className="confirm-button-delete" onClick={handleConfirm}>Confirm Delete</div>
                    <div className="cancel-button-delete" onClick={onClose}>Cancel</div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
