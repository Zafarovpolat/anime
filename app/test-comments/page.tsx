"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

type TestComment = {
  id: number;
  username: string;
  text: string;
  depth: number;
  replies: TestComment[];
};

const LEVELS = Array.from({ length: 10 }, (_, index) => index + 1);
const INITIAL_COMMENT: TestComment = LEVELS.reduceRight(
  (reply, level) => [{
    id: level,
    username: level === 1 ? "Jul_Mol" : level % 2 ? "MangaFan92" : "Вы",
    text: `Тестовый комментарий — уровень вложенности ${level}`,
    depth: level - 1,
    replies: reply,
  }],
  [] as TestComment[],
)[0];

function addReply(comments: TestComment[], targetId: number, reply: TestComment): TestComment[] {
  return comments.map((comment) => {
    if (comment.id === targetId) return { ...comment, replies: [...comment.replies, reply] };
    return comment.replies.length
      ? { ...comment, replies: addReply(comment.replies, targetId, reply) }
      : comment;
  });
}

function TestCommentBlock({ comment, onReply }: { comment: TestComment; onReply: (comment: TestComment) => void }) {
  return (
    <div
      id={`test-comment-${comment.id}`}
      className={`manga-inner__comment${comment.depth > 0 ? " manga-inner__comment--nested" : ""}`}
    >
      <div className="manga-inner__comment-avatar">
        <img src={`/images/${comment.depth % 2 ? "avatar2.png" : "avatar_default.png"}`} alt={comment.username} />
      </div>
      <div className="manga-inner__comment-body">
        <div className="manga-inner__comment-top">
          <div className="manga-inner__comment-header">
            <span className="manga-inner__comment-name">{comment.username}</span>
            <span className="test-comments__level">Уровень {comment.depth + 1}</span>
          </div>
          <div className="manga-inner__comment-text">{comment.text}</div>
        </div>
        <div className="manga-inner__comment-footer">
          <span className="manga-inner__comment-time">Только что</span>
          <button className="manga-inner__comment-reply" onClick={() => onReply(comment)}>
            Ответить
          </button>
        </div>
        {comment.replies.length > 0 && (
          <div className="manga-inner__comment-replies">
            {comment.replies.map((reply) => (
              <TestCommentBlock key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestCommentsPage() {
  const [comments, setComments] = useState<TestComment[]>([INITIAL_COMMENT]);
  const [nextId, setNextId] = useState(11);
  const [replyTarget, setReplyTarget] = useState<TestComment | null>(null);
  const [text, setText] = useState("");

  const submitReply = () => {
    if (!replyTarget || !text.trim()) return;
    const reply: TestComment = {
      id: nextId,
      username: "Вы",
      text: text.trim(),
      depth: replyTarget.depth + 1,
      replies: [],
    };
    setComments((current) => addReply(current, replyTarget.id, reply));
    setNextId((id) => id + 1);
    setText("");
    setReplyTarget(null);
  };

  return (
    <>
      <Header />
      <main className="main test-comments-page">
        <section className="section">
          <div className="container">
            <h1 className="section-title">Тест вложенности комментариев</h1>
            <p className="test-comments__hint">
              Тестовая ветка из 10 уровней. Здесь также можно отвечать самому себе.
            </p>
            <div className="manga-inner__comments-list test-comments__list">
              {comments.map((comment) => (
                <TestCommentBlock key={comment.id} comment={comment} onReply={setReplyTarget} />
              ))}
            </div>
            {replyTarget && (
              <div className="test-comments__form">
                <p>Ответ для <b>{replyTarget.username}</b> (уровень {replyTarget.depth + 1})</p>
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Напишите ответ"
                />
                <div>
                  <button className="test-comments__submit" onClick={submitReply}>Ответить</button>
                  <button className="test-comments__cancel" onClick={() => setReplyTarget(null)}>Отмена</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
