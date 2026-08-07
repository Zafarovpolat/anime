"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewModal from "@/components/ReviewModal";
import ReportModal from "@/components/ReportModal";
import RichTextEditor, { parseRichText, handleSpoilerClick, RichTextEditorHandle } from "@/components/RichTextEditor";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/* ── mock data ── */
const DEFAULT_DATA = {
  title: "НАНОМАШИНЫ",
  genres: ["Боевые искусства", "2024"],
  likes: "12.5k",
  views: "140k",
  bookmarks: "24.4k",
  rating: 9.6,
  ratingCount: "21 401 оценок",
  description: [
    "Чон Еун - рождённый в незаконном браке принц. С самого детства он страдал от полного отсутствия внутренней энергии, что вызывало всеобщую отвращение и презрение к нему. Угнетённый и лишённый мотивации, он проживал жалкое существование, не надеясь на что-либо большее. Еун был изгоем, презираемым шести великими кланами, но однажды все изменилось.",
    'В один день он был окружён десятком убийц, готовых уничтожить его. Подавленный и уже готовый сдаться, Еун чуть не потерял сознание, окутываясь белым светом безнадёжности и отчаяния, но тут на горизонте появилась еле заметная фигура. Этот незнакомец был "потомком" из будущего и моментально уничтожил всех врагов. Затем он вложил странный предмет под названием Наномашина в тело Еуна. С этого момента все изменилось.',
    "Искусственный интеллект, заложенный внутрь этой Наномашины, дал новый импульс его жизни. Больше ничего не будет как прежде. Это начало новой истории, истории о парне, который решил перейти через небеса и поднять вызов им.",
  ],
  totalChapters: 309,
  totalReviews: 47,
};

const CHAPTERS_LIST = Array.from({ length: 13 }, (_, i) => ({
  volume: 1,
  chapter: 241 - i,
  date: "09.01.2026",
  views: "3 646",
}));

/* Комментарий + вложенные ответы (древовидная структура) */
type CommentType = {
  id: number;
  avatar: string;
  username: string;
  text: string;
  time: string;
  likes: number;
  dislikes: number;
  userReaction: null | "like" | "dislike";
  replies: CommentType[];
  /* Кому именно адресован этот ответ внутри ветки (root или другой ответ) — чтобы не терялся контекст, когда в ветке несколько ответов */
  replyToUsername: string | null;
  /* id комментария, на который отвечают — для скролла к нему по клику на «Ответ для …» */
  replyToId: number | null;
};

const INITIAL_COMMENTS: CommentType[] = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  avatar: "/images/avatar_default.png",
  username: "Jul_Mol",
  text: "Нравится и рисовка да фантазия автора удивляет",
  time: "14 часов назад",
  likes: 20,
  dislikes: 1,
  userReaction: null,
  replyToUsername: null,
  replyToId: null,
  replies: i === 0 ? [
    {
      id: 1000,
      avatar: "/images/avatar_default.png",
      username: "MangaFan92",
      text: "Согласен, рисовка действительно очень хорошая",
      time: "12 часов назад",
      likes: 5,
      dislikes: 0,
      userReaction: null,
      replyToUsername: "Jul_Mol",
      replyToId: 0,
      replies: [],
    },
  ] : [],
}));

/* Превращает rich-text (HTML) комментария в plain-текст — для превью «на что отвечаешь» */
function stripHtml(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]*>/g, "");
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || "").trim();
}

