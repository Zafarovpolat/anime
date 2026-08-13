'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import SearchDropdown from './SearchDropdown';
import Logo from './Logo';

type Theme = 'light' | 'dark';

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Ленивая инициализация темы: читаем актуальное значение с <html data-theme>
  // (его выставляет анти-FOUC скрипт в layout ещё до гидрации), затем localStorage
  // и системную настройку. Так тема не сбрасывается на 'light' при навигации.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    const stored = localStorage.getItem('panelia-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Применение темы к <html> + сохранение выбора
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('panelia-theme', theme);
    } catch (e) {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => {
    // Отключаем переходы только на момент смены темы, чтобы фон и элементы
    // переключались одним кадром и не давали визуальную «лесенку».
    document.documentElement.classList.add('theme-switching');
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-switching');
      });
    });
  };

  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className={`header${searchOpen ? ' header--search-open' : ''}`} id="header" style={{ position: 'relative' }}>
        <div className="header__inner container">
          <div className="header__left">
            <Link href="/" className="logo" aria-label="Panelia">
              <Logo className="logo-svg" width={120} height={63} />
            </Link>
            <nav className="nav" aria-label="Основная навигация">
              <Link href="/" className={`nav__link${isActive('/') ? ' nav__link--active' : ''}`}>
                Главная
              </Link>
              <Link href="/catalog" className={`nav__link${isActive('/catalog') ? ' nav__link--active' : ''}`}>
                Каталог
              </Link>
              <Link href="/popular" className={`nav__link${isActive('/popular') ? ' nav__link--active' : ''}`}>
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5001 3.51709V19.4829L10.7334 20.355C9.66965 21.5625 8.79757 21.2367 8.79757 19.6267V12.7267H5.83632C4.49466 12.7267 4.12091 11.9025 5.01216 10.8963L11.5001 3.51709Z" fill="currentColor"/>
                  <path opacity="0.4" d="M17.9879 12.1038L11.5 19.4829V3.51709L12.2667 2.645C13.3304 1.4375 14.2025 1.76334 14.2025 3.37334V10.2733H17.1637C18.5054 10.2733 18.8792 11.0975 17.9879 12.1038Z" fill="currentColor"/>
                </svg>
                Популярное
              </Link>
            </nav>
          </div>
          <div className="header__actions">
            {searchOpen && (
              <button
                className="header__action-btn search-close-mobile"
                aria-label="Закрыть поиск"
                onClick={() => setSearchOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <button className="header__action-btn btn-search" aria-label="Поиск" onClick={() => setSearchOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15.8033 15.8033M15.8033 15.8033C17.1605 14.4461 18 12.5711 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.5711 18 14.4461 17.1605 15.8033 15.8033Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="header__action-btn btn-theme"
              aria-label="Переключить тему"
              aria-pressed={theme === 'dark'}
              onClick={toggleTheme}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z" fill="currentColor"/>
                <path d="M12 22.96C11.45 22.96 11 22.55 11 22V21.92C11 21.37 11.45 20.92 12 20.92C12.55 20.92 13 21.37 13 21.92C13 22.47 12.55 22.96 12 22.96ZM19.14 20.14C18.88 20.14 18.63 20.04 18.43 19.85L18.3 19.72C17.91 19.33 17.91 18.7 18.3 18.31C18.69 17.92 19.32 17.92 19.71 18.31L19.84 18.44C20.23 18.83 20.23 19.46 19.84 19.85C19.65 20.04 19.4 20.14 19.14 20.14ZM4.86 20.14C4.6 20.14 4.35 20.04 4.15 19.85C3.76 19.46 3.76 18.83 4.15 18.44L4.28 18.31C4.67 17.92 5.3 17.92 5.69 18.31C6.08 18.7 6.08 19.33 5.69 19.72L5.56 19.85C5.37 20.04 5.11 20.14 4.86 20.14ZM22 13H21.92C21.37 13 20.92 12.55 20.92 12C20.92 11.45 21.37 11 21.92 11C22.47 11 22.96 11.45 22.96 12C22.96 12.55 22.55 13 22 13ZM2.08 13H2C1.45 13 1 12.55 1 12C1 11.45 1.45 11 2 11C2.55 11 3.04 11.45 3.04 12C3.04 12.55 2.63 13 2.08 13ZM19.01 5.99C18.75 5.99 18.5 5.89 18.3 5.7C17.91 5.31 17.91 4.68 18.3 4.29L18.43 4.16C18.82 3.77 19.45 3.77 19.84 4.16C20.23 4.55 20.23 5.18 19.84 5.57L19.71 5.7C19.52 5.89 19.27 5.99 19.01 5.99ZM4.99 5.99C4.73 5.99 4.48 5.89 4.28 5.7L4.15 5.56C3.76 5.17 3.76 4.54 4.15 4.15C4.54 3.76 5.17 3.76 5.56 4.15L5.69 4.28C6.08 4.67 6.08 5.3 5.69 5.69C5.5 5.89 5.24 5.99 4.99 5.99ZM12 3.04C11.45 3.04 11 2.63 11 2.08V2C11 1.45 11.45 1 12 1C12.55 1 13 1.45 13 2C13 2.55 12.55 3.04 12 3.04Z" fill="currentColor"/>
              </svg>
            </button>
            <Link href="/profile?tab=bookmarks" className="header__action-btn btn-bookmarks header__action-btn--desktop" aria-label="Закладки">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M16.8199 2H7.17995C5.04995 2 3.31995 3.74 3.31995 5.86V19.95C3.31995 21.75 4.60995 22.51 6.18995 21.64L11.0699 18.93C11.5899 18.64 12.4299 18.64 12.9399 18.93L17.8199 21.64C19.3999 22.52 20.6899 21.76 20.6899 19.95V5.86C20.6799 3.74 18.9499 2 16.8199 2Z" fill="currentColor"/>
                <path d="M12 10.28C10.98 10.28 9.96 10.1 8.99 9.74999C8.6 9.60999 8.4 9.17999 8.54 8.78999C8.69 8.39999 9.12 8.19999 9.51 8.33999C11.12 8.91999 12.89 8.91999 14.5 8.33999C14.89 8.19999 15.32 8.39999 15.46 8.78999C15.6 9.17999 15.4 9.60999 15.01 9.74999C14.04 10.1 13.02 10.28 12 10.28Z" fill="currentColor"/>
              </svg>
            </Link>
            <button
              className="header__action-btn btn-profile header__action-btn--desktop"
              aria-label="Профиль"
              onClick={() => setLoginOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="currentColor"/>
                <path d="M17.08 14.15C14.29 12.29 9.73996 12.29 6.92996 14.15C5.65996 15 4.95996 16.15 4.95996 17.38C4.95996 18.61 5.65996 19.75 6.91996 20.59C8.31996 21.53 10.16 22 12 22C13.84 22 15.68 21.53 17.08 20.59C18.34 19.74 19.04 18.6 19.04 17.36C19.03 16.13 18.34 14.99 17.08 14.15Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        {searchOpen && <SearchDropdown onClose={() => setSearchOpen(false)} />}
      </header>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </>
  );
}
