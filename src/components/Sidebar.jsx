import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import '../App.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <ul className="nav flex-column">
                <li className="nav-item d-flex justify-content-between align-items-center">
                    <Link className="nav-link" to="/category/smartfony">Smartfony</Link>
                    <FontAwesomeIcon icon={faChevronRight} className="text-black" />
                </li>
                <li className="nav-item d-flex justify-content-between align-items-center">
                    <Link className="nav-link" to="/category/laptopy">Laptopy</Link>
                    <FontAwesomeIcon icon={faChevronRight} className="text-black" />
                </li>
                <li className="nav-item d-flex justify-content-between align-items-center">
                    <Link className="nav-link" to="/category/drukarki">Drukarki 3D</Link>
                    <FontAwesomeIcon icon={faChevronRight} className="text-black" />
                </li>
                <li className="nav-item d-flex justify-content-between align-items-center">
                    <Link className="nav-link" to="/category/aparaty">Aparaty</Link>
                    <FontAwesomeIcon icon={faChevronRight} className="text-black" />
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
