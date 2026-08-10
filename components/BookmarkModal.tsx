"use client";

import { useEffect } from "react";

interface BookmarkModalProps {
  value: string | null;
  onChange: (v: string) => void;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.9003 11.8998L6.40039 6.3999M6.40039 6.3999L0.900391 0.899902M6.40039 6.3999L11.9004 0.899902M6.40039 6.3999L0.900391 11.8999"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BOOKMARK_OPTIONS = [
  { label: "Читаю",       color: "#562CF0" },
  { label: "Буду читать", color: "#3B82F6" },
  { label: "Прочитано",   color: "#22C55E" },
  { label: "Брошено",     color: "#EF4444" },
  { label: "Избранное",   color: "#F59E0B" },
];

export default function BookmarkModal({ value, onChange, onClose }: BookmarkModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      <div className="bookmark-edit-overlay" onClick={onClose} />
      <div className="bookmark-edit-modal" role="dialog" aria-modal="true">
        <div className="reader__bookmark-popup-header">
          <span className="reader__bookmark-popup-title">Закладки</span>
          <button
            className="reader__bookmark-popup-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="reader__bookmark-popup-list">
          {BOOKMARK_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              className={`reader__bookmark-popup-opt${
                value === opt.label ? " reader__bookmark-popup-opt--active" : ""
              }`}
              onClick={() => {
                onChange(opt.label);
                onClose();
              }}
            >
              <span className="bookmark-dot" style={{ background: opt.color }} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
