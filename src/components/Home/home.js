import React, { Component } from 'react';
import { Row, Col, Container } from "react-bootstrap"
import './home.scss';
import { Link } from 'react-router-dom';
import { checkCredentialsAPI, validIds, saveToDbAPI, SaveUserProfile, saveWebsiteVisitors, websitevisitorsconverted, sendMagicLinkEmail } from '../../common/API'
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import Carousel from 'better-react-carousel'
import Accordion from "../HomeAccordion/HomeAccordion";

import Emily from '../../assets/images/student1.png';
import Vikram from '../../assets/images/student2.png';
import Aisha from '../../assets/images/student3.png';
import John from '../../assets/images/student4.png';
import practiceTestDemoVideo from "../../assets/videos/aiPlato_Practice_Tests_edited.mp4";
import {
    APP_URL, setCookies, checkIsPrivate, setIsPrivate, setToken, token, gtoken, getToken, demoUserId
    , WEBSITE_URL, getlocalsystemtimezone, getUserAgent, showFullApp,
} from '../../common/Functions';
import quoteSignImg from '../../assets/images/img-quote-sign.svg';

import ellipse1Img from '../../assets/images/ellipse11.png';
import ellipse2Img from '../../assets/images/ellipse5.png';
import ellipse4Img from '../../assets/images/ellipse4.png';

import plusLightBlueImg from '../../assets/images/plus-light-blue.svg';
import equalLightBlueImg from '../../assets/images/equal-light-blue.svg';

import graduateStudentIcon from '../../assets/images/icon-graduate-student.svg';
import proficincyIcon from '../../assets/images/icon-proficincy.svg';
import puzzleIcon from '../../assets/images/icon-puzzle.svg';

import Acc1aImg from '../../assets/images/Acc-1a.png';
import Acc1bImg from '../../assets/images/Acc-1b.png';
import Acc1cImg from '../../assets/images/Acc-1c.png';

import Acc2aImg from '../../assets/images/Acc-2a.png';
import Acc2bImg from '../../assets/images/Acc-2b.png';
import Acc2dImg from '../../assets/images/Acc-2d.png';

import Acc3aImg from '../../assets/images/Acc-3a.png';
import Acc3bImg from '../../assets/images/Acc-3b.png';
import videoHome from '../../assets/images/video_aiPlato.mp4'
import infoIcon from '../../assets/images/info_icon.png'
import videoHomeBottom from '../../assets/images/video_aiPlato_Proficiency_Curve_vs_Traditional_v2.mp4'
import { ClientJS } from 'clientjs';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Stack from '@mui/material/Stack';
import TrapFocus from '@mui/material/Unstable_TrapFocus';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import texas from '../../assets/images/texas.svg';
import rice from '../../assets/images/rice.svg';
import nyc from '../../assets/images/nyu.svg';
import georgia from '../../assets/images/georgia-tech.svg';
import statCardIcon1 from '../../assets/images/card11.svg';
import statCardIcon2 from '../../assets/images/card22.svg';
import statCardIcon3 from '../../assets/images/card33.svg';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    '@media (max-width: 600px)': {
        width: '350px !important',
        p: 1
    }

};


class Home extends Component {
    state = {
        email: '',
        password: '',
        validIds: [],
        showPassword: false,
        shoowearlyaccess: true,
        showemaildiv: false,
        showdropdown: true,
        studenttutorvalue: "Student",
        buttontext: "Request Access",
        carousalCardCount: 3,
        reviews: [
            { name: 'Emily, University, GA', image: Emily, text: 'I loved how aiPlato gave me hints and step-by-step feedback when I got stuck. Instead of just telling me my answer was wrong, it actually helped me figure out where I went off track and learn from my mistakes.' },
            { name: 'Vikram V., University, TX', image: Vikram, text: 'The Evaluate My Work feature was a game-changer. I could see exactly where my reasoning broke down and keep working until I got it right. Honestly, it feels way more supportive than other homework platforms I’ve used.' },
            { name: 'Aisha S., High School, CA', image: Aisha, text: 'aiPlato made tough physics problems feel less intimidating. The AI Teaching Assistant explained my errors clearly and nudged me with just the right hints so I could solve the problems on my own.' },
            { name: 'Nicole O., University, GA', image: Aisha, text: 'I found aiPlato much more interactive and engaging than other homework systems. It kept me motivated and helped me stick with problems longer before giving up.' },
            { name: 'Eric C., University, TX', image: Aisha, text: 'The AI Teaching Assistant Chat was super helpful whenever I felt stuck. It didn’t just give answers—it guided me step by step, which really improved my understanding.' },
            { name: 'John D., University, TX', image: John, text: 'aiPlato gave me clear, personalized feedback that helped me master concepts faster. It turned problem-solving from something frustrating into something I actually enjoyed working through.' }
        ],
        responsiveLayout: [
            {
                breakpoint: 768,
                cols: 2,
                rows: 1,
                gap: 10,
                loop: true,
                autoplay: 5000,
                hideArrow: false,
            },
            {
                breakpoint: 1024,
                cols: 3,
                rows: 1,
                gap: 10,
                loop: false,
                autoplay: 5000,
                hideArrow: false,
            },
            {
                breakpoint: 576,
                cols: 1,
                rows: 1,
                gap: 10,
                loop: true,
                autoplay: 5000,
                hideArrow: false,
            }

        ],
        accordionSection1: [],
        accordionSection2: [],
        isPrivate: false,
        isOpen: false,
        bannerOpen: false,
        showModalVideo: false,
        whiteBoardVideoDiv: '',
        showMagicLinkModal: false,
        showSubscriptionsModal: false,
        magicLinkEmail: '',
        magicLinkSending: false,
        magicLinkSent: false,
        magicLinkError: '',
        hasLoadedValidIds: false,
        isLoadingValidIds: false,
    }

