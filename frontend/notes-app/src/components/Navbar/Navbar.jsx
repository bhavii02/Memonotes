/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import '../../index.css';  

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const navigate = useNavigate();

  
    const onLogout = () => {
        localStorage.clear(); 
        navigate("/login"); 
    };

    
    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery); 
        }
    };

    
    const onClearSearch = () => {
        setSearchQuery("");
        handleClearSearch(); 
    };

    
    const toggleDarkMode = () => {
        setIsDarkTheme(!isDarkTheme); 
    };

   
    useEffect(() => {
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkTheme]);

    return (
        <div className={`flex items-center justify-between px-6 py-2 drop-shadow  ${isDarkTheme ? 'bg-[#333]' : 'bg-[#ece5dd]'}`}>
            <h2 className={`text-xl font-medium ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>Notes</h2>

            <div style={{ minWidth: '200px' }}>
                <SearchBar
                    value={searchQuery}
                    onChange={({ target }) => setSearchQuery(target.value)}
                    handleSearch={handleSearch}
                    onClearSearch={onClearSearch}
                />
            </div>

            <div className="flex items-center">
                <button
                    onClick={toggleDarkMode}
                    className="text-gray-500 mr-5 dark:text-gray-200 focus:outline-none"
                    aria-label="Toggle Dark Mode"
                    style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <FontAwesomeIcon
                        icon={isDarkTheme ? faSun : faMoon}
                        size="lg"
                        style={{ color: isDarkTheme ? "white" : "black" }}
                    />
                </button>

                <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
            </div>
        </div>
    );
};

Navbar.propTypes = {
    userInfo: PropTypes.shape({
        fullName: PropTypes.string.isRequired,
    }).isRequired,
    onSearchNote: PropTypes.func.isRequired,
    handleClearSearch: PropTypes.func.isRequired,
};

export default Navbar;