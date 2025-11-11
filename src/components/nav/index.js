"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./Nav.module.scss";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [isMenuSelected, setIsMenuSelected] = useState(false);
  const menuClose = () => setIsMenuOpen(!setIsMenuOpen);

  return (
    <nav className={styles.navbar}>
      {/* Hamburger Icon */}
      <div className={styles.navbar__hamburger} onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />{" "}
      </div>

      {/* Mobile-only logo */}
      <div className={`${styles.navbar__logo} ${styles["navbar__logo--mobile"]}`}>
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <Image src="/logo.png" alt="Logo" width={220} height={110} />
        </Link>
      </div>

      {/* Menu */}
      <ul
        className={`${styles.navbar__menu} ${
          isMenuOpen ? styles["navbar__menu--open"] : ""
        }`}
      >
        <Link href="/rent" onClick={() => setIsMenuOpen(false)}>
          <li className={styles.navbar__item}>RENT</li>
        </Link>

        <Link href="/sell" onClick={() => setIsMenuOpen(false)}>
          <li className={styles.navbar__item}>SELL</li>
        </Link>

        <Link href="/buy" onClick={() => setIsMenuOpen(false)}>
          <li className={styles.navbar__item}>BUY</li>
        </Link>

        <Link href="/shortlets" onClick={() => setIsMenuOpen(false)}>
          <li className={styles.navbar__item}>SHORTLETS</li>
        </Link>

        {/* Desktop-only logo */}
        <div className={`${styles.navbar__logo} ${styles["navbar__logo--desktop"]}`}>
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={220} height={110} />
          </Link>
        </div>

        <Link href="/manage" onClick={() => setIsMenuOpen(false)}>
          <li className={styles.navbar__item}>MANAGE</li>
        </Link>

        <Link href="/advertise" onClick={() => setIsMenuOpen(false)}>
          <li className={styles.navbar__item}>ADVERTISE</li>
        </Link>

        <Link href="/help" onClick={() => setIsMenuOpen(false)}>
          <li className={styles.navbar__item}>HELP</li>
        </Link>

        <Link href="/signUpLanding" onClick={() => setIsMenuOpen(false)}>
          <li className={styles.navbar__item}>SIGN UP / SIGN IN</li>
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;