    componentWillMount() {
        const cookies = new Cookies();
        this.setState({ isPrivate: true })
        setIsPrivate(true);

        /*
            try {
                const queryString = window.atob(window.location.search.slice(1));
                let queryParamsArry = queryString.split("=")[1];
                if (getToken() !== null) {
                    this.setState({ isPrivate: true })
                    setIsPrivate(true);
                }
                else if (!isNil(queryParamsArry)) {
                    getPrivateDetail(queryParamsArry).then(res => {
                        if (res.data.allow === 'True') {
                            this.setState({ isPrivate: true })
                            setIsPrivate(true);
                            setToken(queryParamsArry)
                        } else {
                            this.setState({ isPrivate: false })
                            cookies.set('isPrivate', 'false');
                            setIsPrivate(false)
                        }
                    });


                }
                else {
                    setIsPrivate(false)
                    this.setState({ isPrivate: false })

                }

            } catch (err) {
                console.log(err);
                cookies.set('isPrivate', 'false')
                this.setState({ isPrivate: false })
                cookies.set('PrivateToken', null)
            }
        */

        let data1 = {
            headerIconPath: graduateStudentIcon,
            headingText: "Lectures That Listen and Respond",
            headingDescription: "Interactive AI Teaching Assistant",
            imgOnLeft: false,
            imgSectionClass: 'yellow',
            accordionSectionClass: 'px-0',
            isFirstOpen: true,
            accordionDetails: [
                {
                    headerText: "Your Questions, Instantly Addressed",
                    description: "Experience the nuance of a tutor who understands the roots of your confusion, offering precise clarification in real-time.",
                    imagePath: Acc1bImg,
                },
                {
                    headerText: "Dive Deeper with Interactive Elements",
                    description: "Purpose-built AI engages you with content that is personalized to your strengths and weaknesses.",
                    imagePath: Acc1aImg,
                },
                {
                    headerText: "Real-Time Feedback",
                    description: "Benefit from immediate, accurate responses to your in-lecture queries, allowing you to grasp complex concepts the moment they're discussed.",
                    imagePath: Acc1cImg,
                }]
        }

        let data = {
            headerIconPath: puzzleIcon,
            headingText: "Homework and Tests Prep that Teach",
            headingDescription: "Become an Expert Problem Solver",
            imgOnLeft: true,
            imgSectionClass: 'blue',
            accordionSectionClass: 'px-0',
            isFirstOpen: true,
            accordionDetails: [{
                headerText: "Get step-by-step feedback, master Every Problem",
                description: "Learn with a 24/7 AI Teaching Assistant that provides step-by-step feedback, understanding your thought process and guiding you through each problem with targeted interventions and insights.",
                imagePath: Acc2aImg,
            },
            {
                headerText: "Customized Problem-Solving Practice",
                description: "Advance your skills with an AI that adapts to your needs, offering personalized problem-solving sessions that help you tackle challenges and learn topics in-depth, anytime, anywhere.",
                imagePath: Acc2bImg,
            },
            {
                headerText: "Bring any problem, any topic ",
                description: "Upload your own problems and let our AI Teaching Assistant break it down for you, offering clear, step-by-step guidance that ensures you not only find the answer but understand the how and why behind it.",
                imagePath: Acc2dImg,
            }
                // ,
                // {
                //     headerText: "Bring Any Problem, Any Topic",
                //     description: "Unpack any challenge or learn any topic. If you have a unique problem or topic, simply upload it, and learn step-by-step with the 1-on-1 AI Teaching Assistant!",
                //     imagePath: Acc2dImg,
                // },
                // {
                //     headerText: "One-Click Human Tutor Access",
                //     description: "And when you want it, a human tutor is just one click away.",
                //     imagePath: Acc2eImg,
                // }
            ],
        }
        let data2 = {
            headerIconPath: proficincyIcon,
            headingText: "Personalized Teaching for Your Proficiency",
            headingDescription: "Master Concepts, Boost Confidence & Grades",
            imgOnLeft: false,
            imgSectionClass: 'yellow',
            accordionSectionClass: 'px-0',
            isFirstOpen: true,
            accordionDetails: [{
                headerText: "Personalized Lectures, Problems, and Interactions",
                description: "Learn from a tutor who understands your strengths and weaknesses, to personalize your learning – to your needs, your struggles, your proficiency map.",
                imagePath: Acc3aImg,
            },
            {
                headerText: "Focus Time & Effort for Most Impact",
                description: "Target your study time on your proficiency needs, at the specificity of each micro-concept level.",
                imagePath: Acc3bImg,
            }],
        }

        this.setState({ accordionSection1: data, accordionSection2: data1, accordionSection3: data2 })
    }

    savewebsitevisitors = () => {
        //debugger;
        const client = new ClientJS();
        const fingerprint = client.getFingerprint();
        const form_data = new FormData();
        //     debugger;

        form_data.append("userId", fingerprint)
        form_data.append('user_agent', getUserAgent());
        form_data.append("ref_url", document.referrer);
        form_data.append("browsing_detail", "")
        saveWebsiteVisitors(form_data).then(res => {
        })
    }

    componentDidMount() {
        let studentContainer = document.getElementById('studentsContainer');
        this.setState({ carousalCardCount: Math.floor(studentContainer.clientWidth / 280) })
        // If we arrived with a hash (e.g. from the Products menu on another page), scroll to it.
        if (window.location.hash) {
            const targetId = window.location.hash.slice(1);
            setTimeout(() => {
                const el = document.getElementById(targetId);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
        // Defer visitor tracking so it does not compete with initial rendering.
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
                this.savewebsitevisitors();
            }, { timeout: 5000 });
        } else {
            setTimeout(() => {
                this.savewebsitevisitors();
            }, 3000);
        }
        // debugger;
        const cookies = new Cookies();
        let cookiebannervalue = cookies.get("cookieconcentbanner")
        if (cookiebannervalue === false || cookiebannervalue === "false") {
            this.setState({ bannerOpen: false })
        }
        else {
            this.setState({ bannerOpen: true })
        }


    }
    closeBanner = () => {
        debugger;
        const cookies = new Cookies();
        // const hostnameParts = window.location.hostname.split('.');
        // const domainName = hostnameParts.length > 1 ? hostnameParts[hostnameParts.length - 2] + "." + hostnameParts[hostnameParts.length - 1] : hostnameParts[hostnameParts.length - 1];
        cookies.set('cookieconcentbanner', false);
        this.setState({ bannerOpen: false })
    }

