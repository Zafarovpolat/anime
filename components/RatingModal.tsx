"use client";

import { useEffect, useState } from "react";

interface RatingModalProps {
  /** Средняя оценка произведения на сайте */
  rating: number;
  /** Сколько всего оценок */
  ratingCount: string;
  /** Оценка текущего пользователя: null — ещё не оценивал */
  value: number | null;
  /** Сохранить новую оценку или снять её (null) */
  onChange: (value: number | null) => void;
  onClose: () => void;
}

/* Оценка от 1 до 10 — как на странице произведения */
const STARS = Array.from({ length: 10 }, (_, i) => i + 1);

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.8998 11.9L6.3999 6.40002M6.3999 6.40002L0.899902 0.900024M6.3999 6.40002L11.8999 0.900024M6.3999 6.40002L0.899902 11.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.2091 1.01094L9.44445 3.49535C9.61092 3.83894 10.0578 4.16491 10.4345 4.23538L12.6687 4.6054C14.0969 4.84327 14.4298 5.88285 13.4047 6.92242L11.6611 8.6756C11.372 8.96633 11.2055 9.53898 11.3019 9.95305L11.8013 12.1203C12.1956 13.8294 11.2844 14.499 9.78617 13.6004L7.69214 12.3494C7.3154 12.1203 6.68458 12.1203 6.30783 12.3494L4.21381 13.6004C2.71558 14.4902 1.80439 13.8294 2.19866 12.1203L2.69808 9.95305C2.79445 9.54779 2.62798 8.97514 2.33885 8.6756L0.595308 6.92242C-0.429794 5.89165 -0.0968578 4.85208 1.33128 4.6054L3.56546 4.23538C3.94221 4.17372 4.38905 3.83894 4.55552 3.49535L5.7909 1.01094C6.44802 -0.336981 7.53446 -0.336981 8.2091 1.01094Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Модальное окно оценки: средний балл произведения + выставление своей оценки звёздами.
   Открывается по клику на оценку, перенесённую на обложку. */
export default function RatingModal({ rating, ratingCount, value, onChange, onClose }: RatingModalProps) {
  const [draft, setDraft] = useState(value ?? 0);
  const [hover, setHover] = useState(0);

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

  /* При наведении показываем предпросмотр будущей оценки */
  const shown = hover || draft;

  return (
    <div className="review-overlay" onMouseDown={onClose}>
      <div
        className="review-modal rating-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Оценить произведение"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="review-modal__close" onClick={onClose} aria-label="Закрыть">
          <CloseIcon />
        </button>

        <h2 className="rating-modal__title">ОЦЕНИТЬ ПРОИЗВЕДЕНИЕ</h2>

        <div className="rating-modal__score">
          <span className="rating-modal__score-val">{rating}</span>
          <span className="rating-modal__score-count">{ratingCount}</span>
        </div>

        <div className="rating-modal__stars" onMouseLeave={() => setHover(0)}>
          {STARS.map((star) => (
            <button
              key={star}
              type="button"
              className={`rating-modal__star${shown >= star ? " rating-modal__star--active" : ""}`}
              onMouseEnter={() => setHover(star)}
              onFocus={() => setHover(star)}
              onBlur={() => setHover(0)}
              onClick={() => setDraft(star)}
              aria-label={`Оценить на ${star}`}
            >
              <StarIcon />
            </button>
          ))}
        </div>

        <p className="rating-modal__hint">
          {draft > 0 ? `Ваша оценка: ${draft} из 10` : "Выберите оценку от 1 до 10"}
        </p>

        <div className="rating-modal__actions">
          <button
            type="button"
            className="rating-modal__save"
            disabled={draft === 0}
            onClick={() => {
              onChange(draft);
              onClose();
            }}
          >
            Сохранить оценку
          </button>
          {value !== null && (
            <button
              type="button"
              className="rating-modal__clear"
              onClick={() => {
                onChange(null);
                setDraft(0);
                onClose();
              }}
            >
              Убрать оценку
            </button>
          )}
        </div>
      </div>
    </div>
  );
}