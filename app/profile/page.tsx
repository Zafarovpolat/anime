'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useRef, useEffect, Suspense, type Dispatch, type SetStateAction } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

/* ── SVG Icons ── */
function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="currentColor"/>
<path d="M17.0809 14.1499C14.2909 12.2899 9.74094 12.2899 6.93094 14.1499C5.66094 14.9999 4.96094 16.1499 4.96094 17.3799C4.96094 18.6099 5.66094 19.7499 6.92094 20.5899C8.32094 21.5299 10.1609 21.9999 12.0009 21.9999C13.8409 21.9999 15.6809 21.5299 17.0809 20.5899C18.3409 19.7399 19.0409 18.5999 19.0409 17.3599C19.0309 16.1299 18.3409 14.9899 17.0809 14.1499Z" fill="currentColor"/>
</svg>

  );
}

function BookmarkMenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M16.8203 2H7.18031C5.05031 2 3.32031 3.74 3.32031 5.86V19.95C3.32031 21.75 4.61031 22.51 6.19031 21.64L11.0703 18.93C11.5903 18.64 12.4303 18.64 12.9403 18.93L17.8203 21.64C19.4003 22.52 20.6903 21.76 20.6903 19.95V5.86C20.6803 3.74 18.9503 2 16.8203 2Z" fill="currentColor"/>
<path d="M12.0007 10.2801C10.9807 10.2801 9.96074 10.1001 8.99074 9.75005C8.60074 9.61005 8.40074 9.18005 8.54074 8.79005C8.69074 8.40005 9.12074 8.20005 9.51074 8.34005C11.1207 8.92005 12.8907 8.92005 14.5007 8.34005C14.8907 8.20005 15.3207 8.40005 15.4607 8.79005C15.6007 9.18005 15.4007 9.61005 15.0107 9.75005C14.0407 10.1001 13.0207 10.2801 12.0007 10.2801Z" fill="currentColor"/>
</svg>

  );
}

function CommentsMenuIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M21.5475 19.6349L22.0025 23.3216C22.1192 24.2899 21.0808 24.9666 20.2525 24.4649L15.3642 21.5599C14.8275 21.5599 14.3025 21.5249 13.7892 21.4549C14.6525 20.4399 15.1658 19.1566 15.1658 17.7682C15.1658 14.4549 12.2958 11.7716 8.74917 11.7716C7.39584 11.7716 6.14751 12.1566 5.10918 12.8333C5.07418 12.5416 5.0625 12.2499 5.0625 11.9466C5.0625 6.63824 9.67084 2.33325 15.3642 2.33325C21.0575 2.33325 25.6658 6.63824 25.6658 11.9466C25.6658 15.0966 24.0442 17.8849 21.5475 19.6349Z" fill="currentColor"/>
<path d="M15.1654 17.7683C15.1654 19.1567 14.652 20.44 13.7887 21.455C12.6337 22.855 10.802 23.7533 8.7487 23.7533L5.7037 25.5617C5.19036 25.8767 4.53703 25.445 4.60703 24.85L4.89869 22.5517C3.33536 21.4667 2.33203 19.7283 2.33203 17.7683C2.33203 15.715 3.4287 13.9067 5.1087 12.8334C6.14704 12.1567 7.39536 11.7717 8.7487 11.7717C12.2954 11.7717 15.1654 14.455 15.1654 17.7683Z" fill="currentColor"/>
</svg>

  );
}

function ReviewsMenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" fill="currentColor"/>
      <path d="M18.5 9.25H16.5C14.98 9.25 13.75 8.02 13.75 6.5V4.5C13.75 4.09 14.09 3.75 14.5 3.75C14.91 3.75 15.25 4.09 15.25 4.5V6.5C15.25 7.19 15.81 7.75 16.5 7.75H18.5C18.91 7.75 19.25 8.09 19.25 8.5C19.25 8.91 18.91 9.25 18.5 9.25Z" fill="currentColor"/>
      <path d="M12 13.75H8C7.59 13.75 7.25 13.41 7.25 13C7.25 12.59 7.59 12.25 8 12.25H12C12.41 12.25 12.75 12.59 12.75 13C12.75 13.41 12.41 13.75 12 13.75Z" fill="currentColor"/>
      <path d="M16 17.75H8C7.59 17.75 7.25 17.41 7.25 17C7.25 16.59 7.59 16.25 8 16.25H16C16.41 16.25 16.75 16.59 16.75 17C16.75 17.41 16.41 17.75 16 17.75Z" fill="currentColor"/>
    </svg>
  );
}

function HistoryMenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" fill="currentColor"/>
      <path d="M18.5 9.25H16.5C14.98 9.25 13.75 8.02 13.75 6.5V4.5C13.75 4.09 14.09 3.75 14.5 3.75C14.91 3.75 15.25 4.09 15.25 4.5V6.5C15.25 7.19 15.81 7.75 16.5 7.75H18.5C18.91 7.75 19.25 8.09 19.25 8.5C19.25 8.91 18.91 9.25 18.5 9.25Z" fill="currentColor"/>
      <path d="M12 13.75H8C7.59 13.75 7.25 13.41 7.25 13C7.25 12.59 7.59 12.25 8 12.25H12C12.41 12.25 12.75 12.59 12.75 13C12.75 13.41 12.41 13.75 12 13.75Z" fill="currentColor"/>
      <path d="M16 17.75H8C7.59 17.75 7.25 17.41 7.25 17C7.25 16.59 7.59 16.25 8 16.25H16C16.41 16.25 16.75 16.59 16.75 17C16.75 17.41 16.41 17.75 16 17.75Z" fill="currentColor"/>
    </svg>
  );
}

function SettingsMenuIcon() {
  return (
    <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M2.25 15.0268V12.9734C2.25 11.7601 3.20625 10.7568 4.3875 10.7568C6.42375 10.7568 7.25625 9.26342 6.2325 7.43176C5.6475 6.38176 5.99625 5.01676 7.02 4.41009L8.96625 3.25509C9.855 2.70676 11.0025 3.03342 11.5312 3.95509L11.655 4.17676C12.6675 6.00842 14.3325 6.00842 15.3562 4.17676L15.48 3.95509C16.0088 3.03342 17.1563 2.70676 18.045 3.25509L19.9913 4.41009C21.015 5.01676 21.3637 6.38176 20.7787 7.43176C19.755 9.26342 20.5875 10.7568 22.6238 10.7568C23.7938 10.7568 24.7613 11.7484 24.7613 12.9734V15.0268C24.7613 16.2401 23.805 17.2434 22.6238 17.2434C20.5875 17.2434 19.755 18.7368 20.7787 20.5684C21.3637 21.6301 21.015 22.9834 19.9913 23.5901L18.045 24.7451C17.1563 25.2934 16.0088 24.9668 15.48 24.0451L15.3562 23.8234C14.3437 21.9918 12.6787 21.9918 11.655 23.8234L11.5312 24.0451C11.0025 24.9668 9.855 25.2934 8.96625 24.7451L7.02 23.5901C5.99625 22.9834 5.6475 21.6184 6.2325 20.5684C7.25625 18.7368 6.42375 17.2434 4.3875 17.2434C3.20625 17.2434 2.25 16.2401 2.25 15.0268Z" fill="currentColor"/>
<path d="M13.5 17.7916C15.5193 17.7916 17.1562 16.094 17.1562 13.9999C17.1562 11.9058 15.5193 10.2083 13.5 10.2083C11.4807 10.2083 9.84375 11.9058 9.84375 13.9999C9.84375 16.094 11.4807 17.7916 13.5 17.7916Z" fill="currentColor"/>
</svg>

  );
}

function LogoutIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M9 7.2V16.79C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2H14.2C11 2 9 4 9 7.2Z" fill="#FF0000"/>
<path d="M12.43 8.12002L15.78 11.47C16.07 11.76 16.07 12.24 15.78 12.53L12.43 15.88C12.14 16.17 11.66 16.17 11.37 15.88C11.08 15.59 11.08 15.11 11.37 14.82L13.44 12.75H2.75C2.34 12.75 2 12.41 2 12C2 11.59 2.34 11.25 2.75 11.25H13.44L11.37 9.18002C11.22 9.03002 11.15 8.84002 11.15 8.65002C11.15 8.46002 11.22 8.27002 11.37 8.12002C11.66 7.82002 12.13 7.82002 12.43 8.12002Z" fill="#FF0000"/>
</svg>
  );
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 4.58605L1 12.5861V16.5861L5 16.586L13 8.58604M9 4.58605L11.8686 1.7174L11.8704 1.7157C12.2652 1.32082 12.463 1.12303 12.691 1.04894C12.8919 0.983686 13.1082 0.983686 13.3091 1.04894C13.5369 1.12297 13.7345 1.32054 14.1288 1.71486L15.8686 3.45466C16.2646 3.85067 16.4627 4.04878 16.5369 4.2771C16.6022 4.47795 16.6021 4.69429 16.5369 4.89513C16.4628 5.1233 16.265 5.3211 15.8695 5.71655L15.8686 5.7174L13 8.58604M9 4.58605L13 8.58604" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  );
}

function EyeOpenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M21.25 9.14993C18.94 5.51993 15.56 3.42993 12 3.42993C10.22 3.42993 8.49 3.94993 6.91 4.91993C5.33 5.89993 3.91 7.32993 2.75 9.14993C1.75 10.7199 1.75 13.2699 2.75 14.8399C5.06 18.4799 8.44 20.5599 12 20.5599C13.78 20.5599 15.51 20.0399 17.09 19.0699C18.67 18.0899 20.09 16.6599 21.25 14.8399C22.25 13.2799 22.25 10.7199 21.25 9.14993ZM12 16.0399C9.76 16.0399 7.96 14.2299 7.96 11.9999C7.96 9.76993 9.76 7.95993 12 7.95993C14.24 7.95993 16.04 9.76993 16.04 11.9999C16.04 14.2299 14.24 16.0399 12 16.0399Z" fill="currentColor"/>
      <path d="M11.9984 9.13989C10.4284 9.13989 9.14844 10.4199 9.14844 11.9999C9.14844 13.5699 10.4284 14.8499 11.9984 14.8499C13.5684 14.8499 14.8584 13.5699 14.8584 11.9999C14.8584 10.4299 13.5684 9.13989 11.9984 9.13989Z" fill="currentColor"/>
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M21.2516 9.15004C20.7616 8.37004 20.2016 7.67004 19.6216 7.04004L15.8516 10.81C15.9716 11.18 16.0416 11.58 16.0416 12C16.0416 14.24 14.2316 16.04 12.0016 16.04C11.5816 16.04 11.1816 15.97 10.8116 15.85L7.35156 19.31C8.81156 20.13 10.3916 20.56 12.0016 20.56C13.7816 20.56 15.5116 20.04 17.0916 19.07C18.6716 18.09 20.0916 16.66 21.2516 14.84C22.2516 13.28 22.2516 10.72 21.2516 9.15004Z" fill="currentColor"/>
      <path d="M14.0206 9.97989L9.98062 14.0199C9.47062 13.4999 9.14062 12.7799 9.14062 11.9999C9.14062 10.4299 10.4206 9.13989 12.0006 9.13989C12.7806 9.13989 13.5006 9.46989 14.0206 9.97989Z" fill="currentColor"/>
      <path opacity="0.4" d="M18.25 5.74993L14.86 9.13993C14.13 8.39993 13.12 7.95993 12 7.95993C9.76 7.95993 7.96 9.76993 7.96 11.9999C7.96 13.1199 8.41 14.1299 9.14 14.8599L5.76 18.2499H5.75C4.64 17.3499 3.62 16.1999 2.75 14.8399C1.75 13.2699 1.75 10.7199 2.75 9.14993C3.91 7.32993 5.33 5.89993 6.91 4.91993C8.49 3.95993 10.22 3.42993 12 3.42993C14.23 3.42993 16.39 4.24993 18.25 5.74993Z" fill="currentColor"/>
      <path d="M14.8581 12.0001C14.8581 13.5701 13.5781 14.8601 11.9981 14.8601C11.9381 14.8601 11.8881 14.8601 11.8281 14.8401L14.8381 11.8301C14.8581 11.8901 14.8581 11.9401 14.8581 12.0001Z" fill="currentColor"/>
      <path d="M21.7689 2.22988C21.4689 1.92988 20.9789 1.92988 20.6789 2.22988L2.22891 20.6899C1.92891 20.9899 1.92891 21.4799 2.22891 21.7799C2.37891 21.9199 2.56891 21.9999 2.76891 21.9999C2.96891 21.9999 3.15891 21.9199 3.30891 21.7699L21.7689 3.30988C22.0789 3.00988 22.0789 2.52988 21.7689 2.22988Z" fill="currentColor"/>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.875 24.375V22.5H5.625C4.9375 22.5 4.3125 22.225 3.8625 21.7625C3.4 21.3125 3.125 20.6875 3.125 20C3.125 18.7125 4.125 17.6375 5.3875 17.5125C5.4625 17.5 5.5375 17.5 5.625 17.5H24.375C24.4625 17.5 24.5375 17.5 24.6125 17.5125C25.2125 17.5625 25.7375 17.825 26.1375 18.2375C26.65 18.7375 26.925 19.45 26.8625 20.225C26.75 21.5375 25.5625 22.5 24.2375 22.5H18.125V24.375C18.125 26.1 16.725 27.5 15 27.5C13.275 27.5 11.875 26.1 11.875 24.375Z" fill="white"/>
<path opacity="0.4" d="M25.2103 6.625L24.6103 17.5125C24.5353 17.5 24.4603 17.5 24.3728 17.5H5.62276C5.53526 17.5 5.46026 17.5 5.38526 17.5125L4.78526 6.625C4.56026 4.4125 6.29776 2.5 8.51026 2.5H21.4853C23.6978 2.5 25.4353 4.4125 25.2103 6.625Z" fill="white"/>
<path d="M10.9258 2.5V8.75C10.9258 9.2625 10.5008 9.6875 9.98828 9.6875C9.47578 9.6875 9.05078 9.2625 9.05078 8.75V2.5H10.9258Z" fill="white"/>
<path d="M15.9375 2.5V5C15.9375 5.5125 15.5125 5.9375 15 5.9375C14.4875 5.9375 14.0625 5.5125 14.0625 5V2.5H15.9375Z" fill="white"/>
</svg>

  );
}

function ThreeDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
      <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
      <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
    </svg>
  );
}

function ThumbUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path opacity="0.4" d="M21.6509 10.03C21.2609 9.46997 20.5709 9.14997 19.7809 9.14997H15.6809C15.4109 9.14997 15.1609 9.03998 14.9909 8.83998C14.8109 8.63998 14.7409 8.35997 14.7809 8.06997L15.2909 4.78997C15.5109 3.80997 14.8609 2.70998 13.8809 2.37998C12.9709 2.03998 11.9009 2.49998 11.4709 3.14998L7.25086 9.41998L7.13086 9.61998V18.46L7.28086 18.61L10.4509 21.06C10.8709 21.48 11.8209 21.71 12.4909 21.71H16.3909C17.7309 21.71 19.0809 20.7 19.3809 19.47L21.8409 11.98C22.1009 11.27 22.0309 10.58 21.6509 10.03Z" fill="#562CF0"/>
      <path d="M5.21 6.37988H4.18C2.63 6.37988 2 6.97988 2 8.45988V18.5199C2 19.9999 2.63 20.5999 4.18 20.5999H5.21C6.76 20.5999 7.39 19.9999 7.39 18.5199V8.45988C7.39 6.97988 6.76 6.37988 5.21 6.37988Z" fill="#562CF0"/>
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path opacity="0.4" d="M2.34904 13.96C2.73904 14.52 3.42904 14.84 4.21904 14.84H8.31904C8.58904 14.84 8.83904 14.95 9.00904 15.15C9.18904 15.35 9.25904 15.63 9.21904 15.92L8.70904 19.2C8.48904 20.18 9.13904 21.28 10.119 21.61C11.029 21.95 12.099 21.49 12.529 20.84L16.739 14.57L16.859 14.37V5.53003L16.709 5.38003L13.539 2.93003C13.119 2.51003 12.169 2.28003 11.499 2.28003H7.59904C6.25904 2.28003 4.90904 3.29003 4.60904 4.52003L2.14904 12.01C1.89904 12.72 1.96904 13.42 2.34904 13.96Z" fill="currentColor"/>
      <path d="M18.7894 17.6099H19.8194C21.3694 17.6099 21.9994 17.0099 21.9994 15.5299V5.4799C21.9994 3.9999 21.3694 3.3999 19.8194 3.3999H18.7894C17.2394 3.3999 16.6094 3.9999 16.6094 5.4799V15.5399C16.6094 17.0099 17.2394 17.6099 18.7894 17.6099Z" fill="currentColor"/>
    </svg>
  );
}

