import React, { Component } from 'react';
import { Row, Col, Container } from "react-bootstrap";
import './team.scss';
import Typography from '@mui/material/Typography';
import company1logo from '../../assets/images/c1.png';
import company2logo from '../../assets/images/c21.png';
import c22 from '../../assets/images/c22.png';
import c23 from '../../assets/images/c23.png';
import person1logo from '../../assets/images/p1.png';
import person2logo from '../../assets/images/p2.png';
import pallavilogo1 from '../../assets/images/pallavilogo1.png';
import pallavilogo2 from '../../assets/images/pallavilogo2.png';
import pallavi from '../../assets/images/pallavi.png';

import p3 from '../../assets/images/p3.png';
import p5 from '../../assets/images/p5.png';
import p6 from '../../assets/images/p6.png';
import p7 from '../../assets/images/p7.png';
import p8 from '../../assets/images/p8.png';
import p9 from '../../assets/images/p9.png';

import c3 from '../../assets/images/c3.png';
import c4 from '../../assets/images/c4.png';
import c6 from '../../assets/images/c6.png';
import c7 from '../../assets/images/c7.png';
import c8 from '../../assets/images/c8.png';
import teamPageIcon from "../../assets/images/aboutus-page-icon.svg";
import { getIsPrivate } from '../../common/Functions';

const LEADERSHIP_TEAM = [
    {
        name: 'Nimish Shah',
        image: person1logo,
        descPrivate: <>Founder & CEO <br /> Serial entrepreneur, founded first company 25 years ago, funded by Sequoia & Accel, acquired by Cisco.</>,
        descPublic: <>Founder. Serial entrepreneur, founded first company 25 years ago, funded by Sequoia & Accel, acquired by Cisco.</>,
        companies: [company1logo],
        privateOnly: false
    },
    {
        name: 'Dr. Louis Deslauriers',
        image: p7,
        descPrivate: <>Chief of Learning Science, Co-Founder<br />Harvard physics faculty, authored influential papers on active learning and its implications for effective tutoring.</>,
        descPublic: <>Chief of Learning Science.<br />Harvard physics faculty, authored influential papers on active learning and its implications for effective tutoring.</>,
        companies: [c7],
        privateOnly: false
    },
    {
        name: 'Dr. Nimish Radia',
        image: person2logo,
        descPrivate: <>Chief of AI/ML, Co-Founder <br /> Led AI/ML teams at Google, Ericsson. Led 80+ AI/ML engineer teams.Led industry-shaping AI innovations in Telecom/Networking , other sectors.</>,
        descPublic: <>VP AI/ML. Led 80-strong AI/ML team.</>,
        companies: [company2logo, c22, c23],
        privateOnly: false
    },
    {
        name: 'Khyati Shah',
        image: p9,
        descPrivate: <>Sr. Director of Engineering, Co-Founder<br />Led engineering, pioneered rapid-development - AI, big data, analytics.<br />Drove innovative AI and analytics ideas to successful products and customer wins.</>,
        descPublic: null,
        companies: [c4],
        privateOnly: true
    },
    {
        name: 'Sunil Ratada',
        image: p5,
        descPrivate: <>Principal Engineer</>,
        descPublic: <>Principal Engineer</>,
        companies: [c4],
        privateOnly: false
    },
    {
        name: 'Pallavi Bagchi',
        image: pallavi,
        descPrivate: <>UX Designer <br />U Washington MS, Deloitte</>,
        descPublic: null,
        companies: [pallavilogo1, pallavilogo2],
        privateOnly: true
    },
    {
        name: 'Dr. Ranjeet Tate',
        image: p3,
        descPrivate: <>Lead Data Scientist, Physics.</>,
        descPublic: <>Lead Data Scientist, Physics.</>,
        companies: [c3, c8],
        privateOnly: false
    }
];

