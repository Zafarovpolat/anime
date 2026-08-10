'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchDropdownProps {
  onClose: () => void;
}

const ALL_ITEMS = [
  { id: 1, cover: '/images/cover_1.jpg', type: 'Манга', title: 'План перерожденного наёмника' },
  { id: 2, cover: '/images/cover_2.jpg', type: 'Манга', title: 'Я стала приёмной дочерью в семье убийц' },
  { id: 3, cover: '/images/cover_3.jpg', type: 'Манга', title: 'Леди-малышка изменяет мир деньгами' },
  { id: 4, cover: '/images/cover_4.jpg', type: 'Манга', title: 'Следуйте за своим сердцем' },
  { id: 5, cover: '/images/cover_5.jpg', type: 'Манга', title: 'Не подбирайте выброшенный мусор' },
  { id: 6, cover: '/images/cover_6.jpg', type: 'Манга', title: 'Таков закон' },
  { id: 7, cover: '/images/cover_7.jpg', type: 'Манга', title: 'Истинная красота' },
  { id: 8, cover: '/images/cover_8.jpg', type: 'Манга', title: 'Игрок падшего дворянского рода' },
  { id: 9, cover: '/images/cover_9.jpg', type: 'Манга', title: 'Мир Зомби' },
  { id: 10, cover: '/images/cover_10.jpg', type: 'Манга', title: 'Наномашины' },
  { id: 11, cover: '/images/cover_11.jpg', type: 'Манга', title: 'Выбери меня!' },
  { id: 12, cover: '/images/cover_12.jpg', type: 'Манга', title: 'Присцилла просит о замужестве' },
];

const ALL_USERS = [
  { id: 1, cover: '/images/avatar_default.png', type: 'Пользователь', title: 'Jul_Mol', subtitle: 'читатель' },
  { id: 2, cover: '/images/avatar2.png', type: 'Пользователь', title: 'ZafarovPolat', subtitle: 'администратор' },
  { id: 3, cover: '/images/avatar3.png', type: 'Пользователь', title: 'Reader_2026', subtitle: 'комментатор' },
];

const ALL_RESULTS = [
  ...ALL_ITEMS.map((item) => ({
    ...item,
    key: `manga-${item.id}`,
    href: `/manga/${item.id}`,
    searchText: `${item.title} ${item.type}`,
  })),
  ...ALL_USERS.map((user) => ({
    ...user,
    key: `user-${user.id}`,
    href: `/profile?user=${user.id}`,
    searchText: `${user.title} ${user.type} ${user.subtitle}`,
  })),
];

const DEFAULT_RESULTS = [
  ...ALL_RESULTS.filter((item) => item.key.startsWith('manga-')).slice(0, 4),
  ...ALL_RESULTS.filter((item) => item.key.startsWith('user-')).slice(0, 2),
];

export default function SearchDropdown({ onClose }: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? ALL_RESULTS.filter((item) => item.searchText.toLowerCase().includes(normalizedQuery))
    : DEFAULT_RESULTS;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleMouseDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleMouseDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="search-dropdown" ref={panelRef}>
      <div className="search-dropdown__input-wrap">
        <div className="search-dropdown__input-field">
          <svg className="search-dropdown__search-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.3333 23.3333L18.4372 18.4372M18.4372 18.4372C20.0206 16.8537 21 14.6662 21 12.25C21 7.41751 17.0825 3.5 12.25 3.5C7.41751 3.5 3.5 7.41751 3.5 12.25C3.5 17.0825 7.41751 21 12.25 21C14.6662 21 16.8537 20.0206 18.4372 18.4372Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            ref={inputRef}
            className="search-dropdown__input"
            type="text"
            placeholder="Поиск по произведениям и пользователям"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="search-dropdown__close-btn" onClick={onClose} aria-label="Закрыть поиск">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <p className="search-dropdown__label">
        {query.trim() ? `Результаты по «${query}»` : 'Часто ищут'}
      </p>

      {results.length === 0 ? (
        <p className="search-dropdown__empty">Ничего не найдено</p>
      ) : (
        <div className="search-dropdown__grid">
          {results.map((item) => {
            const isUserResult = item.type === 'Пользователь';

            return (
              <Link key={item.key} href={item.href} className="search-dropdown__card" onClick={onClose}>
                <div className={`search-dropdown__card-img${isUserResult ? ' search-dropdown__card-img--user' : ''}`}>
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="72px"
                    style={{ objectFit: isUserResult ? 'contain' : 'cover' }}
                  />
                </div>
                <div className="search-dropdown__card-info">
                  <span className="search-dropdown__card-type">{item.type}</span>
                  <span className="search-dropdown__card-title">{item.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
