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

const [isMenuSelected,setIsMenuSelected] = useState(false);
const menuClose = () => setIsMenuClose(!setIsMenuClose);

return ( <nav className={styles.navbar}>
{/* Hamburger Icon */} 
<div className={styles.navbar__hamburger} onClick={toggleMenu}>
<FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" /> </div>

  {/* Mobile-only logo */}
  <div
    className={`${styles.navbar__logo} ${styles["navbar__logo--mobile"]}`}>
    <Link href="/" onClick={() => setIsMenuOpen(false)}>
      <Image src="/logo.png" alt="Logo" width={220} height={110} />
    </Link>
  </div>

  {/* Menu */}
  <ul
    className={`${styles.navbar__menu} 
    ${
      isMenuOpen ? styles["navbar__menu--open"] : ""} `}>
    
    <li className={styles.navbar__item}>
      <Link href="/rent" onClick={() => setIsMenuOpen(false)}>RENT</Link>
    </li>
    <li className={styles.navbar__item}>
      <Link href="/sell" onClick={() => setIsMenuOpen(false)}>SELL</Link>
    </li>
    <li className={styles.navbar__item}>
      <Link href="/buy" onClick={() => setIsMenuOpen(false)}>BUY</Link>
    </li>
    <li className={styles.navbar__item}>
      <Link href="/shortlets" onClick={() => setIsMenuOpen(false)}>SHORTLETS</Link>
    </li>

    {/* Desktop-only logo */}
    <div className={`${styles.navbar__logo} ${styles['navbar__logo--desktop']}`}>
      <Link href="/">
      <Image 
      src="/logo.png" 
      alt="Logo" 
      width={220} height={110} 
      />
      </Link>
    </div>

    <li className={styles.navbar__item}>
      <Link href="/manage" onClick={() => setIsMenuOpen(false)}>MANAGE</Link>
    </li>
    <li className={styles.navbar__item}>
      <Link href="/advert" onClick={() => setIsMenuOpen(false)}>ADVERT</Link>
    </li>
    <li className={styles.navbar__item}>
      <Link href="/help" onClick={() => setIsMenuOpen(false)}>HELP</Link>
    </li>
    <li className={styles.navbar__item}>
      <Link href="/signIn" onClick={() => setIsMenuOpen(false)}>SIGN IN / SIGN UP</Link>
    </li>
  </ul>
</nav>

);
}

export default Nav;
