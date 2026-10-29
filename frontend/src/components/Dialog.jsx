import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

export default function Dialog({
  open,
  onClose,
  titleId,
  children,
  busy = false,
}) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return createPortal(
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || busy) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <button
        className="icon-button modal-close"
        onClick={onClose}
        disabled={busy}
        aria-label="Close dialog"
      >
        <Icon name="close" />
      </button>
      {children}
    </dialog>,
    document.body,
  );
}
