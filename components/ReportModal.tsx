"use client";

import { useEffect, useRef, useState } from "react";

interface ReportModalProps {
  onClose: () => void;
}

const REASONS = [
  "Спам",
  "Оскорбление",
  "Нарушение правил",
  "Недостоверная информация",
  "Другое",
];

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.8998 11.9L6.3999 6.40002M6.3999 6.40002L0.899902 0.900024M6.3999 6.40002L11.8999 0.900024M6.3999 6.40002L0.899902 11.9"
        stroke="black"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 9L12 15L18 9" stroke="#9b9faa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ReportModal({ onClose }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!selectOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!selectRef.current?.contains(e.target as Node)) {
        setSelectOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [selectOpen]);

  return (
    <div className="report-overlay" onMouseDown={onClose}>
      <div className="report-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="report-modal__close" onClick={onClose} aria-label="Закрыть">
          <CloseIcon />
        </button>

        <h2 className="report-modal__title">Отправить жалобу</h2>

        <div className="report-modal__fields">
          {/* Custom select */}
          <div
            ref={selectRef}
            className="report-modal__field report-modal__field--select"
            onClick={(e) => {
              e.stopPropagation();
              setSelectOpen((v) => !v);
            }}
          >
            <span className={`report-modal__select-value${!reason ? " report-modal__select-value--placeholder" : ""}`}>
              {reason || "Причина жалобы"}
            </span>
            <span className={`report-modal__chevron${selectOpen ? " report-modal__chevron--open" : ""}`}>
              <ChevronIcon />
            </span>
            {selectOpen && (
              <div
                className="report-modal__options"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`report-modal__option${reason === r ? " report-modal__option--active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setReason(r);
                      setSelectOpen(false);
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Textarea */}
          <div className="report-modal__field report-modal__field--textarea">
            <textarea
              className="report-modal__textarea"
              placeholder="Сообщение"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <button className="report-modal__submit" type="button" onClick={onClose}>Отправить</button>
      </div>
    </div>
  );
}
