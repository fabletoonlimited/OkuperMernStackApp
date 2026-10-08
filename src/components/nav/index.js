"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Nav.module.scss";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faTimes,
    faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // CHECK AUTH SESSION
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/user/me", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                if (res.ok) {
                    const data = await res.json();

                    setIsAuthenticated(true);
                    setUserRole(data?.role || data?.user?.role || null);
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

    // LOGOUT
    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
                cache: "no-store",
            });

            // Immediately update navbar
            setIsAuthenticated(false);
            setUserRole(null);
            setShowDropdown(false);
            setIsMenuOpen(false);

            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="flex justify-around gap-2 md:px-0 px-8 bg-white">

            {/* Hamburger */}
            <div
                className={styles.navbar__hamburger}
                onClick={toggleMenu}
            >
                <FontAwesomeIcon
                    icon={isMenuOpen ? faTimes : faBars}
                    size="lg"
                />
            </div>

            {/* Mobile logo */}
            <div
                className={`${styles.navbar__logo} ${styles["navbar__logo--mobile"]}`}
            >
                <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={220}
                        height={110}
                    />
                </Link>
            </div>

            {/* Menu */}
            <ul
                className={`${styles.navbar__menu} ${
                    isMenuOpen
                        ? styles["navbar__menu--open"]
                        : ""
                }`}
            >
                <Link
                    href="/rent"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <li className="text-sm">RENT</li>
                </Link>

                <Link
                    href="/sell"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <li className="text-sm">SELL</li>
                </Link>

                <Link
                    href="/buy"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <li className="text-sm">BUY</li>
                </Link>

                <Link
                    href="/shortlets"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <li className="text-sm">SHORTLETS</li>
                </Link>

                {/* Desktop logo */}
                <div
                    className={`${styles.navbar__logo} ${styles["navbar__logo--desktop"]}`}
                >
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={300}
                            height={220}
                        />
                    </Link>
                </div>

                <Link
                    href="/manage"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <li className="text-sm">MANAGE</li>
                </Link>

                <Link
                    href="/advertise"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <li className="text-sm">ADVERTISE</li>
                </Link>

                <Link
                    href="/help"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <li className="text-sm">HELP</li>
                </Link>

                {/* AUTH SECTION */}
                {!loading && (
                    <>
                        {!isAuthenticated ? (
                            <Link
                                href="/signUpLanding"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <li className="text-sm">
                                    SIGN UP / SIGN IN
                                </li>
                            </Link>
                        ) : (
                            <li className="relative">
                                <div
                                    onClick={() =>
                                        setShowDropdown(
                                            (prev) => !prev
                                        )
                                    }
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <FontAwesomeIcon
                                        className="text-blue-950 hover:text-gray-700 transition-colors duration-200 ease-in-out"
                                        icon={faUserCircle}
                                        size="lg"
                                    />
                                </div>

                                {showDropdown && (
                                    <div className="absolute md:right-0 left mt-2 w-40 bg-white text-black rounded shadow-lg z-50">

                                        {/* Dashboard */}
                                        <button
                                            onClick={() => {
                                                if (
                                                    userRole ===
                                                    "tenant"
                                                ) {
                                                    router.push(
                                                        "/tenantDashboard"
                                                    );
                                                } else if (
                                                    userRole ===
                                                    "landlord"
                                                ) {
                                                    router.push(
                                                        "/landlordDashboard"
                                                    );
                                                }

                                                setShowDropdown(
                                                    false
                                                );
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </button>

                                        {/* Logout */}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </li>
                        )}
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Nav;