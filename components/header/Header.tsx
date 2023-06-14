import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Header.module.css';

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar-left']}>
        <Link href="/" className={styles['navbar-brand']}>
          Purchase Order
        </Link>
      </div>
      <button
        className={styles['navbar-toggle-button']}
        onClick={toggleMenu}
        aria-label="toggleButton"
      >
        <span className={styles['navbar-toggle-icon']} id="toggleButton"></span>
      </button>
      <div
        className={`${styles['navbar-right']} ${isOpen ? styles['open'] : ''}`}
      >
        <Link
          href="/"
          className={`${styles.navbarlink}  ${
            router.asPath === '/' ? styles['active'] : ''
          }`}
          onClick={toggleMenu}
        >
          Home
        </Link>
        <Link
          href="/evc"
          className={`${styles.navbarlink}  ${
            router.asPath === '/evc' ? styles['active'] : ''
          }`}
          onClick={toggleMenu}
        >
          EVC
        </Link>
        <Link
          href="/dmr"
          className={`${styles.navbarlink}  ${
            router.asPath === '/dmr' ? styles['active'] : ''
          }`}
          onClick={toggleMenu}
        >
          Raise DMR
        </Link>
        <Link
          href="/total"
          className={`${styles.navbarlink}  ${
            router.asPath === '/total' ? styles['active'] : ''
          }`}
          onClick={toggleMenu}
        >
          Total Amounts
        </Link>
      </div>
    </nav>
  );
};

export default Header;
