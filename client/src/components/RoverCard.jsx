import React from "react";
import { useState } from "react";
import { Modal } from "./Modal";

const RoverCard = ({ earthDate, id, camera, image, sol }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeCard = () => setModalIsOpen(false);

  return (
    <>
      <div className="grid-image-container">
        <img className="grid-image" src={image} />
        <button
          className="grid-image--button"
          onClick={() => setModalIsOpen(true)}
        >
          <a>Modal</a>
        </button>
      </div>
      <div>
        <Modal open={modalIsOpen} onClose={closeCard}>
          <h3>{earthDate}</h3>
          <h3>{sol}</h3>
          <h3>{id}</h3>
          <h4>{camera}</h4>
          <div className="modalI-container">
            <img className="modal-image" src={image} />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default RoverCard;