/* Скролл к комментарию по id + кратковременная подсветка */
function scrollToComment(id: number) {
  const el = document.getElementById(`comment-${id}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("comment--highlight");
  setTimeout(() => el.classList.remove("comment--highlight"), 1600);
}

function mapCommentTree(list: CommentType[], id: number, fn: (c: CommentType) => CommentType): CommentType[] {
  return list.map((c) => {
    if (c.id === id) return fn(c);
    if (c.replies.length) return { ...c, replies: mapCommentTree(c.replies, id, fn) };
    return c;
  });
}

function removeFromCommentTree(list: CommentType[], id: number): CommentType[] {
  return list
    .filter((c) => c.id !== id)
    .map((c) => ({ ...c, replies: removeFromCommentTree(c.replies, id) }));
}

function findThreadRootId(list: CommentType[], id: number): number {
  for (const c of list) {
    if (c.id === id) return c.id;
    if (c.replies.some((r) => r.id === id)) return c.id;
  }
  return id;
}

function addReplyToThread(list: CommentType[], rootId: number, reply: CommentType): CommentType[] {
  return list.map((c) => (c.id === rootId ? { ...c, replies: [...c.replies, reply] } : c));
}

const REVIEWS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  username: "Jul_Mot",
  time: "2 месяца назад",
  title: "Спасибо",
  text: "Оригинальный сюжет для ренкорнаций.Впервые я смотрю аниме после прочтения манги. И здесь очень важно найти СВОЙ формат познания этой истории. Аниме помогло мне увидеть истинную её красоту, благодаря кинематографическим средствам, красоте рисовки и цветов, красоте главной мысли этого произведения.",
  rating: i % 3 === 0 ? 10 : i % 3 === 1 ? 3 : 7,
  views: "1 470",
  likes: 240,
  type: i % 3 === 0 ? "positive" : i % 3 === 1 ? "negative" : "neutral",
}));

/* ── SVG icons ── */
function HeartIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 8.68998C22 9.87998 21.81 10.98 21.48 12H2.52C2.19 10.98 2 9.87998 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.37 3.09998 10.99 3.97998 12 5.32998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998Z"
        fill="#292D32"
      />
      <path
        opacity="0.4"
        d="M21.4795 12C19.8995 17 15.0295 19.99 12.6195 20.81C12.2795 20.93 11.7195 20.93 11.3795 20.81C8.96953 19.99 4.09953 17 2.51953 12H21.4795Z"
        fill="#292D32"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M21.25 9.15005C18.94 5.52005 15.56 3.43005 12 3.43005C10.22 3.43005 8.49 3.95005 6.91 4.92005C5.33 5.90005 3.91 7.33005 2.75 9.15005C1.75 10.7201 1.75 13.2701 2.75 14.8401C5.06 18.4801 8.44 20.5601 12 20.5601C13.78 20.5601 15.51 20.0401 17.09 19.0701C18.67 18.0901 20.09 16.6601 21.25 14.8401C22.25 13.2801 22.25 10.7201 21.25 9.15005ZM12 16.0401C9.76 16.0401 7.96 14.2301 7.96 12.0001C7.96 9.77005 9.76 7.96005 12 7.96005C14.24 7.96005 16.04 9.77005 16.04 12.0001C16.04 14.2301 14.24 16.0401 12 16.0401Z"
        fill="#180F2A"
      />
      <path
        d="M12.0004 9.14001C10.4304 9.14001 9.15039 10.42 9.15039 12C9.15039 13.57 10.4304 14.85 12.0004 14.85C13.5704 14.85 14.8604 13.57 14.8604 12C14.8604 10.43 13.5704 9.14001 12.0004 9.14001Z"
        fill="#180F2A"
      />
    </svg>
  );
}

function BookmarkFillIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M16.8203 2H7.18031C5.05031 2 3.32031 3.74 3.32031 5.86V19.95C3.32031 21.75 4.61031 22.51 6.19031 21.64L11.0703 18.93C11.5903 18.64 12.4303 18.64 12.9403 18.93L17.8203 21.64C19.4003 22.52 20.6903 21.76 20.6903 19.95V5.86C20.6803 3.74 18.9503 2 16.8203 2Z"
        fill="#180F2A"
      />
      <path
        d="M11.9998 10.2801C10.9798 10.2801 9.95976 10.1001 8.98976 9.75005C8.59976 9.61005 8.39976 9.18005 8.53976 8.79005C8.68976 8.40005 9.11976 8.20005 9.50976 8.34005C11.1198 8.92005 12.8898 8.92005 14.4998 8.34005C14.8898 8.20005 15.3198 8.40005 15.4598 8.79005C15.5998 9.18005 15.3998 9.61005 15.0098 9.75005C14.0398 10.1001 13.0198 10.2801 11.9998 10.2801Z"
        fill="#180F2A"
      />
    </svg>
  );
}

function BookmarkOutlineIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        opacity="0.4"
        d="M16.82 2H7.18C5.05 2 3.32 3.74 3.32 5.86V19.95C3.32 21.75 4.61 22.51 6.19 21.64L11.07 18.93C11.59 18.64 12.43 18.64 12.94 18.93L17.82 21.64C19.4 22.52 20.69 21.76 20.69 19.95V5.86C20.68 3.74 18.95 2 16.82 2Z"
        fill="#562CF0"
      />
      <path
        d="M12 10.28C10.98 10.28 9.96 10.1 8.99 9.75C8.6 9.61 8.4 9.18 8.54 8.79C8.69 8.4 9.12 8.2 9.51 8.34C11.12 8.92 12.89 8.92 14.5 8.34C14.89 8.2 15.32 8.4 15.46 8.79C15.6 9.18 15.4 9.61 15.01 9.75C14.04 10.1 13.02 10.28 12 10.28Z"
        fill="#562CF0"
      />
    </svg>
  );
}

function BookSquareIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M18.2142 2.25H8.79797C4.70297 2.25 2.26172 4.69125 2.26172 8.78625V18.2025C2.26172 22.2975 4.70297 24.7387 8.79797 24.7387H18.2142C22.3092 24.7387 24.7505 22.2975 24.7505 18.2025V8.78625C24.7505 4.69125 22.3092 2.25 18.2142 2.25Z"
        fill="white"
      />
      <path
        d="M12.9373 9.10113V19.4061C12.9373 19.8111 12.5323 20.0811 12.161 19.9236C10.7998 19.3386 9.02225 18.7986 7.78475 18.6411L7.571 18.6186C6.88475 18.5286 6.32227 17.8874 6.32227 17.1899V8.52736C6.32227 7.67236 7.01977 7.03113 7.87477 7.09863C9.28102 7.21113 11.3623 7.88614 12.6673 8.62864C12.836 8.70739 12.9373 8.89863 12.9373 9.10113Z"
        fill="white"
      />
      <path
        d="M20.6775 8.66243V17.1787C20.6775 17.8762 20.115 18.5174 19.4288 18.6074L19.1925 18.6299C17.9662 18.7987 16.2 19.3274 14.8388 19.9012C14.4675 20.0587 14.0625 19.7887 14.0625 19.3837V9.0899C14.0625 8.8874 14.1638 8.69618 14.3438 8.59493C15.6487 7.86368 17.685 7.21115 19.0688 7.0874H19.1137C19.98 7.09865 20.6775 7.79618 20.6775 8.66243Z"
        fill="white"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="#97989B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 22L20 20"
        stroke="#97989B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M8.29513 6.95333L18.8185 3.44166C23.5435 1.86666 26.1101 4.445 24.5468 9.17L21.0351 19.6933C18.6785 26.775 14.8051 26.775 12.4485 19.6933L11.4101 16.5667L8.28346 15.5283C1.21346 13.1833 1.21346 9.32166 8.29513 6.95333Z"
        fill="white"
      />
      <path
        d="M14.1406 13.5685L18.5856 9.11182L14.1406 13.5685Z"
        fill="white"
      />
      <path
        d="M14.1397 14.4435C13.918 14.4435 13.6963 14.3618 13.5213 14.1868C13.183 13.8485 13.183 13.2885 13.5213 12.9502L17.9547 8.4935C18.293 8.15516 18.853 8.15516 19.1913 8.4935C19.5297 8.83183 19.5297 9.39183 19.1913 9.73016L14.758 14.1868C14.583 14.3502 14.3613 14.4435 14.1397 14.4435Z"
        fill="white"
      />
    </svg>
  );
}

function EyeSmallIcon() {
  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 4.15428C8 -0.540161 1 -0.0401611 1 5.95987C1 11.9599 10 16.9601 10 16.9601C10 16.9601 19 11.9599 19 5.95987C19 -0.0401611 12 -0.540161 10 4.15428Z"
        stroke="#180F2A"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}


function EditIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#9B9FAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#9B9FAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


function HorizontalDotsIcon() {
  return (
    <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2C13 2.55228 13.4477 3 14 3C14.5523 3 15 2.55228 15 2C15 1.44772 14.5523 1 14 1C13.4477 1 13 1.44772 13 2Z" stroke="#9B9FAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 2C7 2.55228 7.44772 3 8 3C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1C7.44772 1 7 1.44772 7 2Z" stroke="#9B9FAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 2C1 2.55228 1.44772 3 2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2Z" stroke="#9B9FAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ThreeDotsIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill="#180F2A"
      />
      <path
        d="M12 13.75C12.41 13.75 12.75 13.41 12.75 13V8C12.75 7.59 12.41 7.25 12 7.25C11.59 7.25 11.25 7.59 11.25 8V13C11.25 13.41 11.59 13.75 12 13.75Z"
        fill="#180F2A"
      />
      <path
        d="M12.92 15.6199C12.87 15.4999 12.8 15.3899 12.71 15.2899C12.61 15.1999 12.5 15.1299 12.38 15.0799C12.14 14.9799 11.86 14.9799 11.62 15.0799C11.5 15.1299 11.39 15.1999 11.29 15.2899C11.2 15.3899 11.13 15.4999 11.08 15.6199C11.03 15.7399 11 15.8699 11 15.9999C11 16.1299 11.03 16.2599 11.08 16.3799C11.13 16.5099 11.2 16.6099 11.29 16.7099C11.39 16.7999 11.5 16.8699 11.62 16.9199C11.74 16.9699 11.87 16.9999 12 16.9999C12.13 16.9999 12.26 16.9699 12.38 16.9199C12.5 16.8699 12.61 16.7999 12.71 16.7099C12.8 16.6099 12.87 16.5099 12.92 16.3799C12.97 16.2599 13 16.1299 13 15.9999C13 15.8699 12.97 15.7399 12.92 15.6199Z"
        fill="#180F2A"
      />
    </svg>
  );
}

function ThumbUpIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M21.6509 10.0302C21.2609 9.47022 20.5709 9.15022 19.7809 9.15022H15.6809C15.4109 9.15022 15.1609 9.04022 14.9909 8.84022C14.8109 8.64022 14.7409 8.36022 14.7809 8.07022L15.2909 4.79022C15.5109 3.81022 14.8609 2.71022 13.8809 2.38022C12.9709 2.04022 11.9009 2.50022 11.4709 3.15022L7.25086 9.42022L7.13086 9.62022V18.4602L7.28086 18.6102L10.4509 21.0602C10.8709 21.4802 11.8209 21.7102 12.4909 21.7102H16.3909C17.7309 21.7102 19.0809 20.7002 19.3809 19.4702L21.8409 11.9802C22.1009 11.2702 22.0309 10.5802 21.6509 10.0302Z"
        fill="#999999"
      />
      <path
        d="M5.21 6.37988H4.18C2.63 6.37988 2 6.97988 2 8.45988V18.5199C2 19.9999 2.63 20.5999 4.18 20.5999H5.21C6.76 20.5999 7.39 19.9999 7.39 18.5199V8.45988C7.39 6.97988 6.76 6.37988 5.21 6.37988Z"
        fill="#999999"
      />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M2.34904 13.9598C2.73904 14.5198 3.42904 14.8398 4.21904 14.8398H8.31904C8.58904 14.8398 8.83904 14.9498 9.00904 15.1498C9.18904 15.3498 9.25904 15.6298 9.21904 15.9198L8.70904 19.1998C8.48904 20.1798 9.13904 21.2798 10.119 21.6098C11.029 21.9498 12.099 21.4898 12.529 20.8398L16.739 14.5698L16.859 14.3698V5.52979L16.709 5.37979L13.539 2.92979C13.119 2.50979 12.169 2.27979 11.499 2.27979H7.59904C6.25904 2.27979 4.90904 3.28979 4.60904 4.51979L2.14904 12.0098C1.89904 12.7198 1.96904 13.4198 2.34904 13.9598Z"
        fill="#999999"
      />
      <path
        d="M18.7894 17.6099H19.8194C21.3694 17.6099 21.9994 17.0099 21.9994 15.5299V5.4799C21.9994 3.9999 21.3694 3.3999 19.8194 3.3999H18.7894C17.2394 3.3999 16.6094 3.9999 16.6094 5.4799V15.5399C16.6094 17.0099 17.2394 17.6099 18.7894 17.6099Z"
        fill="#999999"
      />
    </svg>
  );
}

/* Рекурсивный рендер комментария: корень и вложенные ответы используют одну и ту же разметку */
function CommentBlock({
  comment: c,
  nested,
  editingCommentId,
  editingCommentText,
  onChangeEditText,
  onStartEdit,
  onSaveEdit,
  commentMenuOpen,
  onToggleMenu,
  onDelete,
  onReport,
  onReply,
  onLike,
  onDislike,
}: {
  comment: CommentType;
  nested?: boolean;
  editingCommentId: number | null;
  editingCommentText: string;
  onChangeEditText: (text: string) => void;
  onStartEdit: (c: CommentType) => void;
  onSaveEdit: (id: number) => void;
  commentMenuOpen: number | null;
  onToggleMenu: (id: number | null) => void;
  onDelete: (id: number) => void;
  onReport: () => void;
  onReply: (c: CommentType) => void;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
}) {
  return (
    <div
      id={`comment-${c.id}`}
      className={`manga-inner__comment${nested ? " manga-inner__comment--nested" : ""}${c.replies.length > 0 ? " manga-inner__comment--has-replies" : ""}`}
    >
      <div className="manga-inner__comment-avatar">
        <img src={`/images/cover_${(c.id % 12) + 1}.jpg`} alt={c.username} />
      </div>
      <div className="manga-inner__comment-body">
        <div className="manga-inner__comment-top">
          <div className="manga-inner__comment-header">
            <span className="manga-inner__comment-name">{c.username}</span>
            {c.username === "Вы" ? (
              <div style={{ position: "relative" }}>
                <button
                  className="manga-inner__comment-menu"
                  onClick={() => onToggleMenu(commentMenuOpen === c.id ? null : c.id)}
                  aria-label="Меню"
                >
                  <HorizontalDotsIcon />
                </button>
                {commentMenuOpen === c.id && (
                  <>
                    <div className="comment-menu-overlay" onClick={() => onToggleMenu(null)} />
                    <div className="comment-menu-dropdown">
                      <button
                        className="comment-menu-dropdown__item comment-menu-dropdown__item--active"
                        onClick={() => {
                          onToggleMenu(null);
                          onStartEdit(c);
                        }}
                      >
                        Редактировать
                      </button>
                      <button
                        className="comment-menu-dropdown__item"
                        style={{ color: "#EF4444" }}
                        onClick={() => {
                          onToggleMenu(null);
                          onDelete(c.id);
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button className="manga-inner__comment-menu" onClick={onReport} title="Пожаловаться" aria-label="Пожаловаться">
                <ThreeDotsIcon />
              </button>
            )}
          </div>
          {c.replyToUsername && (
            <div className="manga-inner__comment-replyto">
              Ответ для{" "}
              {c.replyToId != null ? (
                <b
                  className="manga-inner__comment-replyto-link"
                  onClick={() => scrollToComment(c.replyToId as number)}
                  title="Перейти к комментарию"
                >
                  {c.replyToUsername}
                </b>
              ) : (
                <b>{c.replyToUsername}</b>
              )}
            </div>
          )}
          {editingCommentId === c.id ? (
            <div className="comment-inline-edit">
              <RichTextEditor
                value={editingCommentText}
                onChange={onChangeEditText}
                onSubmit={() => onSaveEdit(c.id)}
                placeholder="Редактировать комментарий..."
              />
            </div>
          ) : (
            <div
              className="manga-inner__comment-text"
              onClick={handleSpoilerClick}
              dangerouslySetInnerHTML={{ __html: parseRichText(c.text) }}
            />
          )}
        </div>
        <div className="manga-inner__comment-footer">
          <span className="manga-inner__comment-time">{c.time}</span>
          {c.username !== "Вы" && (
            <span
              className="manga-inner__comment-reply"
              style={{ cursor: "pointer" }}
              onClick={() => onReply(c)}
            >
              Ответить
            </span>
          )}
          <div className="manga-inner__comment-reactions">
            <span
              className={`manga-inner__comment-like${c.userReaction === "like" ? " manga-inner__comment-like--active" : ""}`}
              onClick={() => onLike(c.id)}
            >
              <ThumbUpIcon /> {c.likes}
            </span>
            <span
              className={`manga-inner__comment-dislike${c.userReaction === "dislike" ? " manga-inner__comment-dislike--active" : ""}`}
              onClick={() => onDislike(c.id)}
            >
              <ThumbDownIcon /> {c.dislikes}
            </span>
          </div>
        </div>

        {c.replies.length > 0 && (
          <div className="manga-inner__comment-replies">
            {c.replies.map((r) => (
              <CommentBlock
                key={r.id}
                comment={r}
                nested
                editingCommentId={editingCommentId}
                editingCommentText={editingCommentText}
                onChangeEditText={onChangeEditText}
                onStartEdit={onStartEdit}
                onSaveEdit={onSaveEdit}
                commentMenuOpen={commentMenuOpen}
                onToggleMenu={onToggleMenu}
                onDelete={onDelete}
                onReport={onReport}
                onReply={onReply}
                onLike={onLike}
                onDislike={onDislike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SmilePositiveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2"/>
      <path d="M8.5 14.5C8.5 14.5 9.8 16 12 16C14.2 16 15.5 14.5 15.5 14.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="9" cy="10" r="1.4" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.4" fill="currentColor"/>
    </svg>
  );
}

function SmileNegativeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2"/>
      <path d="M8.5 16C8.5 16 9.8 14.5 12 14.5C14.2 14.5 15.5 16 15.5 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="9" cy="10" r="1.4" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.4" fill="currentColor"/>
    </svg>
  );
}

function SmileNeutralIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.2"/>
      <path d="M9 15.5H15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="9" cy="10" r="1.4" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.4" fill="currentColor"/>
    </svg>
  );
}

function ReviewEyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M15.9375 6.86251C14.205 4.14001 11.67 2.57251 9 2.57251C7.665 2.57251 6.3675 2.96251 5.1825 3.69001C3.9975 4.42501 2.9325 5.49751 2.0625 6.86251C1.3125 8.04001 1.3125 9.95251 2.0625 11.13C3.795 13.86 6.33 15.42 9 15.42C10.335 15.42 11.6325 15.03 12.8175 14.3025C14.0025 13.5675 15.0675 12.495 15.9375 11.13C16.6875 9.96001 16.6875 8.04001 15.9375 6.86251ZM9 12.03C7.32 12.03 5.97 10.6725 5.97 9.00001C5.97 7.32751 7.32 5.97001 9 5.97001C10.68 5.97001 12.03 7.32751 12.03 9.00001C12.03 10.6725 10.68 12.03 9 12.03Z" fill="#180F2A"/>
      <path d="M8.99883 6.85492C7.82133 6.85492 6.86133 7.81492 6.86133 8.99992C6.86133 10.1774 7.82133 11.1374 8.99883 11.1374C10.1763 11.1374 11.1438 10.1774 11.1438 8.99992C11.1438 7.82242 10.1763 6.85492 8.99883 6.85492Z" fill="#180F2A"/>
    </svg>
  );
}

function ReviewHeartIcon() {
  return (
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.75 3.31938C6.19444 -0.504391 0.75 -0.0971239 0.75 4.7901C0.75 9.67732 7.75 13.7501 7.75 13.7501C7.75 13.7501 14.75 9.67732 14.75 4.7901C14.75 -0.0971239 9.30556 -0.504391 7.75 3.31938Z" stroke="#97989B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ReverseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 12L4 15L7 12M4 15V1M15 4L12 1L9 4M12 1V15"
        stroke="#562CF0"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

/* ── Toolbar icons ── */
function ToolbarChaptersIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 5.25H14C13.59 5.25 13.25 4.91 13.25 4.5C13.25 4.09 13.59 3.75 14 3.75H21C21.41 3.75 21.75 4.09 21.75 4.5C21.75 4.91 21.41 5.25 21 5.25Z"
        fill="#180F2A"
      />
      <path
        opacity="0.4"
        d="M21 10.25H14C13.59 10.25 13.25 9.91 13.25 9.5C13.25 9.09 13.59 8.75 14 8.75H21C21.41 8.75 21.75 9.09 21.75 9.5C21.75 9.91 21.41 10.25 21 10.25Z"
        fill="#180F2A"
      />
      <path
        d="M21 15.25H3C2.59 15.25 2.25 14.91 2.25 14.5C2.25 14.09 2.59 13.75 3 13.75H21C21.41 13.75 21.75 14.09 21.75 14.5C21.75 14.91 21.41 15.25 21 15.25Z"
        fill="#180F2A"
      />
      <path
        opacity="0.4"
        d="M21 20.25H3C2.59 20.25 2.25 19.91 2.25 19.5C2.25 19.09 2.59 18.75 3 18.75H21C21.41 18.75 21.75 19.09 21.75 19.5C21.75 19.91 21.41 20.25 21 20.25Z"
        fill="#180F2A"
      />
      <path
        opacity="0.4"
        d="M7.92 3.5H5.08C3.68 3.5 3 4.18 3 5.58V8.43C3 9.83 3.68 10.51 5.08 10.51H7.93C9.33 10.51 10.01 9.83 10.01 8.43V5.58C10 4.18 9.32 3.5 7.92 3.5Z"
        fill="#180F2A"
      />
    </svg>
  );
}

function ToolbarCommentsIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M21.5475 19.6349L22.0025 23.3216C22.1192 24.2899 21.0808 24.9666 20.2525 24.4649L15.3642 21.5599C14.8275 21.5599 14.3025 21.5249 13.7892 21.4549C14.6525 20.4399 15.1658 19.1566 15.1658 17.7682C15.1658 14.4549 12.2958 11.7716 8.74917 11.7716C7.39584 11.7716 6.14751 12.1566 5.10918 12.8333C5.07418 12.5416 5.0625 12.2499 5.0625 11.9466C5.0625 6.63824 9.67084 2.33325 15.3642 2.33325C21.0575 2.33325 25.6658 6.63824 25.6658 11.9466C25.6658 15.0966 24.0442 17.8849 21.5475 19.6349Z"
        fill="#180F2A"
      />
      <path
        d="M15.1654 17.7683C15.1654 19.1567 14.652 20.44 13.7887 21.455C12.6337 22.855 10.802 23.7533 8.7487 23.7533L5.7037 25.5617C5.19036 25.8767 4.53703 25.445 4.60703 24.85L4.89869 22.5517C3.33536 21.4667 2.33203 19.7283 2.33203 17.7683C2.33203 15.715 3.4287 13.9067 5.1087 12.8334C6.14704 12.1567 7.39536 11.7717 8.7487 11.7717C12.2954 11.7717 15.1654 14.455 15.1654 17.7683Z"
        fill="#180F2A"
      />
    </svg>
  );
}

function ToolbarBookmarkIcon() {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 4.55744C8.77778 -0.737018 1 -0.17311 1 6.59382C1 13.3607 11 19 11 19C11 19 21 13.3607 21 6.59382C21 -0.17311 13.2222 -0.737018 11 4.55744Z"
        stroke="#180F2A"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function ToolbarSettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.47 5.33 4.3 6.24 3.78L7.97 2.79C8.76 2.32 9.78 2.6 10.25 3.39L10.36 3.58C11.26 5.15 12.74 5.15 13.65 3.58L13.76 3.39C14.23 2.6 15.25 2.32 16.04 2.79L17.77 3.78C18.68 4.3 18.99 5.47 18.47 6.37C17.56 7.94 18.3 9.22 20.11 9.22C21.15 9.22 22.01 10.07 22.01 11.12V12.88C22.01 13.92 21.16 14.78 20.11 14.78C18.3 14.78 17.56 16.06 18.47 17.63C18.99 18.54 18.68 19.7 17.77 20.22L16.04 21.21C15.25 21.68 14.23 21.4 13.76 20.61L13.65 20.42C12.75 18.85 11.27 18.85 10.36 20.42L10.25 20.61C9.78 21.4 8.76 21.68 7.97 21.21L6.24 20.22C5.33 19.7 5.02 18.53 5.54 17.63C6.45 16.06 5.71 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 4L12 12"
        stroke="#97989B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 4L4 12"
        stroke="#97989B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Toolbar Panel Data ── */
const TOOLBAR_CHAPTERS = Array.from({ length: 10 }, (_, i) => ({
  volume: 1,
  chapter: 241 - i,
  date: "09.01.2026",
  views: "3 646",
}));

const TOOLBAR_COMMENTS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  username: "Jul_Mol",
  text: "Нравится и рисовка да фантазия автора удивляет",
  time: "14 часов назад",
}));

const BOOKMARK_OPTIONS = [
  { label: "Читаю",       color: "#562CF0" },
  { label: "Буду читать", color: "#3B82F6" },
  { label: "Прочитано",   color: "#22C55E" },
  { label: "Брошено",     color: "#EF4444" },
  { label: "Избранное",   color: "#F59E0B" },
];

/* ── Page Component ── */
export default function MangaPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id) || 0;
  const data = DEFAULT_DATA;
  const coverIdx = (id % 12) + 1;

  const [activeTab, setActiveTab] = useState<"main" | "chapters" | "comments" | "reviews">(
    "main",
  );
const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
  const [commentSort, setCommentSort] = useState<"new" | "popular">("new");
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);
  const [reviews, setReviews] = useState(REVIEWS.map(r => ({ ...r, userReaction: null as 'like' | null })));
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [commentMenuOpen, setCommentMenuOpen] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ rootId: number; targetId: number; username: string; text: string } | null>(null);
  const commentInputRef = useRef<RichTextEditorHandle>(null);
  const searchParams = useSearchParams();
  const edittext = searchParams.get('edittext');
  const router = useRouter();

  useEffect(() => {
    if (edittext) {
      setActiveTab('comments');
      const fakeId = Date.now();
      setComments(prev => [{
        id: fakeId,
        avatar: "/images/avatar_default.png",
        username: "Вы",
        text: edittext,
        time: "Только что",
        likes: 0,
        dislikes: 0,
        userReaction: null,
        replyToUsername: null,
        replyToId: null,
        replies: [],
      }, ...prev]);
      setEditingCommentId(fakeId);
      setEditingCommentText(edittext);
      
      // Очищаем URL от параметра edittext без перезагрузки страницы
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [edittext]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reversed, setReversed] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [bookmarkDropdownOpen, setBookmarkDropdownOpen] = useState(false);
  const [bookmarkValue, setBookmarkValue] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<"all" | "positive" | "negative" | "neutral">("all");
  const bookmarkWrapRef = useRef<HTMLDivElement>(null);
  const bookmarkBtnRef = useRef<HTMLButtonElement>(null);
  const bookmarkDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownBottom, setDropdownBottom] = useState<number | null>(null);

  useEffect(() => {
    if (!bookmarkDropdownOpen) return;
    if (bookmarkBtnRef.current && window.innerWidth <= 768) {
      // Мобайл: fixed-дропдаун над кнопкой + блокируем скролл страницы
      const rect = bookmarkBtnRef.current.getBoundingClientRect();
      setDropdownBottom(window.innerHeight - rect.top + 6);
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      setDropdownBottom(null);
      // Десктоп: скроллим дропдаун в видимую область с отступом снизу
      setTimeout(() => {
        if (!bookmarkDropdownRef.current) return;
        const rect = bookmarkDropdownRef.current.getBoundingClientRect();
        const offset = 24;
        const overflow = rect.bottom + offset - window.innerHeight;
        if (overflow > 0) {
          window.scrollBy({ top: overflow, behavior: 'smooth' });
        }
      }, 0);
    }
    const handler = (e: MouseEvent) => {
      if (bookmarkWrapRef.current && !bookmarkWrapRef.current.contains(e.target as Node)) {
        setBookmarkDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [bookmarkDropdownOpen]);

  const filteredChapters = CHAPTERS_LIST.filter((ch) =>
    `Том ${ch.volume} Глава ${ch.chapter}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  )
    .slice()
    .sort((a, b) => (reversed ? a.chapter - b.chapter : b.chapter - a.chapter));

  const newChapters = Array.from({ length: 8 }, (_, i) => 241 - i);

  const handleCommentLike = (id: number) => {
    setComments(prev => mapCommentTree(prev, id, (comment) => {
      if (comment.username === "Вы") return comment;
      const wasLiked = comment.userReaction === "like";
      const wasDisliked = comment.userReaction === "dislike";
      return {
        ...comment,
        userReaction: wasLiked ? null : "like",
        likes: comment.likes + (wasLiked ? -1 : 1),
        dislikes: comment.dislikes + (wasDisliked ? -1 : 0),
      };
    }));
  };

  const handleCommentDislike = (id: number) => {
    setComments(prev => mapCommentTree(prev, id, (comment) => {
      if (comment.username === "Вы") return comment;
      const wasLiked = comment.userReaction === "like";
      const wasDisliked = comment.userReaction === "dislike";
      return {
        ...comment,
        userReaction: wasDisliked ? null : "dislike",
        dislikes: comment.dislikes + (wasDisliked ? -1 : 1),
        likes: comment.likes + (wasLiked ? -1 : 0),
      };
    }));
  };

  const handleCommentDelete = (id: number) => {
    setComments(prev => removeFromCommentTree(prev, id));
  };

  const handleCommentStartEdit = (c: CommentType) => {
    setCommentMenuOpen(null);
    setEditingCommentId(c.id);
    setEditingCommentText(c.text);
  };

  const handleCommentSaveEdit = (id: number) => {
    setComments(prev => mapCommentTree(prev, id, (c) => ({ ...c, text: editingCommentText })));
    setEditingCommentId(null);
  };

  const handleCommentReply = (c: CommentType) => {
    setReplyingTo({
      rootId: findThreadRootId(comments, c.id),
      targetId: c.id,
      username: c.username,
      text: stripHtml(c.text),
    });
    if (commentInputRef.current) commentInputRef.current.focus();
  };

  return (
    <>
      <Header />
      <main className="main manga-main">
        <section className="section manga-inner-section">
          <div className="container">
            <div className="manga-inner">
              {/* ── Left: Cover card ── */}
              <div className="manga-inner__left">
                <div className="manga-inner__cover">
                  <img src={`/images/cover_${coverIdx}.jpg`} alt={data.title} />
                </div>
                <div className="manga-inner__left-btns">
                  <div className="manga-inner__bookmark-wrap" ref={bookmarkWrapRef}>
                  <Link
                    href={`/manga/${id}/read`}
                    className="manga-inner__read-btn"
                  >
                    <BookSquareIcon />
                    Читать
                  </Link>
                    <button
                      ref={bookmarkBtnRef}
                      className="manga-inner__bookmark-btn"
                      onClick={() => setBookmarkDropdownOpen((v) => !v)}
                    >
                      <BookmarkOutlineIcon />
                      {bookmarkValue ?? "В закладки"}
                    </button>
                    {bookmarkDropdownOpen && (
                      <div
                        ref={bookmarkDropdownRef}
                        className="manga-inner__bookmark-dropdown"
                        style={dropdownBottom !== null ? { bottom: dropdownBottom } : undefined}
                      >
                        {BOOKMARK_OPTIONS.map((opt) => (
                          <button
                            key={opt.label}
                            className={`reader__bookmark-popup-opt${bookmarkValue === opt.label ? " reader__bookmark-popup-opt--active" : ""}`}
                            onClick={() => {
                              setBookmarkValue(opt.label);
                              setBookmarkDropdownOpen(false);
                            }}
                          >
                            <span className="bookmark-dot" style={{ background: opt.color }} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Right: Info ── */}
              <div className="manga-inner__info">
                {/* Header row: left (tags+title+stats) + right (rating) */}
                <div className="manga-inner__header-row">
                  <div className="manga-inner__text-group">
                    {/* Genre + Year tags */}
                    <div className="manga-inner__tags">
                      <span className="manga-inner__tag">
                        {data.genres[0]}
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.75 8.75L8.75 0.75M8.75 7.15V0.75H2.35"
                            stroke="#999999"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="manga-inner__tag-sep">•</span>
                      <span className="manga-inner__tag">
                        {data.genres[1]}
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.75 8.75L8.75 0.75M8.75 7.15V0.75H2.35"
                            stroke="#999999"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="manga-inner__title">{data.title}</h1>

                    {/* Stats row */}
                    <div className="manga-inner__stats">
                      <span className="manga-inner__stat">
                        <HeartIcon /> Лайков: {data.likes}
                      </span>
                      <span className="manga-inner__stat">
                        <EyeIcon /> Просмотров: {data.views}
                      </span>
                      <span className="manga-inner__stat">
                        <BookmarkFillIcon /> Закладок: {data.bookmarks}
                      </span>
                    </div>
                  </div>

                  <div className="manga-inner__rating-group">
                    {/* Rating block */}
                    <div className="manga-inner__rating-block">
                      <div className="manga-inner__rating-score">
                        {data.rating}
                      </div>
                      <a href="#" className="manga-inner__rating-count">
                        {data.ratingCount}
                      </a>
                      <div className="manga-inner__user-rating">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                          <button
                            key={star}
                            className={`manga-inner__rating-star${(hoverRating || userRating || 0) >= star ? " manga-inner__rating-star--active" : ""}`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setUserRating(star)}
                            aria-label={`Оценить ${star}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M8.2091 1.01094L9.44445 3.49535C9.61092 3.83894 10.0578 4.16491 10.4345 4.23538L12.6687 4.6054C14.0969 4.84327 14.4298 5.88285 13.4047 6.92242L11.6611 8.6756C11.372 8.96633 11.2055 9.53898 11.3019 9.95305L11.8013 12.1203C12.1956 13.8294 11.2844 14.499 9.78617 13.6004L7.69214 12.3494C7.3154 12.1203 6.68458 12.1203 6.30783 12.3494L4.21381 13.6004C2.71558 14.4902 1.80439 13.8294 2.19866 12.1203L2.69808 9.95305C2.79445 9.54779 2.62798 8.97514 2.33885 8.6756L0.595308 6.92242C-0.429794 5.89165 -0.0968578 4.85208 1.33128 4.6054L3.56546 4.23538C3.94221 4.17372 4.38905 3.83894 4.55552 3.49535L5.7909 1.01094C6.44802 -0.336981 7.53446 -0.336981 8.2091 1.01094Z" fill="currentColor"/>
                            </svg>
                          </button>
                        ))}
                        {userRating && (
                          <>
                            <span className="manga-inner__user-rating-val">{userRating}</span>
                            <button
                              className="manga-inner__rating-clear"
                              onClick={() => setUserRating(null)}
                              aria-label="Убрать оценку"
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                      <button className="manga-inner__rating-btn" onClick={() => setReviewOpen(true)}>
                        Написать отзыв
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs + Content wrapper */}
                <div className="manga-inner__tabs-wrapper">
                  {/* Tabs */}
                  <div className="manga-inner__tabs">
                    <button
                      className={`manga-inner__tab${activeTab === "main" ? " manga-inner__tab--active" : ""}`}
                      onClick={() => setActiveTab("main")}
                    >
                      Главная
                    </button>
                    <button
                      className={`manga-inner__tab${activeTab === "chapters" ? " manga-inner__tab--active" : ""}`}
                      onClick={() => setActiveTab("chapters")}
                    >
                      Главы ({data.totalChapters})
                    </button>
                    <button
                      className={`manga-inner__tab${activeTab === "comments" ? " manga-inner__tab--active" : ""}`}
                      onClick={() => setActiveTab("comments")}
                    >
                      Комментарии ({data.totalReviews})
                    </button>
                    <button
                      className={`manga-inner__tab${activeTab === "reviews" ? " manga-inner__tab--active" : ""}`}
                      onClick={() => setActiveTab("reviews")}
                    >
                      Отзывы ({REVIEWS.length})
                    </button>
                  </div>

                  {/* ── Tab: Главная ── */}
                  {activeTab === "main" && (
                    <div className="manga-inner__content">
                      <div className="manga-inner__description">
                        {data.description.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>

                      <div className="manga-inner__new-chapters">
                        <h3 className="manga-inner__new-chapters-title">
                          Новые главы
                        </h3>
                        <div className="manga-inner__chapters-grid">
                          {newChapters.map((ch) => (
                            <Link
                              href="#"
                              key={ch}
                              className="manga-inner__chapter-card"
                            >
                              <span className="manga-inner__chapter-num">
                                {ch}
                              </span>
                              <span className="manga-inner__chapter-label">
                                глава
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Tab: Главы ── */}
                  {activeTab === "chapters" && (
                    <div className="manga-inner__content">
                      {/* Search + reverse */}
                      <div className="manga-inner__chapters-toolbar">
                        <div className="manga-inner__chapters-search">
                          <SearchIcon />
                          <input
                            type="text"
                            className="manga-inner__chapters-search-input"
                            placeholder="Поиск по названию"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <button
                          className="manga-inner__chapters-reverse"
                          onClick={() => setReversed((r) => !r)}
                        >
                          <ReverseIcon />
                          {reversed ? "Показать с конца" : "Показать с начала"}
                        </button>
                      </div>

                      {/* Chapter rows */}
                      <div className="manga-inner__chapters-list">
                        {filteredChapters.length === 0 ? (
                          <p className="manga-inner__chapters-empty">
                            Ничего не найдено
                          </p>
                        ) : (
                          filteredChapters.map((ch) => (
                            <Link
                              href="#"
                              key={ch.chapter}
                              className="manga-inner__chapter-row"
                            >
                              <div className="manga-inner__chapter-row-title">
                                <span className="manga-inner__chapter-row-vol">
                                  Том {ch.volume}
                                </span>
                                <span className="manga-inner__chapter-row-ch">
                                  Глава {ch.chapter}
                                </span>
                              </div>
                              <div className="manga-inner__chapter-row-info">
                                <span className="manga-inner__chapter-row-date">
                                  {ch.date}
                                </span>
                                <span className="manga-inner__chapter-row-views">
                                  <EyeSmallIcon /> {ch.views}
                                </span>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Tab: Комментарии ── */}
                  {activeTab === "comments" && (
                    <div className="manga-inner__content">
                      <div className="manga-inner__comments-header">
                        <h3 className="manga-inner__comments-title">
                          КОММЕНТАРИИ<span>{data.totalReviews}</span>
                        </h3>
                        <div className="manga-inner__comments-filter">
                          <button
                            className={`manga-inner__filter-btn${commentSort === "new" ? " manga-inner__filter-btn--active" : ""}`}
                            onClick={() => setCommentSort("new")}
                          >
                            Новые
                          </button>
                          <button
                            className={`manga-inner__filter-btn${commentSort === "popular" ? " manga-inner__filter-btn--active" : ""}`}
                            onClick={() => setCommentSort("popular")}
                          >
                            Популярные
                          </button>
                        </div>
                      </div>

                      {/* Reply preview */}
                      {replyingTo && (
                        <div className="manga-inner__reply-preview">
                          <div className="manga-inner__reply-preview-body">
                            <span className="manga-inner__reply-preview-text">
                              Ответ для <b>{replyingTo.username}</b>
                            </span>
                            {replyingTo.text && (
                              <span className="manga-inner__reply-preview-quote">{replyingTo.text}</span>
                            )}
                          </div>
                          <button
                            className="manga-inner__reply-preview-close"
                            onClick={() => setReplyingTo(null)}
                            aria-label="Отменить ответ"
                          >
                            <CloseIcon />
                          </button>
                        </div>
                      )}

                      {/* Comment input */}
                      <RichTextEditor
                        ref={commentInputRef}
                        value={newComment}
                        onChange={setNewComment}
                        onSubmit={() => {
                          if (!newComment.trim()) return;
                          const newC: CommentType = {
                            id: Date.now(),
                            avatar: "/images/avatar_default.png",
                            username: "Вы",
                            text: newComment,
                            time: "Только что",
                            likes: 0,
                            dislikes: 0,
                            userReaction: null,
                            replyToUsername: replyingTo ? replyingTo.username : null,
                            replyToId: replyingTo ? replyingTo.targetId : null,
                            replies: [],
                          };
                          setComments(prev => replyingTo ? addReplyToThread(prev, replyingTo.rootId, newC) : [newC, ...prev]);
                          setNewComment("");
                          setReplyingTo(null);
                        }}
                        placeholder="Оставить комментарий"
                      />

                      {/* Comments list */}
                      <div className="manga-inner__comments-list">
                        {[...comments]
                          .sort((a, b) => {
                            if (commentSort === "popular") {
                              return b.likes - a.likes;
                            }
                            return 0; // "new" — зберігаємо порядок (найновіші зверху)
                          })
                          .slice(0, visibleCommentsCount)
                          .map((c) => (
                            <CommentBlock
                              key={c.id}
                              comment={c}
                              editingCommentId={editingCommentId}
                              editingCommentText={editingCommentText}
                              onChangeEditText={setEditingCommentText}
                              onStartEdit={handleCommentStartEdit}
                              onSaveEdit={handleCommentSaveEdit}
                              commentMenuOpen={commentMenuOpen}
                              onToggleMenu={setCommentMenuOpen}
                              onDelete={handleCommentDelete}
                              onReport={() => setReportOpen(true)}
                              onReply={handleCommentReply}
                              onLike={handleCommentLike}
                              onDislike={handleCommentDislike}
                            />
                          ))}
                      </div>

                      {visibleCommentsCount < comments.length && (
                        <button className="manga-inner__show-more" onClick={() => setVisibleCommentsCount(prev => prev + 5)}>
                          Показать ещё
                        </button>
                      )}
                    </div>
                  )}
                  {/* ── Tab: Отзывы ── */}
                  {activeTab === "reviews" && (
                    <div className="manga-inner__content">
                      {/* Фильтры */}
                      <div className="manga-inner__review-filters">
                        <button
                          className={`manga-inner__review-filter${reviewFilter === "all" ? " manga-inner__review-filter--active" : ""}`}
                          onClick={() => setReviewFilter("all")}
                        >
                          Все отзывы
                        </button>
                        <button
                          className={`manga-inner__review-filter manga-inner__review-filter--positive${reviewFilter === "positive" ? " manga-inner__review-filter--active" : ""}`}
                          onClick={() => setReviewFilter("positive")}
                        >
                          <SmilePositiveIcon />
                          Положительные
                        </button>
                        <button
                          className={`manga-inner__review-filter manga-inner__review-filter--negative${reviewFilter === "negative" ? " manga-inner__review-filter--active" : ""}`}
                          onClick={() => setReviewFilter("negative")}
                        >
                          <SmileNegativeIcon />
                          Негативные
                        </button>
                        <button
                          className={`manga-inner__review-filter manga-inner__review-filter--neutral${reviewFilter === "neutral" ? " manga-inner__review-filter--active" : ""}`}
                          onClick={() => setReviewFilter("neutral")}
                        >
                          <SmileNeutralIcon />
                          Нейтральные
                        </button>
                      </div>

                      {/* Список отзывов */}
                      <div className="manga-inner__reviews-list">
                        {reviews.filter((r) => reviewFilter === "all" || r.type === reviewFilter).slice(0, visibleReviewsCount).map((r) => {
                          const scoreColor = r.type === "positive" ? "green" : r.type === "negative" ? "red" : "yellow";
                          return (
                            <div key={r.id} className={`manga-inner__review manga-inner__review--${r.type}`}>
                              <div className="manga-inner__review-top">
                                <div className="manga-inner__review-avatar">
                                  <img
                                    src={`/images/cover_${(r.id % 12) + 1}.jpg`}
                                    alt={r.username}
                                  />
                                </div>
                                <div className="manga-inner__review-user">
                                  <span className="manga-inner__comment-name">{r.username}</span>
                                  <span className="manga-inner__comment-time">{r.time}</span>
                                </div>
                                <div className={`manga-inner__review-indicator manga-inner__review-indicator--${r.type}`} />
                              </div>
                              <p className="manga-inner__review-title">{r.title}</p>
                              <div className="manga-inner__review-textbox">
                                <p className="manga-inner__comment-text">{r.text}</p>
                              </div>
                              <div className="manga-inner__review-footer">
                                <span className="manga-inner__review-score">
                                  Оценка: <span className={`manga-inner__review-score-val manga-inner__review-score-val--${scoreColor}`}>{r.rating}</span>
                                </span>
                                <div className="manga-inner__review-reactions">
                                  <span className="manga-inner__review-stat">
                                    <ReviewEyeIcon /> {r.views}
                                  </span>
                                  <span 
                                    className={`manga-inner__review-stat manga-inner__review-like${r.userReaction === 'like' ? ' manga-inner__review-like--active' : ''}`}
                                    onClick={() => {
                                      setReviews(reviews.map(review => {
                                        if (review.id !== r.id) return review;
                                        const wasLiked = review.userReaction === 'like';
                                        return {
                                          ...review,
                                          userReaction: wasLiked ? null : 'like',
                                          likes: review.likes + (wasLiked ? -1 : 1)
                                        };
                                      }));
                                    }}
                                  >
                                    <ReviewHeartIcon /> {r.likes}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {visibleReviewsCount < reviews.filter((r) => reviewFilter === "all" || r.type === reviewFilter).length && (
                        <button className="manga-inner__show-more" onClick={() => setVisibleReviewsCount(prev => prev + 5)}>
                          Показать ещё
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {/* /manga-inner__tabs-wrapper */}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {reviewOpen && <ReviewModal onClose={() => setReviewOpen(false)} />}
      {reportOpen && <ReportModal onClose={() => setReportOpen(false)} />}
    </>
  );
}
