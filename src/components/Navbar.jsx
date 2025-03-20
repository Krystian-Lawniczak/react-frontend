import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Navbar, Nav, Form, FormControl, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Lazy Loading ikon
const FontAwesomeIcon = lazy(() => import("@fortawesome/react-fontawesome").then(module => ({ default: module.FontAwesomeIcon })));
const faCartShopping = lazy(() => import("@fortawesome/free-solid-svg-icons").then(module => ({ default: module.faCartShopping })));
const faHeart = lazy(() => import("@fortawesome/free-solid-svg-icons").then(module => ({ default: module.faHeart })));
const faSearch = lazy(() => import("@fortawesome/free-solid-svg-icons").then(module => ({ default: module.faSearch })));
const faUser = lazy(() => import("@fortawesome/free-solid-svg-icons").then(module => ({ default: module.faUser })));
const faUserPlus = lazy(() => import("@fortawesome/free-solid-svg-icons").then(module => ({ default: module.faUserPlus })));
const faSignOutAlt = lazy(() => import("@fortawesome/free-solid-svg-icons").then(module => ({ default: module.faSignOutAlt })));

const AppNavbar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate(); // 🚀 Reactowy sposób przekierowania

    // Pobieranie użytkownika z localStorage
    const getUserFromLocalStorage = useCallback(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch (error) {
            console.error("Błąd przy parsowaniu danych użytkownika:", error);
            return null;
        }
    }, []);

    // Pobieranie liczby produktów w koszyku
    const getCartCount = useCallback(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, []);

    // Ustawienie początkowych wartości
    useEffect(() => {
        setUser(getUserFromLocalStorage());
        setCartCount(getCartCount());
    }, [getUserFromLocalStorage, getCartCount]);

    // Obsługa zmiany localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setUser(getUserFromLocalStorage());
            setCartCount(getCartCount());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [getUserFromLocalStorage, getCartCount]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/"); // 🚀 Przekierowanie po wylogowaniu
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
            <Container fluid>
                <Navbar.Brand href="/">ShopApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {!user ? (
                            <>
                                <Nav.Link href="/login">
                                    Logowanie <Suspense fallback={<span>...</span>}><FontAwesomeIcon icon={faUser} className="me-2" /></Suspense>
                                </Nav.Link>
                                <Nav.Link href="/register">
                                    Zarejestruj się <Suspense fallback={<span>...</span>}><FontAwesomeIcon icon={faUserPlus} className="me-2" /></Suspense>
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link>
                                    Witaj, {user.name} <Suspense fallback={<span>...</span>}><FontAwesomeIcon icon={faUser} className="me-2" /></Suspense>
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout}>
                                    Wyloguj <Suspense fallback={<span>...</span>}><FontAwesomeIcon icon={faSignOutAlt} className="me-2" /></Suspense>
                                </Nav.Link>
                                <Nav.Link href="/favorites">
                                    Ulubione <Suspense fallback={<span>...</span>}><FontAwesomeIcon icon={faHeart} className="me-2" /></Suspense>
                                </Nav.Link>
                            </>
                        )}
                        <Nav.Link href="/cart">
                            Koszyk <Suspense fallback={<span>...</span>}><FontAwesomeIcon icon={faCartShopping} className="me-2" /></Suspense>
                            <span className="badge bg-light text-dark">{cartCount}</span>
                        </Nav.Link>
                    </Nav>
                    <Form className="d-flex" onSubmit={handleSearchSubmit}>
                        <FormControl
                            type="search"
                            placeholder="Szukaj produktów..."
                            className="me-2"
                            style={{ width: "350px" }}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            aria-label="Szukaj"
                        />
                        <Button variant="outline-light" className="ms-2" type="submit">
                            <Suspense fallback={<span>...</span>}><FontAwesomeIcon icon={faSearch} className="me-2" /></Suspense>
                            Szukaj
                        </Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
