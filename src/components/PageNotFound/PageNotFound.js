import React, { Component } from 'react';
import { Row, Col } from "react-bootstrap"
import { WEBSITE_URL } from '../../common/Functions';

class PageNotFound extends Component {

    render() {
        return (
            <div>
                <div className='container-fluid py-5 bg-light-blue2'>
                    <div className='container'>
                        <Row className='sectionOne'>
                            <Col sm={12} lg={12} className='sectionOneWhite'>
                                <div className='bannerTitleWhite'>
                                    <h1 className='bannerTitle '>Sorry .. !</h1>
                                    <p className='bannerText text-black'>Unable to find what your are looking for.
                                        Please visit our <a style={{ color: '#007bda' }} target='_self' href={WEBSITE_URL}>homepage </a> 
                                        or 
                                        <a style={{ color: '#007bda' }} target='_self' href='/contact'> contact us.</a>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }

}

export default PageNotFound;