"use client";

import { useEffect, useRef, useState } from "react";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const EmailIcon = () => (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M19.125 23.0625H7.875C4.5 23.0625 2.25 21.375 2.25 17.4375V9.5625C2.25 5.625 4.5 3.9375 7.875 3.9375H19.125C22.5 3.9375 24.75 5.625 24.75 9.5625V17.4375C24.75 21.375 22.5 23.0625 19.125 23.0625Z" fill="currentColor"/>
      <path d="M13.5001 14.4787C12.5551 14.4787 11.5989 14.1862 10.8676 13.59L7.34636 10.7775C6.98636 10.485 6.91887 9.95621 7.21137 9.59621C7.50387 9.23621 8.03262 9.16872 8.39262 9.46122L11.9139 12.2737C12.7689 12.96 14.2201 12.96 15.0751 12.2737L18.5964 9.46122C18.9564 9.16872 19.4964 9.22496 19.7776 9.59621C20.0701 9.95621 20.0139 10.4962 19.6426 10.7775L16.1214 13.59C15.4014 14.1862 14.4451 14.4787 13.5001 14.4787Z" fill="currentColor"/>
    </svg>
  );

  const PasswordIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M19.7901 4.21995C16.8301 1.26995 12.0301 1.26995 9.09015 4.21995C7.02015 6.26995 6.40015 9.21995 7.20015 11.8199L2.50015 16.5199C2.17015 16.8599 1.94015 17.5299 2.01015 18.0099L2.31015 20.1899C2.42015 20.9099 3.09015 21.5899 3.81015 21.6899L5.99015 21.9899C6.47015 22.0599 7.14015 21.8399 7.48015 21.4899L8.30015 20.6699C8.50015 20.4799 8.50015 20.1599 8.30015 19.9599L6.36015 18.0199C6.07015 17.7299 6.07015 17.2499 6.36015 16.9599C6.65015 16.6699 7.13015 16.6699 7.42015 16.9599L9.37015 18.9099C9.56015 19.0999 9.88015 19.0999 10.0701 18.9099L12.1901 16.7999C14.7801 17.6099 17.7301 16.9799 19.7901 14.9299C22.7401 11.9799 22.7401 7.16995 19.7901 4.21995Z" fill="currentColor"/>
      <path d="M14.5 12C15.8807 12 17 10.8807 17 9.5C17 8.11929 15.8807 7 14.5 7C13.1193 7 12 8.11929 12 9.5C12 10.8807 13.1193 12 14.5 12Z" fill="currentColor"/>
    </svg>
  );

  const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="currentColor"/>
      <path d="M17.08 14.15C14.29 12.29 9.74 12.29 6.93 14.15C5.66 15 4.96 16.15 4.96 17.38C4.96 18.61 5.66 19.75 6.92 20.59C8.32 21.53 10.16 22 12 22C13.84 22 15.68 21.53 17.08 20.59C18.34 19.74 19.04 18.6 19.04 17.36C19.03 16.13 18.34 14.99 17.08 14.15Z" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="login-overlay" ref={overlayRef} onClick={handleOverlayClick} aria-modal="true" role="dialog">
      <div className="login-modal">
        <button className="login-modal__close" onClick={onClose} aria-label="Закрыть">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11.8998 11.9L6.3999 6.40002M6.3999 6.40002L0.899902 0.900024M6.3999 6.40002L11.8999 0.900024M6.3999 6.40002L0.899902 11.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {tab === 'login' ? (
          <>
            {/* Title */}
            <h2 className="login-modal__title">Войти в аккаунт</h2>

            <div className="login-modal__inputs">
              <div className="login-modal__field">
                <span className="login-modal__field-icon"><EmailIcon /></span>
                <input className="login-modal__input" type="email" placeholder="*Логин/почта" autoComplete="email"/>
              </div>
              <div className="login-modal__field">
                <span className="login-modal__field-icon"><PasswordIcon /></span>
                <input className="login-modal__input" type="password" placeholder="*Пароль" autoComplete="current-password"/>
              </div>
              <button className="login-modal__submit">Войти</button>
              <a href="#" className="login-modal__forgot">Забыли пароль?</a>
            </div>

            <div className="login-modal__divider">
              <span className="login-modal__divider-line"/>
              <span className="login-modal__divider-text">или</span>
              <span className="login-modal__divider-line"/>
            </div>

            <div className="login-modal__socials">
              <button className="login-modal__social-btn" aria-label="Войти через Telegram">
                <svg width="21" height="17" viewBox="0 0 21 17" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1.44364 7.31839C7.08077 4.9193 10.8397 3.33767 12.7206 2.5735C18.0907 0.391658 19.2065 0.0126486 19.9338 0.000133439C20.0938 -0.00261913 20.4514 0.0361057 20.6831 0.219742C20.8787 0.374801 20.9326 0.584264 20.9583 0.731277C20.9841 0.87829 21.0162 1.21319 20.9907 1.47487C20.6997 4.46165 19.4405 11.7098 18.7999 15.055C18.5288 16.4705 17.9951 16.9451 17.4784 16.9916C16.3554 17.0925 15.5027 16.2667 14.4151 15.5702C12.7132 14.4805 11.7517 13.8021 10.0997 12.7387C8.19056 11.5097 9.42819 10.8343 10.5162 9.73037C10.801 9.44148 15.7486 5.04547 15.8444 4.64668C15.8564 4.59681 15.8675 4.41089 15.7544 4.31273C15.6414 4.21456 15.4745 4.24813 15.3541 4.27483C15.1834 4.31267 12.4646 6.06807 7.19761 9.54101C6.42588 10.0587 5.72687 10.3109 5.10058 10.2977C4.41015 10.2831 3.08204 9.91632 2.09473 9.60282C0.883743 9.2183 -0.0787216 9.01501 0.00508745 8.36197C0.0487404 8.02183 0.528258 7.67397 1.44364 7.31839Z" fill="currentColor"/></svg>
              </button>
              <button className="login-modal__social-btn" aria-label="Войти через Яндекс">
                <svg width="22" height="24" viewBox="0 0 22 24" fill="none"><path d="M12.8665 19.7147V23.7482H8.40977V16.947L0 0H4.65015L11.2023 13.258C12.4656 15.7914 12.8665 16.6716 12.8665 19.7147ZM21.246 0L15.7789 11.4816H11.2476L16.7148 0H21.246Z" fill="currentColor"/></svg>
              </button>
              <button className="login-modal__social-btn" aria-label="Войти через ВКонтакте">
                <svg width="25" height="15" viewBox="0 0 25 15" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M3.67273 0H0.937734C0.156297 0 0 0.371685 0 0.781421C0 1.51334 0.927234 5.14326 4.31734 9.94413C6.57742 13.2227 9.76163 15 12.6592 15C14.3977 15 14.6128 14.6053 14.6128 13.9254V11.4474C14.6128 10.6579 14.7775 10.5003 15.328 10.5003C15.7337 10.5003 16.4291 10.7053 18.0517 12.286C19.9062 14.1595 20.2119 15 21.2549 15H23.9899C24.7714 15 25.1621 14.6053 24.9367 13.8263C24.6901 13.0499 23.8047 11.9234 22.6298 10.5882C21.9923 9.82705 21.0362 9.00742 20.7464 8.59753C20.3408 8.07063 20.4566 7.83639 20.7464 7.36808C20.7464 7.36808 24.0786 2.62571 24.4263 1.01574C24.6001 0.430184 24.4263 0 23.5992 0H20.8642C20.1688 0 19.8482 0.371685 19.6743 0.781421C19.6743 0.781421 18.2835 4.20647 16.3132 6.43129C15.6757 7.07526 15.3859 7.28021 15.0382 7.28021C14.8644 7.28021 14.6127 7.07526 14.6127 6.48987V1.01574C14.6127 0.313105 14.4109 0 13.8313 0H9.53343C9.0989 0 8.83749 0.326052 8.83749 0.635131C8.83749 1.30113 9.82265 1.45476 9.92421 3.32826V7.39737C9.92421 8.28947 9.76468 8.45124 9.41703 8.45124C8.48984 8.45124 6.23445 5.01087 4.89679 1.07424C4.63469 0.309079 4.37172 0 3.67273 0Z" fill="currentColor"/></svg>
              </button>
              <button className="login-modal__social-btn" aria-label="Войти через Google">
                <svg width="18" height="17" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_login_google" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="34" height="33"><path d="M33.5192 13.0317H17.2826V19.1832H26.6122C26.4622 20.0538 26.1255 20.9103 25.6323 21.6912C25.0673 22.5859 24.3688 23.2671 23.6528 23.7858C21.5081 25.3397 19.0077 25.6574 17.2712 25.6574C12.8846 25.6574 9.13657 22.9768 7.68561 19.3342C7.62706 19.2021 7.58818 19.0655 7.54083 18.9305C7.2202 18.0035 7.04501 17.0216 7.04501 16.0011C7.04501 14.9391 7.23472 13.9224 7.58062 12.9622C8.94501 9.17528 12.7776 6.34679 17.2744 6.34679C18.1789 6.34679 19.0499 6.44859 19.8759 6.65163C21.7636 7.11565 23.0989 8.02955 23.917 8.75243L28.854 4.18104C25.8509 1.57757 21.936 0 17.2662 0C13.533 0 10.0863 1.09972 7.26184 2.9584C4.9713 4.46574 3.09274 6.48388 1.82494 8.82773C0.645706 11.001 0 13.4093 0 15.9987C0 18.5883 0.646693 21.0216 1.82593 23.1748V23.1893C3.0715 25.4751 4.89295 27.4433 7.10672 28.9437C9.04069 30.2545 12.5085 32.0002 17.2662 32.0002C20.0022 32.0002 22.4271 31.5338 24.5656 30.6597C26.1083 30.0292 27.4752 29.2068 28.7127 28.1498C30.3479 26.7531 31.6285 25.0257 32.5025 23.0381C33.3766 21.0506 33.8442 18.8031 33.8442 16.3663C33.8442 15.2315 33.7236 14.079 33.5192 13.0316V13.0317Z" fill="white"/></mask><g mask="url(#mask0_login_google)"><path d="M-0.25 16.1074C-0.232053 18.6561 0.536031 21.2857 1.69866 23.4085V23.4231C2.53871 24.9647 3.68682 26.1825 4.99449 27.3891L12.8925 24.6643C11.3983 23.9466 11.1703 23.5068 10.0991 22.7044C9.0045 21.6607 8.18868 20.4627 7.68061 19.0578H7.66015L7.68061 19.0432C7.34637 18.1155 7.3134 17.1308 7.30107 16.1074H-0.25Z" fill="currentColor"/><path d="M17.2808 -0.116211C16.5001 2.47686 16.7986 4.99742 17.2808 6.46399C18.1822 6.46462 19.0506 6.56622 19.874 6.76863C21.7617 7.23265 23.0969 8.14657 23.9151 8.86946L28.9784 4.18128C25.9789 1.58091 22.3691 -0.112114 17.2808 -0.116211Z" fill="currentColor"/><path d="M17.264 -0.136719C13.435 -0.136797 9.89983 0.99123 7.00289 2.89764C5.92725 3.60549 4.94016 4.42317 4.06121 5.33245C3.83096 7.37495 5.7849 9.88538 9.65431 9.8646C11.5317 7.79973 14.3084 6.46376 17.3988 6.46376C17.4016 6.46376 17.4044 6.46398 17.4072 6.46399L17.281 -0.116252C17.2753 -0.136255 17.2698 -0.136719 17.264 -0.136719Z" fill="currentColor"/><path d="M29.9032 16.8465L26.4855 19.0665C26.3355 19.9371 25.9985 20.7935 25.5053 21.5745C24.9403 22.4692 24.2418 23.1504 23.5259 23.6691C21.3856 25.2198 18.8919 25.5391 17.1558 25.5404C15.3615 28.43 15.0469 29.8774 17.282 32.2095C20.0478 32.2076 22.4998 31.7356 24.6626 30.8516C26.226 30.2126 27.6111 29.3791 28.8652 28.3079C30.5223 26.8926 31.8203 25.1418 32.7061 23.1277C33.592 21.1135 34.0656 18.8359 34.0656 16.3665L29.9032 16.8465Z" fill="currentColor"/><path d="M17.0273 12.7981V19.4171H33.4707C33.6154 18.5106 34.0937 17.3376 34.0937 16.3665C34.0937 15.2317 33.9732 13.8455 33.7688 12.7981H17.0273Z" fill="currentColor"/><path d="M4.13995 5.09863C3.12522 6.14839 2.25833 7.32337 1.57099 8.5941C0.391771 10.7673 -0.253906 13.4094 -0.253906 15.9988C-0.253906 16.0353 -0.250712 16.071 -0.250455 16.1074C0.271785 17.0542 6.96333 16.8729 7.30061 16.1074C7.30019 16.0717 7.29593 16.0369 7.29593 16.0011C7.29593 14.939 7.4857 14.1562 7.8316 13.196C8.25831 12.0116 8.92645 10.921 9.78082 9.98129C9.97449 9.7475 10.4911 9.24491 10.6418 8.94344C10.6992 8.82861 10.5376 8.76416 10.5285 8.72374C10.5184 8.67853 10.3017 8.71489 10.2531 8.68121C10.099 8.57429 9.7937 8.51846 9.60833 8.46884C9.21211 8.36276 8.55545 8.12883 8.19073 7.88634C7.03785 7.11982 5.23867 6.20423 4.13995 5.09863Z" fill="currentColor"/><path d="M9.3012 24.196C5.71248 25.421 5.15065 25.4649 4.82031 27.5678C5.45158 28.1502 6.12983 28.689 6.85057 29.1775C8.78454 30.4883 12.5047 32.234 17.2624 32.234C17.268 32.234 17.2733 32.2336 17.2789 32.2336V25.4236C17.2753 25.4236 17.2712 25.4238 17.2675 25.4238C15.486 25.4238 14.0623 24.9814 12.6026 24.212C12.2427 24.0223 11.5897 24.5317 11.2578 24.3039C10.8 23.9899 9.69827 24.5746 9.3012 24.196Z" fill="currentColor"/></g></svg>
              </button>
            </div>

            {/* Register link */}
            <p className="login-modal__register">
              <span>Нет учетной записи?</span>
              <a
                href="#"
                className="login-modal__register-link"
                onClick={(e) => {
                  e.preventDefault();
                  setTab('register');
                }}
              >
                Зарегистрироваться
              </a>
            </p>

            <p className="login-modal__legal">
              Нажимая <em>«Войти»</em>,{" "}
              <span className="login-modal__legal-dark">вы принимаете{" "}
              <a href="/terms" className="login-modal__legal-link">пользовательское соглашение</a></span>
              {" "}и{" "}
              <a href="/privacy" className="login-modal__legal-link">политику конфиденциальности</a>
            </p>
          </>
        ) : (
          <>
            {/* Title */}
            <h2 className="login-modal__title">Регистрация</h2>

            <div className="login-modal__inputs">
              <div className="login-modal__field">
                <span className="login-modal__field-icon"><UserIcon /></span>
                <input className="login-modal__input" type="text" placeholder="*Никнейм" autoComplete="username"/>
              </div>
              <div className="login-modal__field">
                <span className="login-modal__field-icon"><EmailIcon /></span>
                <input className="login-modal__input" type="email" placeholder="*Почта" autoComplete="email"/>
              </div>
              <div className="login-modal__field">
                <span className="login-modal__field-icon"><PasswordIcon /></span>
                <input className="login-modal__input" type="password" placeholder="*Пароль" autoComplete="new-password"/>
              </div>
              <div className="login-modal__field">
                <span className="login-modal__field-icon"><PasswordIcon /></span>
                <input className="login-modal__input" type="password" placeholder="*Повторите пароль" autoComplete="new-password"/>
              </div>
              <button className="login-modal__submit">Зарегистрироваться</button>
            </div>

            {/* Login link */}
            <p className="login-modal__register">
              <span>Уже есть учетная запись?</span>
              <a
                href="#"
                className="login-modal__register-link"
                onClick={(e) => {
                  e.preventDefault();
                  setTab('login');
                }}
              >
                Войти
              </a>
            </p>

            <p className="login-modal__legal">
              Нажимая <em>«Зарегистрироваться»</em>,{" "}
              <span className="login-modal__legal-dark">вы принимаете{" "}
              <a href="/terms" className="login-modal__legal-link">пользовательское соглашение</a></span>
              {" "}и{" "}
              <a href="/privacy" className="login-modal__legal-link">политику конфиденциальности</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