    handleEmailChange = (event) => {

        let email = event.target.value.trim()
        this.ensureValidIdsLoaded();
        this.setState({ email: email }, () => {
            if (this.state.validIds.includes(email.toLowerCase())) {
                this.setState({ showPassword: true, showdropdown: false, buttontext: "Login" });
            } else {
                this.setState({ showPassword: false, showdropdown: true });
            }
        });

    }



    ensureValidIdsLoaded = () => {
        if (this.state.hasLoadedValidIds || this.state.isLoadingValidIds) return;
        this.fetchIds();
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
                            res.data.user_timezone, "", false, res.data.isDemoUser, res.data.isPtTeacher, res.data.user_professor_id, res.data.isTA)
                        toast.success("Valid Demo Credentials!", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
                        window.open(APP_URL, '_self')
                        this.setState({ email: '', password: '', showPassword: false });
                        this.setState({ shoowearlyaccess: true, showemaildiv: false, showdropdown: true, studenttutorvalue: "Student", buttontext: "Request Access" })



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
            let data = { 'email': this.state.email.trim().toLowerCase(), studenteducatior: this.state.studenttutorvalue == "" ? "Student" : this.state.studenttutorvalue }
            saveToDbAPI(data).then(res => {
                toast.success("Thank you for submitting your early access request. Our team will be in touch with you shortly to provide further information and support.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
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

    addValidationCookie = (email, userId, role, name, status, tryThisPinsEnabled, QATestFlag, timeLimit, institute_id, usertimezone, user_fingerprint, isDemoUser, isDemoUserFlagged, isPtTeacher, user_professor_id, isTA) => {
        setCookies(email, userId, role, name, status, tryThisPinsEnabled, QATestFlag, timeLimit, institute_id, usertimezone, user_fingerprint, isDemoUser, isDemoUserFlagged, isPtTeacher, "", false, "", user_professor_id, isTA);
    }

    fetchIds = () => {
        this.setState({ isLoadingValidIds: true });

        validIds().then(res => {
            this.setState({
                validIds: res.data.ids.map(item => atob(item)),
                hasLoadedValidIds: true,
                isLoadingValidIds: false
            });
        }).catch(err => {
            console.error(err.message)
            this.setState({ isLoadingValidIds: false });
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
        this.setState({ shoowearlyaccess: false, showemaildiv: true })
    }

    opentestappdemovideo = (e) => {
        e.preventDefault();
        this.setState({
            showModalVideo: true,


        })

    }
    closeVideoModal = () => {
        this.setState({ showModalVideo: false })
    }

    openDemoApp = (e) => {
        e.preventDefault();
        this.setState({ showMagicLinkModal: true, magicLinkSent: false, magicLinkEmail: '', magicLinkSending: false, magicLinkError: '' });
    }

    closeMagicLinkModal = () => {
        this.setState({ showMagicLinkModal: false, magicLinkSent: false, magicLinkEmail: '', magicLinkSending: false, magicLinkError: '' });
    }

    openSubscriptionsModal = (e) => {
        e.preventDefault();
        this.setState({ showSubscriptionsModal: true });
    }

    closeSubscriptionsModal = () => {
        this.setState({ showSubscriptionsModal: false });
    }

    handleMagicLinkEmailChange = (e) => {
        this.setState({ magicLinkEmail: e.target.value.trim(), magicLinkError: '' });
    }

    sendMagicLink = (e) => {
        e.preventDefault();
        const email = this.state.magicLinkEmail.trim().toLowerCase();

        if (!this.isValidEmail(email)) {
            toast.error("Please enter a valid email address.", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
            return;
        }

        this.setState({ magicLinkSending: true });

        const data = {
            email: email,
            referURL: document.referrer,
            userAgent: getUserAgent(),
            timezone: getlocalsystemtimezone()
        };

        sendMagicLinkEmail(data).then(res => {
            if (res.data.Success === true || res.data.Success === "Success") {
                this.setState({ magicLinkSent: true, magicLinkSending: false, magicLinkError: '' });
                toast.success("Verification link sent! Please check your email.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            } else {
                const errorMsg = res.data.message || "Failed to send verification link. Please try again.";
                this.setState({ magicLinkSending: false, magicLinkError: errorMsg });
            }
        }).catch(err => {
            const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
            this.setState({ magicLinkSending: false, magicLinkError: errorMsg });
            console.error(err.message);
        });
    }
    handlestudenttutorchange = (e) => {
        this.setState({ studenttutorvalue: e.target.value })
    }

    downloadStudyPdf = (e) => {
        e.preventDefault();
        // const link = document.createElement('a');
        // link.href = studyPdf;
        // link.download = 'UT_PhyEdRes_AI_Study_aiPlato.pdf';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        window.open('https://arxiv.org/abs/2601.09965','window')
    }

    MyDot = ({ isActive }) => (
        <span
            style={{
                display: 'inline-block',
                height: isActive ? '8px' : '5px',
                width: isActive ? '8px' : '5px',
                background: '#1890ff'
            }}
        ></span>
    )


    bannerOpen

    CustomLeftArrow = ({ onClick }) => (
        <button
            className="custom-carousel-arrow prev-arrow"
            onClick={onClick}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            &#10094;
        </button>
    );

    CustomRightArrow = ({ onClick }) => (
        <button
            className="custom-carousel-arrow next-arrow"
            onClick={onClick}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            &#10095;
        </button>
    );

    render() {
        return (

            // ======= NEW=========           
            this.state.isPrivate ?
                <>
                    <div className='mainContainerWrapper'>
                        {/* Hero Section */}
                        <div className='py-3 mobile-box'>
                            <div className='homeHeroOverlay'>
                                    <video
                                        src={videoHome}
                                        className='homeHeroVideo'
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload='meta'
                                    ></video>
                                    <div className='homeHeroContent'>
                                        <h1>AI Teaching Assistant for STEM</h1>
                                        <h3>Developed by Educators, for Educators</h3>
                                        <div className='homeHeroCtaGroup'>
                                            <button onClick={this.openDemoApp} className='homeHeroCta'>
                                                Try Free — 7-Day Trial
                                            </button>
                                            <button onClick={this.openSubscriptionsModal} className='homeHeroCta homeHeroCtaSecondary'>
                                                View Plans
                                            </button>
                                        </div>
                                        <Link to="/educator" className='homeHeroForkPill'>
                                            Are you an <strong>educator or institution?</strong> → See Educator Tools
                                        </Link>
                                    </div>
                            </div>
                        </div>

                        <div className='py-5'>
                            <Row className='ellipseSection'>
                                    <Col sm={12} md={3} className='banner2Text'>
                                        <img aria-label='' src={ellipse1Img} alt='Deep Research in Education' className='img-fluid' loading="lazy" decoding="async" fetchpriority="low" />
                                        <h5 className=''>Deep Research in Education</h5>
                                        <p className='copyText-special mb-0 '>aiPlato Harvard and Stanford education researchers have created groundbreaking insights on how expert 1-on-1 tutors boost learning.</p>
                                    </Col>
                                    <Col sm={12} md={1} className='text-center'><img aria-label='' src={plusLightBlueImg} alt='background' className='img-fluid blackArrowCircle' /></Col>
                                    <Col sm={12} md={3} className='banner2Text'>
                                        <img aria-label='' src={ellipse2Img} alt='Purpose-Built Gen AI' className='img-fluid' loading="lazy" decoding="async" fetchpriority="low" />
                                        <h5 className=''>Purpose-Built Gen AI</h5>
                                        <p className='copyText-special mb-0 '>aiPlato AI experts have meticulously embodied   insights from education research in purpose-built AI.</p>
                                    </Col>
                                    <Col sm={12} md={1} className='text-center'><img aria-label='' src={equalLightBlueImg} alt='background' className='img-fluid blackEqualCircle' /></Col>
                                    <Col sm={12} md={3} className='banner2Text'>
                                        <img aria-label='' src={ellipse4Img} alt='Revolutionary AI Teaching Assistant' className='img-fluid' loading="lazy" decoding="async" fetchpriority="low" />
                                        <h5 className=''>Revolutionary AI Teaching Assistant</h5>
                                        <p className='copyText-special mb-0 '>Culminating in the most advanced AI Teaching Assistant. It understands you, cognitively, and guides you to mastery.  The most Personalized, Interactive, Engaging learning platform.</p>
                                    </Col>
                            </Row>
                        </div>

                        {/* Logos Section*/}
                        <div className='bg-white'>
                                <Row style={{marginBottom:'-60px',marginTop:'20px'}}>
                                    <Col sm={12} className='text-center mb-4'>
                                        <h1 className='bannerTitle mb-3 mt-3'>Trusted by Leading Institutions</h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} className='mb-4'>
                                        <div className='trusted-institutions-card compact'>
                                            <Row className='university-logos-row'>
                                                <Col sm={12}>
                                                    <Row className='justify-content-center align-items-center'>
                                                        <Col xs={6} sm={4} md className='text-center mb-3 mb-md-0 p-3'>
                                                            <div className='university-logo'>
                                                                <img aria-label='' src={texas} alt='texas logo' className='img-fluid' />
                                                            </div>
                                                        </Col>
                                                        <Col xs={6} sm={4} md className='text-center mb-3 mb-md-0 p-3'>
                                                            <div className='university-logo'>
                                                                <img aria-label='' src={rice} alt='rice logo' className='img-fluid' />
                                                            </div>
                                                        </Col>
                                                        <Col xs={6} sm={4} md className='text-center mb-3 mb-md-0 p-3'>
                                                            <div className='university-logo'>
                                                                <img aria-label='' src={nyc} alt='nyc logo' className='img-fluid' />
                                                            </div>
                                                        </Col>
                                                        <Col xs={6} sm={4} md className='text-center mb-3 mb-md-0 p-3'>
                                                            <div className='university-logo'>
                                                                <img aria-label='' src={georgia} alt='georgia logo' className='img-fluid' />
                                                            </div>
                                                        </Col>
                                                        {/* <Col xs={6} sm={4} md className='text-center mb-3 mb-md-0 p-3'>
                                                            <div className='university-logo'>
                                                                <img aria-label='' src={harvard} alt='harvard logo' className='img-fluid' />
                                                            </div>
                                                        </Col> */}
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col sm={12}>
                                        <div className='trusted-institutions-card research-impact-card'>
                                            <div className='research-impact-header text-center'>
                                                <h2 className='section-main-title'>Game-Changing Learning Impact</h2>
                                                <h3 className='university-name'>University of Texas at Arlington Study</h3>
                                                <p className='research-group'>
                                                    Independent study by the Physics Education Research Group at the University of Texas shows that students who used
                                                    aiPlato scored about a full standard deviation higher on their final exam scores increased by
                                                </p>
                                            </div>

                                            <div className='impact-map-image-wrap'>
                                                <img
                                                    aria-label=''
                                                    src={impactMapImg}
                                                    alt='University of Texas at Arlington study impact map'
                                                    className='img-fluid impact-map-image'
                                                />
                                            </div>

                                            <div className='text-center'>
                                                <button onClick={this.downloadStudyPdf} className="btnMain impact-study-btn">
                                                    View Published Copy
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row> */}
                        </div>
                    </div>

                    {/* Blue Section Outside the main container in full width */}
                    <div className='py-3 bg-blue2' style={{ overflow: 'visible', paddingBottom: '40px' , width:"100%" , display:"flex" , justifyContent:"center", alignItems:"center"}}>
                        <div className='mainContainerWrapper' id='studentsContainer'>
                                <Row style={{margin:0}}>
                                    <Col sm={12} style={{padding:0}}>
                                        <div className='trusted-institutions-card'>
                                            <Row>
                                                <Col sm={12} className='text-center'>
                                                    <h1 className='bannerTitle2 pb-2 text-white'>Game-Changing Learning Impact</h1>
                                                </Col>
                                            </Row>
                                            
                                            <div className='research-impact-column'>
                                                <div className='research-highlight'>
                                                    <h3 className='university-name'>University of Texas at Arlington Study</h3>
                                                    <p className='research-group'>Independent study by Physics Education Research Group at University of Texas Arlington shows that students who did homework on aiPlato scored <span className='highlight-number'>13.9 points </span> higher on their three-hour 100-point cumulative Final Exam (effect size = 0.8).</p>
                                                    <div className='hide-mobile'>
                                                        <button onClick={this.downloadStudyPdf} className="btnDarkBlue-white">
                                                            Published Copy on arXiv
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className='research-stats-cards'>
                                                    <div className='research-stat-card research-stat-card--one'>
                                                        <img src={statCardIcon1} alt='' className='research-stat-icon' />
                                                        <div className='research-stat-value'>+13.9 pts</div>
                                                        <div className='research-stat-label'>Exam Score Gain</div>
                                                        <p className='research-stat-detail'>Cumulative 3-hr Final Exam<br />University of Texas, Arl. PER</p>
                                                    </div>
                                                    <div className='research-stat-card research-stat-card--two'>
                                                        <img src={statCardIcon2} alt='' className='research-stat-icon' />
                                                        <div className='research-stat-value research-stat-value--effect'>
                                                            <em className='research-stat-effect-d'>d</em>
                                                            <span className='research-stat-effect-rest'>= 0.81</span>
                                                        </div>
                                                        <div className='research-stat-label'>Effect Size</div>
                                                        <a href='https://arxiv.org/abs/2601.09965' target='_blank' rel='noopener noreferrer' className='research-stat-link'>https://arxiv.org/abs/2601.09965</a>
                                                    </div>
                                                    <div className='research-stat-card research-stat-card--three'>
                                                        <img src={statCardIcon3} alt='' className='research-stat-icon' />
                                                        <div className='research-stat-value'>~99%</div>
                                                        <div className='research-stat-label'>Auto-grade Accuracy</div>
                                                        <a href='https://openai.com/index/gpt-4-research/' target='_blank' rel='noopener noreferrer' className='research-stat-detail research-stat-link'>vs. GPT-4’s 64% on AP Physics (source: OpenAI)</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                        </div>
                    </div>

                    {/* ===== Ported from mockup: Rethinking + One Platform/Three Products ===== */}
                    <div className="mockupSections">
                        {/* Rethinking Education for the Age of AI */}
                        <section className="mk-section mk-ai-era-section">
                            <div className="mk-section-inner mk-text-center">
                                <span className="mk-section-tag">Why aiPlato</span>
                                <h2 className="mk-section-title">Rethinking Education for the Age of AI</h2>
                                <p className="mk-section-body">The skills students need to thrive are changing. Beyond memorizing formulas, students must reason deeply, diagnose their own errors, and persist through hard problems — the exact capabilities AI cannot replace. aiPlato is purpose-built to develop these metacognitive and problem-solving skills, not just deliver correct answers.</p>
                                <div className="mk-three-col">
                                    <div className="mk-ai-era-card"><div className="mk-icon">🧠</div><h4>Reasoning Over Recall</h4><p>Step-level diagnosis identifies where understanding breaks down, not just that it did — mirroring how expert human tutors think.</p></div>
                                    <div className="mk-ai-era-card"><div className="mk-icon">🔁</div><h4>Learns from Educators</h4><p>Continuously improves from real teaching interactions, building a compounding teaching-intelligence moat that grows with every session.</p></div>
                                    <div className="mk-ai-era-card"><div className="mk-icon">🎯</div><h4>Metacognitive Development</h4><p>Tracks micro-concept proficiency across 800+ concepts, forming the infrastructure layer for AI-native, lifelong STEM learning.</p></div>
                                </div>
                            </div>
                        </section>

                        {/* One Platform. Three Products. */}
                        <section className="mk-section mk-products-section" id="three-products">
                            <div className="mk-section-inner">
                                <span className="mk-section-tag">Our Platform</span>
                                <h2 className="mk-section-title">One Platform. Three Products.<br />Built on the Same AI Core.</h2>
                                <p className="mk-section-body">Each product extends aiPlato's proprietary teaching intelligence — grounded in 4M+ equations of real student problem-solving data.</p>
                                <div className="mk-three-col">
                                    <div className="mk-product-card mk-featured" id="prod-homework">
                                        <div className="mk-product-featured-badge">Most Popular</div>
                                        <div className="mk-product-icon">📚</div>
                                        <h3>Homework Platform</h3>
                                        <div className="mk-product-tagline">Replaces WebAssign · Pearson · Wiley · Cengage</div>
                                        <p className="mk-product-desc">The most advanced online homework system for Physics — free-response grading at ~99% accuracy with step-by-step personalized feedback, 24/7.</p>
                                        <div className="mk-product-tam">TAM: $1.2B · Already generating revenue</div>
                                        <ul className="mk-product-features">
                                            <li>Free-response auto-grading: equations, text, diagrams</li>
                                            <li>Step-level feedback identifying root causes of errors</li>
                                            <li>Proficiency map across 800+ physics micro-concepts</li>
                                            <li>Handwritten, stylus, or keyboard equation input</li>
                                            <li>Instructor dashboard + TA Copilot™</li>
                                        </ul>
                                        <Link to="/requestDemo" className="mk-btn-card">Learn More →</Link>
                                    </div>
                                    <div className="mk-product-card" id="prod-testprep">
                                        <div className="mk-product-icon">🎯</div>
                                        <h3>Test Prep AI</h3>
                                        <div className="mk-product-tagline">AP Physics 1 &amp; 2</div>
                                        <p className="mk-product-desc">Precision-targeted test prep powered by micro-concept mastery. AP exam-aligned rubrics, Harvard-designed practice tests, immediate diagnostic analytics.</p>
                                        <div className="mk-product-tam">TAM: $4B D2C market · AP pilots underway</div>
                                        <ul className="mk-product-features">
                                            <li>5 AP Physics 1 &amp; 2 practice tests — Harvard-designed</li>
                                            <li>Practice Mode + Exam Mode with timed simulation</li>
                                            <li>FRQ step-by-step grading aligned to AP rubrics</li>
                                            <li>Diagnostic analytics across 800+ concepts</li>
                                            <li>Free access for AAPT / APS / PhysTEC members</li>
                                        </ul>
                                        <Link to="/requestDemo" className="mk-btn-card mk-outline">Explore Test Prep →</Link>
                                    </div>
                                    <div className="mk-product-card" id="prod-courses">
                                        <div className="mk-product-coming">Coming Soon</div>
                                        <div className="mk-product-icon">🎓</div>
                                        <h3>Independent Courses</h3>
                                        <div className="mk-product-tagline">Replaces Stride · Coursera · Synchronous Tutoring</div>
                                        <p className="mk-product-desc">Full AI-powered courses for students without access to qualified instructors — starting with AP Physics 1 &amp; 2, then expanding across K–12 STEM.</p>
                                        <div className="mk-product-tam">TAM: $1.5B+ · 1.2M AP students constrained by access</div>
                                        <ul className="mk-product-features">
                                            <li>Complete AP Physics curriculum, AI-delivered</li>
                                            <li>Self-paced with adaptive proficiency checkpoints</li>
                                            <li>ESA-eligible (Education Savings Account)</li>
                                            <li>Expands to Calculus, Chemistry, Pre-Calc</li>
                                            <li>One-click human tutor access</li>
                                        </ul>
                                        <button className="mk-btn-card mk-dim">Notify Me When Available</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Comparison vs legacy platforms */}
                        <section className="mk-section mk-compare-section">
                            <div className="mk-section-inner">
                                <span className="mk-section-tag">Why Switch</span>
                                <h2 className="mk-section-title">Why Institutions Are Switching to aiPlato</h2>
                                <p className="mk-section-body">The only platform with ~99% free-response accuracy, peer-reviewed learning outcomes, and a complete teaching-intelligence layer built from real educator interactions.</p>
                                <div className="mk-comp-label"><strong>📚 Homework Platform</strong> <span>— aiPlato vs. WebAssign / Pearson MyLab / WileyPLUS / Cengage</span></div>
                                <div className="mk-comp-table-wrap">
                                    <table className="mk-comp-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '32%' }}>Feature</th>
                                                <th className="mk-hl" style={{ width: '22%' }}>✦ aiPlato</th>
                                                <th style={{ width: '23%' }}>WebAssign / Pearson</th>
                                                <th style={{ width: '23%' }}>ExpertTA / Wiley</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>Free-response auto-grading (equations)</td><td className="mk-hl"><span className="mk-chk">✓</span> ~99% accuracy</td><td><span className="mk-prt">⚡ Limited / MCQ focus</span></td><td><span className="mk-prt">⚡ Partial</span></td></tr>
                                            <tr><td>Step-level root-cause feedback</td><td className="mk-hl"><span className="mk-chk">✓</span> Identifies exact error step</td><td><span className="mk-crs">✕</span></td><td><span className="mk-crs">✕</span></td></tr>
                                            <tr><td>Diagram + handwriting input</td><td className="mk-hl"><span className="mk-chk">✓</span> Stylus / scan / keyboard</td><td><span className="mk-crs">✕</span></td><td><span className="mk-crs">✕</span></td></tr>
                                            <tr><td>Micro-concept proficiency map</td><td className="mk-hl"><span className="mk-chk">✓</span> 800+ concepts</td><td><span className="mk-crs">✕</span></td><td><span className="mk-crs">✕</span></td></tr>
                                            <tr><td>24/7 AI Teaching Assistant</td><td className="mk-hl"><span className="mk-chk">✓</span> Interactive, personalized</td><td><span className="mk-crs">✕</span></td><td><span className="mk-prt">⚡ Basic hints only</span></td></tr>
                                            <tr><td>TA workload reduction</td><td className="mk-hl"><span className="mk-chk">✓</span> 70–80% offloaded</td><td><span className="mk-crs">✕</span></td><td><span className="mk-crs">✕</span></td></tr>
                                            <tr><td>Instructor AI interaction visibility</td><td className="mk-hl"><span className="mk-chk">✓</span> Full audit log</td><td><span className="mk-crs">✕</span></td><td><span className="mk-crs">✕</span></td></tr>
                                            <tr><td>Peer-reviewed learning impact</td><td className="mk-hl"><span className="mk-chk">✓</span> +13.9 pts (arXiv)</td><td><span className="mk-crs">✕</span></td><td><span className="mk-crs">✕</span></td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* Institutional AI Policy */}
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

                    <div className='mainContainerWrapper'>
                        {/* accordian cards */}
                        <div className='cards-wrapper'>
                                <div className=''>
                                    <div className='card-box'>
                                        <Accordion sectionClass="home-accordion-lectures" viewtestappdemoclick={(e) => this.opentestappdemovideo(e)} tryItOutClick={this.openDemoApp} isFirstOpen={true} accordionData={this.state.accordionSection2}></Accordion>
                                    </div>
                                </div>

                                <div id="firstAccordian" name="firstAccordian" className='' >
                                    <div className='card-box'>
                                        <Accordion sectionClass="home-accordion-homework" viewtestappdemoclick={(e) => this.opentestappdemovideo(e)} tryItOutClick={this.openDemoApp} isFirstOpen={true} accordionData={this.state.accordionSection1}></Accordion>
                                    </div>
                                </div>

                                <div className=''>
                                    <div className='card-box'>
                                        <Accordion sectionClass="home-accordion-proficiency" viewtestappdemoclick={(e) => this.opentestappdemovideo(e)} tryItOutClick={this.openDemoApp} isFirstOpen={true} accordionData={this.state.accordionSection3}></Accordion>
                                    </div>
                                </div>
                        </div>
                    </div>
                    
                    {/* Blue Section Outside the main container in full width */}
                    <div className='py-3 bg-blue2' style={{ paddingBottom: '40px',width:"100%" , display:"flex" , justifyContent:"center", alignItems:"center" }}>
                                <div className='mainContainerWrapper' id='studentsContainer'>
                                    <Row style={{ overflow: 'visible' }}>
                                        <Col sm={12} className='text-center'>
                                            <h1 className='bannerTitle2 pb-4 text-white'>What Our Students Say</h1>
                                        </Col>
                                        <Col sm={12} className='p-0' style={{ overflow: 'visible' }}>
                                            <Carousel
                                                dot={this.MyDot}
                                                cols={4}
                                                rows={1}
                                                gap={20}
                                                autoplay={5000}
                                                showDots={false}
                                                responsiveLayout={this.state.responsiveLayout}
                                                style={{ overflow: 'visible' }}
                                                hideArrow={false}
                                                arrowLeft={this.CustomLeftArrow}
                                                arrowRight={this.CustomRightArrow}
                                                mobileBreakpoint={0}
                                            >
                                                {this.state.reviews.map(content => (
                                                    <Carousel.Item key={content.name}>
                                                        <div className='studentBox2'>
                                                            <img aria-label='' src={quoteSignImg} alt='Quote Sign' className='img-fluid quote-icon' />
                                                            <p className='pt-2 pb-4 copyText'>
                                                                {content.text}
                                                            </p>
                                                            <p className='text-right copyText text-muted'>- {content.name}</p>
                                                        </div>
                                                    </Carousel.Item>
                                                ))
                                                }
                                            </Carousel>
                                        </Col>
                                    </Row>
                                </div>
                    </div>

                    <div className='mainContainerWrapper'>
                        <div className='py-3 '>
                                    <div className='' >
                                        <Row className="" style={{marginTop:"20px"}}>
                                            <Col sm={12} lg={12} className='text-md-right text-center'>
                                                <video src={videoHomeBottom} width="100%" autoPlay loop muted preload='meta' playsInline ></video>
                                            </Col>
                                        </Row>
                                        <Row className='py-5'>
                                            <Col sm={12} className='text-center'>
                                                <h1 className='bannerTitle pb-3' style={{fontSize:"28px"}}>Unleash Each Student's Potential <br className='d-none d-md-block' />With the most advanced AI Teaching Assistant for STEM</h1>
                                                <button
                                                    onClick={this.openDemoApp}
                                                    className="btnMain"
                                                >Try as a student — 7-day free trial</button>
                                            </Col>
                                        </Row>
                                    </div>
                        </div>
                    </div>
                    
                    <Modal style={{
                        position: 'absolute',
                        top: '100px',
                        left: '5px',
                        justify: 'center',
                        maxWidth: "400px"
                    }}
                        open={this.state.isOpen}
                        onClose={() => this.setState({ isOpen: false })}
                        aria-describedby="modal-modal-description"
                    >
                        <div className='infoModal'>
                            <h5>Optimized Experience Advisory</h5>
                            <img aria-label='' alt='Information' src={infoIcon}></img>
                            <p>We are actively working on making aiPlato available on all mobile and tablet devices. Currently we only support large screens.</p>
                        </div>
                    </Modal>

                    <Modal
                        open={this.state.showModalVideo}
                        onClose={this.closeVideoModal}
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                            backdrop: {
                                timeout: 500,
                            },
                        }}
                    >

                        <Fade in={this.state.showModalVideo}>
                            <Box sx={style}>
                                <div >
                                    <div className='videoDiv'>
                                        <video playsInline muted loop={true} autoPlay={true} width={showFullApp() ? "590" : "340"} height="300" controls>
                                            <source src={practiceTestDemoVideo} type="video/mp4" />
                                        </video>
                                    </div>

                                    <div className='modal-button text-center'>
                                        <Button className="videoClosebtn" onClick={this.closeVideoModal}> CLOSE </Button>
                                    </div>
                                </div>
                            </Box>
                        </Fade>
                    </Modal>

                    <Modal
                        open={this.state.showSubscriptionsModal}
                        onClose={this.closeSubscriptionsModal}
                        aria-labelledby="subscriptions-modal-title"
                        aria-describedby="subscriptions-modal-description"
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '94vw',
                                maxWidth: '1320px',
                                height: '92vh',
                                bgcolor: '#fff',
                                borderRadius: '14px',
                                boxShadow: 24,
                                overflow: 'hidden'
                            }}
                        >
                            <IconButton
                                onClick={this.closeSubscriptionsModal}
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    zIndex: 2,
                                    color: '#1d2f5f',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,1)'
                                    }
                                }}
                                aria-label="close subscriptions modal"
                            >
                                <CloseIcon />
                            </IconButton>
                            <iframe
                                title="Subscription Plans"
                                src="/SignUpPlans?embed=1"
                                style={{
                                    border: 'none',
                                    width: '100%',
                                    height: '100%',
                                    display: 'block'
                                }}
                            />
                        </Box>
                    </Modal>

                    <Modal
                        open={this.state.showMagicLinkModal}
                        onClose={this.closeMagicLinkModal}
                        aria-labelledby="magic-link-modal-title"
                        aria-describedby="magic-link-modal-description"
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                            backdrop: {
                                timeout: 500,
                            },
                        }}
                    >
                        <Fade in={this.state.showMagicLinkModal}>
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 480,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                borderRadius: '16px',
                                p: 4,
                                '@media (max-width: 600px)': {
                                    width: '90%',
                                    p: 3
                                }
                            }}>
                                <IconButton
                                    onClick={this.closeMagicLinkModal}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        color: '#999',
                                        '&:hover': {
                                            color: '#333',
                                            backgroundColor: 'rgba(0,0,0,0.04)'
                                        }
                                    }}
                                    aria-label="close"
                                >
                                    <CloseIcon />
                                </IconButton>
                                {!this.state.magicLinkSent ? (
                                    <div className='text-center'>
                                        <Typography id="magic-link-modal-title" variant="h5" sx={{
                                            fontFamily: 'quincy-cf, serif',
                                            fontWeight: 700,
                                            color: '#003392',
                                            marginBottom: '8px'
                                        }}>
                                            Try aiPlato as a Student
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'proxima-nova, sans-serif',
                                            fontSize: '15px',
                                            color: '#555',
                                            marginBottom: '24px'
                                        }}>
                                            Enter your email address and we'll send you a verification link to get started. Your account will be active for 7 days.
                                        </Typography>
                                        <form onSubmit={this.sendMagicLink}>
                                            <div className="form-group mb-3">
                                                <input
                                                    autoFocus
                                                    type="email"
                                                    className="form-control inp"
                                                    value={this.state.magicLinkEmail}
                                                    onChange={this.handleMagicLinkEmailChange}
                                                    placeholder="Enter your email address"
                                                    style={{ height: '48px', borderRadius: '8px' }}
                                                />
                                            </div>
                                            {this.state.magicLinkError && (
                                                <Typography sx={{
                                                    fontFamily: 'proxima-nova, sans-serif',
                                                    fontSize: '14px',
                                                    color: '#d32f2f',
                                                    backgroundColor: '#fdecea',
                                                    borderRadius: '8px',
                                                    padding: '10px 14px',
                                                    marginBottom: '16px',
                                                    textAlign: 'left',
                                                    lineHeight: 1.5
                                                }}>
                                                    {this.state.magicLinkError}
                                                </Typography>
                                            )}
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                disabled={!this.isValidEmail(this.state.magicLinkEmail) || this.state.magicLinkSending}
                                                sx={{
                                                    backgroundColor: '#003392',
                                                    borderRadius: '24px',
                                                    padding: '10px 24px',
                                                    textTransform: 'none',
                                                    fontFamily: 'proxima-nova, sans-serif',
                                                    fontWeight: 600,
                                                    fontSize: '16px',
                                                    '&:hover': {
                                                        backgroundColor: '#002270'
                                                    },
                                                    '&:disabled': {
                                                        backgroundColor: '#ccc',
                                                        color: '#666'
                                                    }
                                                }}
                                            >
                                                {this.state.magicLinkSending ? 'Sending...' : 'Send Verification Link'}
                                            </Button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className='text-center'>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#9993;</div>
                                        <Typography variant="h5" sx={{
                                            fontFamily: 'quincy-cf, serif',
                                            fontWeight: 700,
                                            color: '#003392',
                                            marginBottom: '8px'
                                        }}>
                                            Check Your Email
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'proxima-nova, sans-serif',
                                            fontSize: '15px',
                                            color: '#555',
                                            marginBottom: '8px'
                                        }}>
                                            We've sent a verification link to
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'proxima-nova, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#003392',
                                            marginBottom: '16px'
                                        }}>
                                            {this.state.magicLinkEmail}
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'proxima-nova, sans-serif',
                                            fontSize: '14px',
                                            color: '#777',
                                            marginBottom: '24px'
                                        }}>
                                            Click the link in your email to verify your address and set up your account.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            onClick={this.closeMagicLinkModal}
                                            sx={{
                                                borderRadius: '24px',
                                                borderColor: '#003392',
                                                color: '#003392',
                                                textTransform: 'none',
                                                fontFamily: 'proxima-nova, sans-serif',
                                                fontWeight: 600,
                                                padding: '8px 32px',
                                                '&:hover': {
                                                    borderColor: '#002270',
                                                    backgroundColor: 'rgba(0,51,146,0.04)'
                                                }
                                            }}
                                        >
                                            Got it
                                        </Button>
                                    </div>
                                )}
                            </Box>
                        </Fade>
                    </Modal>

                    <TrapFocus open disableAutoFocus disableEnforceFocus>
                        <Fade appear={false} in={this.state.bannerOpen}>
                            <Paper
                                elevation={24}
                                role="dialog"
                                aria-modal="false"
                                aria-label="Cookie banner"
                                square
                                variant="outlined"
                                tabIndex={-1}
                                sx={{
                                    position: 'fixed',
                                    right: 0,
                                    m: 0,
                                    p: 2,
                                    borderWidth: 0,
                                    borderTopWidth: 1,
                                    zIndex: 9999,
                                    width: "30% !important",
                                    left: "30px",
                                    bottom: "20px",
                                    borderRadius: "10px",
                                    '@media (max-width: 600px)': {
                                        width: '100% !important',
                                        left: "0px !important"
                                    }
                                }}
                            >
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    justifyContent="space-between"
                                    gap={2}
                                    sx={{ mb: 2 }}
                                >
                                    <Box
                                        sx={{
                                            flexShrink: 1,
                                            alignSelf: { xs: 'flex-start', sm: 'center' }
                                        }}
                                    >
                                        <Typography sx={{
                                            fontSize: "18px"
                                        }} fontWeight="bold">This website uses cookies.</Typography>
                                        <Typography sx={{
                                            fontSize: "12px"
                                        }}>This website uses cookies to provide you with a great experience and to help our website run effectively.
                                            By continuing to use aiPlato, you agree to <Button size="small" href="/termsandcondition" target='_blank'
                                                sx={{
                                                    // lineHeight: 0.50,
                                                    textTransform: "capitalize",
                                                    textDecoration: "underline",
                                                    color: "#000",
                                                    fontSize: "12px",
                                                    padding: "0px",

                                                }}>Terms of Use</Button> and <Button href="/privacypolicy" target='_blank' size="small" sx={{
                                                    // lineHeight: 0.50,
                                                    padding: "0px",
                                                    textTransform: "capitalize",
                                                    textDecoration: "underline",
                                                    color: "#000",
                                                    fontSize: "12px",

                                                }}>Privacy Policy</Button></Typography>


                                    </Box>
                                </Stack>
                                <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="flex-end"
                                    spacing={2}
                                >
                                    <Button size="small" onClick={this.closeBanner} variant="outlined"
                                        sx={{

                                            textTransform: "capitalize",
                                            borderColor: "#000",
                                            color: "#000"
                                        }}>
                                        Dismiss
                                    </Button>
                                </Stack>
                            </Paper>
                        </Fade>
                    </TrapFocus>
                </>
                :
                null
        )
    }
}

export default Home;    
