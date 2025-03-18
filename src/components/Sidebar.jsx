import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import '../App.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <ul className="nav flex-column">
                <li className="nav-item d-flex justify-content-between align-items-center">
                    <a className="nav-link" href="#">Smartfony</a>
                    <FontAwesomeIcon icon={faChevronRight} className="text-black" />
                </li>
                <li className="nav-item d-flex justify-content-between align-items-center">
                    <a className="nav-link" href="#">Laptopy</a>
                    <FontAwesomeIcon icon={faChevronRight} className="text-black" />
                </li>
                <li className="nav-item d-flex justify-content-between align-items-center">
                    <a className="nav-link" href="#">Drukarki 3D</a>
                    <FontAwesomeIcon icon={faChevronRight} className="text-black" />
                </li>
                <li className="nav-item d-flex justify-content-between align-items-center">
                    <a className="nav-link" href="#">Aparaty</a>
                    <FontAwesomeIcon icon={faChevronRight} className="text-black" />
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;

