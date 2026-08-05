"use client";

import React, { useState, useRef, KeyboardEvent } from "react";

/* ── Типы ── */
export type RichTextContent = {
  text: string;
  html: string; // для рендера с форматированием
};

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
};

/* ── SVG иконки ── */
function TextFormatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 4h10M10 4v12M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8 10c0-1.5-1-2.5-2-2.5-1.5 0-2 1.5-2 3s.5 3 2 3c1 0 2-.5 2-2v-1.5zM16 10c0-1.5-1-2.5-2-2.5-1.5 0-2 1.5-2 3s.5 3 2 3c1 0 2-.5 2-2v-1.5z" fill="currentColor"/>
    </svg>
  );
}

function SpoilerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 7c-3 0-5.5 1.5-7 4 1.5 2.5 4 4 7 4s5.5-1.5 7-4c-1.5-2.5-4-4-7-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="11" r="2" fill="currentColor"/>
    </svg>
  );
}

function StrikeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M7 6h6c1.5 0 2 1 2 2M7 14h6c1.5 0 2-1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="7.5" cy="8.5" r="1.5" fill="currentColor"/>
      <path d="M3 13l4-4 3 3 4-4 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4h5c1 0 2 .5 2 1.5v10c0-1-1-1.5-2-1.5H4V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M16 4h-5c-1 0-2 .5-2 1.5v10c0-1 1-1.5 2-1.5h5V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

function StickerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="7.5" cy="9" r="1" fill="currentColor"/>
      <circle cx="12.5" cy="9" r="1" fill="currentColor"/>
      <path d="M7 12c.5 1 1.5 2 3 2s2.5-1 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

/* ── Компонент ── */
export default function RichTextEditor({
  value,
  onChange,
  onSubmit,
  placeholder = "Написать комментарий...",
  className = "",
}: RichTextEditorProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [formatMenu, setFormatMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Вставка форматирования
  const insertFormat = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || "текст";
    const newText =
      value.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      value.substring(end);

    onChange(newText);
    setFormatMenu(false);

    // Восстанавливаем фокус
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // В реальном проекте здесь будет загрузка на сервер
    // Сейчас просто вставляем placeholder
    const imageUrl = URL.createObjectURL(file);
    insertFormat(`[img]${imageUrl}[/img]`);

    // Очищаем input
    e.target.value = "";
  };

  return (
    <div className={`richtext-editor ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowToolbar(true)}
        placeholder={placeholder}
        className="richtext-editor__textarea"
        rows={1}
      />

      {showToolbar && (
        <div className="richtext-editor__toolbar">
          {/* Форматирование текста */}
          <div className="richtext-editor__toolbar-group">
            <button
              type="button"
              className="richtext-editor__btn"
              onClick={() => setFormatMenu(!formatMenu)}
              title="Форматирование"
            >
              <TextFormatIcon />
            </button>

            {formatMenu && (
              <>
                <div className="format-menu-overlay" onClick={() => setFormatMenu(false)} />
                <div className="format-menu-dropdown">
                  <button
                    type="button"
                    onClick={() => insertFormat("**", "**")}
                    className="format-menu-dropdown__item"
                  >
                    <strong>Жирный</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat("*", "*")}
                    className="format-menu-dropdown__item"
                  >
                    <em>Курсив</em>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormat("~~", "~~")}
                    className="format-menu-dropdown__item"
                  >
                    <s>Зачеркнутый</s>
                  </button>
                </div>
              </>
            )}

            <button
              type="button"
              className="richtext-editor__btn"
              onClick={() => insertFormat("> ", "")}
              title="Цитата"
            >
              <QuoteIcon />
            </button>

            <button
              type="button"
              className="richtext-editor__btn"
              onClick={() => insertFormat("[spoiler]", "[/spoiler]")}
              title="Спойлер"
            >
              <SpoilerIcon />
            </button>

            <button
              type="button"
              className="richtext-editor__btn"
              onClick={() => insertFormat("~~", "~~")}
              title="Зачеркнутый"
            >
              <StrikeIcon />
            </button>
          </div>

          {/* Медиа */}
          <div className="richtext-editor__toolbar-group">
            <button
              type="button"
              className="richtext-editor__btn"
              onClick={() => fileInputRef.current?.click()}
              title="Изображение"
            >
              <ImageIcon />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />

            <button
              type="button"
              className="richtext-editor__btn"
              onClick={() => insertFormat("[book]", "[/book]")}
              title="Оформление"
            >
              <BookIcon />
            </button>

            <button
              type="button"
              className="richtext-editor__btn"
              onClick={() => insertFormat("[sticker]😊[/sticker]")}
              title="Стикер"
            >
              <StickerIcon />
            </button>
          </div>

          {/* Действия */}
          <div className="richtext-editor__toolbar-group">
            <button
              type="button"
              className="richtext-editor__btn"
              onClick={() => {
                onChange("");
                setShowToolbar(false);
              }}
              title="Очистить"
            >
              <CloseIcon />
            </button>

            <button
              type="button"
              className="richtext-editor__btn richtext-editor__btn--send"
              onClick={onSubmit}
              title="Отправить"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Утилита для парсинга и рендера ── */
export function parseRichText(text: string): string {
  if (!text) return "";

  let html = text
    // Экранируем HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Жирный
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Курсив
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Зачеркнутый
    .replace(/~~(.*?)~~/g, "<s>$1</s>")
    // Цитата
    .replace(/^> (.+)$/gm, '<blockquote class="comment-quote">$1</blockquote>')
    // Спойлер
    .replace(/\[spoiler\](.*?)\[\/spoiler\]/g, '<span class="comment-spoiler" onclick="this.classList.toggle(\'revealed\')">$1</span>')
    // Изображения
    .replace(/\[img\](.*?)\[\/img\]/g, '<img src="$1" alt="Изображение" class="comment-image" />')
    // Стикеры
    .replace(/\[sticker\](.*?)\[\/sticker\]/g, '<span class="comment-sticker">$1</span>')
    // Книга (оформление)
    .replace(/\[book\](.*?)\[\/book\]/g, '<span class="comment-book">$1</span>')
    // Переносы строк
    .replace(/\n/g, "<br>");

  return html;
}
