import React from 'react';
import './Hyperlink.scss';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Hyperlink = (props) => {
  
    return (
        <NavLink onClick={()=> props.onLinkClick()} to={props.href}
            className={[props.type === "Link_Primary" ? "White" : "Primary", "Font_H9, nav-link"].join(' ')} exact activeClassName='active'>
            {props.children}
        </NavLink>
    )
}

export default Hyperlink;