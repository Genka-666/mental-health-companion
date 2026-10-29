import React from "react";
import Dialog from "./Dialog";
import Icon from "./Icon";

export default function HelpBanner({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} titleId="help-title">
      <span className="modal-symbol">
        <Icon name="heart" size={28} />
      </span>
      <span className="eyebrow">You don’t have to face this alone</span>
      <h2 id="help-title" className="page-title">
        You deserve support.
      </h2>
      <p className="modal-description">
        If you feel unsafe or might hurt yourself, contact emergency services or
        someone you trust who can stay with you.
      </p>
      <a href="tel:14416" className="helpline-card">
        <span>
          <strong>Tele-MANAS</strong>
          <small>Mental health support in India</small>
        </span>
        <span className="helpline-number">
          14416 <Icon name="phone" size={17} />
        </span>
      </a>
      <a href="tel:112" className="helpline-card">
        <span>
          <strong>Emergency services</strong>
          <small>If you are in immediate danger</small>
        </span>
        <span className="helpline-number">
          112 <Icon name="phone" size={17} />
        </span>
      </a>
      <a href="tel:18008914416" className="helpline-alternate">
        Tele-MANAS alternate: 1-800-891-4416
      </a>
      <p className="text-xs">
        Outside India? Contact your local emergency number or crisis service.
        This automated companion cannot provide emergency care.
      </p>
      <button className="btn btn-secondary btn-full" onClick={onClose}>
        Back to my space
      </button>
    </Dialog>
  );
}
