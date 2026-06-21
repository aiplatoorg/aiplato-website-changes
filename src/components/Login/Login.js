import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';
import { checkCredentialsAPI, getcoursesbyinstituteid, passwordresetsendemail, createPlanCheckoutSession, verifyTeacherAccessCode } from '../../common/API'
import { toast } from 'react-toastify';
import { APP_URL, WEBSITE_URL, getIsPrivate, setCookies, setCourse, showFullApp } from '../../common/Functions';
import { isNil, isEmpty } from 'lodash';
import './Login.scss';
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'universal-cookie';

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    height: 'fit-content'
};
const stylefp = {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    height: 'fit-content'
};

const style1 = {
    my: 1,
    mx: 'auto',
    width: ['100%', 500]
}

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            validLoginEmail: false,
            password: '',
            showPassword: false,
            redirectToQue: '',
            sessionId: '',
            isPrivate: false,
            showHeader: true,
            isForgotPasswordClicked: false,
            loading: false,
            hasAutoLogin: true,
            showTrialExpired: false,
            // Class-Key (enrollment) student whose 14-day grace lapsed unpaid, or
            // any other entitlement-expired cohort: login is blocked, so this is
            // the ONLY place they can pay (the in-app grace banner is unreachable).
            showAccessExpired: false,
            accessExpiredPaying: false,
            // Locked-out (expired) student settling with a bookstore code instead
            // of paying online — the in-app grace banner is unreachable once blocked.
            showRedeemFromLogin: false,
            redeemCode: '',
            redeemingFromLogin: false,
            redeemError: ''
        }
    }

    componentWillMount() {
        document.cookie = "hasTestPrep=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.setState({ isPrivate: getIsPrivate() })
    }

    componentDidMount() {
        this.getURLParams()
        if (this.props.showHeader !== undefined) {
            this.setState({ showHeader: this.props.showHeader })
        }
    }

    getURLParams = () => {
        const queryParameters = new URLSearchParams(window.location.search.substring(1));
        let assignmentId = ''
        let assignmentStr = '';
        let paymentStatus = ''
        if (!isNil(queryParameters) && queryParameters.size > 0) {
            if (!isNil(queryParameters.get("external_id"))) {
                if (!isNil(queryParameters.get('course_id'))) {
                    setCourse(queryParameters.get('course_id'));
                }
                if (!isNil(queryParameters.get('assignment_id'))) {
                    assignmentId = queryParameters.get('assignment_id')
                }
                if (!isNil(queryParameters.get('assignment_str'))) {
                    assignmentStr = queryParameters.get('assignment_str')
                }
                if (!isNil(queryParameters.get('registered'))) {
                    paymentStatus = (queryParameters.get('registered'))
                }
                this.getEarlyAccessHandler(null, queryParameters.get("external_id"), assignmentId, !isNil(queryParameters.get('role')) ? queryParameters.get('role') : '', !isNil(queryParameters.get('registered')) ? (queryParameters.get('registered') === 'not_started' || queryParameters.get('registered') === 'expired') ? false : true : true, assignmentStr, paymentStatus);
                return;
            } else {
                this.setState({ hasAutoLogin: false })
            }
            if (!isNil(queryParameters.get("sessionId"))) {
                this.setState({ sessionId: queryParameters.get("sessionId") })
            }
            if (!isNil(queryParameters.get('fromQue'))) {
                this.setState({ redirectToQue: queryParameters.get('fromQue').toString() });
            }

        } else {
            this.setState({ hasAutoLogin: false })
        }

    }
    validateEmail = (input) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(input);
    }

    handleEmailChange = (event) => {
        const newEmail = event.target.value;
        this.setState({ loginEmail: newEmail });
        this.setState({ validLoginEmail: this.validateEmail(newEmail) });
    }

    togglePasswordVisibility = () => {
        this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
    }

    // Pay for Semester Access from the login screen when access has expired.
    // The entered email identifies the account; the backend resolves the real
    // per-course price and, on success, promotes the entitlement so the student
    // can log back in.
    handlePaySemesterFromLogin = () => {
        const email = this.state.loginEmail.trim().toLowerCase();
        this.setState({ accessExpiredPaying: true });
        createPlanCheckoutSession({
            plan_type: 'semester',
            email: email,
            origin: window.location.origin
        })
            .then(res => {
                if (res.data && res.data.url) {
                    window.location.href = res.data.url;
                } else {
                    this.setState({ accessExpiredPaying: false });
                    toast.error(res.data?.error || "Couldn't start checkout. Please try again.", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                }
            })
            .catch(err => {
                this.setState({ accessExpiredPaying: false });
                toast.error("Something went wrong starting checkout. Please try again.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
                console.error(err.message);
            });
    }

    // Redeem a bookstore access code from the login screen for a locked-out
    // (access-expired) student. Upgrades their entitlement (expired -> bookstore)
    // and consumes the single-use code, then re-attempts login automatically.
    handleRedeemFromLogin = (e) => {
        if (e) { e.preventDefault(); }
        const trimmed = (this.state.redeemCode || '').trim();
        if (!trimmed) {
            this.setState({ redeemError: 'Please enter your access code.' });
            return;
        }
        this.setState({ redeemingFromLogin: true, redeemError: '' });
        verifyTeacherAccessCode({
            first_name: '',
            last_name: '',
            email: this.state.loginEmail.trim().toLowerCase(),
            access_code: trimmed,
            share_report_with_professor: true
        })
            .then(res => {
                const ok = res.data && (res.data.Success === true || res.data.Success === 'Success');
                if (ok) {
                    // Entitlement upgraded to bookstore; retry login automatically.
                    this.setState({ redeemingFromLogin: false, showAccessExpired: false, showRedeemFromLogin: false, redeemCode: '' });
                    toast.success('Code redeemed! Signing you in…', {
                        position: toast.POSITION.BOTTOM_RIGHT, autoClose: true, style: { borderRadius: '10px' }
                    });
                    this.getEarlyAccessHandler();
                } else {
                    this.setState({ redeemingFromLogin: false, redeemError: (res.data && res.data.message) || 'Could not redeem this code.' });
                }
            })
            .catch(err => {
                const msg = err.response && err.response.data && err.response.data.message;
                this.setState({ redeemingFromLogin: false, redeemError: msg || 'Could not redeem this code. Please try again.' });
            });
    }
    // encryptPassword = (password) => {
    //     return CryptoJS.AES.encrypt(password, "sDJwT4ZG2NBj4wOa3rR3A76jtzZqZ9SkZ8uQ4V2s5Go=").toString();
    // };

    getEarlyAccessHandler = (e, external_id = '', assignment_id = '', role = '', registered = true, assignmentCollection = '', paymentStatus = '') => {
        if (!isNil(e)) {
            e.preventDefault()
        }

        if (this.state.password.length > 0 || external_id !== '') {
            let data = external_id === '' ? { 'email': this.state.loginEmail.trim().toLowerCase(), password: (this.state.password.trim()), signupmethod: "aiPlato" } : { 'external_id': external_id }

            checkCredentialsAPI(data).then(res => {
                if (res.status === 200) {
                    if (res.data['found'] === true && res.data.status === "Active") {
                        this.addValidationCookie(res.data.email.trim().toLowerCase(),
                            res.data.userId,
                            res.data.role,
                            res.data.name,
                            res.data.status,
                            res.data.tryThisPinsEnabled,
                            res.data.QATestFlag,
                            this.convertDurationToSeonds(res.data.timeLimit),
                            res.data.institute_id,
                            res.data.institute_name,
                            (isNil(res.data.user_timezone) || isEmpty(res.data.user_timezone)) ? "America/New_York" : res.data.user_timezone,
                            res.data.isDemoUser,
                            res.data.isPtTeacher,
                            res.data.menuselecteditem,
                            res.data.isAdminUser,
                            res.data.userPlan,
                            res.data.user_professor_id,
                            res.data.isTA,
                            res.data.isinternaluser,
                            registered,
                            assignmentCollection,
                            paymentStatus,
                            external_id,
                            res.data.signupmethod || ''
                        )

                        this.getUserCourse(res, external_id, assignment_id, role, registered, assignmentCollection, paymentStatus)

                    }
                    else if (res.data['trial_expired'] === true) {
                        toast.error("Your 7-day free trial has expired. Please subscribe to continue using aiPlato.", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 8000,
                            style: { borderRadius: "10px" }
                        });
                        this.setState({ showTrialExpired: true, shoowearlyaccess: false, showemaildiv: true })
                    }
                    else if (res.data['access_expired'] === true) {
                        toast.error(res.data.error || "Your access has expired. Please pay for Semester Access to continue.", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 8000,
                            style: { borderRadius: "10px" }
                        });
                        this.setState({ showAccessExpired: true, showTrialExpired: false, shoowearlyaccess: false, showemaildiv: true })
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
        }

    }
    addValidationCookie = (email, userId, role, name, status, tryThisPinsEnabled, QATestFlag, timeLimit, institute_id, institute_name, usertimezone, isDemoUserFlagged, isPtTeacher, menuselecteditem, isAdminUser, userPlan, user_professor_id, isTA, isinternaluser, registered, assignmentCollection, paymentStatus, external_id, signupmethod) => {
        setCookies(email, userId, role, name, status, tryThisPinsEnabled, QATestFlag, timeLimit, institute_id, institute_name, usertimezone, "", false, isDemoUserFlagged, isPtTeacher, menuselecteditem, isAdminUser, userPlan, user_professor_id, isTA, isinternaluser, registered, assignmentCollection, paymentStatus, external_id, signupmethod)
    }

    getUserCourse = (res, external_id, assignment_id, role, registered, assignmentCollection, paymentStatus) => {
        const reqData = { params: { "user_id": res.data.userId } };
        getcoursesbyinstituteid(reqData)
            .then(response => {
                if (response.data.data !== undefined && response.data.data !== null) {
                    let cookies = new Cookies();
                    let menuselecteditem = cookies.get("menuselecteditem")
                    if (menuselecteditem !== undefined && menuselecteditem !== null && menuselecteditem !== "") {
                        let hasExistingSelectedItem = false
                        response.data.data.forEach(element => {
                            if (element.value === parseInt(menuselecteditem)) {
                                hasExistingSelectedItem = true;
                                cookies.set('hasTestPrep', element.enabletestprep)
                            }
                        });

                        if (!hasExistingSelectedItem) {
                            if (response.data.data.length > 0) {
                                cookies.set('menuselecteditem', response.data.data[0].value)
                                cookies.set('hasTestPrep', response.data.data[0].enabletestprep)
                            }
                        }
                    }
                    else {
                        if (response.data.data.length > 0) {
                            cookies.set('menuselecteditem', response.data.data[0].value)
                            cookies.set('hasTestPrep', response.data.data[0].enabletestprep)
                        }
                    }

                    if (this.state.redirectToQue === 'true') {
                        window.location.href = `/question/?sessionId=${this.state.sessionId}`
                    }
                    else if (Number(res.data.institute_id) !== 1) {
                        if (assignment_id === '' || role.toLowerCase() === 'professor') {
                            window.open(APP_URL + "assignments", '_self')
                        } else if (!registered && external_id !== '' && assignment_id !== '') {
                            window.open(APP_URL + "payment/" + assignment_id, '_self')
                        } else {
                            window.open(APP_URL + "assignmentdetails/" + assignment_id, '_self')
                        }
                    } else {
                        if (showFullApp()) {
                            window.open(APP_URL + "curriculum-problems", '_self')
                        } else {
                            window.open(APP_URL, '_self')
                        }

                        this.setState({ email: '', password: '', showPassword: false });
                        this.setState({ shoowearlyaccess: true, showemaildiv: false, showdropdown: true, studenttutorvalue: "", buttontext: "Request Access" })
                    }

                }
            })
            .catch(err => {
                console.error(err.message)
                this.setState({ loading: false })
            })
    }
    convertDurationToSeonds = (duration) => {
        const a = duration.split(':');
        return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    }

    handleforgotpassword = () => {
        this.setState({ isForgotPasswordClicked: true, loginEmail: '', password: '' })
    }
    handlecancelforgotpassword = () => {
        this.setState({ isForgotPasswordClicked: false, loginEmail: '', password: '' })
    }
    handleresetPassword = () => {
        this.setState({ loading: true })
        const resparams = {
            "useremail": this.state.loginEmail
        }
        passwordresetsendemail(resparams).then(res => {
            if (res.status === 200) {
                this.setState({ loading: false })
                if (res.data === "0") {
                    toast.error("Please check entered email address, it does not exist in the system.", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
                else {
                    toast.info("Your password has been successfully reset, and a new password has been sent to your registered email address.", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    this.setState({ isForgotPasswordClicked: false, loginEmail: '', password: '' })
                }
            }
        }).catch(err => {
            console.error(err.message)
            this.setState({ loading: false })
        })


    }

    render() {

        return (

            <>
                {
                    !this.state.hasAutoLogin ?

                        <div className='fwidth'>
                            {this.state.showHeader ?
                                <div className="banner-pt container-fluid bg-gray1 pb-3">
                                    <Container className="gradientBannerBg">
                                        <div className="col-12 col-md-12 col-lg-12">
                                            <div className='homeBannerHead1'>
                                                <h1>AI Teaching Assistant for STEM</h1> <h3>Developed by Educators, for Educators</h3>
                                            </div>
                                        </div>
                                    </Container>
                                </div>
                                : null
                            }
                            <div className="container-fluid px-0">
                                <Container className='pt-2 pt-md-5'>
                                    {
                                        !this.state.isForgotPasswordClicked ? (<Box component="form" onSubmit={this.getEarlyAccessHandler} sx={this.state.showHeader ? style1 : style} className='whiteBG signup'>
                                            {this.state.showHeader ?
                                                <Typography component="h1" variant="h5">
                                                    Login
                                                </Typography>
                                                : null
                                            }
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email Address/User Id"
                                                name="email"
                                                autoComplete="email"
                                                autoFocus
                                                value={this.state.loginEmail}
                                                onChange={this.handleEmailChange}
                                            // error={!this.state.validLoginEmail}
                                            // helperText={!this.state.validLoginEmail ? 'Invalid email format' : ''}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password"
                                                type={this.state.showPassword ? "text" : "password"}
                                                id="password"
                                                value={this.state.password}
                                                onChange={(e) => this.setState({ password: e.target.value })}
                                                autoComplete="current-password"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label={this.state.showPassword ? "Hide password" : "Show password"}
                                                                onClick={this.togglePasswordVisibility}
                                                                edge="end"
                                                                sx={{
                                                                    backgroundColor: 'transparent',
                                                                    '&:hover': {
                                                                        backgroundColor: 'transparent',
                                                                    },
                                                                    '&:focus': {
                                                                        backgroundColor: 'transparent',
                                                                    },
                                                                }}
                                                            >
                                                                {this.state.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <Button variant="text" sx={{ textTransform: "capitalize", cursor: "pointer" }} onClick={this.handleforgotpassword}>Forgot Password</Button>

                                            {this.state.loginEmail !== '' ? <Button className='btnmain' type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Sign In </Button>
                                                : <Button className='btnmain' style={{ cursor: ' not-allowed' }} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Sign In </Button>}

                                            {this.state.showTrialExpired && (
                                                <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '12px 16px', marginTop: '10px', textAlign: 'center' }}>
                                                    <Typography variant="body2" style={{ color: '#856404', fontWeight: 500 }}>
                                                        Your 7-day free trial has expired. Please subscribe to continue using aiPlato.
                                                    </Typography>
                                                    {this.state.showHeader ?
                                                        <Link to="/signUpPlans" style={{ color: '#164b99', fontWeight: 600, marginTop: '6px', display: 'inline-block' }}>
                                                            Subscribe Now
                                                        </Link>
                                                        :
                                                        <a href={WEBSITE_URL + "signUpPlans"} style={{ color: '#164b99', fontWeight: 600, marginTop: '6px', display: 'inline-block' }}>
                                                            Subscribe Now
                                                        </a>
                                                    }
                                                </div>
                                            )}

                                            {this.state.showAccessExpired && (
                                                <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '12px 16px', marginTop: '10px', textAlign: 'center' }}>
                                                    <Typography variant="body2" style={{ color: '#856404', fontWeight: 500, marginBottom: '8px' }}>
                                                        Your access has expired. Pay for Semester Access to keep using aiPlato for the term.
                                                    </Typography>
                                                    <Button
                                                        className='btnmain'
                                                        variant="contained"
                                                        onClick={this.handlePaySemesterFromLogin}
                                                        disabled={this.state.accessExpiredPaying || this.state.loginEmail === ''}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        {this.state.accessExpiredPaying ? 'Redirecting…' : 'Pay Semester Access'}
                                                    </Button>

                                                    {!this.state.showRedeemFromLogin ? (
                                                        <div style={{ marginTop: '8px' }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => this.setState({ showRedeemFromLogin: true, redeemError: '' })}
                                                                style={{ background: 'none', border: 'none', color: '#164b99', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', padding: 0 }}
                                                            >
                                                                Already bought a code at the bookstore? Redeem it
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <form onSubmit={this.handleRedeemFromLogin} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                                            <TextField
                                                                size="small"
                                                                label="Access code"
                                                                placeholder="Enter your code"
                                                                value={this.state.redeemCode}
                                                                onChange={(ev) => this.setState({ redeemCode: ev.target.value, redeemError: '' })}
                                                                fullWidth
                                                            />
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <Button type="submit" className='btnmain' variant="contained" disabled={this.state.redeemingFromLogin || this.state.loginEmail === ''}>
                                                                    {this.state.redeemingFromLogin ? 'Redeeming…' : 'Redeem'}
                                                                </Button>
                                                                <Button type="button" variant="text" onClick={() => this.setState({ showRedeemFromLogin: false, redeemError: '', redeemCode: '' })}>
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </form>
                                                    )}
                                                    {this.state.redeemError
                                                        ? <Typography variant="body2" style={{ color: '#a12020', marginTop: '6px' }}>{this.state.redeemError}</Typography>
                                                        : null}
                                                </div>
                                            )}

                                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>OR</div>
                                            {/* <GoogleLoginPage></GoogleLoginPage> */}
                                            <Grid container>
                                                {/* <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?bt
                            </Link>
                        </Grid>  */}
                                                {this.state.showHeader ?
                                                    <Grid item style={{ marginTop: '10px' }}>
                                                        <Link target="_self" to="/signUpPlans" variant="body2">
                                                            {"Don't have an account? Sign Up"}
                                                        </Link>
                                                    </Grid>
                                                    :
                                                    <Grid item style={{ marginTop: '10px' }}>
                                                        <a href={WEBSITE_URL + "signUpPlans"}>
                                                            {"Don't have an account? Sign Up"}
                                                        </a>
                                                    </Grid>
                                                }
                                            </Grid>

                                        </Box>) : (
                                            <Box component="form" sx={stylefp} className='whiteBG '>

                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label="Email Address"
                                                    name="email"
                                                    autoComplete="email"
                                                    autoFocus
                                                    value={this.state.loginEmail}
                                                    onChange={this.handleEmailChange}
                                                />
                                                <Button variant="contained" sx={{ textTransform: "capitalize", mt: 2 }} onClick={this.handleresetPassword}> Reset Password </Button>
                                                <Button variant="outlined" sx={{ textTransform: "capitalize", marginLeft: "6px", mt: 2 }} onClick={this.handlecancelforgotpassword}> Cancel </Button>
                                            </Box>)
                                    }

                                </Container>
                            </div>
                        </div>

                        :
                        null
                }

                {this.state.loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            color: "#164b99",
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}

            </>
        )
    }
}

export default withRouter(Login);