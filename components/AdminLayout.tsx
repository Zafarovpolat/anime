'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_MENU: { href: string; label: string; alsoActive?: string[]; icon: React.ReactNode }[] = [
  {
    href: '/admin/works',
    label: 'Произведения',
    alsoActive: ['/admin/chapters'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path opacity="0.4" d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" fill="currentColor"/>
        <path d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5M8 13H12M8 17H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/admin/users',
    label: 'Пользователи',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path opacity="0.4" d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="currentColor"/>
        <path d="M17.08 14.15C14.29 12.29 9.74 12.29 6.93 14.15C5.66 15 4.96 16.15 4.96 17.38C4.96 18.61 5.66 19.75 6.92 20.59C8.32 21.53 10.16 22 12 22C13.84 22 15.68 21.53 17.08 20.59C18.34 19.74 19.04 18.6 19.04 17.36C19.03 16.13 18.34 14.99 17.08 14.15Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: '/admin/comments',
    label: 'Комментарии',
    icon: (
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <path opacity="0.4" d="M21.5475 19.6349L22.0025 23.3216C22.1192 24.2899 21.0808 24.9666 20.2525 24.4649L15.3642 21.5599C14.8275 21.5599 14.3025 21.5249 13.7892 21.4549C14.6525 20.4399 15.1658 19.1566 15.1658 17.7682C15.1658 14.4549 12.2958 11.7716 8.74917 11.7716C7.39584 11.7716 6.14751 12.1566 5.10918 12.8333C5.07418 12.5416 5.0625 12.2499 5.0625 11.9466C5.0625 6.63824 9.67084 2.33325 15.3642 2.33325C21.0575 2.33325 25.6658 6.63824 25.6658 11.9466C25.6658 15.0966 24.0442 17.8849 21.5475 19.6349Z" fill="currentColor"/>
        <path d="M15.1654 17.7683C15.1654 19.1567 14.652 20.44 13.7887 21.455C12.6337 22.855 10.802 23.7533 8.7487 23.7533L5.7037 25.5617C5.19036 25.8767 4.53703 25.445 4.60703 24.85L4.89869 22.5517C3.33536 21.4667 2.33203 19.7283 2.33203 17.7683C2.33203 15.715 3.4287 13.9067 5.1087 12.8334C6.14704 12.1567 7.39536 11.7717 8.7487 11.7717C12.2954 11.7717 15.1654 14.455 15.1654 17.7683Z" fill="currentColor"/>
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <nav className="admin-sidebar__nav">
          {ADMIN_MENU.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/') ||
              (item.alsoActive?.some(p => pathname === p || pathname.startsWith(p + '/')) ?? false);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar__item${active ? ' admin-sidebar__item--active' : ''}`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="profile-sidebar__divider" />
        <Link href="/" className="admin-sidebar__back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          На сайт
        </Link>
      </aside>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