/* ── Custom Select ── */
function CustomSelect({ options, value, onChange }: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={`custom-select${open ? ' custom-select--open' : ''}`} ref={ref}>
      <button
        type="button"
        className="custom-select__trigger"
        onClick={() => setOpen(v => !v)}
      >
        <span>{value}</span>
        <svg
          className="custom-select__arrow"
          width="12" height="8" viewBox="0 0 12 8" fill="none"
        >
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div className="custom-select__dropdown">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              className={`custom-select__option${value === opt ? ' custom-select__option--active' : ''}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Mock data ── */
const BOOKMARKS = [
  { id: 0, title: 'НАНОМАШИНЫ',          status: 'Читаю',       genre: 'Боевые искусства', year: 2024, added: 2, updated: 5, volume: 1, chapter: 240 },
  { id: 1, title: 'СОЛО ЛЕВЕЛИНГ',       status: 'Читаю',       genre: 'Экшен',            year: 2021, added: 0, updated: 3, volume: 2, chapter: 110 },
  { id: 2, title: 'БАШНЯ БОГА',          status: 'Читаю',       genre: 'Фэнтези',          year: 2010, added: 4, updated: 1, volume: 3, chapter: 88 },
  { id: 3, title: 'ВЫБЕРИ МЕНЯ',         status: 'Буду читать', genre: 'Романтика',        year: 2023, added: 1, updated: 4, volume: 1, chapter: 12 },
  { id: 4, title: 'НАЧАЛО ПОСЛЕ КОНЦА',  status: 'Прочитано',   genre: 'Приключения',      year: 2018, added: 3, updated: 2, volume: 5, chapter: 300 },
  { id: 5, title: 'МАГИЧЕСКАЯ БИТВА',    status: 'Брошено',     genre: 'Сёнэн',            year: 2020, added: 5, updated: 0, volume: 2, chapter: 45 },
  { id: 6, title: 'КЛИНОК ДЕМОНОВ',      status: 'Избранное',   genre: 'Экшен',            year: 2019, added: 6, updated: 6, volume: 4, chapter: 205 },
];

const MY_COMMENTS = [
  {
    id: 0,
    username: 'Sempai_11',
    text: 'Надеюсь я дождусь до финала данного шедевра.',
    time: '14 часов назад',
    likes: 10,
  },
];

const READING_HISTORY = [
  { id: 0, title: 'Выбери меня!', genres: 'Манхва, Экшен', rating: 9.6, cover: 1 },
  { id: 1, title: 'Я стала приёмной дочерью в семье убийц', genres: 'Манхва, Экшен', rating: 9.6, cover: 2 },
  { id: 2, title: 'Леди-малышка изменяет мир деньгами', genres: 'Манхва, Экшен', rating: 9.6, cover: 3 },
];

const MENU_ITEMS = [
  { id: 'profile', label: 'Профиль', icon: <ProfileIcon /> },
  { id: 'bookmarks', label: 'Закладки', icon: <BookmarkMenuIcon /> },
  { id: 'comments', label: 'Мои комментарии', icon: <CommentsMenuIcon /> },
  { id: 'reviews', label: 'Мои отзывы', icon: <ReviewsMenuIcon /> },
  { id: 'history', label: 'История чтения', icon: <HistoryMenuIcon /> },
  { id: 'settings', label: 'Настройки аккаунта', icon: <SettingsMenuIcon /> },
];

const BOOKMARK_TABS = [
  { id: 'Читаю',       label: 'Читаю',       color: '#562CF0' },
  { id: 'Буду читать', label: 'Буду читать', color: '#3B82F6' },
  { id: 'Прочитано',   label: 'Прочитано',   color: '#22C55E' },
  { id: 'Брошено',     label: 'Брошено',     color: '#EF4444' },
  { id: 'Избранное',   label: 'Избранное',   color: '#F59E0B' },
];

const SOCIAL_LINKS = [
  {
    name: 'Telegram',
    icon: (
      <svg width="35" height="28" viewBox="0 0 35 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2.40607 12.0538C11.8013 8.10237 18.0662 5.49734 21.2009 4.23871C30.1511 0.645084 32.0108 0.0208329 33.223 0.000219782C33.4896 -0.00431385 34.0857 0.0594683 34.4719 0.361928C34.7979 0.61732 34.8876 0.962317 34.9306 1.20446C34.9735 1.44659 35.0269 1.99819 34.9844 2.4292C34.4994 7.3486 32.4008 19.2867 31.3331 24.7965C30.8813 27.1279 29.9918 27.9096 29.1306 27.9861C27.2591 28.1524 25.8379 26.7921 24.0252 25.6451C21.1887 23.8502 19.5862 22.7328 16.8329 20.9813C13.6509 18.9572 15.7137 17.8447 17.527 16.0265C18.0016 15.5507 26.2477 8.31018 26.4074 7.65336C26.4273 7.57121 26.4458 7.265 26.2574 7.10332C26.069 6.94163 25.7908 6.99692 25.5901 7.04089C25.3056 7.10322 20.7743 9.99446 11.996 15.7146C10.7098 16.5672 9.54479 16.9826 8.50097 16.9608C7.35026 16.9368 5.13673 16.3328 3.49121 15.8164C1.4729 15.1831 -0.131203 14.8482 0.00847908 13.7727C0.081234 13.2124 0.88043 12.6395 2.40607 12.0538Z" fill="currentColor"/></svg>
    ),
  },
  {
    name: 'Yandex',
    icon: (
      <svg width="29" height="32" viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5623 26.565V32H11.479V22.8356L0 0H6.34727L15.2907 17.8647C17.015 21.2784 17.5623 22.4645 17.5623 26.565ZM29 0L21.5376 15.4711H15.3525L22.815 0H29Z" fill="currentColor"/></svg>
    ),
  },
  {
    name: 'ВКонтакте',
    icon: (
      <svg width="37" height="22" viewBox="0 0 37 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.43564 0H1.38785C0.23132 0 0 0.545137 0 1.14608C0 2.21957 1.37231 7.54345 6.38967 14.5847C9.73458 19.3933 14.4472 22 18.7356 22C21.3086 22 21.6269 21.4211 21.6269 20.4239V16.7895C21.6269 15.6316 21.8707 15.4005 22.6854 15.4005C23.2858 15.4005 24.315 15.7011 26.7165 18.0195C29.4611 20.7673 29.9136 22 31.4573 22H35.5051C36.6617 22 37.2399 21.4211 36.9063 20.2786C36.5413 19.1399 35.2309 17.4877 33.4921 15.5293C32.5486 14.413 31.1335 13.2109 30.7047 12.6097C30.1043 11.8369 30.2758 11.4934 30.7047 10.8065C30.7047 10.8065 35.6363 3.85104 36.1509 1.48975C36.4082 0.630937 36.1509 0 34.9268 0H30.879C29.8498 0 29.3753 0.545137 29.1179 1.14608C29.1179 1.14608 27.0596 6.16949 24.1435 9.43256C23.2 10.3771 22.7712 10.6776 22.2565 10.6776C21.9993 10.6776 21.6268 10.3771 21.6268 9.51847V1.48975C21.6268 0.459221 21.3282 0 20.4704 0H14.1095C13.4664 0 13.0795 0.47821 13.0795 0.931526C13.0795 1.90833 14.5375 2.13365 14.6878 4.88145V10.8495C14.6878 12.1579 14.4517 12.3951 13.9372 12.3951C12.565 12.3951 9.22699 7.34927 7.24726 1.57555C6.85933 0.453316 6.47014 0 5.43564 0Z" fill="currentColor"/></svg>
    ),
  },
  {
    name: 'Google',
    icon: (
      <svg width="34" height="32" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_151_4963" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="34" height="33"><path d="M33.5192 13.0317H17.2826V19.1832H26.6122C26.4622 20.0538 26.1255 20.9103 25.6323 21.6912C25.0673 22.5859 24.3688 23.2671 23.6528 23.7858C21.5081 25.3397 19.0077 25.6574 17.2712 25.6574C12.8846 25.6574 9.13657 22.9768 7.68561 19.3342C7.62706 19.2021 7.58818 19.0655 7.54083 18.9305C7.2202 18.0035 7.04501 17.0216 7.04501 16.0011C7.04501 14.9391 7.23472 13.9224 7.58062 12.9622C8.94501 9.17528 12.7776 6.34679 17.2744 6.34679C18.1789 6.34679 19.0499 6.44859 19.8759 6.65163C21.7636 7.11565 23.0989 8.02955 23.917 8.75243L28.854 4.18104C25.8509 1.57757 21.936 0 17.2662 0C13.533 0 10.0863 1.09972 7.26184 2.9584C4.9713 4.46574 3.09274 6.48388 1.82494 8.82773C0.645706 11.001 0 13.4093 0 15.9987C0 18.5883 0.646693 21.0216 1.82593 23.1748V23.1893C3.0715 25.4751 4.89295 27.4433 7.10672 28.9437C9.04069 30.2545 12.5085 32.0002 17.2662 32.0002C20.0022 32.0002 22.4271 31.5338 24.5656 30.6597C26.1083 30.0292 27.4752 29.2068 28.7127 28.1498C30.3479 26.7531 31.6285 25.0257 32.5025 23.0381C33.3766 21.0506 33.8442 18.8031 33.8442 16.3663C33.8442 15.2315 33.7236 14.079 33.5192 13.0316V13.0317Z" fill="white"/></mask><g mask="url(#mask0_151_4963)"><path d="M-0.25 16.1074C-0.232053 18.6561 0.536031 21.2857 1.69866 23.4085V23.4231C2.53871 24.9647 3.68682 26.1825 4.99449 27.3891L12.8925 24.6643C11.3983 23.9466 11.1703 23.5068 10.0991 22.7044C9.0045 21.6607 8.18868 20.4627 7.68061 19.0578H7.66015L7.68061 19.0432C7.34637 18.1155 7.3134 17.1308 7.30107 16.1074H-0.25Z" fill="currentColor"/><path d="M17.2808 -0.116211C16.5001 2.47686 16.7986 4.99742 17.2808 6.46399C18.1822 6.46462 19.0506 6.56622 19.874 6.76863C21.7617 7.23265 23.0969 8.14657 23.9151 8.86946L28.9784 4.18128C25.9789 1.58091 22.3691 -0.112114 17.2808 -0.116211Z" fill="currentColor"/><path d="M17.264 -0.136719C13.435 -0.136797 9.89983 0.99123 7.00289 2.89764C5.92725 3.60549 4.94016 4.42317 4.06121 5.33245C3.83096 7.37495 5.7849 9.88538 9.65431 9.8646C11.5317 7.79973 14.3084 6.46376 17.3988 6.46376C17.4016 6.46376 17.4044 6.46398 17.4072 6.46399L17.281 -0.136252C17.2753 -0.136255 17.2698 -0.136719 17.264 -0.136719Z" fill="currentColor"/><path d="M29.9032 16.8465L26.4855 19.0665C26.3355 19.9371 25.9985 20.7935 25.5053 21.5745C24.9403 22.4692 24.2418 23.1504 23.5259 23.6691C21.3856 25.2198 18.8919 25.5391 17.1558 25.5404C15.3615 28.43 15.0469 29.8774 17.282 32.2095C20.0478 32.2076 22.4998 31.7356 24.6626 30.8516C26.226 30.2126 27.6111 29.3791 28.8652 28.3079C30.5223 26.8926 31.8203 25.1418 32.7061 23.1277C33.592 21.1135 34.0656 18.8359 34.0656 16.3665L29.9032 16.8465Z" fill="currentColor"/><path d="M17.0273 12.7981V19.4171H33.4707C33.6154 18.5106 34.0937 17.3376 34.0937 16.3665C34.0937 15.2317 33.9732 13.8455 33.7688 12.7981H17.0273Z" fill="currentColor"/><path d="M4.13995 5.09863C3.12522 6.14839 2.25833 7.32337 1.57099 8.5941C0.391771 10.7673 -0.253906 13.4094 -0.253906 15.9988C-0.253906 16.0353 -0.250712 16.071 -0.250455 16.1074C0.271785 17.0542 6.96333 16.8729 7.30061 16.1074C7.30019 16.0717 7.29593 16.0369 7.29593 16.0011C7.29593 14.939 7.4857 14.1562 7.8316 13.196C8.25831 12.0116 8.92645 10.921 9.78082 9.98129C9.97449 9.7475 10.4911 9.24491 10.6418 8.94344C10.6992 8.82861 10.5376 8.76416 10.5285 8.72374C10.5184 8.67853 10.3017 8.71489 10.2531 8.68121C10.099 8.57429 9.7937 8.51846 9.60833 8.46884C9.21211 8.36276 8.55545 8.12883 8.19073 7.88634C7.03785 7.11982 5.23867 6.20423 4.13995 5.09863Z" fill="currentColor"/><path d="M9.3012 24.196C5.71248 25.421 5.15065 25.4649 4.82031 27.5678C5.45158 28.1502 6.12983 28.689 6.85057 29.1775C8.78454 30.4883 12.5047 32.234 17.2624 32.234C17.268 32.234 17.2733 32.2336 17.2789 32.2336V25.4236C17.2753 25.4236 17.2712 25.4238 17.2675 25.4238C15.486 25.4238 14.0623 24.9814 12.6026 24.212C12.2427 24.0223 11.5897 24.5317 11.2578 24.3039C10.8 23.9899 9.69827 24.5746 9.3012 24.196Z" fill="currentColor"/></g></svg>
    ),
  },
];

/* ── Close icon ── */
function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M11.9003 11.8998L6.40039 6.3999M6.40039 6.3999L0.900391 0.899902M6.40039 6.3999L11.9004 0.899902M6.40039 6.3999L0.900391 11.8999" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Trash icon ── */
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Drag handle icon ── */
function DragIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
      <path d="M1 1H17M1 6H17M1 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Plus icon ── */
function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z" fill="currentColor"/>
<path d="M16 11.25H12.75V8C12.75 7.59 12.41 7.25 12 7.25C11.59 7.25 11.25 7.59 11.25 8V11.25H8C7.59 11.25 7.25 11.59 7.25 12C7.25 12.41 7.59 12.75 8 12.75H11.25V16C11.25 16.41 11.59 16.75 12 16.75C12.41 16.75 12.75 16.41 12.75 16V12.75H16C16.41 12.75 16.75 12.41 16.75 12C16.75 11.59 16.41 11.25 16 11.25Z" fill="currentColor"/>
</svg>

  );
}

const BOOKMARK_COLORS = ['#562CF0', '#3B82F6', '#22C55E', '#EF4444', '#F59E0B', '#e91e63'];

/* ── Bookmark Edit Modal ── */
function BookmarkEditModal({
  onClose,
  items,
  setItems,
}: {
  onClose: () => void;
  items: typeof BOOKMARK_TABS;
  setItems: Dispatch<SetStateAction<typeof BOOKMARK_TABS>>;
}) {
  const [inputValue, setInputValue] = useState('');
  const [selectedColor, setSelectedColor] = useState(BOOKMARK_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [colorPickId, setColorPickId] = useState<string | null>(null);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const addBookmark = () => {
    const name = inputValue.trim();
    if (!name) return;
    setItems(prev => [...prev, { id: name + Date.now(), label: name, color: selectedColor }]);
    setInputValue('');
  };

  const commitEdit = (id: string) => {
    const text = editingText.trim();
    if (text) setItems(prev => prev.map(x => x.id === id ? { ...x, label: text } : x));
    setEditingId(null);
  };

  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === i) return;
    setItems(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx.current!, 1);
      next.splice(i, 0, moved);
      dragIdx.current = i;
      return next;
    });
  };

  return (
    <>
      <div className="bookmark-edit-overlay" onClick={onClose} />
      <div className="bookmark-edit-modal">
        <div className="reader__bookmark-popup-header">
          <span className="reader__bookmark-popup-title">Редактирование закладок</span>
          <button className="reader__bookmark-popup-close" onClick={onClose} aria-label="Закрыть">
            <CloseIcon />
          </button>
        </div>
        <div className="reader__bookmark-popup-list">
          {items.map((item, i) => (
            <div key={item.id} className="bookmark-edit-modal__row-wrap">
              <div
                className="reader__bookmark-popup-opt"
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                onDragEnd={() => { dragIdx.current = null; }}
              >
                <span
                  className="bookmark-dot"
                  style={{ background: item.color, cursor: 'pointer', flexShrink: 0 }}
                  onClick={() => setColorPickId(colorPickId === item.id ? null : item.id)}
                />
                {editingId === item.id ? (
                  <input
                    className="bookmark-edit-modal__label-input"
                    value={editingText}
                    autoFocus
                    onChange={e => setEditingText(e.target.value)}
                    onBlur={() => commitEdit(item.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitEdit(item.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                ) : (
                  <span
                    className="bookmark-edit-modal__label"
                    onClick={() => { setEditingId(item.id); setEditingText(item.label); setColorPickId(null); }}
                  >
                    {item.label}
                  </span>
                )}
                <button
                  className="bookmark-edit-modal__delete"
                  aria-label="Удалить"
                  onClick={() => setItems(prev => prev.filter(x => x.id !== item.id))}
                >
                  <TrashIcon />
                </button>
                <span className="bookmark-edit-modal__drag"><DragIcon /></span>
              </div>
              {colorPickId === item.id && (
                <div className="bookmark-edit-modal__color-pick">
                  {BOOKMARK_COLORS.map(c => (
                    <button
                      key={c}
                      className={`bookmark-edit-modal__color${item.color === c ? ' bookmark-edit-modal__color--active' : ''}`}
                      style={{ background: c }}
                      onClick={() => { setItems(prev => prev.map(x => x.id === item.id ? { ...x, color: c } : x)); setColorPickId(null); }}
                      aria-label={c}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="bookmark-edit-modal__colors">
          {BOOKMARK_COLORS.map(color => (
            <button
              key={color}
              className={`bookmark-edit-modal__color${selectedColor === color ? ' bookmark-edit-modal__color--active' : ''}`}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
              aria-label={color}
            />
          ))}
        </div>
        <div className="bookmark-edit-modal__input-wrap">
          <input
            type="text"
            className="bookmark-edit-modal__input"
            placeholder="Создать новую закладку"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addBookmark(); }}
          />
          <button className="bookmark-edit-modal__add" aria-label="Добавить" onClick={addBookmark}>
            <PlusIcon />
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Customize Modal ── */
function CustomizeModal({ onClose }: { onClose: () => void }) {
  const [avatar, setAvatar] = useState('/images/avatar3.png');
  const [banner, setBanner] = useState('/images/profile-bg.png');
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handlePick = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  return (
    <>
      <div className="customize-overlay" onClick={onClose} />
      <div className="customize-modal">
        <div className="customize-modal__header">
          <h2 className="customize-modal__title">Кастомизировать</h2>
          <button className="customize-modal__close" onClick={onClose} aria-label="Закрыть">
            <CloseIcon />
          </button>
        </div>

        <div className="customize-modal__previews">
          <div className="customize-modal__card customize-modal__card--avatar">
            <img src={avatar} alt="Аватар" />
            <button className="customize-modal__change" onClick={() => avatarInput.current?.click()}>
              Изменить
            </button>
            <input
              ref={avatarInput}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePick(setAvatar)}
            />
          </div>
          <div className="customize-modal__card customize-modal__card--banner">
            <img src={banner} alt="Баннер" />
            <button className="customize-modal__change" onClick={() => bannerInput.current?.click()}>
              Изменить
            </button>
            <input
              ref={bannerInput}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePick(setBanner)}
            />
          </div>
        </div>

        <button className="customize-modal__save" onClick={onClose}>Сохранить</button>
      </div>
    </>
  );
}

/* ── Review icons ── */
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
      <path opacity="0.4" d="M15.9375 6.86251C14.205 4.14001 11.67 2.57251 9 2.57251C7.665 2.57251 6.3675 2.96251 5.1825 3.69001C3.9975 4.42501 2.9325 5.49751 2.0625 6.86251C1.3125 8.04001 1.3125 9.95251 2.0625 11.13C3.795 13.86 6.33 15.42 9 15.42C10.335 15.42 11.6325 15.03 12.8175 14.3025C14.0025 13.5675 15.0675 12.495 15.9375 11.13C16.6875 9.96001 16.6875 8.04001 15.9375 6.86251ZM9 12.03C7.32 12.03 5.97 10.6725 5.97 9.00001C5.97 7.32751 7.32 5.97001 9 5.97001C10.68 5.97001 12.03 7.32751 12.03 9.00001C12.03 10.6725 10.68 12.03 9 12.03Z" fill="currentColor"/>
      <path d="M8.99883 6.85492C7.82133 6.85492 6.86133 7.81492 6.86133 8.99992C6.86133 10.1774 7.82133 11.1374 8.99883 11.1374C10.1763 11.1374 11.1438 10.1774 11.1438 8.99992C11.1438 7.82242 10.1763 6.85492 8.99883 6.85492Z" fill="currentColor"/>
    </svg>
  );
}
function ReviewHeartIcon() {
  return (
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.75 3.31938C6.19444 -0.504391 0.75 -0.0971239 0.75 4.7901C0.75 9.67732 7.75 13.7501 7.75 13.7501C7.75 13.7501 14.75 9.67732 14.75 4.7901C14.75 -0.0971239 9.30556 -0.504391 7.75 3.31938Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const PROFILE_REVIEWS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  username: "Jul_Mot",
  time: "2 месяца назад",
  title: "Спасибо",
  text: "Оригинальный сюжет для ренкорнаций. Впервые я смотрю аниме после прочтения манги. И здесь очень важно найти СВОЙ формат познания этой истории.",
  rating: i % 3 === 0 ? 10 : i % 3 === 1 ? 3 : 7,
  views: "1 470",
  likes: 240,
  type: i % 3 === 0 ? "positive" : i % 3 === 1 ? "negative" : "neutral",
}));

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageInner />
    </Suspense>
  );
}

function ProfilePageInner() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'bookmarks' ? 'bookmarks' : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [myComments, setMyComments] = useState(MY_COMMENTS);
  const router = useRouter();
  const [activeBookmarkFilter, setActiveBookmarkFilter] = useState('Читаю');
  // Список типов закладок вынесен в состояние, чтобы правки из модалки
  // редактирования сразу отражались в фильтрах (profile-bookmarks__filters)
  const [visibleBookmarksCount, setVisibleBookmarksCount] = useState(3);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);
  const [bookmarkTabs, setBookmarkTabs] = useState(BOOKMARK_TABS);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [gender, setGender] = useState('Мужской');
  const [bookmarkEditOpen, setBookmarkEditOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState('По добавлению ↓');
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [commentMenuOpen, setCommentMenuOpen] = useState<number | null>(null);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(true);
  const [showRepeatPwd, setShowRepeatPwd] = useState(false);
  const [excludedGenres, setExcludedGenres] = useState<string[]>([]);
  const toggleExcludeGenre = (g: string) => setExcludedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  // Если активный тип закладки удалили в модалке — переключаемся на первый доступный
  useEffect(() => {
    if (bookmarkTabs.length && !bookmarkTabs.some(t => t.id === activeBookmarkFilter)) {
      setActiveBookmarkFilter(bookmarkTabs[0].id);
    }
  }, [bookmarkTabs, activeBookmarkFilter]);

  // Фильтрация по активному типу закладки + сортировка по выбранной опции
  const visibleBookmarks = BOOKMARKS
    .filter(b => b.status === activeBookmarkFilter)
    .slice()
    .sort((a, b) => {
      switch (sortLabel) {
        case 'По добавлению ↓': return a.added - b.added;      // новые сверху
        case 'По добавлению ↑': return b.added - a.added;      // старые сверху
        case 'По обновлению ↓': return a.updated - b.updated;
        case 'По обновлению ↑': return b.updated - a.updated;
        case 'По названию А-Я': return a.title.localeCompare(b.title, 'ru');
        case 'По названию Я-А': return b.title.localeCompare(a.title, 'ru');
        default: return 0;
      }
    });

  return (
    <>
      <Header />
      <main className="main profile-page-main">
        {/* ── Banner ── */}
        <section className="profile-banner">
          <div className="container">
            <div className="profile-banner__content">
              <div className="profile-banner__avatar">
                <img src="/images/avatar3.png" alt="Avatar" />
              </div>
              <div className="profile-banner__info">
                <h2 className="profile-banner__name">SEMPAI_11</h2>
                <p className="profile-banner__status">Пользователь | В сети 2 минуты назад</p>
              </div>
              <button className="profile-banner__upload" onClick={() => setCustomizeOpen(true)}>
                <UploadIcon />
              </button>
            </div>
          </div>
        </section>

        {customizeOpen && <CustomizeModal onClose={() => setCustomizeOpen(false)} />}

        {/* ── Mobile tab bar ── */}
        <div className="profile-mobile-tabs">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`profile-mobile-tabs__item${activeTab === item.id ? ' profile-mobile-tabs__item--active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* ── Body: sidebar + content ── */}
        <section className="section profile-section">
          <div className="container">
            <div className="profile-layout">
              {/* ── Left sidebar ── */}
              <aside className="profile-sidebar">
                <nav className="profile-sidebar__nav">
                  {MENU_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      className={`profile-sidebar__item${activeTab === item.id ? ' profile-sidebar__item--active' : ''}`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
                <div className="profile-sidebar__divider"></div>
                <button className="profile-sidebar__logout">
                  <LogoutIcon />
                  Выйти
                </button>
              </aside>

              {/* ── Right content ── */}
              <div className="profile-content">
                {/* ── Tab: Профиль ── */}
                {activeTab === 'profile' && (
                  <div className="profile-tab-profile">
                    <h2 className="profile-content__title">ЛИЧНЫЕ ДАННЫЕ</h2>
                    <div className="profile-form">
                      <div className="profile-form__row">
                        <div className="profile-form__field">
                          <label className="profile-form__label">Никнейм</label>
                          <div className="profile-form__input-wrap">
                            <input type="text" defaultValue="Sempai_11" className="profile-form__input" />
                            <button className="profile-form__edit-btn"><EditIcon /></button>
                          </div>
                        </div>
                        <div className="profile-form__field">
                          <label className="profile-form__label">Пол</label>
                          <div className="profile-form__input-wrap">
                            <CustomSelect
                              options={['Мужской', 'Женский']}
                              value={gender}
                              onChange={setGender}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="profile-form__field profile-form__field--full">
                        <label className="profile-form__label">О себе</label>
                        <textarea className="profile-form__textarea" placeholder="О себе"></textarea>
                      </div>
                      <button className="profile-form__save">Сохранить</button>
                    </div>
                  </div>
                )}

                {/* ── Tab: Закладки ── */}
                {activeTab === 'bookmarks' && (
                  <div className="profile-tab-bookmarks">
                    <h2 className="profile-content__title">МОИ ЗАКЛАДКИ</h2>
                    <div className="profile-bookmarks__filters">
                      {bookmarkTabs.map((tab) => (
                        <button
                          key={tab.id}
                          className={`profile-bookmarks__filter${activeBookmarkFilter === tab.id ? ' profile-bookmarks__filter--active' : ''}`}
                          onClick={() => setActiveBookmarkFilter(tab.id)}
                        >
                          <span className="bookmark-dot" style={{ background: tab.color }} />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div className="profile-bookmarks__toolbar">
                      <button className="profile-bookmarks__edit" onClick={() => setBookmarkEditOpen(true)}>
                        Редактировать
                        <EditIcon />
                      </button>
                    </div>
                    {bookmarkEditOpen && (
                      <BookmarkEditModal
                        onClose={() => setBookmarkEditOpen(false)}
                        items={bookmarkTabs}
                        setItems={setBookmarkTabs}
                      />
                    )}
                    <div className="catalog-title-row__actions">
                      <div className="catalog-sort-wrapper">
                        <button
                          className="catalog-sort-btn"
                          onClick={() => setSortOpen(v => !v)}
                          aria-haspopup="listbox"
                          aria-expanded={sortOpen}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12L4 15L7 12M4 15V1M15 4L12 1L9 4M12 1V15" stroke="#562CF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{sortLabel}</span>
                        </button>
                        {sortOpen && (
                          <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setSortOpen(false)} />
                            <ul className="catalog-sort-dropdown" role="listbox">
                              {[
                                'По добавлению ↓',
                                'По добавлению ↑',
                                'По обновлению ↓',
                                'По обновлению ↑',
                                'По названию А-Я',
                                'По названию Я-А',
                              ].map(opt => (
                                <li
                                  key={opt}
                                  className={`catalog-sort-option${sortLabel === opt ? ' catalog-sort-option--active' : ''}`}
                                  role="option"
                                  aria-selected={sortLabel === opt}
                                  onClick={() => { setSortLabel(opt); setSortOpen(false); }}
                                >
                                  {opt}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                      <button className="catalog-filter-toggle" aria-label="Открыть фильтры">
                        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.22998 0H9.35999C10.04 0 10.59 0.56 10.59 1.25V2.62C10.59 3.12 10.28 3.73999 9.96997 4.04999L7.32001 6.42001C6.95001 6.73001 6.70001 7.36001 6.70001 7.85001V10.53C6.70001 10.9 6.45002 11.4 6.15002 11.59L5.28998 12.15C4.48998 12.65 3.38 12.09 3.38 11.09V7.78C3.38 7.34 3.13001 6.78 2.89001 6.47L0.549988 3.97C0.239988 3.66 0 3.1 0 2.72V1.29001C0 0.560009 0.54998 0 1.22998 0Z" fill="#834DFB"/>
                        </svg>
                        <span>Фильтры</span>
                      </button>
                    </div>
                    <div className="profile-bookmarks__list">
                      {visibleBookmarks.length === 0 && (
                        <p className="profile-bookmarks__empty">В этой закладке пока нет произведений.</p>
                      )}
                      {visibleBookmarks.slice(0, visibleBookmarksCount).map((b) => (
                        <div key={b.id} className="profile-bookmark-item">
                          <div className="profile-bookmark-item__cover">
                            <img src={`/images/cover_${(b.id % 12) + 1}.jpg`} alt={b.title} />
                          </div>
                          <div className="profile-bookmark-item__info">
                            <h4 className="profile-bookmark-item__title">{b.title}</h4>
                            <p className="profile-bookmark-item__tags">
                              {b.genre}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 8.75L8.75 0.75M8.75 7.15V0.75H2.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              {b.year}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 8.75L8.75 0.75M8.75 7.15V0.75H2.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </p>
                          </div>
                          <button
                            className="profile-bookmark-item__continue"
                            onClick={() => router.push(`/manga/${b.id}/read`)}
                          >
                            Продолжить Том {b.volume} Глава {b.chapter}
                          </button>
                        </div>
                      ))}
                    </div>
                    {visibleBookmarksCount < BOOKMARKS.length && (
                      <button className="profile-content__show-more manga-inner__show-more" onClick={() => setVisibleBookmarksCount(prev => prev + 3)}>
                        Показать ещё
                      </button>
                    )}
                  </div>
                )}

                {/* ── Tab: Мои комментарии ── */}
                {activeTab === 'comments' && (
                  <div className="profile-tab-comments">
                    <h2 className="profile-content__title">МОИ КОММЕНТАРИИ</h2>
                    <div className="profile-comments__list">
                      {myComments.map((c) => (
                        <div key={c.id} className="profile-comment-item">
                          <div className="profile-comment-item__avatar">
                            <img src="/images/avatar_default.png" alt={c.username} />
                          </div>
                          <div className="profile-comment-item__body">
                            <div className="profile-comment-item__top">
                              <div className="profile-comment-item__header">
                                <span className="profile-comment-item__name">{c.username}</span>
                                <div className="profile-comment-item__menu-wrap">
                                  <button
                                    className="profile-comment-item__menu"
                                    onClick={() => setCommentMenuOpen(commentMenuOpen === c.id ? null : c.id)}
                                  >
                                    <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2C13 2.55228 13.4477 3 14 3C14.5523 3 15 2.55228 15 2C15 1.44772 14.5523 1 14 1C13.4477 1 13 1.44772 13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 2C7 2.55228 7.44772 3 8 3C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1C7.44772 1 7 1.44772 7 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 2C1 2.55228 1.44772 3 2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  </button>
                                  {commentMenuOpen === c.id && (
                                    <>
                                      <div className="comment-menu-overlay" onClick={() => setCommentMenuOpen(null)} />
                                      <div className="comment-menu-dropdown">
                                        <button 
                                          className="comment-menu-dropdown__item comment-menu-dropdown__item--active"
                                          onClick={() => {
                                            setCommentMenuOpen(null);
                                            router.push('/manga/1?edittext=' + encodeURIComponent(c.text));
                                          }}
                                        >
                                          Редактировать
                                        </button>
                                        <button 
                                          className="comment-menu-dropdown__item"
                                          onClick={() => {
                                            setMyComments(myComments.filter(comment => comment.id !== c.id));
                                            setCommentMenuOpen(null);
                                          }}
                                        >
                                          Удалить
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <p className="profile-comment-item__text">{c.text}</p>
                            </div>
                            <div className="profile-comment-item__footer">
                              <span className="profile-comment-item__time">{c.time}</span>
                              <a href="#" className="profile-comment-item__link">Перейти в комментарии</a>
                              <div className="profile-comment-item__reactions">
                                <button className="profile-comment-item__like">
                                  <ThumbUpIcon /> {c.likes}
                                </button>
                                <button className="profile-comment-item__dislike">
                                  <ThumbDownIcon /> 0
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Tab: Мои отзывы ── */}
                {activeTab === 'reviews' && (
                  <div className="profile-tab-reviews">
                    <h2 className="profile-content__title">МОИ ОТЗЫВЫ</h2>

                    <div className="manga-inner__review-filters">
                      <button
                        className={`manga-inner__review-filter${reviewFilter === 'all' ? ' manga-inner__review-filter--active' : ''}`}
                        onClick={() => setReviewFilter('all')}
                      >
                        Все отзывы
                      </button>
                      <button
                        className={`manga-inner__review-filter manga-inner__review-filter--positive${reviewFilter === 'positive' ? ' manga-inner__review-filter--active' : ''}`}
                        onClick={() => setReviewFilter('positive')}
                      >
                        <SmilePositiveIcon />
                        Положительные
                      </button>
                      <button
                        className={`manga-inner__review-filter manga-inner__review-filter--negative${reviewFilter === 'negative' ? ' manga-inner__review-filter--active' : ''}`}
                        onClick={() => setReviewFilter('negative')}
                      >
                        <SmileNegativeIcon />
                        Негативные
                      </button>
                      <button
                        className={`manga-inner__review-filter manga-inner__review-filter--neutral${reviewFilter === 'neutral' ? ' manga-inner__review-filter--active' : ''}`}
                        onClick={() => setReviewFilter('neutral')}
                      >
                        <SmileNeutralIcon />
                        Нейтральные
                      </button>
                    </div>

                    <div className="manga-inner__reviews-list">
                      {PROFILE_REVIEWS.filter((r) => reviewFilter === 'all' || r.type === reviewFilter).map((r) => {
                        const scoreColor = r.type === 'positive' ? 'green' : r.type === 'negative' ? 'red' : 'yellow';
                        return (
                          <div key={r.id} className={`manga-inner__review manga-inner__review--${r.type}`}>
                            <div className="manga-inner__review-top">
                              <div className="manga-inner__review-avatar">
                                <img src={`/images/cover_${(r.id % 12) + 1}.jpg`} alt={r.username} />
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
                                <span className="manga-inner__review-stat">
                                  <ReviewHeartIcon /> {r.likes}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {visibleReviewsCount < PROFILE_REVIEWS.filter(r => reviewFilter === 'all' || r.type === reviewFilter).length && (
                      <button className="manga-inner__show-more" onClick={() => setVisibleReviewsCount(prev => prev + 5)}>
                        Показать ещё
                      </button>
                    )}
                  </div>
                )}

                {/* ── Tab: История чтения ── */}
                {activeTab === 'history' && (
                  <div className="profile-tab-history">
                    <h2 className="profile-content__title">ИСТОРИЯ ЧТЕНИЯ</h2>
                    <div className="manga-grid profile-history__grid">
                      {READING_HISTORY.map((item) => (
                        <a href={`/manga/${item.id}`} key={item.id} className="manga-card">
                          <div className="manga-card__image-wrapper">
                            <img src={`/images/cover_${item.cover}.jpg`} alt={item.title} />
                            <div className="rating-badge">
                              {item.rating}
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.2091 1.01094L9.44445 3.49535C9.61092 3.83894 10.0578 4.16491 10.4345 4.23538L12.6687 4.6054C14.0969 4.84327 14.4298 5.88285 13.4047 6.92242L11.6611 8.6756C11.372 8.96633 11.2055 9.53898 11.3019 9.95305L11.8013 12.1203C12.1956 13.8294 11.2844 14.499 9.78617 13.6004L7.69214 12.3494C7.3154 12.1203 6.68458 12.1203 6.30783 12.3494L4.21381 13.6004C2.71558 14.4902 1.80439 13.8294 2.19866 12.1203L2.69808 9.95305C2.79445 9.54779 2.62798 8.97514 2.33885 8.6756L0.595308 6.92242C-0.429794 5.89165 -0.0968578 4.85208 1.33128 4.6054L3.56546 4.23538C3.94221 4.17372 4.38905 3.83894 4.55552 3.49535L5.7909 1.01094C6.44802 -0.336981 7.53446 -0.336981 8.2091 1.01094Z" fill="white"/></svg>
                            </div>
                          </div>
                          <div className="manga-card__info">
                            <h3 className="manga-card__title">{item.title}</h3>
                            <span className="manga-card__genre">{item.genres}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Tab: Настройки аккаунта ── */}
                {activeTab === 'settings' && (
                  <div className="profile-tab-settings">
                    <h2 className="profile-content__title">СМЕНА ПАРОЛЯ</h2>
                    <div className="profile-settings__password">
                      <div className="profile-form__field profile-form__field--full">
                        <label className="profile-form__label">Старый пароль</label>
                        <div className="profile-form__input-wrap">
                          <input type={showOldPwd ? 'text' : 'password'} className="profile-form__input" />
                          <button className="profile-form__edit-btn" onClick={() => setShowOldPwd(v => !v)}>
                            {showOldPwd ? <EyeOpenIcon /> : <EyeClosedIcon />}
                          </button>
                        </div>
                      </div>
                      <div className="profile-form__row">
                        <div className="profile-form__field">
                          <label className="profile-form__label">Новый пароль</label>
                          <div className="profile-form__input-wrap">
                            <input type={showNewPwd ? 'text' : 'password'} className="profile-form__input" />
                            <button className="profile-form__edit-btn" onClick={() => setShowNewPwd(v => !v)}>
                              {showNewPwd ? <EyeOpenIcon /> : <EyeClosedIcon />}
                            </button>
                          </div>
                        </div>
                        <div className="profile-form__field">
                          <label className="profile-form__label">Введите пароль ещё раз</label>
                          <div className="profile-form__input-wrap">
                            <input type={showRepeatPwd ? 'text' : 'password'} className="profile-form__input" />
                            <button className="profile-form__edit-btn" onClick={() => setShowRepeatPwd(v => !v)}>
                              {showRepeatPwd ? <EyeOpenIcon /> : <EyeClosedIcon />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button className="profile-form__save">Сохранить</button>
                    </div>

                    <h2 className="profile-content__title profile-content__title--mt">ИСКЛЮЧИТЬ ЖАНРЫ</h2>
                    <div className="profile-settings__genres">
                      {[
                        "Боевые искусства", "Гарем", "Гендерная интрига", "Героическое фэнтези",
                        "Детектив", "Дзёсэй", "Драма", "Исекай",
                        "Комедия", "Мистика", "Приключения", "Романтика",
                        "Сёнэн", "Сёдзё", "Фэнтези",
                      ].map((genre) => {
                        const checked = excludedGenres.includes(genre);
                        return (
                          <button
                            key={genre}
                            type="button"
                            className={`profile-genre-row${checked ? ' profile-genre-row--checked' : ''}`}
                            onClick={() => toggleExcludeGenre(genre)}
                          >
                            <span className="profile-genre-checkbox-box">
                              {checked && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </span>
                            <span className="catalog-filter__checkbox-label">{genre}</span>
                          </button>
                        );
                      })}
                    </div>
                    <h2 className="profile-content__title profile-content__title--mt">ПРИВЯЗАТЬ ПРОФИЛЬ</h2>
                    <div className="profile-settings__social">
                      {SOCIAL_LINKS.map((s) => (
                        <div key={s.name} className="profile-social-item">
                          <div className="profile-social-item__icon">{s.icon}</div>
                          <span className="profile-social-item__name">{s.name}</span>
                          <button className="profile-social-item__btn">Привязать</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button className="profile-mobile-logout">
                  <LogoutIcon />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
