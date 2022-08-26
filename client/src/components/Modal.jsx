import React from "react";

export const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <dialog open className="popup">
      <div className="popup-inner">
        <button onClick={onClose}>close Modal</button>
        {children}
      </div>
    </dialog>
  );
};
