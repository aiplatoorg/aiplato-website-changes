import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { TextField, Grid, Box, Button, FormLabel, FormControl, FormControlLabel, RadioGroup, Radio, Typography } from '@mui/material';
import { getCurrentUserId, WEBSITE_URL } from '../../common/Functions';
import { FaStar } from "react-icons/fa";
import './Feedback.scss';
import { Container, RadioRate, Rating } from "./RatingStyles";
import { saveFeedbackDetails, createSessionforFeedback, feedbackmailssend } from '../../common/API'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Cookies from 'universal-cookie';
import Divider from '@mui/material/Divider';


class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionId: 0,
            startFeedback: true,
            isPage1: true,
            isPage2: false,
            isPage3: false,
            isPage4: false,
            userId: getCurrentUserId(true) === undefined ? 0 : getCurrentUserId(true),
            userName: "",
            selectedFeedbackType: "Provide Feedback",
            rating: 0,
            issueDetail: "",
            overallExpRating: 0,
            easeOfNavigationRating: 0,
            recommendUs: 'Yes',
            additionalComments: '',
            emailaddress: "",
            isHelped: 'Yes',
            accuracyRating: 0,
            hintQualityRating: 0,
            explanationRating: 0,
            rootcauseAnalysisRating: 0,
            videoLectureEngagingRating: 0,
            raiseHandRating: 0,
            isEffective: 'Yes',
            knowledgebaseRating: 0,
            aiResponseRating: 0,
            page1EmailDivVisble: false,
            page2EmailDivVisble: false,
            page3EmailDivVisble: false,
            emailAddress1Confirmation: "No",
            emailAddress2Confirmation: "No",
            emailAddress3Confirmation: "No",
            emailError1: false,
            emailError2: false,
            emailError3: false
        }
    }

    // componentDidMount() {
    //     const cookies = new Cookies();
    //     cookies.set('feedbackbanner', false);
    // }

    handleUserNameChange = (e) => {
        this.setState({ userName: e.target.value })
    }

    handlerecommendUsChange = (e) => {
        this.setState({ recommendUs: e.target.value })
    }

    handleAdditionalComments = (e) => {
        this.setState({ additionalComments: e.target.value })
    }

    handleemailAddress1Confirmation = (e) => {

        this.setState({ emailAddress1Confirmation: e.target.value })
        if (e.target.value === "Yes") {
            this.setState({ page1EmailDivVisble: true, page2EmailDivVisble: false, page3EmailDivVisble: false })
        }
        else {
            this.setState({ page1EmailDivVisble: false, page2EmailDivVisble: false, page3EmailDivVisble: false, emailaddress: "", emailError1: false, emailError2: false, emailError3: false })
        }
    }
    handleemailAddress2Confirmation = (e) => {
        this.setState({ emailAddress2Confirmation: e.target.value })
        if (e.target.value === "Yes") {
            this.setState({ page1EmailDivVisble: false, page2EmailDivVisble: true, page3EmailDivVisble: false })
        }
        else {
            this.setState({ page1EmailDivVisble: false, page2EmailDivVisble: false, page3EmailDivVisble: false, emailaddress: "", emailError1: false, emailError2: false, emailError3: false })
        }
    }
    handleemailAddress3Confirmation = (e) => {
        this.setState({ emailAddress3Confirmation: e.target.value })
        if (e.target.value === "Yes") {
            this.setState({ page1EmailDivVisble: false, page2EmailDivVisble: false, page3EmailDivVisble: true })
        }
        else {
            this.setState({ page1EmailDivVisble: false, page2EmailDivVisble: false, page3EmailDivVisble: false, emailaddress: "", emailError1: false, emailError2: false, emailError3: false })
        }
    }
    handleEmailAddress = (e) => {
        this.setState({ emailaddress: e.target.value })

        if (this.state.isPage1) {
            if (e.target.validity.valid) {
                this.setState({ emailError1: false, emailError2: false, emailError3: false });
            } else {
                this.setState({ emailError1: true, emailError2: false, emailError3: false });
            }
        }
        else if (this.state.isPage2) {
            if (e.target.validity.valid) {
                this.setState({ emailError1: false, emailError2: false, emailError3: false });
            } else {
                this.setState({ emailError1: false, emailError2: true, emailError3: false });
            }
        }
        // else if (this.state.isPage3) {
        //     if (e.target.validity.valid) {
        //         this.setState({ emailError1: false, emailError2: false, emailError3: false });
        //     } else {
        //         this.setState({ emailError1: false, emailError2: false, emailError3: true });
        //     }
        // }
    }

    handleIsHelpedChange = (e) => {
        this.setState({ isHelped: e.target.value })
    }

    handleIsEffectiveChange = (e) => {
        this.setState({ isEffective: e.target.value })
    }

    handleFeedbackType = (e) => {
        this.setState({ selectedFeedbackType: e.target.value })
    }

    handleIssueDetailChange = (e) => {
        this.setState({ issueDetail: e.target.value })
    }

    handlePage1Submit = () => {
        if (this.state.emailError1) {
            return
        }
        if (this.state.sessionId === 0) {
            const reqData = {
                userId: this.state.userId
            }

            createSessionforFeedback(reqData).then(res => {
                if (res.data !== undefined) {
                    const sessionIDNew = res.data.sessionId
                    this.setState({ sessionId: res.data.sessionId })

                    if (sessionIDNew !== 0) {
                        const reqData = {
                            sessionId: sessionIDNew,
                            userId: this.state.userId,
                            otherFeedback: "",
                            rating: this.state.rating,
                            userName: this.state.userName,
                            feedbackType: this.state.selectedFeedbackType,
                            issueDetail: this.state.issueDetail,
                            overallExpRating: this.state.overallExpRating,
                            easeOfNavigationRating: this.state.easeOfNavigationRating,
                            recommendUs: this.state.recommendUs,
                            additionalComments: this.state.additionalComments,
                            emailaddress: this.state.emailaddress,
                            isHelped: this.state.isHelped,
                            accuracyRating: this.state.accuracyRating,
                            hintQualityRating: this.state.hintQualityRating,
                            explanationRating: this.state.explanationRating,
                            rootcauseAnalysisRating: this.state.rootcauseAnalysisRating,
                            videoLectureEngagingRating: this.state.videoLectureEngagingRating,
                            raiseHandRating: this.state.raiseHandRating,
                            isEffective: this.state.isEffective,
                            knowledgebaseRating: this.state.knowledgebaseRating,
                            aiResponseRating: this.state.aiResponseRating
                        }

                        saveFeedbackDetails(reqData).then(res => {
                            const hostnameParts = window.location.hostname.split('.');
                            const domainName = hostnameParts.length > 1 ? hostnameParts[hostnameParts.length - 2] + "." + hostnameParts[hostnameParts.length - 1] : hostnameParts[hostnameParts.length - 1];
                            if (domainName !== "localhost") {

                                const reqData1 = {
                                    mailtype: "overallfeedback",
                                    userId: this.state.userId,
                                    rating: this.state.rating,
                                    userName: this.state.userName,
                                    feedbackType: this.state.selectedFeedbackType,
                                    issueDetail: this.state.issueDetail,
                                    overallExpRating: this.state.overallExpRating,
                                    easeOfNavigationRating: this.state.easeOfNavigationRating,
                                    recommendUs: this.state.recommendUs,
                                    additionalComments: this.state.additionalComments,
                                    emailaddress: this.state.emailaddress,
                                    isHelped: this.state.isHelped,
                                    accuracyRating: this.state.accuracyRating,
                                    hintQualityRating: this.state.hintQualityRating,
                                    aiResponseRating: this.state.aiResponseRating
                                }
                                feedbackmailssend(reqData1).then(res => {
                                })
                                    .catch(err => {
                                        console.error(err.message);
                                    })
                            }

                        })
                            .catch(err => {
                                console.error(err.message);
                            })
                    }
                }
            }).catch(err => {
                console.error(err.message)
                toast.error("Opps! Something wrong", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            })
        }
        else {
            const reqData = {
                sessionId: this.state.sessionId,
                userId: this.state.userId,
                otherFeedback: "",
                rating: this.state.rating,
                userName: this.state.userName,
                feedbackType: this.state.selectedFeedbackType,
                issueDetail: this.state.issueDetail,
                overallExpRating: this.state.overallExpRating,
                easeOfNavigationRating: this.state.easeOfNavigationRating,
                recommendUs: this.state.recommendUs,
                additionalComments: this.state.additionalComments,
                emailaddress: this.state.emailaddress,
                isHelped: this.state.isHelped,
                accuracyRating: this.state.accuracyRating,
                hintQualityRating: this.state.hintQualityRating,
                explanationRating: this.state.explanationRating,
                rootcauseAnalysisRating: this.state.rootcauseAnalysisRating,
                videoLectureEngagingRating: this.state.videoLectureEngagingRating,
                raiseHandRating: this.state.raiseHandRating,
                isEffective: this.state.isEffective,
                knowledgebaseRating: this.state.knowledgebaseRating,
                aiResponseRating: this.state.aiResponseRating
            }

            saveFeedbackDetails(reqData).then(res => {
            })
                .catch(err => {
                    console.error(err.message);
                })
        }

        this.setState({ isPage1: false, isPage2: true })

        if (this.state.emailaddress !== "" && this.state.emailaddress !== undefined && this.state.emailaddress !== null) {
            this.setState({ page2EmailDivVisble: true, emailAddress2Confirmation: "Yes" })
        }
        else {
            this.setState({ page2EmailDivVisble: false, emailAddress2Confirmation: "No", emailError1: false, emailError2: false, emailError3: false })
        }
    }

    handlePage2Submit = () => {
        if (this.state.emailError2) {
            return
        }
        // this.setState({ isPage2: false, isPage3: true })
        this.setState({ isPage2: false })

        const reqData = {
            sessionId: this.state.sessionId,
            userId: this.state.userId,
            otherFeedback: "",
            rating: this.state.rating,
            userName: this.state.userName,
            feedbackType: this.state.selectedFeedbackType,
            issueDetail: this.state.issueDetail,
            overallExpRating: this.state.overallExpRating,
            easeOfNavigationRating: this.state.easeOfNavigationRating,
            recommendUs: this.state.recommendUs,
            additionalComments: this.state.additionalComments,
            emailaddress: this.state.emailaddress,
            isHelped: this.state.isHelped,
            accuracyRating: this.state.accuracyRating,
            hintQualityRating: this.state.hintQualityRating,
            explanationRating: this.state.explanationRating,
            rootcauseAnalysisRating: this.state.rootcauseAnalysisRating,
            videoLectureEngagingRating: this.state.videoLectureEngagingRating,
            raiseHandRating: this.state.raiseHandRating,
            isEffective: this.state.isEffective,
            knowledgebaseRating: this.state.knowledgebaseRating,
            aiResponseRating: this.state.aiResponseRating
        }

        saveFeedbackDetails(reqData).then(res => {
        })
            .catch(err => {
                console.error(err.message);
            })

        if (this.state.emailaddress !== "" && this.state.emailaddress !== undefined && this.state.emailaddress !== null) {
            this.setState({ page3EmailDivVisble: true, emailAddress3Confirmation: "Yes" })
        }
        else {
            this.setState({ page3EmailDivVisble: false, emailAddress3Confirmation: "No", emailError1: false, emailError2: false, emailError3: false })
        }
    }

    page2arrouphandler = () => {
        if (this.state.emailError2) {
            return
        }
        this.setState({ isPage1: true, isPage2: false }) //, isPage3: false })
        if (this.state.emailaddress !== "" && this.state.emailaddress !== undefined && this.state.emailaddress !== null) {
            this.setState({ page1EmailDivVisble: true, emailAddress1Confirmation: "Yes" })
        }
        else {
            this.setState({ page1EmailDivVisble: false, emailAddress1Confirmation: "No", emailError1: false, emailError2: false, emailError3: false })
        }
    }
    page3arrouphandler = () => {
        if (this.state.emailError3) {
            return
        }
        this.setState({ isPage1: false, isPage2: true }) //, isPage3: false })
        if (this.state.emailaddress !== "" && this.state.emailaddress !== undefined && this.state.emailaddress !== null) {
            this.setState({ page2EmailDivVisble: true, emailAddress2Confirmation: "Yes" })
        }
        else {
            this.setState({ page2EmailDivVisble: false, emailAddress2Confirmation: "No", emailError1: false, emailError2: false, emailError3: false })
        }
    }

    handleSubmit = (e) => {
        if (this.state.emailError3) {
            return
        }
        e.preventDefault();

        if (this.state.sessionId === 0) {
            const reqData1 = {
                userId: this.state.userId
            }

            createSessionforFeedback(reqData1).then(res => {
                if (res.data !== undefined) {
                    const sessionIDNew = res.data.sessionId
                    this.setState({ sessionId: res.data.sessionId })

                    if (sessionIDNew !== 0) {
                        const reqData = {
                            sessionId: sessionIDNew,
                            userId: this.state.userId,
                            otherFeedback: "",
                            rating: this.state.rating,
                            userName: this.state.userName,
                            feedbackType: this.state.selectedFeedbackType,
                            issueDetail: this.state.issueDetail,
                            overallExpRating: this.state.overallExpRating,
                            easeOfNavigationRating: this.state.easeOfNavigationRating,
                            recommendUs: this.state.recommendUs,
                            additionalComments: this.state.additionalComments,
                            emailaddress: this.state.emailaddress,
                            isHelped: this.state.isHelped,
                            accuracyRating: this.state.accuracyRating,
                            hintQualityRating: this.state.hintQualityRating,
                            explanationRating: this.state.explanationRating,
                            rootcauseAnalysisRating: this.state.rootcauseAnalysisRating,
                            videoLectureEngagingRating: this.state.videoLectureEngagingRating,
                            raiseHandRating: this.state.raiseHandRating,
                            isEffective: this.state.isEffective,
                            knowledgebaseRating: this.state.knowledgebaseRating,
                            aiResponseRating: this.state.aiResponseRating
                        }

                        saveFeedbackDetails(reqData).then(res => {
                            toast.success("Thank you for writting to us !", {
                                position: toast.POSITION.BOTTOM_RIGHT,
                                autoClose: true,
                                style: { borderRadius: "10px" }
                            });
                            setTimeout(function () {
                                window.open(WEBSITE_URL + "feedback", '_self')
                            }, 5000)
                        })
                            .catch(err => {
                                console.error(err.message);
                                toast.error("Some error occurred", {
                                    position: toast.POSITION.BOTTOM_RIGHT,
                                    autoClose: true,
                                    style: { borderRadius: "10px" }
                                });
                            })
                    }
                }
            }).catch(err => {
                console.error(err.message)
                toast.error("Opps! Something wrong", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            })
        }
        else {
            const reqData = {
                sessionId: this.state.sessionId,
                userId: this.state.userId,
                otherFeedback: "",
                rating: this.state.rating,
                userName: this.state.userName,
                feedbackType: this.state.selectedFeedbackType,
                issueDetail: this.state.issueDetail,
                overallExpRating: this.state.overallExpRating,
                easeOfNavigationRating: this.state.easeOfNavigationRating,
                recommendUs: this.state.recommendUs,
                additionalComments: this.state.additionalComments,
                emailaddress: this.state.emailaddress,
                isHelped: this.state.isHelped,
                accuracyRating: this.state.accuracyRating,
                hintQualityRating: this.state.hintQualityRating,
                explanationRating: this.state.explanationRating,
                rootcauseAnalysisRating: this.state.rootcauseAnalysisRating,
                videoLectureEngagingRating: this.state.videoLectureEngagingRating,
                raiseHandRating: this.state.raiseHandRating,
                isEffective: this.state.isEffective,
                knowledgebaseRating: this.state.knowledgebaseRating,
                aiResponseRating: this.state.aiResponseRating
            }

            saveFeedbackDetails(reqData).then(res => {
                toast.success("Thank you for writting to us !", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
                setTimeout(function () {
                    window.open(WEBSITE_URL + "feedback", '_self')
                }, 5000)
            })
                .catch(err => {
                    console.error(err.message);
                    toast.error("Some error occurred", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                })
        }
    }

    render() {

        return (
            <>
                <div style={{ width: '95%' }}>
                    {this.state.startFeedback ?
                        <div className="container-fluid px-0">
                            <Container style={{ display: 'block' }} className='pt-2 pt-md-5'>
                                {this.state.isPage1 ?
                                    <Box component="form" sx={{ my: 1, mx: 'auto', width: ['100%', 500] }} className='whiteBGFeedback feedbackBox'>
                                        <Typography component="h1" variant="h4" sx={{ pb: 2, fontSize: '24px' }}>
                                            Welcome
                                            <br />  <span style={{ fontSize: '15px' }}>Take a minute to share your feedback regarding your experience with our platform. </span>
                                        </Typography>
                                        <Grid container spacing={2} style={{ marginTop: '5px' }}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="userName"
                                                    fullWidth
                                                    hidden
                                                    rows={3}
                                                    id="userName"
                                                    label="Your Name"
                                                    value={this.state.userName}
                                                    onChange={this.handleUserNameChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl>
                                                    <FormLabel id="feedback-type-formLabel">What type of feedback would you like to provide ?</FormLabel>
                                                    <RadioGroup row
                                                        aria-labelledby="feedback-type-radio"
                                                        value={this.state.selectedFeedbackType}
                                                        name="feedbackType"
                                                        onChange={this.handleFeedbackType}
                                                    >
                                                        <FormControlLabel value="Provide Feedback" control={<Radio />} label="Provide Feedback" />
                                                        <FormControlLabel value="Report a Site Issue" control={<Radio />} label="Report a Site Issue" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                            {this.state.selectedFeedbackType === "Report a Site Issue" ?
                                                <Grid item xs={12}>
                                                    <FormLabel id="feedback-type-formLabel">We're so sorry you encountered a website issue.Please tell us more about the site issue to help us improve our platform.</FormLabel>
                                                    <Container>
                                                        <TextField
                                                            name="issueDetail"
                                                            fullWidth
                                                            multiline
                                                            rows={3}
                                                            id="issueDetail"
                                                            label="Please tell us more about the site issue."
                                                            value={this.state.issueDetail}
                                                            onChange={this.handleIssueDetailChange}
                                                        />
                                                    </Container>
                                                </Grid>
                                                : null
                                            }
                                            {this.state.selectedFeedbackType === "Report a Site Issue" ?
                                                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                                                    <FormLabel id="rating-us-radio">Overall, how satisfied are you with the aiPlato ? </FormLabel>
                                                    <Container>
                                                        {[...Array(5)].map((item, index) => {
                                                            const givenRating = index + 1;
                                                            return (
                                                                <label>
                                                                    <RadioRate
                                                                        type="radio"
                                                                        value={givenRating}
                                                                        onClick={() => { this.setState({ rating: givenRating }) }}
                                                                    />
                                                                    <Rating>
                                                                        <FaStar
                                                                            color={
                                                                                givenRating < this.state.rating || givenRating === this.state.rating
                                                                                    ? "#ffb400"
                                                                                    : "rgb(192,192,192)"
                                                                            }
                                                                        />
                                                                    </Rating>
                                                                </label>
                                                            );
                                                        })}
                                                    </Container>
                                                </Grid>
                                                : null}
                                            {this.state.selectedFeedbackType === "Provide Feedback" ?
                                                <Grid item xs={12}>
                                                    <FormLabel id="refer-us-radio">Overall Experience (1-5) </FormLabel>
                                                    <Container>
                                                        {[...Array(5)].map((item, index) => {
                                                            const overallExpRating = index + 1;
                                                            return (
                                                                <label>
                                                                    <RadioRate
                                                                        type="radio"
                                                                        value={overallExpRating}
                                                                        onClick={() => { this.setState({ overallExpRating: overallExpRating }) }}
                                                                    />
                                                                    <Rating>
                                                                        <FaStar
                                                                            color={
                                                                                overallExpRating < this.state.overallExpRating || overallExpRating === this.state.overallExpRating
                                                                                    ? "#ffb400"
                                                                                    : "rgb(192,192,192)"
                                                                            }
                                                                        />
                                                                    </Rating>
                                                                </label>
                                                            );
                                                        })}
                                                    </Container>
                                                </Grid>
                                                : null}
                                            {this.state.selectedFeedbackType === "Provide Feedback" ?
                                                <Grid item xs={12}>
                                                    <FormLabel id="ease-of-navigation-radio">Ease of navigation (1-5)</FormLabel>
                                                    <Container>
                                                        {[...Array(5)].map((item, index) => {
                                                            const easeOfNavigationRating = index + 1;
                                                            return (
                                                                <label>
                                                                    <RadioRate
                                                                        type="radio"
                                                                        value={easeOfNavigationRating}
                                                                        onClick={() => { this.setState({ easeOfNavigationRating: easeOfNavigationRating }) }}
                                                                    />
                                                                    <Rating>
                                                                        <FaStar
                                                                            color={
                                                                                easeOfNavigationRating < this.state.easeOfNavigationRating || easeOfNavigationRating === this.state.easeOfNavigationRating
                                                                                    ? "#ffb400"
                                                                                    : "rgb(192,192,192)"
                                                                            }
                                                                        />
                                                                    </Rating>
                                                                </label>
                                                            );
                                                        })}
                                                    </Container>
                                                </Grid>
                                                : null}
                                            {this.state.selectedFeedbackType === "Provide Feedback" ?
                                                <Grid item xs={12}>
                                                    <FormControl>
                                                        <FormLabel id="refer-us-radio">Would you recommend the app to others?</FormLabel>
                                                        <RadioGroup row
                                                            aria-labelledby="refer-us-radio"
                                                            value={this.state.recommendUs}
                                                            name="recommendUs"
                                                            onChange={this.handlerecommendUsChange}
                                                        >
                                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                            <FormControlLabel value="No" control={<Radio />} label="No" />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                                : null}
                                            {this.state.selectedFeedbackType === "Provide Feedback" ?
                                                <Grid item xs={12}>
                                                    <TextField
                                                        name="additionalComments"
                                                        multiline
                                                        rows={3}
                                                        id="additionalComments"
                                                        label="Additional comments"
                                                        style={{ width: '99%', border: '1px solid lightgrey' }}
                                                        value={this.state.additionalComments}
                                                        onChange={this.handleAdditionalComments}
                                                    />
                                                </Grid>
                                                : null}
                                            <Divider sx={{ width: "98%", marginTop: "10px", marginLeft: "17px" }} />

                                            {this.state.selectedFeedbackType === "Provide Feedback" ?
                                                <Grid item xs={12}>
                                                    <FormControl>
                                                        <FormLabel id="refer-us-radio">Can we reach out to you via email for more detailed feedback or questions?</FormLabel>
                                                        <RadioGroup row
                                                            aria-labelledby="refer-us-radio"
                                                            value={this.state.emailAddress1Confirmation}
                                                            name="emailAddress1Confirmation"
                                                            onChange={this.handleemailAddress1Confirmation}
                                                        >
                                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                            <FormControlLabel value="No" control={<Radio />} label="No" />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                                : null}


                                            {
                                                this.state.selectedFeedbackType === "Provide Feedback" && this.state.page1EmailDivVisble ? (
                                                    <Grid item xs={5} style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                                        <FormControl fullWidth sx={{ border: "none" }}>
                                                            <FormLabel id="refer-1-emailaddress">Please provide your email address</FormLabel><TextField
                                                                name="emailaddress"
                                                                id="emailaddress1"
                                                                // style={{ width: '100%', border: '1px solid lightgrey' }}
                                                                value={this.state.emailaddress}
                                                                onChange={this.handleEmailAddress}
                                                                fullWidth
                                                                sx={{
                                                                    "& .MuiFormHelperText-root": {
                                                                        color: "red",
                                                                        border: "none",
                                                                        margin: 0
                                                                    },
                                                                    "& .MuiFormControl-root .MuiTextField-root": {
                                                                        border: "none",
                                                                    },

                                                                }}
                                                                helperText={this.state.emailError1 ? "Please enter a valid email" : ""}
                                                                inputProps={{
                                                                    type: "email",
                                                                }}
                                                            /></FormControl>
                                                    </Grid  >) : null
                                            }
                                        </Grid>
                                        {this.state.selectedFeedbackType === "Report a Site Issue" ? null :
                                            <>
                                                <Grid item container spacing={2} mt={5}>
                                                    <Grid item xs={2} >
                                                        1/2 <ArrowCircleDownIcon className='blink' onClick={this.handlePage1Submit} />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                    </Box>
                                    : null}

                                {this.state.selectedFeedbackType === "Provide Feedback" ?
                                    <div>
                                        <div id="slide" className={!this.state.isPage2 ? "hide" : null}>
                                            {this.state.isPage2 ?
                                                <Box component="form" sx={{ cursor: 'pointer', my: 1, mx: 'auto', width: ['100%', 500] }} className='whiteBGFeedback feedbackBox'>
                                                    <Typography component="h1" variant="h4" style={{ fontSize: '24px' }} sx={{ pb: 2 }}>
                                                        Free Response Questions (FRQs)
                                                    </Typography>
                                                    <Grid container spacing={2} style={{ marginTop: '5px' }}>
                                                        <Grid item xs={12}>
                                                            <FormControl>
                                                                <FormLabel id="isHelped-radio">"Evaluate My Work" feedback helped you understand and solve problems effectively?</FormLabel>
                                                                <RadioGroup row
                                                                    aria-labelledby="isHelped-radio"
                                                                    value={this.state.isHelped}
                                                                    name="isHelped"
                                                                    onChange={this.handleIsHelpedChange}
                                                                >
                                                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormLabel id="accuracy-rating-radio">How accurately could you confirm the correctness of your answers? (1-5)</FormLabel>
                                                            <Container>
                                                                {[...Array(5)].map((item, index) => {
                                                                    const accuracyRating = index + 1;
                                                                    return (
                                                                        <label>
                                                                            <RadioRate
                                                                                type="radio"
                                                                                value={accuracyRating}
                                                                                onClick={() => { this.setState({ accuracyRating: accuracyRating }) }}
                                                                            />
                                                                            <Rating>
                                                                                <FaStar
                                                                                    color={
                                                                                        accuracyRating < this.state.accuracyRating || accuracyRating === this.state.accuracyRating
                                                                                            ? "#ffb400"
                                                                                            : "rgb(192,192,192)"
                                                                                    }
                                                                                />
                                                                            </Rating>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </Container>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormLabel id="accuracy-rating-radio">Did you find the "Hints" useful? (1-5).</FormLabel>
                                                            <Container>
                                                                {[...Array(5)].map((item, index) => {
                                                                    const hintQualityRating = index + 1;
                                                                    return (
                                                                        <label>
                                                                            <RadioRate
                                                                                type="radio"
                                                                                value={hintQualityRating}
                                                                                onClick={() => { this.setState({ hintQualityRating: hintQualityRating }) }}
                                                                            />
                                                                            <Rating>
                                                                                <FaStar
                                                                                    color={
                                                                                        hintQualityRating < this.state.hintQualityRating || hintQualityRating === this.state.hintQualityRating
                                                                                            ? "#ffb400"
                                                                                            : "rgb(192,192,192)"
                                                                                    }
                                                                                />
                                                                            </Rating>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </Container>
                                                            {/* <Container>
                                                                Explanation : &nbsp;
                                                                {[...Array(5)].map((item, index) => {
                                                                    const explanationRating = index + 1;
                                                                    return (
                                                                        <label>
                                                                            <RadioRate
                                                                                type="radio"
                                                                                value={explanationRating}
                                                                                onClick={() => { this.setState({ explanationRating: explanationRating }) }}
                                                                            />
                                                                            <Rating>
                                                                                <FaStar
                                                                                    color={
                                                                                        explanationRating < this.state.explanationRating || explanationRating === this.state.explanationRating
                                                                                            ? "#ffb400"
                                                                                            : "rgb(192,192,192)"
                                                                                    }
                                                                                />
                                                                            </Rating>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </Container>
                                                            <Container>
                                                                Root cause Analysis : &nbsp;
                                                                {[...Array(5)].map((item, index) => {
                                                                    const rootcauseAnalysisRating = index + 1;
                                                                    return (
                                                                        <label>
                                                                            <RadioRate
                                                                                type="radio"
                                                                                value={rootcauseAnalysisRating}
                                                                                onClick={() => { this.setState({ rootcauseAnalysisRating: rootcauseAnalysisRating }) }}
                                                                            />
                                                                            <Rating>
                                                                                <FaStar
                                                                                    color={
                                                                                        rootcauseAnalysisRating < this.state.rootcauseAnalysisRating || rootcauseAnalysisRating === this.state.rootcauseAnalysisRating
                                                                                            ? "#ffb400"
                                                                                            : "rgb(192,192,192)"
                                                                                    }
                                                                                />
                                                                            </Rating>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </Container> */}
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormLabel id="accuracy-rating-radio">How did the "AI + Human TA Chat" help you in solving the problem? (1-5).</FormLabel>
                                                            <Container>
                                                                {[...Array(5)].map((item, index) => {
                                                                    const aiResponseRating = index + 1;
                                                                    return (
                                                                        <label>
                                                                            <RadioRate
                                                                                type="radio"
                                                                                value={aiResponseRating}
                                                                                onClick={() => { this.setState({ aiResponseRating: aiResponseRating }) }}
                                                                            />
                                                                            <Rating>
                                                                                <FaStar
                                                                                    color={
                                                                                        aiResponseRating < this.state.aiResponseRating || aiResponseRating === this.state.aiResponseRating
                                                                                            ? "#ffb400"
                                                                                            : "rgb(192,192,192)"
                                                                                    }
                                                                                />
                                                                            </Rating>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </Container>
                                                        </Grid>
                                                        <Divider sx={{ width: "98%", marginTop: "10px", marginLeft: "17px" }} />
                                                        {this.state.selectedFeedbackType === "Provide Feedback" ?
                                                            <Grid item xs={12}>
                                                                <FormControl>
                                                                    <FormLabel id="refer-us-radio">Can we reach out to you via email for more detailed feedback or questions?</FormLabel>
                                                                    <RadioGroup row
                                                                        aria-labelledby="refer-us-radio"
                                                                        value={this.state.emailAddress2Confirmation}
                                                                        name="emailAddress1Confirmation"
                                                                        onChange={this.handleemailAddress2Confirmation}
                                                                    >
                                                                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                            : null}


                                                        {
                                                            this.state.selectedFeedbackType === "Provide Feedback" && this.state.page2EmailDivVisble ? (
                                                                <Grid item xs={5} style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                                                    <FormControl fullWidth>
                                                                        <FormLabel id="refer-2-emailaddress">Please provide your email address</FormLabel><TextField
                                                                            name="emailaddress"
                                                                            id="emailaddress"
                                                                            // style={{ width: '100%', border: '1px solid lightgrey' }}
                                                                            value={this.state.emailaddress}
                                                                            onChange={this.handleEmailAddress}
                                                                            fullWidth
                                                                            sx={{
                                                                                "& .MuiFormHelperText-root": {
                                                                                    color: "red",
                                                                                    border: "none",
                                                                                    margin: 0
                                                                                },
                                                                                "& .MuiFormControl-root .MuiTextField-root": {
                                                                                    border: "none",
                                                                                },

                                                                            }}
                                                                            helperText={this.state.emailError2 ? "Please enter a valid email" : ""}
                                                                            inputProps={{
                                                                                type: "email",
                                                                            }}
                                                                        /></FormControl>
                                                                </Grid>) : null
                                                        }
                                                    </Grid>
                                                    <Grid item container spacing={2} mt={5}>
                                                        <Grid item xs={8} >
                                                            2/2  <ArrowCircleUpIcon className='arrow' onClick={this.page2arrouphandler} />
                                                            {/* <ArrowCircleDownIcon className='blink'
                                                                onClick={this.handlePage2Submit} /> */}
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                                : null}
                                        </div>
                                        {/* <div id="slide" className={!this.state.isPage3 ? "hide" : null}>
                                            {this.state.isPage3 ?
                                                <Box component="form" sx={{ my: 1, mx: 'auto', width: ['100%', 500] }} className='whiteBGFeedback feedbackBox'>
                                                    <Typography component="h1" variant="h4" style={{ fontSize: '24px' }} sx={{ pb: 2 }}>
                                                        Interactive Content
                                                    </Typography>
                                                    <Grid container spacing={2} style={{ marginTop: '5px' }}>
                                                        <Grid item xs={12}>
                                                            <FormLabel id="accuracy-rating-radio">How engaging did you find the interactive elements during the video lecture? (1-5) </FormLabel>
                                                            <Container>
                                                                {[...Array(5)].map((item, index) => {
                                                                    const videoLectureEngagingRating = index + 1;
                                                                    return (
                                                                        <label>
                                                                            <RadioRate
                                                                                type="radio"
                                                                                value={videoLectureEngagingRating}
                                                                                onClick={() => { this.setState({ videoLectureEngagingRating: videoLectureEngagingRating }) }}
                                                                            />
                                                                            <Rating>
                                                                                <FaStar
                                                                                    color={
                                                                                        videoLectureEngagingRating < this.state.videoLectureEngagingRating || videoLectureEngagingRating === this.state.videoLectureEngagingRating
                                                                                            ? "#ffb400"
                                                                                            : "rgb(192,192,192)"
                                                                                    }
                                                                                />
                                                                            </Rating>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </Container>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormLabel id="accuracy-rating-radio">Helpfulness of the 'Raise Hand' (1-5) </FormLabel>
                                                            <Container>
                                                                {[...Array(5)].map((item, index) => {
                                                                    const raiseHandRating = index + 1;
                                                                    return (
                                                                        <label>
                                                                            <RadioRate
                                                                                type="radio"
                                                                                value={raiseHandRating}
                                                                                onClick={() => { this.setState({ raiseHandRating: raiseHandRating }) }}
                                                                            />
                                                                            <Rating>
                                                                                <FaStar
                                                                                    color={
                                                                                        raiseHandRating < this.state.raiseHandRating || raiseHandRating === this.state.raiseHandRating
                                                                                            ? "#ffb400"
                                                                                            : "rgb(192,192,192)"
                                                                                    }
                                                                                />
                                                                            </Rating>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </Container>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormControl>
                                                                <FormLabel id="isEffective-radio">Do you feel the interactive elements complemented the lecture material effectively?</FormLabel>
                                                                <RadioGroup row
                                                                    aria-labelledby="isEffective-radio"
                                                                    value={this.state.isEffective}
                                                                    name="isEffective"
                                                                    onChange={this.handleIsEffectiveChange}
                                                                >
                                                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormLabel id="accuracy-rating-radio">Usefulness of curated answers from the knowledge base (1-5)</FormLabel>
                                                            <Container>
                                                                {[...Array(5)].map((item, index) => {
                                                                    const knowledgebaseRating = index + 1;
                                                                    return (
                                                                        <label>
                                                                            <RadioRate
                                                                                type="radio"
                                                                                value={knowledgebaseRating}
                                                                                onClick={() => { this.setState({ knowledgebaseRating: knowledgebaseRating }) }}
                                                                            />
                                                                            <Rating>
                                                                                <FaStar
                                                                                    color={
                                                                                        knowledgebaseRating < this.state.knowledgebaseRating || knowledgebaseRating === this.state.knowledgebaseRating
                                                                                            ? "#ffb400"
                                                                                            : "rgb(192,192,192)"
                                                                                    }
                                                                                />
                                                                            </Rating>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </Container>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FormLabel id="accuracy-rating-radio">Satisfaction with generative AI responses (1-5)</FormLabel>
                                                            <Container>
                                                                {[...Array(5)].map((item, index) => {
                                                                    const aiResponseRating = index + 1;
                                                                    return (
                                                                        <label>
                                                                            <RadioRate
                                                                                type="radio"
                                                                                value={aiResponseRating}
                                                                                onClick={() => { this.setState({ aiResponseRating: aiResponseRating }) }}
                                                                            />
                                                                            <Rating>
                                                                                <FaStar
                                                                                    color={
                                                                                        aiResponseRating < this.state.aiResponseRating || aiResponseRating === this.state.aiResponseRating
                                                                                            ? "#ffb400"
                                                                                            : "rgb(192,192,192)"
                                                                                    }
                                                                                />
                                                                            </Rating>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </Container>
                                                        </Grid>

                                                        <Divider sx={{ width: "98%", marginTop: "10px", marginLeft: "17px" }} />

                                                        {this.state.selectedFeedbackType === "Provide Feedback" ?
                                                            <Grid item xs={12}>
                                                                <FormControl>
                                                                    <FormLabel id="refer-us-radio">Can we reach out to you via email for more detailed feedback or questions?</FormLabel>
                                                                    <RadioGroup row
                                                                        aria-labelledby="refer-us-radio"
                                                                        value={this.state.emailAddress3Confirmation}
                                                                        name="emailAddress1Confirmation"
                                                                        onChange={this.handleemailAddress3Confirmation}
                                                                    >
                                                                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                            : null}


                                                        {
                                                            this.state.selectedFeedbackType === "Provide Feedback" && this.state.page3EmailDivVisble ? (
                                                                <Grid item xs={5} style={{ display: "flex", justifyContent: "flex-start", lignItems: "center" }}>
                                                                    <FormControl fullWidth>
                                                                        <FormLabel id="refer-3-emailaddress">Please provide your email address</FormLabel>
                                                                        <TextField
                                                                            name="emailaddress"
                                                                            id="emailaddress"
                                                                            // style={{ width: '100%', border: '1px solid lightgrey' }}
                                                                            value={this.state.emailaddress}
                                                                            onChange={this.handleEmailAddress}
                                                                            fullWidth
                                                                            sx={{
                                                                                "& .MuiFormHelperText-root": {
                                                                                    color: "red",
                                                                                    border: "none",
                                                                                    margin: 0
                                                                                },
                                                                                "& .MuiFormControl-root .MuiTextField-root": {
                                                                                    border: "none",
                                                                                },

                                                                            }}
                                                                            helperText={this.state.emailError3 ? "Please enter a valid email" : ""}
                                                                            inputProps={{
                                                                                type: "email",
                                                                            }}
                                                                        /></FormControl>
                                                                </Grid>) : null
                                                        }
                                                    </Grid>


                                                    <Grid item container spacing={2} mt={5}>
                                                        <Grid item xs={8} >
                                                            3/3  <ArrowCircleUpIcon className='blink'
                                                                onClick={this.page3arrouphandler} />
                                                        </Grid>


                                                    </Grid>

                                                </Box>
                                                : null}
                                        </div> */}
                                    </div>
                                    : null
                                }

                                {this.state.isPage2 || this.state.selectedFeedbackType === "Report a Site Issue" ?
                                    <Container style={{ display: 'block' }} className='pt-2 pt-md-5'>
                                        <Box component="form" sx={{ my: 1, mx: 'auto', display: 'block', boxShadow: '0', width: ['100%', 500] }} className='whiteBGFeedback feedbackBoxSubmit'>
                                            <Button onClick={this.handleSubmit} type='submit' fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Submit </Button>
                                        </Box>
                                    </Container>
                                    : null}
                            </Container>
                        </div>
                        : null
                    }
                    <ToastContainer />
                </div >
            </>
        )
    }
}

export default withRouter(Feedback);