const ADVISORS = [
    {
        name: 'Dr. Vijay Erramilli',
        image: p6,
        descPrivate: <>AI/ML Advisor. Principal Data Scientist, Einstein Team.</>,
        descPublic: <>AI/ML Advisor. Principal Data Scientist, Einstein Team.</>,
        companies: [c6],
        privateOnly: false
    },
    {
        name: 'Natasha Prasad',
        image: p8,
        descPrivate: <>Growth & Strategy Advisor.<br />CXO – Cleo, ClassPass, Atlassian. Harvard MBA.</>,
        descPublic: <>Growth & Strategy Advisor.<br />CXO – Cleo, ClassPass, Atlassian. Harvard MBA.</>,
        companies: [c7],
        privateOnly: false
    }
];
const TeamMemberCard = ({ member, isPrivate }) => {
    const description = isPrivate ? member.descPrivate : member.descPublic;
    return (
        <div className="col-12 col-sm-6 col-lg-3 my-4">
            <div className="team-card">
                <div className="team-image-wrapper">
                    <img
                        className="team-image"
                        src={member.image}
                        alt={`${member.name} Image`}
                    />
                </div>
                <div className="team-content">
                    <div className="team-text">
                        <div className="team-name">
                            {member.name}
                        </div>

                        <div className="team-description">
                            {description}
                        </div>
                    </div>

                    <div className="team-logos">
                        {member.companies.map((logo, index) => (
                            <img
                                key={index}
                                className={`company-logo ${logo === c8 ? "small-logo" : ""}`}
                                src={logo}
                                alt="Company Logo"
                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

const TeamHeading = ({ title }) => {
    const words = title?.split(" ");
    return (
        <div className='heading-container mt-3'>
            <div className="heading-rays">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className='team-icon-container'><img src={teamPageIcon} alt="Team Icon" /></div>
            <div className='heading-title'>
                <h1><span className='heading-color'>{words[0]}</span> {words?.slice(1).join(" ")}</h1>
            </div>
        </div>
    )
}

class Team extends Component {
    state = {
        isPrivate: false,
    }

    componentDidMount() {
        this.setState({ isPrivate: getIsPrivate() });
    }

    render() {
        window.scroll(0, 0);
        const { isPrivate } = this.state;
        const displayLeadership = LEADERSHIP_TEAM.filter(member => isPrivate || !member.privateOnly);
        const displayAdvisors = ADVISORS.filter(member => isPrivate || !member.privateOnly);

        return (
            <div className='mainContainerWrapper' style={{marginTop:'60px' , marginBottom:"20px" , paddingTop:"60px"}}>
                {isPrivate ? (
                    <div className="">
                        <div className="col-12 col-md-12 col-lg-12 d-flex justify-content-center">
                            <TeamHeading title="Meet the Team" />
                        </div>
                    </div>
                ) : (
                    <div className="homecontmpad ">
                        <div>
                            <div className="col-12 col-md-12 col-lg-12">
                                <div> <img src={teamPageIcon} alt="Team Icon" className='mb-3' style={{ width: "80px", height: "80px" }} /></div>
                                <div className='homeBannerHead text-white'>
                                    Meet the Team
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div style={{width:"100%" , display:"flex" , justifyContent:"center"}}>
                    <div className='team-summary'>
                        <Row>
                            <Col xs={12} md={12}>
                                <div className="copyText text-center">
                                    Our exceptional team is comprised of distinguished educators from prestigious institutions
                                    {!isPrivate && " such as Harvard and Stanford"}, AI experts from renowned Silicon Valley giants and talented,
                                    entrepreneurial-minded engineers. Get to know some of the passionate individuals who are dedicated
                                    to empowering students and shaping the future of education. Together, we bring a wealth of knowledge
                                    and experience from leading institutions and corporations with best AI-powered 1-on-1 tutoring experience for our students.
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className=''>
                <div className="">
                    {/* Leadership Section */}
                    <Row className='mt-3'>
                        <Col xs={12} md={12}>
                            {isPrivate ? (
                                <div className='d-flex justify-content-center'>
                                    <TeamHeading title="Leadership" />
                                </div>
                            ) : (
                                <Typography component="div" variant="h4" className='bannerTitle2'>Leadership</Typography>
                            )}
                        </Col>
                    </Row>

                    {!isPrivate && <Row><Col xs={12} md={12} className='my-2'><hr /></Col></Row>}

                    <Row className={isPrivate ? 'teamsCards' : ''}>
                        {displayLeadership.map((member, index) => (
                            <TeamMemberCard key={index} member={member} isPrivate={isPrivate} />
                        ))}
                    </Row>
                    {/* Advisors Section */}
                    <Row className='mt-3'>
                        <Col xs={12} md={12}>
                            {isPrivate ? (
                                <div className='d-flex justify-content-center'>
                                    <TeamHeading title="Advisors" />
                                </div>

                            ) : (
                                <Typography component="div" variant="h4" className='bannerTitle2'>Advisors</Typography>
                            )}
                        </Col>
                    </Row>
                    {!isPrivate && <Row><Col xs={12} md={12} className='my-2'><hr /></Col></Row>}
                    <Row >
                        {displayAdvisors.map((member, index) => (
                            <TeamMemberCard key={index} member={member} isPrivate={isPrivate} />
                        ))}
                    </Row>
                </div>
                </div>
            </div>
        );
    }
}

export default Team;