import React from 'react';
import { Row, Col, Container } from "react-bootstrap"
import Hyperlink from '../shared/Hyperlink/Hyperlink'
import { Link } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './HomeAccordion.scss';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

class HomeAccordion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpand: null,
            imagePath: '',
            expand: false,
        };
    }

    handleAccordionChange = (indexNo, imgPath) => (_, isExpanded) => {
        if (this.props.accordionData.isFirstOpen) {
            this.setState({ expand: true, isExpand: (isExpanded ? indexNo : null), imagePath: imgPath })
        }
        else {
            this.setState({ expand: false, isExpand: (isExpanded ? indexNo : null), imagePath: imgPath })
        }
    }

    render() {
        return <div className=''>
            <Row className=''>
                {this.props.accordionData.imgOnLeft ?
                    <Col xs={12} md={6} className={this.props.accordionData.imgSectionClass + 'accImg'}>
                        {!this.props.accordionData.isFirstOpen ?
                            <img aria-label='' className='accImg img-fluid' alt='Banner' src={this.props.accordionData.accordionDetails[0].imagePath} loading="lazy" decoding="async" fetchpriority="low"></img>
                            :
                            this.state.imagePath === '' ?
                                <img aria-label='' className='accImg img-fluid' alt='Banner' src={this.props.accordionData.accordionDetails[0].imagePath} loading="lazy" decoding="async" fetchpriority="low"></img>
                                :
                                <img aria-label='' className='accImg img-fluid' alt='Banner' src={this.state.imagePath} loading="lazy" decoding="async" fetchpriority="low"></img>
                        }
                    </Col>
                    : null}
                <Col sm={12} lg={6} className={this.props.sectionClass || ''}>
                    <div className=''><img aria-label='' alt='Header Icon' src={this.props.accordionData.headerIconPath}></img></div>
                    <h1 className='bannerTitle pt-3'>{this.props.accordionData.headingText}</h1>
                    <p className='blueTag'>{this.props.accordionData.headingDescription}</p>
                    <div className='homeAcc'>
                        {this.props.accordionData.accordionDetails.map((item, index) => {
                            return (
                                <Accordion
                                    key={`${item.headerText}-${index}`}
                                    expanded={this.state.isExpand === (index === 0 && this.props.isFirstOpen && !this.state.expand ? null : index)}
                                    onChange={this.handleAccordionChange(index, item.imagePath)}>
                                    <AccordionSummary expandIcon={this.state.isExpand === (index === 0 && this.props.isFirstOpen && !this.state.expand ? null : index) ? <RemoveCircle sx={{ fontSize: '1rem', color: '#2D4773' }} /> : <AddCircle sx={{ fontSize: '1rem', color: '#2D4773' }} />} aria-controls="panel1a-content" id="panel1a-header">
                                        <Typography component="div">
                                            <Row>
                                                <Col className='col-12 col-md-12'>
                                                    <span className='accHdr'>{item.headerText} </span>
                                                </Col>
                                            </Row>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="div">
                                            <div className="challengeTopic border-bottom-last">
                                                {item.description}
                                            </div>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })}
                    </div>
                    <div className='pt-2 accordian-buttons'>
                        <div className='mb-3 mb-sm-0' style={{ marginRight: "5px" }}>
                            <button
                                onClick={this.props.tryItOutClick}
                                className="btnLightBlue"
                            >Try as a student — 7-day free trial</button></div>
                        <div>
                            <button

                                onClick={this.props.viewtestappdemoclick}
                                className="btnLightBlue"
                            >View Practice Test Demo</button></div>
                    </div>
                </Col>

                {!this.props.accordionData.imgOnLeft ?
                    <Col xs={12} md={6} className='{this.props.accordionData.imgSectionClass} accImg'>
                        {!this.props.accordionData.isFirstOpen ?
                            <img aria-label='' className='accImg img-fluid' alt='Banner' src={this.props.accordionData.accordionDetails[0].imagePath} loading="lazy" decoding="async" fetchpriority="low"></img>
                            :
                            this.state.imagePath === '' ?
                                <img aria-label='' className='accImg img-fluid' alt='Banner' src={this.props.accordionData.accordionDetails[0].imagePath} loading="lazy" decoding="async" fetchpriority="low"></img>
                                :
                                <img aria-label='' className='accImg img-fluid' alt='Banner' src={this.state.imagePath} loading="lazy" decoding="async" fetchpriority="low"></img>
                        }
                    </Col>
                    : null}
            </Row>
        </div>
    }
}

export default HomeAccordion