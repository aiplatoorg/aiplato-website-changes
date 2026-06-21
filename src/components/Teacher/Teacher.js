import React, { Component } from 'react';
import { Row, Col, Container } from "react-bootstrap"
import { checkCredentialsAPI, validIds, saveToDbAPI, saveUserEducatorCounter } from '../../common/API'
import { toast } from 'react-toastify';

import Cookies from 'universal-cookie';
import './Teacher.scss';
import tutorimg1 from '../../assets/images/tutorimg1.png';
import tutorimg2 from '../../assets/images/graph.png';
import tutorimg3 from '../../assets/images/autoGrading.jpeg';
import card4Img1 from '../../assets/images/card4-img1.PNG';
import card4Img2 from '../../assets/images/card4-img2.png';

import { APP_URL, DESKTOP, WEBSITE_URL, detectDevice, getIsPrivate } from '../../common/Functions';
import { withRouter } from 'react-router-dom';
import { PopupButton } from "react-calendly";
import { ClientJS } from 'clientjs';
import QImage from '../../assets/images/exclamation.svg';
import boxEducatorBg from '../../assets/images/box-educator.svg';
import quotationMark from '../../assets/images/quotation-mark.svg';

let scrollPosition = 0
class Teacher extends Component {
    state = {
        email: '',
        password: '',
        validIds: [],
        showPassword: false,
        shoowearlyaccess: true,
        showemaildiv: false,
        buttontext: "Request Demo",
        isPrivate: false,
        fingerprint: null
    }

    componentWillMount() {
        this.setState({ isPrivate: getIsPrivate() })
    }

    componentDidMount() {
        this.fetchIds()
        window.addEventListener("scroll", this.handleScroll);

        const client = new ClientJS();
        const fingerprint = client.getFingerprint();
        this.setState({ fingerprint: fingerprint })
        this.saveActionforEducator('', fingerprint)
    }

    saveActionforEducator = (actionName, fingerprint) => {
        let data = {
            'user_fingerprint': fingerprint,
            'actionname': actionName,
            'scroll_position': scrollPosition
        }

        saveUserEducatorCounter(data).then(res => {
            if (res.status === 200) {
                /// Finger print details saved
            }
        })
    }

    handleScroll = (event) => {
        const scrollTop = window.scrollY; // Pixels scrolled vertically
        const windowHeight = window.innerHeight; // Height of the viewport
        const documentHeight = document.documentElement.scrollHeight; // Total height of the document
        let pos = 0
        // Calculate the percentage scrolled
        const totalScrollable = documentHeight - windowHeight;
        const percentage = (scrollTop / totalScrollable) * 100;
        scrollPosition = Math.round(Math.min(percentage, 100), 2)

        setTimeout(() => {
            //    console.log('scroll', scrollPosition); // Ensure it doesn't exceed 100%
        }, 2000);
    }

    handleEmailChange = (event) => {
        let email = event.target.value.trim()
        this.setState({ email: email });
        if (this.state.validIds.includes(email.toLowerCase())) {
            this.setState({ showPassword: true, buttontext: "Login" });
        } else {
            this.setState({ showPassword: false });
        }
    }

    isValidEmail = (email) => {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
    }

