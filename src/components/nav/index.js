"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Nav.module.scss";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars, faTimes, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // "landlord" | "tenant" | null
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 🔐 CHECK AUTH SESSION
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUserRole(data.role || null); // "landlord" or "tenant"
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const navbar__item = "text-sm"
  return (
      <nav className="flex justify-around gap-2 ">
          {/* Hamburger Icon */}
            <div className={styles.navbar__hamburger} onClick={toggleMenu}>
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
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
              }`}>
              <Link href="/rent" onClick={() => setIsMenuOpen(false)}>
                  <li className="text-sm">RENT</li>
              </Link>

              <Link href="/sell" onClick={() => setIsMenuOpen(false)}>
                  <li className="text-sm">SELL</li>
              </Link>

              <Link href="/buy" onClick={() => setIsMenuOpen(false)}>
                  <li className="text-sm">BUY</li>
              </Link>

              <Link href="/shortlets" onClick={() => setIsMenuOpen(false)}>
                  <li className="text-sm">SHORTLETS</li>
              </Link>

              {/* Desktop logo */}
              <div
                  className={`${styles.navbar__logo} ${styles["navbar__logo--desktop"]}`}>
                  <Link href="/">
                      <Image
                          src="/logo.png"
                          alt="Logo"
                          width={330}
                          height={250}
                      />
                  </Link>
              </div>

              <Link href="/manage" onClick={() => setIsMenuOpen(false)}>
                  <li className="text-sm">MANAGE</li>
              </Link>

              <Link href="/advertise" onClick={() => setIsMenuOpen(false)}>
                  <li className="text-sm">ADVERTISE</li>
              </Link>

              <Link href="/help" onClick={() => setIsMenuOpen(false)}>
                  <li className="text-sm">HELP</li>
              </Link>

                {/* 🔐 AUTH SECTION */}
                {!loading && (
                    <>
                        {!isAuthenticated ? (
                        <Link
                            href="/signUpLanding"
                                onClick={() => setIsMenuOpen(false)}>
                                <li className="text-sm">
                                    SIGN UP / SIGN IN
                                </li>
                        </Link>
                
                        ) : (
                            <li
                                className={styles.navbar__item}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    // Route to the correct dashboard based on role
                                    if (userRole === "tenant") {
                                        router.push("/tenantDashboard");
                                    } else {
                                        router.push("/landlordDashboard");
                                    }
                                }}
                                style={{ cursor: "pointer" }}>
                                <FontAwesomeIcon icon={faUserCircle} size="lg" />
                            </li>
                        )}
                    </>
                )}
          </ul>
      </nav>
  );
}

export default Nav;
