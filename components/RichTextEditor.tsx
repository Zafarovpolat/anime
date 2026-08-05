"use client";

import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

/* ── Типи ── */
export type RichTextEditorHandle = {
  focus: () => void;
};

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
};

/* ── Набір емодзі для пікера ── */
const EMOJIS = [
  "😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😎",
  "🤔", "😅", "😇", "🙂", "😉", "😌", "😔", "😢",
  "😭", "😡", "🥰", "😴", "🤩", "😱", "👍", "👎",
  "👏", "🙏", "💪", "🔥", "❤️", "💔", "✨", "🎉",
];

/* ── SVG іконки ── */
function TextFormatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 4h10M10 4v12M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8 10c0-1.5-1-2.5-2-2.5-1.5 0-2 1.5-2 3s.5 3 2 3c1 0 2-.5 2-2v-1.5zM16 10c0-1.5-1-2.5-2-2.5-1.5 0-2 1.5-2 3s.5 3 2 3c1 0 2-.5 2-2v-1.5z" fill="currentColor" />
    </svg>
  );
}

function SpoilerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 7c-3 0-5.5 1.5-7 4 1.5 2.5 4 4 7 4s5.5-1.5 7-4c-1.5-2.5-4-4-7-4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}

function StrikeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M7 6h6c1.5 0 2 1 2 2M7 14h6c1.5 0 2-1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="7.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M3 13l4-4 3 3 4-4 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4h5c1 0 2 .5 2 1.5v10c0-1-1-1.5-2-1.5H4V4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 4h-5c-1 0-2 .5-2 1.5v10c0-1 1-1.5 2-1.5h5V4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function StickerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="7.5" cy="9" r="1" fill="currentColor" />
      <circle cx="12.5" cy="9" r="1" fill="currentColor" />
      <path d="M7 12c.5 1 1.5 2 3 2s2.5-1 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
/* @@CHUNK2@@ */

/* ── Компонент ── */
const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ value, onChange, onSubmit, placeholder = "Написать комментарий...", className = "" }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [formatMenu, setFormatMenu] = useState(false);
    const [emojiPicker, setEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => editorRef.current?.focus(),
    }));

    // Синхронізація value з contentEditable
    useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }, [value]);

    // Обробка input в contentEditable
    const handleInput = () => {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    };

    // Виконання команди форматування
    const execCmd = (command: string, value: string | undefined = undefined) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      setFormatMenu(false);
    };

    // Вставка спойлера
    const insertSpoiler = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString() || "текст";

      const spoiler = document.createElement("span");
      spoiler.className = "comment-spoiler-edit";
      spoiler.contentEditable = "true";
      spoiler.textContent = selectedText;

      range.deleteContents();
      range.insertNode(spoiler);
      editorRef.current?.focus();
      handleInput();
    };

    // Вставка книги
    const insertBook = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString() || "текст";

      const book = document.createElement("span");
      book.className = "comment-book-edit";
      book.contentEditable = "true";
      book.textContent = selectedText;

      range.deleteContents();
      range.insertNode(book);
      editorRef.current?.focus();
      handleInput();
    };

    // Вставка emoji
    const insertEmoji = (emoji: string) => {
      const sticker = document.createElement("span");
      sticker.className = "comment-sticker-edit";
      sticker.textContent = emoji;

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(sticker);
        range.setStartAfter(sticker);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      setEmojiPicker(false);
      editorRef.current?.focus();
      handleInput();
    };

    // Завантаження зображення
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const imageUrl = URL.createObjectURL(file);
      const img = document.createElement("img");
      img.src = imageUrl;
      img.className = "comment-image-edit";
      img.alt = "Изображение";

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      e.target.value = "";
      editorRef.current?.focus();
      handleInput();
    };

    // Обробка Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };

    // Очистити
    const handleClear = () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
        onChange("");
        setShowToolbar(false);
      }
    };

    return (
      <div className={`richtext-editor-v2 ${className}`}>
        <div className="richtext-editor-v2__wrapper">
          <div
            ref={editorRef}
            className="richtext-editor-v2__content"
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowToolbar(true)}
            data-placeholder={placeholder}
            suppressContentEditableWarning
          />

          {showToolbar && (
            <div className="richtext-editor-v2__toolbar">
              {/* Форматування */}
              <div className="richtext-editor-v2__toolbar-group">
                <button
                  type="button"
                  className="richtext-editor-v2__btn"
                  onClick={() => setFormatMenu(!formatMenu)}
                  title="Форматування"
                >
                  <TextFormatIcon />
                </button>

                {formatMenu && (
                  <>
                    <div className="format-menu-overlay-v2" onClick={() => setFormatMenu(false)} />
                    <div className="format-menu-dropdown-v2">
                      <button type="button" onClick={() => execCmd("bold")}>
                        <strong>Жирний</strong>
                      </button>
                      <button type="button" onClick={() => execCmd("italic")}>
                        <em>Курсив</em>
                      </button>
                      <button type="button" onClick={() => execCmd("strikeThrough")}>
                        <s>Зачеркнутий</s>
                      </button>
                    </div>
                  </>
                )}

                <button type="button" className="richtext-editor-v2__btn" onClick={() => execCmd("formatBlock", "<blockquote>")} title="Цитата">
                  <QuoteIcon />
                </button>

                <button type="button" className="richtext-editor-v2__btn" onClick={insertSpoiler} title="Спойлер">
                  <SpoilerIcon />
                </button>

                <button type="button" className="richtext-editor-v2__btn" onClick={() => execCmd("strikeThrough")} title="Зачеркнутий">
                  <StrikeIcon />
                </button>
              </div>

              {/* Медіа */}
              <div className="richtext-editor-v2__toolbar-group">
                <button type="button" className="richtext-editor-v2__btn" onClick={() => fileInputRef.current?.click()} title="Зображення">
                  <ImageIcon />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />

                <button type="button" className="richtext-editor-v2__btn" onClick={insertBook} title="Оформлення">
                  <BookIcon />
                </button>

                <button type="button" className="richtext-editor-v2__btn" onClick={() => setEmojiPicker(!emojiPicker)} title="Емодзі">
                  <StickerIcon />
                </button>

                {emojiPicker && (
                  <>
                    <div className="emoji-picker-overlay" onClick={() => setEmojiPicker(false)} />
                    <div className="emoji-picker-dropdown">
                      {EMOJIS.map((emoji) => (
                        <button key={emoji} type="button" onClick={() => insertEmoji(emoji)}>
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Дії */}
              <div className="richtext-editor-v2__toolbar-group">
                <button type="button" className="richtext-editor-v2__btn" onClick={handleClear} title="Очистити">
                  <CloseIcon />
                </button>

                <button type="button" className="richtext-editor-v2__btn richtext-editor-v2__btn--send" onClick={onSubmit} title="Відправити">
                  <SendIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;

/* ── Утиліта для конвертації HTML в коментар ── */
export function parseRichText(html: string): string {
  if (!html) return "";

  return html
    // Конвертуємо edit-класи в display-класи
    .replace(/comment-spoiler-edit/g, "comment-spoiler")
    .replace(/comment-book-edit/g, "comment-book")
    .replace(/comment-sticker-edit/g, "comment-sticker")
    .replace(/comment-image-edit/g, "comment-image")
    // Додаємо функціонал спойлерів
    .replace(/<span class="comment-spoiler">(.*?)<\/span>/g, '<span class="comment-spoiler" onclick="this.classList.toggle(\'revealed\')">$1</span>');
}
