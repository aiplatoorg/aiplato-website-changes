import React from 'react';
import './Button.scss'

const Button = (props) => (
    <div className="ButtonContainer" >
        <a href={props.href} className={["Button", "Font_H8"].join(' ')} target="_blank" rel="noopener noreferrer">{props.children} <div className="Overlay"></div></a>
    </div>
);

export default Button;