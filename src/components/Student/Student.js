import React, { Component } from 'react';
import { Row, Col, Container } from "react-bootstrap"
import './Student.scss';
import { checkCredentialsAPI, validIds, saveToDbAPI } from '../../common/API'
import { toast } from 'react-toastify';
import secimg from "../../assets/images/secimg.svg"
import Cookies from 'universal-cookie';
import img4 from "../../assets/images/4.jpg"
import img5 from "../../assets/images/5.jpg"
import img6 from "../../assets/images/6.jpg"
import { APP_URL } from '../../common/Functions';

class Student extends Component {

    state = {
        email: '',
        password: '',
        validIds: [],
        showPassword: false
    }

    componentDidMount() {
        this.fetchIds()
    }

    handleEmailChange = (event) => {
        let email = event.target.value.trim()
        this.setState({ email: email });
        if (this.state.validIds.includes(email.toLowerCase())) {
            this.setState({ showPassword: true });
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
                    }
                    else if (res.data['isexpired'] === true) {
                        toast.error("Your account is expired, please get in touch with support team!", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
                    }
                    else {
                        toast.error("Please enter valid email id and password.", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
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
            let data = { 'email': this.state.email.trim().toLowerCase() }

            saveToDbAPI(data).then(res => {
                toast.success("We have received your early access request, someone from our team contact you soon.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
                this.setState({ email: '' });
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
        cookies.set('user_professor_id', user_professor_id, { path: '/', domain: window.location.hostname, maxAge: timeLimit })
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
    render() {
        return (
            <div className='fwidth'>
                <div className="bgpat prelative">
                    <Container className="homecontmpad">
                        <div className="col-12 col-md-12 col-lg-12 d-flex align-items-center">
                            <div className='fwidth'>
                                <div className='homeBannerHead'>aiPlato</div>
                                {/* <h4 className="tcenter mgbtm18 fontsstle">Stealth Mode Startup</h4> */}
                                <h5><div className='font-weight-bold tcenter mgbtm25'>Democratizing 1-on-1 Teaching.</div></h5>
                                <div className="student-input-group">
                                    <form className="ctflex jcenter flcplm">
                                        <div class="form-group mgbtmzero mright15 mrightzero">
                                            <input
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
                                            type="submit">Get Early Access</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
                <Container className="secpad">
                    <Row className="">
                        <Col xs={12} md={12}>
                            <h2 className="tcenter mgbtm25 oftitle">We believe that education must be reinvented <br />for the 21st century</h2>
                            <p className="tcenter">Study after study has confirmed that compared to one-size-fits-all education, one-on-one teaching boosts student performance by 2 standard deviations, and makes students feel much more engaged in learning. We are on a mission to bring the benefits of one-on-one education to every K-12 student, by building the AI-embodiment of one-on-one teaching. A decade of extensive research by our esteemed education experts is distilled into this AI.</p>
                        </Col>
                    </Row>
                </Container>
                <Container className="">
                    <Row className="">
                        <Col xs={12} md={12}>
                            <hr />
                        </Col>
                    </Row>
                </Container>
                <Container className="secpad">
                    <Row className="studentContentImg">
                        <Col xs={12} md={6}>
                            <h2 className="oftitle mgbtm25">Interactive learning <br />experience by aiPlato</h2>
                            <p className="">The time has come to provide every student with an interactive learning experience equivalent to one-on-one teaching – personalized to their cognitive processing in real-time. The time has come for online education to help each student overcome the obstacles in acing every problem - watching every error, diagnosing the root cause, and reinforcing knowledge-gaps, like a one-on-one teacher.  21st century education must stimulate curiosity. We must turn education from a chore that students dread into a game-like experience that they enjoy.  And yes, human tutoring must be accessible to every student, assisted by AI.</p>
                        </Col>
                        <Col xs={12} md={6}>
                            <img aria-label='' alt='Type of Force' src={img4} />
                        </Col>
                    </Row>
                </Container>
                <Container className="">
                    <Row className="">
                        <Col xs={12} md={12}>
                            <hr />
                        </Col>
                    </Row>
                </Container>
                <Container className="secpad">
                    <Row className="studentContentImg">
                        <Col xs={12} md={6}>
                            <img aria-label='' alt='Interactive Learning AI + Human TA Chat' src={img5} />

                        </Col>
                        <Col xs={12} md={6}>
                            <h2 className="oftitle mgbtm25">Interactive learning <br />experience by aiPlato</h2>
                            <p className="">The time has come to provide every student with an interactive learning experience equivalent to one-on-one teaching – personalized to their cognitive processing in real-time. The time has come for online education to help each student overcome the obstacles in acing every problem - watching every error, diagnosing the root cause, and reinforcing knowledge-gaps, like a one-on-one teacher.  21st century education must stimulate curiosity. We must turn education from a chore that students dread into a game-like experience that they enjoy.  And yes, human tutoring must be accessible to every student, assisted by AI.</p>
                        </Col>
                    </Row>
                </Container>
                <Container className="">
                    <Row className="">
                        <Col xs={12} md={12}>
                            <hr />
                        </Col>
                    </Row>
                </Container>
                <Container className="secpad">
                    <Row className="studentContentImg">
                        <Col xs={12} md={6}>
                            <h2 className="oftitle mgbtm25">Interactive learning <br />experience by aiPlato</h2>
                            <p className="">The time has come to provide every student with an interactive learning experience equivalent to one-on-one teaching – personalized to their cognitive processing in real-time. The time has come for online education to help each student overcome the obstacles in acing every problem - watching every error, diagnosing the root cause, and reinforcing knowledge-gaps, like a one-on-one teacher.  21st century education must stimulate curiosity. We must turn education from a chore that students dread into a game-like experience that they enjoy.  And yes, human tutoring must be accessible to every student, assisted by AI.</p>
                        </Col>
                        <Col xs={12} md={6}>
                            <img aria-label='' alt='Physics' src={img6} />
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
export default Student;