    getEarlyAccessHandler = (e) => {
        e.preventDefault()
        if (this.state.password.length > 0) {
            let data = { 'email': this.state.email.trim().toLowerCase(), password: this.state.password }

            checkCredentialsAPI(data).then(res => {
                if (res.status === 200) {
                    if (res.data['found'] === true) {
                        this.addValidationCookie(this.state.email.trim().toLowerCase(),
                            res.data.userId,
                            res.data.role,
                            res.data.name,
                            res.data.status,
                            res.data.tryThisPinsEnabled,
                            res.data.QATestFlag,
                            this.convertDurationToSeonds(res.data.timeLimit),
                            res.data.institute_id,
                            res.data.user_timezone, res.data.user_professor_id, res.data.isTA)
                        toast.success("Valid Demo Credentials!", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
                        window.open(APP_URL, '_self')
                        this.setState({ email: '', password: '', showPassword: false });
                        this.setState({ shoowearlyaccess: true, showemaildiv: false, buttontext: "Request Access" })
                    }
                    else if (res.data['isexpired'] === true) {
                        toast.error("Your account is expired, please get in touch with support team!", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
                        this.setState({ shoowearlyaccess: true, showemaildiv: false })
                    }
                    else {
                        toast.error("Please enter valid email id and password.", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
                        this.setState({ shoowearlyaccess: false, showemaildiv: true })
                    }

                } else {
                    toast.error("Server Error !", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                }
            }).catch(err => {
                console.error(err.message)
                toast.error("Please enter valid email id and password.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            })
        } else {
            // save email to db
            let data = { 'email': this.state.email.trim().toLowerCase(), studenteducatior: "Educator" }

            saveToDbAPI(data).then(res => {
                toast.success("Thank you for submitting your early access request. Our team will be in touch with you shortly to provide further information and support.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
                // this.setState({ email: '' });
                // this.setState({ shoowearlyaccess: true, showemaildiv: false })

                window.open(`${WEBSITE_URL}earlyaccesspriorityinfo/${res.data.data}`)

            }).catch(err => {
                console.error(err.message)
                toast.warning("We already have your email in our system, someone from our team contact you soon.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
                this.setState({ email: '' });
            })
        }
    }

    addValidationCookie = (email, userId, role, name, status, tryThisPinsEnabled, QATestFlag, timeLimit, institute_id, usertimezone, user_professor_id, isTA) => {
        const cookies = new Cookies();
        cookies.set('isValid', 'yes', { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('email', email, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('userId', userId, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('name', name, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('role', role, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('status', status, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('tryThisPinsEnabled', tryThisPinsEnabled, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('QATestFlag', QATestFlag, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('institute_id', institute_id, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('usertimezone', usertimezone, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set('user_professor_id', user_professor_id, { path: '/', domain: window.location.hostname, maxAge: timeLimit });
        cookies.set("isSaMsgViewInAssList", false, { path: "/", domain: window.location.hostname, maxAge: timeLimit })
        cookies.set("isSaMsgViewInAssDetail", false, { path: "/", domain: window.location.hostname, maxAge: timeLimit })
        cookies.set("uploadImageTourDailog", false, { path: "/", domain: window.location.hostname, maxAge: timeLimit })
        cookies.set('isTA', isTA, { path: '/', domain: window.location.hostname, maxAge: timeLimit })
    }

    fetchIds = () => {

        validIds().then(res => {
            this.setState({ validIds: res.data.ids.map(item => atob(item)) });
        }).catch(err => {
            console.error(err.message)
            toast.error("Error fetching ids!", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
        })

    }

    hasValidValues = () => {
        return this.state.email.trim().length > 0
            && this.isValidEmail(this.state.email.trim())
    }

    convertDurationToSeonds = (duration) => {
        const a = duration.split(':');
        return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    }

    showemailhandler = () => {
        this.saveActionforEducator('request_demo_count', this.state.fingerprint)
        this.setState({ shoowearlyaccess: false, showemaildiv: false })
        window.location.href = "/requestDemo?type=demo"
    }

    navigateToSignUp = () => {
        this.saveActionforEducator('signup_teacher_count', this.state.fingerprint)
        const { history } = this.props;
        history.push('/signup?c3VtbWl0PXRydWU=');
    }

    navigateToRequestADemo = () => {
        //   this.saveActionforEducator('signup_teacher_count', this.state.fingerprint)
        const { history } = this.props;
        history.push('/requestDemo?type=pilot');
    }

    render() {
        return (
            this.state.isPrivate ?

                <div className='mainContainerWrapper'>
                    <div style={{marginTop:'60px' , marginBottom:"20px" , paddingTop:"60px"}}>
                        <div className="">
                            <Row className="align-items-center">
                                <Col xs={12} md={12}>
                                    <div className="d-flex flex-column text-center">

                                    <div className="tutorBanner">
                                        <h3 className="tutorBannerTitle">
                                            <span className="tutorBannerTitleTop">
                                                Revolutionizing Homework and Assessment for
                                            </span>
                                            <span className="tutorBannerTitleBottom">
                                                <img src={QImage} alt="STEM" className="QImage" />
                                                <span className="stemWord">STEM</span>
                                                <span className="tutorBannerTitleBottomRest">Educators</span>
                                            </span>
                                        </h3>

                                        <div className="tutorBannerBox" role="group" aria-label="AI Teaching Assistant for STEM">
                                            <div className="tutorBannerBoxInner">
                                                <div className="tutorBannerSubtitle">AI Teaching Assistant for STEM</div>
                                                <div className="tutorBannerTagline">
                                                    Developed by Physics Faculty, Powered by Advanced AI
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bulletsContainer mt-4">
                                        <ul>
                                        <li>The only AI trained on deep research in “expert tutoring” and “active learning” for STEM</li>
                                        <li>The only AI you can rely on for ~100% correct answers and grading</li>
                                        <li>The only AI universities trust for step-by-step grading and feedback</li>
                                        </ul>
                                    </div>

                                    <div className="pt-3">
                                        <div className="tutorBannerCtas">
                                        <PopupButton
                                            url="https://calendly.com/pilot-aiplato/aiplato"
                                            rootElement={document.getElementById("root")}
                                            text="Schedule a Demo"
                                            className="btnDarkBlue"
                                            styles={{ cursor: 'pointer' }}
                                        />

                                        <div
                                            onClick={this.navigateToRequestADemo}
                                            className="btnDarkBlueSpecial"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Request a Pilot (University or K12)
                                        </div>
                                        </div>
                                    </div>

                                    </div>
                                </Col>
                            </Row>
                            
                            <div style={{marginTop:"40px"}}>
                                {/* <Col xs={12} md={8} style={{ margin: 'auto' }}>
                                    <div style={{ backgroundColor: 'white', border: '1px solid white', borderRadius: '10px', padding: '10px' }}>
                                        <div style={{ textAlign: 'center' }}><strong>Join us at ASU GSV 2025!</strong></div><br />
                                        <span style={{ fontStyle: 'italic' }}>
                                            We’re offering a <strong><a href='/GSVsummitSpecial' target='_blank'>FREE pilot program</a></strong> to 10 universities/schools attending ASU+GSV 2025.<br /><br /> Visit us at <strong>AI Show (Apr 5-7, Booth #4, Higher Ed Zone)</strong>-
                                            <a onClick={() => this.saveActionforEducator('schedule_count', this.state.fingerprint)}>
                                                <PopupButton
                                                    url="https://calendly.com/pilot-aiplato/ai-show-asu-gsv"
                                                    rootElement={document.getElementById("root")}
                                                    text="Schedule a meeting."
                                                    styles={{
                                                        backgroundColor: "#fff",
                                                        color: "#0078FF",
                                                        border: "none",
                                                        fontStyle: "italic",
                                                        textDecoration: 'underline',
                                                        cursor: "pointer",
                                                        paddingLeft: '5px',
                                                        paddingRight: '5px'

                                                    }}
                                                /></a>

                                            <br />Or meet us at <strong>ASU+GSV Summit (Apr 6-9)-</strong>
                                            <a onClick={() => this.saveActionforEducator('schedule_count', this.state.fingerprint)}>
                                                <PopupButton
                                                    url="https://calendly.com/pilot-aiplato/ai-show-asu-gsv-clone"
                                                    rootElement={document.getElementById("root")}
                                                    text="Schedule a meeting."
                                                    styles={{
                                                        backgroundColor: "#fff",
                                                        color: "#0078FF",
                                                        border: "none",
                                                        fontStyle: "italic",
                                                        textDecoration: 'underline',
                                                        cursor: "pointer",
                                                        paddingLeft: '5px',
                                                        paddingRight: '5px'

                                                    }}
                                                /></a><br />
                                            📧 Email {' '}
                                            <a onClick={() => this.saveActionforEducator('email_count', this.state.fingerprint)}>
                                                <a href="mailto:pilot@aiplato.ai" style={{ color: "#0078FF", textDecoration: "underline" }}>
                                                    pilot@aiplato.ai
                                                </a></a> for details.
                                        </span>
                                    </div>
                                </Col> */}

                                <div className="aps-section-box">
                                    <Row className="">
                                        <Col xs={12} md={12} className="text-center">
                                            <h3 className="aps-section-title">
                                                Join us at APS 2026!
                                            </h3>
                                            <p className="aps-section-text">
                                                We’re offering a <strong>FREE pilot program</strong> to 10 universities/schools attending APS.
                                            </p>
                                            <p className="aps-section-text">
                                                Visit us at <strong>APS Booth #1126</strong> to learn more.
                                            </p>
                                            <p className="aps-section-text">
                                                Connect with us:
                                                {' '}
                                                <a
                                                    href="https://calendly.com/pilot-aiplato/aps26"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="aps-section-link"
                                                >
                                                    Book a meeting at APS Booth #1126
                                                </a>
                                                ,{' '}
                                                <a
                                                    href="https://calendly.com/pilot-aiplato/aiplato"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="aps-section-link"
                                                >
                                                    schedule a Zoom meeting
                                                </a>
                                                , or email{' '}
                                                <a
                                                    href="mailto:pilot@aiplato.ai"
                                                    className="aps-section-link"
                                                >
                                                    pilot@aiplato.ai
                                                </a>
                                                .
                                            </p>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            
                            {/* <div className="col-12 col-md-12 col-lg-12 d-flex align-items-center">
                                <div className='fwidth'>
                                    <div className='homeBannerHead1'>
                                        <h3>Revolutionizing Homework and Assessment for Physics Educators</h3>
                                        <h5>Developed by Physics Faculty, Powered by Advanced AI</h5>
                                    </div>
                                    

                                    <div className="input-group p-0 pt-3 text-center">
                                        <form className="d-flex justify-content-center">
                                            {
                                                this.state.shoowearlyaccess ? (
                                                    <button
                                                        onClick={this.showemailhandler}
                                                        className="btnMain"
                                                    >Request a Demo</button>

                                                ) : null
                                            }
                                            <button
                                                onClick={this.navigateToSignUp}
                                                title='For Free Access to Your Students'
                                                className="btnMain" style={{ marginLeft: '10px' }}
                                            >Sign up for Teachers</button>
                                            {
                                                this.state.showemaildiv ? (

                                                    <>
                                                        <div class="form-group mgbtmzero mright15 mrightzero">
                                                            <input
                                                                autoFocus
                                                                type="email"
                                                                className="form-control mr-2 inp mobinpst "
                                                                value={this.state.email}
                                                                onChange={this.handleEmailChange}
                                                                placeholder="Enter your email address" />
                                                        </div>
                                                        {this.state.showPassword ? <div class="form-group mgbtmzero mright15 mrightzero">
                                                            <input
                                                                type="password"
                                                                className="form-control mr-2 inp mobinpst "
                                                                value={this.state.password}
                                                                onChange={(e) => this.setState({ password: e.target.value })}
                                                                placeholder="Enter your password" />
                                                        </div> : null}
                                                        <button
                                                            onClick={this.getEarlyAccessHandler}
                                                            disabled={!this.hasValidValues()}
                                                            className="btn btn-primary formbtnget"
                                                            type="submit">{this.state.buttontext}</button>
                                                    </>
                                                ) : null
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* <div className="bgpat prelative">
                    <Container className="homecontmpad">
                        <div className="col-12 col-md-12 col-lg-12 d-flex align-items-center">
                            <div className='fwidth'>
                                <div className='display-1 tcenter'>aiPlato</div>
                               
                                <h5><div className='tcenter mgbtm25 subHeader'>Democratizing 1-on-1 Teaching</div></h5>
                                <div className="input-group">
                                    <form className="ctflex jcenter flcplm">
                                        {
                                            this.state.shoowearlyaccess ? (
                                                <button
                                                    onClick={this.showemailhandler}
                                                    className="btn btn-primary formbtnget"
                                                >Get Early Access as an Educator</button>

                                            ) : null
                                        }
                                        {
                                            this.state.showemaildiv ? (

                                                <>
                                                    <div class="form-group mgbtmzero mright15 mrightzero">
                                                        <input
                                                        autoFocus
                                                            type="email"
                                                            className="form-control mr-2 inp mobinpst "
                                                            value={this.state.email}
                                                            onChange={this.handleEmailChange}
                                                            placeholder="Enter your email address" />
                                                    </div>
                                                    {this.state.showPassword ? <div class="form-group mgbtmzero mright15 mrightzero">
                                                        <input
                                                            type="password"
                                                            className="form-control mr-2 inp mobinpst "
                                                            value={this.state.password}
                                                            onChange={(e) => this.setState({ password: e.target.value })}
                                                            placeholder="Enter your password" />
                                                    </div> : null}
                                                    <button
                                                        onClick={this.getEarlyAccessHandler}
                                                        disabled={!this.hasValidValues()}
                                                        className="btn btn-primary formbtnget"
                                                        type="submit">{this.state.buttontext}</button>
                                                </>
                                            ) : null
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div> */}
                    {/* <div className='container-fluid bg-gray1'>
                        <Container className="secpad">
                            <Row className="">
                                <Col xs={12} md={12}>
                                    <ul>
                                        <li>The only AI trained on deep research in “expert tutoring” and “active learning” for STEM​</li>
                                        <li>The only AI you can rely on for ~100% correct answers, and ~100% correct grading​​</li>
                                        <li>The only AI top universities trust for step-by-step grading and feedback – personalized, detailed, immediate​​</li>
                                    </ul>
                                  
                                </Col>
                            </Row>
                        </Container>
                    </div> */}
                    <div className="bg-white">

                    {/* Cards wrapper with exact spacing */}
                    <div className="cards-wrapper">

                        {/* CARD 1 */}
                        <div className="card-box">
                        <div style={{display:"flex" , flexDirection:"row" , gap:"20px"}}>
                            <Col xs={12} lg={6}>
                            <img
                                aria-label=""
                                className="accImg img-fluid"
                                alt="Comprehensive Homework Platform"
                                src={tutorimg1}
                            />
                            </Col>
                            <Col
                            xs={12}
                            lg={6}
                            className="d-flex flex-column justify-content-center"
                            style={{ marginTop: detectDevice() === DESKTOP ? '0' : '15px' }}
                            >
                            <h2 className="bannerTitlespecial">Comprehensive Homework Platform</h2>
                            <ul className="copyText topicText cardList">
                                <li>Assign auto-graded homework and exams tailored to your curriculum – free response questions</li>
                                <li>Accept handwritten solutions, or work touchpad-written (or typed) directly on the platform</li>
                                <li>
                                Deliver step-by-step, personalized, interactive feedback to help students understand their mistakes
                                and improve – trace root causes, reinforce knowledge gaps, achieve mastery
                                </li>
                            </ul>
                            </Col>
                        </div>
                        </div>

                        {/* CARD 2 */}
                        <div className="card-box">
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                            <Col xs={12} lg={6} className="d-flex flex-column justify-content-center">
                                <h2 className="bannerTitlespecial">Efficient Auto-Grading System</h2>
                                <ul className="copyText topicText cardList">
                                    <li>Intelligent grading of free-response, multi-step problems with partial credit</li>
                                    <li>Save hours on grading assignments and exams while ensuring precision and consistency</li>
                                    <li>Ensure fairness and transparency in student evaluations</li>
                                </ul>
                            </Col>
                            <Col xs={12} lg={6}>
                                <img
                                    aria-label=""
                                    className="accImg img-fluid"
                                    alt="Efficient Auto-Grading System"
                                    src={tutorimg3}
                                />
                            </Col>
                        </div>
                        </div>

                        {/* CARD 3 */}
                        <div className="card-box">
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                            <Col xs={12} lg={6}>
                                <img
                                    aria-label=""
                                    className="accImg img-fluid"
                                    alt="Adaptive Learning Insights for Educators"
                                    src={tutorimg2}
                                />
                            </Col>
                            <Col
                            xs={12}
                            lg={6}
                                className="d-flex flex-column justify-content-center"
                                style={{ marginTop: detectDevice() === DESKTOP ? '0' : '15px' }}
                            >
                                <h2 className="bannerTitlespecial">Adaptive Learning Insights for Educators</h2>
                                <ul className="copyText topicText cardList">
                                    <li>Monitor individual and class performance with 800-concept detailed proficiency maps</li>
                                    <li>Identify common errors and areas of difficulty to refine your teaching strategies</li>
                                    <li>Leverage actionable data to improve student outcomes</li>
                                </ul>
                            </Col>
                        </div>
                        </div>

                        {/* CARD 4 */}
                        <div className="card-box">
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                            <Col xs={12} lg={6} className="d-flex flex-column justify-content-center">
                                <h2 className="bannerTitlespecial">AI-augmented Teaching Assistant System</h2>
                                <h3 className="cardList-intro">Powered by three core capabilities:</h3>
                                <ul className="copyText topicText cardList card4-capabilities">
                                    <li><strong>LiveHelp™</strong><br />Real-time AI and human TA collaboration</li>
                                    <li><strong>Concept Insight™</strong><br />Concept-level visibility into student learning gaps</li>
                                    <li><strong>TA Copilot™</strong><br />AI-augmented support that scales teaching assistants</li>
                                </ul>
                            </Col>
                            <Col xs={12} lg={6}>
                                <div className="card4-image-wrap">
                                    <img
                                        aria-label=""
                                        className="accImg img-fluid card4-image-main"
                                        alt="AI-augmented Teaching Assistant System"
                                        src={card4Img1}
                                    />
                                    <img
                                        aria-label=""
                                        className="card4-image-overlay"
                                        alt="Concept insight"
                                        src={card4Img2}
                                    />
                                </div>
                            </Col>
                        </div>
                        </div>

                    </div>

                    </div>

                    {/* Institutional AI Policy (moved from home) */}
                    <div className="mockupSections educatorPolicy">
                        <section className="mk-section mk-policy-section">
                            <div className="mk-section-inner">
                                <span className="mk-section-tag">Institutional AI Policy</span>
                                <h2 className="mk-section-title">Designed to Work Within<br />Your Institution's AI Policy</h2>
                                <p className="mk-section-body">aiPlato is purpose-built for institutional adoption — giving faculty full visibility and control while aligning with emerging academic integrity frameworks.</p>
                                <div className="mk-policy-grid">
                                    <div className="mk-policy-card"><div className="mk-icon">🔍</div><div><h4>Full Instructor Visibility</h4><p>Professors see every AI interaction, hint given, and step-level feedback delivered to each student — no black box. Concept Insight™ gives course-level learning gap diagnostics in real time.</p></div></div>
                                    <div className="mk-policy-card"><div className="mk-icon">🏫</div><div><h4>Promotes Academic Integrity</h4><p>aiPlato guides students to answers rather than providing them — supporting your institution's AI use policy while actively developing students' problem-solving skills.</p></div></div>
                                    <div className="mk-policy-card"><div className="mk-icon">📋</div><div><h4>Audit-Ready Interaction Logs</h4><p>Complete audit trails of student–AI interactions are available on demand, supporting institutional compliance reviews and accreditation documentation.</p></div></div>
                                    <div className="mk-policy-card"><div className="mk-icon">🤝</div><div><h4>Collaborative TA + AI Model</h4><p>LiveHelp™ pairs AI with human TAs in real time — your TAs focus on higher-impact interactions while aiPlato handles routine grading and support at scale.</p></div></div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div>
                        <div className="secpad educator-quote-box" style={{ backgroundImage: `url(${boxEducatorBg})`, padding: '25px', borderRadius: '12px' }}>
                            <div style={{maxWidth:"1100px" , position:"relative"}}>
                                <img src={quotationMark} alt="" className="educator-quote-icon" />
                                <Row className="">
                                    <Col xs={12} md={12}>
                                        <div className='copytext educator-quote-text'>
                                            aiPlato empowers educators to focus on what matters most—teaching—while AI-augmented support helps build a learning ecosystem that strengthens productive struggle, cultivates epistemic agency, and prepares students to think, learn, and thrive in the age of AI.
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className="ferpa-footnote">aiPlato platform adheres to FERPA guidelines.</div>
                    </div>
                </div>
                :
                null
        )
    }
}
export default withRouter(Teacher);