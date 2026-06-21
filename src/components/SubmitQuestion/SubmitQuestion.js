import React, { Component, useState } from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import { Row, Col, Container } from "react-bootstrap";
import { toast } from 'react-toastify';
import { isEmpty, filter, isNil } from 'lodash';
import './SubmitQuestion.scss';
import { checksessionsexistsforquestionsubmission, savecalssroomquestionByStudent, getrepresentativequestions, updatetotalcount, getSessionList } from '../../common/API'
import { formatDate, getCurrentUserId, getInstituteName, getCurrentUserName } from '../../common/Functions';
import logoImg from '../../assets/images/logo_aiPlato-white-h.png'
import voteUp from "../../assets/images/vote-up.svg";
import voteDown from "../../assets/images/vote-down.svg";
import voteUpFill from "../../assets/images/vote-up-fill.svg";
import Cookies from 'universal-cookie';
import harvedLogo from '../../assets/images/harvard_university_logo.png';
import riceLogo from '../../assets/images/rice_university-logo.png';

export class SubmitQuestion extends Component {
    // { id: 1, question: 'How does the mass of an object affect the extension or compression of a spring whe... ', vote: false },
    // { id: 2, question: 'Can you explain the process of calculating the work done in stretching or compressi...', vote: false }
    intervalTimer;
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            isQuestionEnabled: false,
            questionText: '',
            showaiQuestions: false,
            session_id: '',
            aiQuestions: [],
            sessionId: '',
            sessionList: [],
            isPreviousSession: false,
            teacherName: '',
            hasValidUser: false
        };
    }

    componentDidMount() {
        this.getSessionIdFromURL()
        this.intervalTimer = setInterval(this.getSessionInformation, 2000);

        const reqData = {
            params: {
                student_user_id: getCurrentUserId(true)
            }
        }
        getSessionList(reqData).then(res => {
            this.setState({ sessionList: res.data.sort((a, b) => Date.parse(b.createdate) - Date.parse(a.createdate)) })
        })
    }
    getSessionIdFromURL() {
        const cookies = new Cookies();
        const queryParameters = new URLSearchParams(window.location.search.substring(1));
        const sessionId = queryParameters.get("sessionId")
        if (cookies.get('isValid') === 'yes' || getCurrentUserId(true) !== undefined) {
            this.setState({ hasValidUser: true, session_id: (!isNil(sessionId) && !isEmpty(sessionId)) ? Number(sessionId) : '' })
        } else {
            window.location.href = `/login/?fromQue=true&sessionId=${sessionId}`
        }

    }
    checkSession = () => {
        this.getSessionInformation();
        this.setState({ showaiQuestions: true, sessionarea: false })
    }

    getSessionInformation = () => {
        if (this.state.session_id !== "") {
            const reqData = {
                params: {
                    session_id: this.state.session_id,
                    student_user_id: getCurrentUserId(true)
                }
            }
            checksessionsexistsforquestionsubmission(reqData).then(res1 => {
                this.setState({ loading: true })
                if (res1.data !== undefined && res1.data.issessionstop === 1) {
                    this.setState({ isQuestionEnabled: true, showaiQuestions: false, teacherName: res1.data.tutor_name })
                }
                if (res1.data.issessionstop === 0) {
                    this.setState({ isQuestionEnabled: true })
                    if (this.state.aiQuestions !== undefined && this.state.aiQuestions.length === 0) {
                        this.getAIQuestions();
                    }

                }
            })
        }
    }

    getAIQuestions = () => {
        const reqData1 = {
            params: {
                session_id: this.state.session_id
            }
        }
        getrepresentativequestions(reqData1).then(res => {
            if (res.data.representative_questions !== undefined) {
                let tempArr = [];
                res.data.representative_questions.forEach(element => {
                    tempArr.push({ theme: element.theme, ques: [...element.children] });
                });
                this.setState({ showaiQuestions: true, aiQuestions: tempArr, loading: false })

            }
        }).catch(err => {
            console.error(err.message)
            this.setState({ loading: false })
            toast.error("Opps! Something wrong", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
        })
    }

    submitQuestion = () => {
        if (this.state.questionText.trim() !== '') {
            this.setState({ loading: true })
            const reqData = {
                session_id: this.state.session_id,
                student_name: getCurrentUserName(),
                student_user_id: getCurrentUserId(true),
                questions: this.state.questionText
            }
            savecalssroomquestionByStudent(reqData).then(res => {
                if (res.data !== undefined) {
                    this.setState({ loading: false, questionText: "", student_name: "" })
                    toast.success("Your question submission was successfully received.", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                }
            }).catch(err => {
                console.error(err.message)
                this.setState({ loading: false })
                toast.error("Opps! Something went wrong", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            })
        } else {
            toast.error("Please provide a question in the text field.", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
        }

    }

    onVoteButtonClick = (index, id, parentindex) => {
        if (this.state.aiQuestions.length > 0) {
            let questionlistdata = [...this.state.aiQuestions]
            if (this.state.aiQuestions[parentindex].ques != undefined && this.state.aiQuestions[parentindex].ques.length > 0) {
                let tempArr = this.state.aiQuestions[parentindex].ques;


                tempArr[index].vote = tempArr[index].vote === 1 ? 0 : 1;
                let votecheck = tempArr[index].vote;
                questionlistdata[parentindex]["ques"] = tempArr
                this.setState({ aiQuestions: questionlistdata })

                const reqData = {
                    id: id,
                    islike: votecheck
                }
                updatetotalcount(reqData).then(res => {
                }).catch(err => {
                    console.error(err.message)
                    toast.error("Opps! Something went wrong", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                })
            }
        }
    }

    handleChange = (event) => {
        this.setState({ questionText: event.target.value });
    };

    handleClear = () => {
        this.setState({ questionText: '' });
    };

    handleSessionChange = (e) => {
        clearInterval(this.intervalTimer)
        if (Number(e.target.value) > 0) {
            this.state.session_id = e.target.value
            this.setState({ isQuestionEnabled: true, showaiQuestions: true })
            this.setState({ session_id: e.target.value, isPreviousSession: true, aiQuestions: [] }, () => {
                this.getAIQuestions();
            })

        }
        else {
            this.setState({ session_id: null, session_id: null, isQuestionEnabled: false, aiQuestions: [], isPreviousSession: false })
        }
    }

    render() {
        return (

            <div style={{ visibility: this.state.hasValidUser ? 'visible' : 'hidden' }}>
                <div className='container-fluid bg-blue-header'>
                    <div className='container que-top-header px-1'>

                        <a alt="aiPlato" href="/question" ><img aria-label='' className='logo-img' alt='Logo' src={logoImg} /></a>
                        <div className='prevSessionList'><span className='text-white'>Session ID:</span>
                            <select onChange={this.handleSessionChange} id="prevSessions" name="prevSessions" className="form-control selectSessionOptions">
                                <option value="-1" selected="selected">
                                    -Select-
                                </option>
                                {this.state.sessionList.map((item) =>
                                    item.issessionstop ? <option value={item.sessionid}> {!isNil(item.session_name) ? item.session_name : ''} (#{item.sessionid})</option> : null
                                )}
                            </select>
                            {this.state.session_id === -1 ?
                                <spam>{this.state.session_id}</spam>
                                : null
                            }
                        </div>
                    </div>
                </div>
                <Container>
                    <Row className='py-3'>
                        <Col className='col-8 '>
                            <p className='sfpro-font16gray m-0'>Welcome to aiPlato. </p>
                        </Col>
                        {(getInstituteName()).toLowerCase() === 'college.harvard.edu' ?
                            <Col className='col-4 text-right'>
                                <img aria-label='' className='uniLogo' src={harvedLogo} alt='Harvard' />
                            </Col> : null
                        }

                        {(getInstituteName()).toLowerCase() === 'rice.edu' ?
                            <Col className='col-4 text-right'>
                                <img aria-label='' className='uniLogo' src={riceLogo} alt='Rice' />
                            </Col> : null
                        }

                    </Row>
                </Container>
                {!this.state.isQuestionEnabled ?
                    <div className='container-fluid'>
                        <Container >
                            <Row>
                                <Col className='whiteBG col-12'>
                                    <div className='enter-code-box'>
                                        <p className='inputHead'>Enter your Code</p>
                                        <input type='number' className="form-control inp mobinpst my-3 " placeholder="code"
                                            onChange={e => this.setState({ session_id: e.target.value })} />
                                        <div className='submitBtn'>
                                            <button className='btn-blue mt-2' onClick={() => this.checkSession()}>Submit</button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div> :
                    <div className='w-100 ' >
                        {!this.state.showaiQuestions ?
                            <div className='container-fluid'>
                                <Container>
                                    <Row>
                                        <Col className='col-12 whiteBG'>
                                            <p className='inputHead'>Ask a question to your Professor!</p>
                                            <textarea rows={4} className='form-control' value={this.state.questionText} placeholder='Drop a question here & let aiPlato work its magic!' onChange={this.handleChange}></textarea>
                                            <div className='submitBtn d-md-flex justify-content-between align-items-center'>
                                                <small class="text-muted font-italic">Submit a single question at each instance.</small>
                                                <button className='btn-blue mt-2' onClick={() => this.submitQuestion()}>Submit</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div> :
                            <div className='container-fluid' >
                                <Container className='whiteBG'>
                                    <Row>
                                        <Col className='col-12'>
                                            <p className='inputHead'>Representative student questions:</p>
                                            <hr className='bdrDtted'></hr>
                                        </Col>
                                    </Row>

                                    {this.state.aiQuestions.map((item, parentIndex) => {
                                        return <Row className='pb-1 mb-2 border-bottom'>
                                            <Col className='col-12'>
                                                <p className='themeTitle'>{item.theme}</p>
                                            </Col>
                                            {item.ques.map((que, index) => {
                                                return <div className='pb-1 col-12'>
                                                    {
                                                        !this.state.isPreviousSession ?
                                                            <Col className='col-12 text-left voteToggle'>
                                                                <ToggleButton
                                                                    value="check"
                                                                    selected={que.vote === 1 ? true : false}
                                                                    onChange={() => this.onVoteButtonClick(index, que.id, parentIndex)}
                                                                >
                                                                    <img aria-label='' alt='Vote Up/Down' src={que.vote ? voteUpFill : voteUp}></img>
                                                                </ToggleButton>
                                                                <span className='pr-3'>{que.total_likes}</span>
                                                            </Col>
                                                            : null
                                                    }
                                                    {
                                                        !this.state.isPreviousSession ?
                                                            <Col className='col-12'>{que.representative_question}</Col>
                                                            :
                                                            <Col className='col-12'><b>Question :</b> {que.representative_question}
                                                                {
                                                                    !isEmpty(que.session_transcript) ?
                                                                        <div>
                                                                            <span style={{ fontWeight: 'bold' }}>Answer : </span> {que.session_transcript}
                                                                        </div> : null
                                                                }
                                                            </Col>
                                                    }
                                                </div>
                                            })}


                                        </Row>
                                    })}
                                    {/* <Row>
                                        <Col className='col-12 submitBtn'>
                                            <button className='btn-viewAll'>View all <span>(32)</span></button>
                                        </Col>
                                    </Row> */}
                                </Container>

                            </div>
                        }


                    </div>}
            </div>


        )
    }

}
export default SubmitQuestion;