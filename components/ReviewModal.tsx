"use client";

import { useEffect, useState } from "react";

interface ReviewModalProps {
  onClose: () => void;
}

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

function SuccessIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#5B35E8" fillOpacity="0.1" />
      <path d="M19 32.5L28 41.5L45 22.5" stroke="#5B35E8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ReviewModal({ onClose }: ReviewModalProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;
    
    // Оптимистичная отправка
    setIsSubmitted(true);
  };

  return (
    <div className="review-overlay" onMouseDown={onClose}>
      <div
        className="review-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="review-modal__close" onClick={onClose} aria-label="Закрыть">
          <CloseIcon />
        </button>

        {isSubmitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
            <SuccessIcon />
            <h2 className="review-modal__title" style={{ marginTop: '24px', marginBottom: '16px' }}>ОТЗЫВ ОТПРАВЛЕН</h2>
            <p className="review-modal__subtitle" style={{ marginBottom: '32px' }}>
              Спасибо за ваш отзыв! Он появится после проверки модератором.
            </p>
            <button className="review-modal__submit" style={{ maxWidth: '200px' }} onClick={onClose}>
              Закрыть
            </button>
          </div>
        ) : (
          <form style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit}>
            <h2 className="review-modal__title">НАПИСАТЬ ОТЗЫВ</h2>

            <p className="review-modal__subtitle">
              Пишите только оригинальные отзывы. Если нечего сказать — не пишите.
              Указывайте плюсы и минусы, избегайте оскорблений и спама. За спам — блокировка.
            </p>

            <div className="review-modal__fields">
              <div className="review-modal__field">
                <input
                  className="review-modal__input"
                  type="text"
                  placeholder="Название отзыва"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="review-modal__field review-modal__field--textarea">
                <textarea
                  className="review-modal__textarea"
                  placeholder="Текст отзыва"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </div>

            <button type="submit" className="review-modal__submit" disabled={!title.trim() || !text.trim()}>
              Отправить
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
