import React, { Component } from 'react';
import { Row, Col, Container } from "react-bootstrap"
import  '../contactUs/contactUs.scss';

class Thankyou extends Component {

    render(){
        return (
            <div className='fwidth'>
            <div className="bgpat prelative">
            <Container className="homecontmpad">
            <div className="col-12 col-md-12 col-lg-12 d-flex align-items-center">
                <div className='fwidth'>
                    <h1 className='mnh1o tcenter'>aiPlato</h1>
                    <h5><div className='font-weight-bold tcenter'>Thank you for registering for Early Access!</div></h5>
                    
                </div>
            </div>
            </Container>
        </div>
        </div>
            
        )
    }
}

export default Thankyou;