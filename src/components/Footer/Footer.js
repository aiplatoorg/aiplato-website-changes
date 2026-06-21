import React from 'react';
import { Row, Col, Container } from "react-bootstrap"
import Hyperlink from '../shared/Hyperlink/Hyperlink'
import logoImg from '../../assets/images/logo_aiPlato-white-h.png'
import { Link } from 'react-router-dom';

import './Footer.scss';
class Footer extends React.Component {
    render() {
        return <div className='mainContainerWrapper'>
            <div>
                <div className='footerTop'>
                    <Col className='copyrightText'>
                        <a alt="aiPlato" href="/" ><img aria-label='' src={logoImg} alt="aiPlato"></img></a>
                        <p style={{color:'#fff',fontSize:'14px',lineHeight:'30px' , paddingTop:"6px"}}>Copyright @{new Date().getFullYear()} aiPlato, Inc.</p>
                        <p style={{color:'#fff',fontSize:'14px',lineHeight:'30px'}}>All rights reserved</p>
                        <a href="/Privacy_Policy.pdf" style={{color:'#fff',fontSize:'14px',lineHeight:'30px'}} download>
                            Privacy Policy
                        </a>
                    </Col>
                    <Col className='footerLinks'>
                        <div>
                            <h5 style={{color:'white' , fontWeight:'bold'}}>Company</h5>
                            <div className='companyLink'>
                                <a className='text-white' href="mailto:support@aiplato.ai" target='blank' >Support</a>
                                <Link type="Link_Primary" className="Blacknavtext" to="/team">About Us</Link>
                                <Link type="Link_Primary" className="Blacknavtext" to="/contact">Contact Us</Link>
                            </div>
                        </div>
                    </Col>
                </div>

            </div>
        </div>
    }
}

export default Footer