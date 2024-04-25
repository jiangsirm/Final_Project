import React from 'react';
import './Header.css'

function Header({ title1, title2 }) {
    return (
        <header class="cover">
       
        <div className="containerHome container_solid">
            <div class="title_wrapper">
                <h1>{title1}</h1>
                <h2>{title2}</h2>
            </div>
        </div>

        
        <div class="container container_image" aria-hidden="true">
            <div class="title_wrapper">
                <h1>{title1}</h1>
                <h2>BY YuChen, Kun, &amp; Joshua</h2>
            </div>
        </div>
        </header>
    );

}

export default Header;
