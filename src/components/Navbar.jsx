import React, { useState, useEffect } from "react";
import { Navbar, Nav, Form, FormControl, Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart, faSearch, faUser, faUserPlus, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"; 

const AppNavbar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);

    const getUserFromLocalStorage = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error("Błąd przy parsowaniu danych użytkownika:", error);
                return null;
            }
        }
        return null;
    };

    useEffect(() => {
        setUser(getUserFromLocalStorage());
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(getUserFromLocalStorage());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

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
        window.location.href = "/"; // 🔥 Po wylogowaniu przekierowanie na stronę główną
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
                                    Logowanie <FontAwesomeIcon icon={faUser} className="me-2" />
                                </Nav.Link>
                                <Nav.Link href="/register">
                                    Zarejestruj się <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link>
                                    Witaj, {user.name} <FontAwesomeIcon icon={faUser} className="me-2" />
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout}>
                                    Wyloguj <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                </Nav.Link>
                                <Nav.Link href="/favorites">
                                    Ulubione <FontAwesomeIcon icon={faHeart} className="me-2" />
                                </Nav.Link>
                            </>
                        )}
                        <Nav.Link href="/cart">
                            Koszyk <FontAwesomeIcon icon={faCartShopping} className="me-2" />
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
                            <FontAwesomeIcon icon={faSearch} className="me-2" />
                            Szukaj
                        </Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
