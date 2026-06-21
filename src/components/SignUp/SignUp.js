import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { SaveUserProfile, getUserDetails, getRoleDetails, websitevisitorsconverted, createPlanCheckoutSession, verifyPayment, savePaymentDetail, setPasswordAfterVerification } from '../../common/API'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Select, MenuItem } from "@mui/material";
import { getIsPrivate, getUserAgent, WEBSITE_URL } from '../../common/Functions';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ClientJS } from 'clientjs';
import { isNil } from 'lodash';
import './SignUp.scss'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const PAYMENT_IDLE = 'idle';
const PAYMENT_REDIRECTING = 'redirecting';
const PAYMENT_VERIFYING = 'verifying';
const PAYMENT_CREATE_PASSWORD = 'create_password';
const PAYMENT_SUCCESS = 'success';
const PAYMENT_ERROR = 'error';

class SignUp extends Component {

    state = {
        loginEmail: '',
        validLoginEmail: true,
        receiveUpdatesChecked: false,
        selectedRole: 'Student',
        disableRole: false,
        disableEmail: false,
        preFilledEmail: '',
        institute: '',
        userClass: '',
        isPrivate: true,
        currentcourses: 0,
        selectedcourse: null,
        useruniqueid: null,
        userSignUpPlan: null,
        isSummitUser: false,
        teacherEmail: '',
        validTeacherEmail: false,
        password: '',
        hideemailfield: false,
        objcurrentcourses: ['Physics', 'Chemistry', 'Calculus', 'Statistics'],
        isOpen: false,
        tEmailUrl: '',
        backtoPlanshow: true,
        showPasswordField: false,
        selectedPlanType: null,
        // Payment states
        paymentStep: PAYMENT_IDLE,
        paymentEmail: '',
        // Actual amount charged (server-resolved per-course price); null until a
        // payment is verified. Used by the success banner instead of the static
        // planDetails price, which can differ from what was really charged.
        paidAmount: null,
        paymentError: '',
        stripeSessionId: '',
        // Password creation after payment (for existing users without password)
        newPassword: '',
        confirmPassword: '',
        showNewPassword: false,
        showConfirmPassword: false,
        settingPassword: false,
        copymesssage: `Dear Students,
I have secured Free access to this AI-powered test-prep platform for Physics, including Practice 
Tests (for entire AP Physics 1, and first semester of AP Physics 1).
To get free access, "https://aiplato.ai/Signup/sponsored" and enter my email in the field "Teacher's Email". 
Here is a short "https://docsend.com/view/fc8dwjbm73dgznbb"  demo of this practice test feature. 
 
 
It is from "https://aiplato.ai", an AI Teaching Assistant for STEM trusted by top universities like Harvard, Rice, and NYU. 
It is developed by Harvard/Stanford educators and ex-Google/Meta AI/ML experts. 

Orientation videos to use the platform effectively.
https://docsend.com/view/h5j5sjjg2uqiff4z
https://docsend.com/view/pjqsqvz6hqf8kczb
https://docsend.com/view/z7arzd7gt9njxw24
                                       
What you get:
 ✓5 Practice Tests with Personalized Test-prep - AP Physics 1
 ✓ Expert-designed, by physics faculty from Harvard University, University of California, etc. 
 ✓ Instant scoring for your test, by AI that analyzes your equations 
 ✓ Immediate step-by-step feedback, and interactive help - to learn to solve problems on your own 
 ✓ 'Proficiency Map' and resources to swiftly address knowledge gaps - to study smarter.

Teacher Tools
✓ After the practice test, students can choose to share with teachers their practice test progress and detailed proficiency map, to enable teachers to help them better`
    }

    planDetails = {
        '30day': { duration: '30-Day Plan', price: '$30', amount: 30, description: 'Ideal for focused revision before exams' },
        '90day': { duration: '90-Day Plan', price: '$75', amount: 75, description: 'Best for structured exam preparation' },
        '6month': { duration: '6-Month Plan', price: '$150', amount: 150, description: 'Designed for long-term preparation' },
        // Institute (Type B) semester access: paid after enrolling via a Class Key.
        // Backend promotes the Class-Key grace entitlement to the semester end.
        // TODO: set the actual institutional price (amount in USD).
        'semester': { duration: 'Semester Access', price: '$99', amount: 99, description: 'Full access for your course this semester' }
    }

    // Price to show in a "Payment confirmed" banner. Prefer the actual amount
    // charged (server-resolved, e.g. a $25 Class-Key price) over the static
    // planDetails price; fall back to the static label before a payment exists.
    confirmedPriceLabel = (planType) => {
        if (this.state.paidAmount != null) {
            return `$${this.state.paidAmount}`;
        }
        return this.planDetails[planType] ? this.planDetails[planType].price : '';
    }

    componentWillMount() {
        this.setState({ isPrivate: getIsPrivate() })
        if (!isNil(window.location.search) && window.location.search !== '') {
            let queryString = '';
            try {
                queryString = window.atob(window.location.search.slice(1));
            } catch (e) {
                queryString = window.location.search.slice(1);
            }
            const queryParamsArray = queryString.split('&');
            queryParamsArray.forEach(param => {
                const [key, value] = param.split('=');
                if (key === 'summit' && value === 'true') {
                    this.setState({ isSummitUser: true });
                }
                if (key === 'temail') {
                    this.setState({ teacherEmail: value === 'teacher@fusd.org' ? 'FreeAccessTeacher@aiPlato.ai' : value });
                    this.setState({ validTeacherEmail: this.validateEmail(value) });
                }
            });
        }
        else {
            this.setState({ validTeacherEmail: true });
        }
    }

    componentDidMount() {
        var userSignUpPlan = this.props.match.params.userplan;
        var userUniqueId = this.props.match.params.useruniqueid;

        if (userSignUpPlan !== undefined && userSignUpPlan !== null && userSignUpPlan !== "") {
            this.state.userSignUpPlan = userSignUpPlan
            this.setState({ userSignUpPlan: userSignUpPlan })
        }

        if (userUniqueId !== undefined && userUniqueId !== null && userUniqueId !== "") {
            this.state.useruniqueid = userUniqueId
            this.setState({ useruniqueid: userUniqueId })
        }

        let queryParameters;
        try {
            queryParameters = new URLSearchParams(window.atob(window.location.search.substring(1)));
        } catch (e) {
            queryParameters = new URLSearchParams(window.location.search);
        }

        const planType = queryParameters.get("plan");
        if (planType && this.planDetails[planType]) {
            this.setState({ selectedPlanType: planType });
        }

        // Check for Stripe return with session_id
        const sessionId = queryParameters.get("session_id");
        if (sessionId) {
            this.setState({
                stripeSessionId: sessionId,
                paymentStep: PAYMENT_VERIFYING,
                selectedPlanType: planType || null
            });
            this.handlePaymentReturn(sessionId);
            return;
        }

        const searchparams = window.location.search
        if (searchparams !== undefined && searchparams !== null && searchparams !== "") {
            if (searchparams === "?c3VtbWl0PXRydWU=") {
                this.setState({ hideemailfield: true, backtoPlanshow: false })
            }
            else {
                this.setState({ hideemailfield: false })
            }
        }
        else if (this.state.userSignUpPlan !== null && this.state.userSignUpPlan !== undefined) {
            if (this.state.userSignUpPlan === "personal") {
                this.setState({ hideemailfield: true })
            }
            else {
                this.setState({ hideemailfield: false })
            }
        }
        else {
            this.setState({ hideemailfield: false })
        }

        const email = queryParameters.get("email")
        if (email !== null) {
            const emailId = email
            this.setState({ preFilledEmail: emailId })

            getUserDetails(emailId.trim()).then(res => {
                this.setState({ selectedRole: res.data.role })
                getRoleDetails(res.data.professor_id).then(res1 => {
                    let json = res1.data
                    for (let count = 0; count < Object.keys(json.Institutes).length; count++) {
                        if (Object.values(json.Institutes)[count].institute_id.toString() === res.data.institute_id.toString()) {
                            this.setState({ institute: Object.keys(json.Institutes)[count].toString() })
                            for (let index = 0; index < Object.values(json.Institutes)[count].classes.length; index++) {
                                if (Object.values(json.Institutes)[count].classes[index].class_id.toString() === res.data.class_id.toString())
                                    this.setState({ userClass: Object.values(json.Institutes)[count].classes[index].name.toString() })
                            }
                        }
                    }
                })
            })

            this.setState({ loginEmail: emailId.trimEnd() })
            this.setState({ validLoginEmail: true })
            this.setState({ disableRole: true })
            this.setState({ disableEmail: true })
        }
    }

    handleRoleChange = (e) => {
        this.setState({ selectedRole: e.target.value })
    }

    handleEmailChange = (event) => {
        const newEmail = event.target.value.trimEnd();
        this.setState({ loginEmail: newEmail });
        this.setState({ validLoginEmail: this.validateEmail(newEmail) });
    }

    handleTeacherEmailChange = (event) => {
        const newEmail = event.target.value.trimEnd();
        this.setState({ teacherEmail: newEmail });
        this.setState({ validTeacherEmail: this.validateEmail(newEmail) });
    }

    validateEmail = (input) => {
        if (input.length == 0) { return true }
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(input);
    }

    onselectcurrentcourses = (e, values) => {
        if (values.length > 0) {
            this.setState({ currentcourses: values[0], selectedcourse: values[0] })
        }
    }

    handleBack = () => {
        window.location.href = "/educator"
    }

    // ---- Stripe Payment Flow ----

    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.state.selectedRole === "0") {
            toast.error("Please fill up all required fields !", {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
            return;
        }

        // If a paid plan is selected, go through Stripe Checkout
        if (this.state.selectedPlanType && this.planDetails[this.state.selectedPlanType]) {
            this.initiateStripeCheckout(event);
            return;
        }

        // Legacy flow (no plan selected) - direct save
        this.saveUserDirectly(event);
    }

    initiateStripeCheckout = (event) => {
        const formEl = event.currentTarget;
        const formData = new FormData(formEl);

        // Save form data to sessionStorage so we can restore it after Stripe redirect
        const formDataObj = {
            firstName: formData.get('firstName') || '',
            lastName: formData.get('lastName') || '',
            email: this.state.loginEmail,
            password: this.state.password,
            role: this.state.selectedRole,
            course: this.state.selectedcourse,
            teacherEmail: this.state.teacherEmail,
            useruniqueid: this.state.useruniqueid,
            userSignUpPlan: this.state.userSignUpPlan,
            isSummitUser: this.state.isSummitUser
        };
        sessionStorage.setItem('signup_form_data', JSON.stringify(formDataObj));

        this.setState({ paymentStep: PAYMENT_REDIRECTING });

        const plan = this.planDetails[this.state.selectedPlanType];

        const data = {
            plan_type: this.state.selectedPlanType,
            email: this.state.loginEmail.trim().toLowerCase(),
            amount: plan.amount,
            origin: window.location.origin
        };

        createPlanCheckoutSession(data)
            .then(res => {
                if (res.data.Success === true || res.data.url) {
                    window.location.href = res.data.url;
                } else {
                    this.setState({ paymentStep: PAYMENT_IDLE });
                    toast.error(res.data.message || "Failed to create checkout session. Please try again.", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                }
            })
            .catch(err => {
                this.setState({ paymentStep: PAYMENT_IDLE });
                toast.error(err.response?.data?.message || "Something went wrong. Please try again.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
                console.error(err.message);
            });
    }

    handlePaymentReturn = (sessionId) => {
        verifyPayment(sessionId)
            .then(res => {
                if (res.data.Success === true) {
                    const email = res.data.email || '';
                    const isRegistered = res.data.is_registered === true;
                    const hasPassword = res.data.has_password === true;
                    const planType = res.data.plan_type || this.state.selectedPlanType;

                    this.setState({
                        paymentEmail: email,
                        selectedPlanType: planType,
                        paidAmount: (res.data.amount_paid != null ? res.data.amount_paid : null)
                    });

                    // Save payment detail. Prefer the actual amount charged
                    // (verify_payment -> amount_paid) over the static client plan
                    // price, since the server resolves the real per-course price
                    // (e.g. a $110 semester) which can differ from planDetails.
                    const paymentData = {
                        email: email,
                        plan_type: planType,
                        amount: (res.data.amount_paid != null ? res.data.amount_paid : (this.planDetails[planType]?.amount || 0)),
                        stripe_session_id: sessionId,
                        payment_status: 'paid'
                    };
                    savePaymentDetail(paymentData).catch(err => console.error('savePaymentDetail error:', err.message));

                    if (!isRegistered) {
                        // New user: create profile with saved form data, then success
                        this.createUserFromSavedData(email);
                    } else if (hasPassword) {
                        // Existing user with password: just show success
                        this.setState({ paymentStep: PAYMENT_SUCCESS });
                        sessionStorage.removeItem('signup_form_data');
                    } else {
                        // Existing user without password: show password creation
                        this.setState({ paymentStep: PAYMENT_CREATE_PASSWORD });
                        sessionStorage.removeItem('signup_form_data');
                    }
                } else {
                    this.setState({
                        paymentStep: PAYMENT_ERROR,
                        paymentError: res.data.message || 'Payment verification failed. Please contact support.'
                    });
                }
            })
            .catch(err => {
                this.setState({
                    paymentStep: PAYMENT_ERROR,
                    paymentError: err.response?.data?.message || 'Something went wrong while verifying payment. Please contact support.'
                });
                console.error(err.message);
            });
    }

    createUserFromSavedData = (email) => {
        const savedData = sessionStorage.getItem('signup_form_data');
        if (!savedData) {
            this.setState({ paymentStep: PAYMENT_SUCCESS });
            return;
        }

        const formDataObj = JSON.parse(savedData);
        const form_data = new FormData();
        form_data.append("Emailid", email);
        form_data.append("Password", formDataObj.password || '');
        form_data.append("Username", (formDataObj.firstName || '') + " " + (formDataObj.lastName || ''));
        form_data.append("course", formDataObj.course || '');
        form_data.append("useruniquecode", formDataObj.useruniqueid || '');
        form_data.append("referURL", document.referrer);
        form_data.append("userPlan", "limitedaccess");
        form_data.append("userAgent", getUserAgent());
        form_data.append("signupmethod", "aiPlato");
        form_data.append("summit", formDataObj.isSummitUser || false);
        form_data.append("role", formDataObj.role || 'Student');
        form_data.append("temail", formDataObj.teacherEmail || '');

        SaveUserProfile(form_data)
            .then(res => {
                const client = new ClientJS();
                const form_data1 = new FormData();
                const fingerprint = client.getFingerprint();
                form_data1.append("userId", fingerprint);
                form_data1.append("converted_from", "S");
                form_data1.append("userdata", email);
                websitevisitorsconverted(form_data1).catch(() => {});

                sessionStorage.removeItem('signup_form_data');
                this.setState({ paymentStep: PAYMENT_SUCCESS });
            })
            .catch(err => {
                console.error(err.message);
                sessionStorage.removeItem('signup_form_data');
                this.setState({ paymentStep: PAYMENT_SUCCESS });
            });
    }

    // Password creation for existing users without password
    handleSetPassword = (e) => {
        e.preventDefault();
        if (this.state.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
            return;
        }
        if (this.state.newPassword !== this.state.confirmPassword) {
            toast.error("Passwords do not match.", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
            return;
        }

        this.setState({ settingPassword: true });

        const data = {
            email: this.state.paymentEmail,
            password: this.state.newPassword
        };

        setPasswordAfterVerification(data)
            .then(res => {
                if (res.data.Success === true || res.data.Success === "Success") {
                    this.setState({ paymentStep: PAYMENT_SUCCESS, settingPassword: false });
                } else {
                    this.setState({ settingPassword: false });
                    toast.error(res.data.message || "Failed to set password. Please try again.", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                }
            })
            .catch(err => {
                this.setState({ settingPassword: false });
                toast.error("Something went wrong. Please try again.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
                console.error(err.message);
            });
    }

    // Legacy direct save (non-payment flow)
    saveUserDirectly = async (event) => {
        const form_data = new FormData(event.currentTarget);
        form_data.append("Username", form_data.get('firstName') + " " + form_data.get('lastName'))
        form_data.append("course", this.state.selectedcourse)
        form_data.append("useruniquecode", this.state.useruniqueid === null ? "" : this.state.useruniqueid)
        form_data.append('referURL', document.referrer);
        form_data.append('userPlan', this.state.userSignUpPlan !== null ? this.state.userSignUpPlan === "personal" ? "limitedaccess" : "fullaccess" : "");
        form_data.append('userAgent', getUserAgent());
        form_data.append("signupmethod", "aiPlato");
        form_data.append("summit", this.state.isSummitUser);
        form_data.delete("firstName")
        form_data.delete("lastName")

        await SaveUserProfile(form_data).then(res => {
            const client = new ClientJS();
            const form_data1 = new FormData();
            const fingerprint = client.getFingerprint();
            form_data1.append("userId", fingerprint)
            form_data1.append('converted_from', "S");
            form_data1.append("userdata", this.state.loginEmail)

            websitevisitorsconverted(form_data1).then(res => {
            })

            if (res.data !== undefined && res.data.Success !== undefined && res.data.Success === "exist") {
                toast.info("User already exists! Please Login to continue...", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                })
                setTimeout(() => {
                    window.location.href = '/login'
                }, 3000);
            }
            else if (res.data !== undefined && res.data.Success === "Not in Check Table") {
                if (this.state.selectedRole === "Student") {
                    setTimeout(() => {
                        window.location.href = '/login'
                    }, 2000);
                }
                else {
                    toast.info("Thanks for reaching out! We will get back to you soon!")
                }
            }
            else {
                toast.success("Sign Up successfully! Please Login to continue..", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                })
                if (this.state.isSummitUser) {
                    this.setState({ tEmailUrl: `https://aiplato.ai/signup?${window.btoa('temail=' + this.state.loginEmail)}` })
                    this.setState({ isOpen: true })
                } else {
                    setTimeout(() => {
                        window.location.href = '/login'
                    }, 3000);
                }
            }
        }).catch(err => {
            toast.error("Error!", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
            console.error(err.message)
        })
    }

    togglePasswordVisibility = () => {
        this.setState(prev => ({ showPasswordField: !prev.showPasswordField }));
    }

    // ---- Payment State Renders ----

    renderPaymentVerifying = () => (
        <div className="signup-card signup-card-centered">
            <CircularProgress size={48} sx={{ color: '#003392', marginBottom: '20px' }} />
            <h2 className="signup-title">Verifying Payment</h2>
            <p className="signup-subtitle">Please wait while we confirm your payment...</p>
        </div>
    )

    renderPaymentRedirecting = () => (
        <div className="signup-card signup-card-centered">
            <CircularProgress size={48} sx={{ color: '#003392', marginBottom: '20px' }} />
            <h2 className="signup-title">Redirecting to Payment</h2>
            <p className="signup-subtitle">You'll be redirected to our secure payment page shortly...</p>
        </div>
    )

    renderPaymentCreatePassword = () => (
        <div className="signup-card">
            <div className="signup-card-centered" style={{ marginBottom: '24px' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 48, color: '#4CAF50', marginBottom: '12px' }} />
                <h2 className="signup-title">Payment Successful!</h2>
                <p className="signup-subtitle">Create a password to complete your account setup</p>
                {this.state.paymentEmail && (
                    <p className="signup-payment-email">{this.state.paymentEmail}</p>
                )}
            </div>

            {this.state.selectedPlanType && this.planDetails[this.state.selectedPlanType] && (
                <div className="signup-plan-banner signup-plan-banner-success">
                    <div className="signup-plan-banner-left">
                        <span className="signup-plan-banner-duration">{this.planDetails[this.state.selectedPlanType].duration}</span>
                        <span className="signup-plan-banner-desc">Payment confirmed</span>
                    </div>
                    <div className="signup-plan-banner-price">{this.confirmedPriceLabel(this.state.selectedPlanType)}</div>
                </div>
            )}

            <form onSubmit={this.handleSetPassword} className="signup-form">
                <div className="signup-input-group">
                    <label className="signup-label">New Password</label>
                    <div className="signup-password-wrapper">
                        <input
                            type={this.state.showNewPassword ? 'text' : 'password'}
                            className="signup-input signup-input-password"
                            placeholder="Minimum 8 characters"
                            value={this.state.newPassword}
                            onChange={(e) => this.setState({ newPassword: e.target.value })}
                            autoFocus
                        />
                        <IconButton onClick={() => this.setState(p => ({ showNewPassword: !p.showNewPassword }))} className="signup-eye-btn" size="small">
                            {this.state.showNewPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                    </div>
                    {this.state.newPassword.length > 0 && this.state.newPassword.length < 8 && (
                        <span className="signup-hint signup-hint-error">Password must be at least 8 characters</span>
                    )}
                </div>

                <div className="signup-input-group">
                    <label className="signup-label">Confirm Password</label>
                    <div className="signup-password-wrapper">
                        <input
                            type={this.state.showConfirmPassword ? 'text' : 'password'}
                            className="signup-input signup-input-password"
                            placeholder="Re-enter your password"
                            value={this.state.confirmPassword}
                            onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                        />
                        <IconButton onClick={() => this.setState(p => ({ showConfirmPassword: !p.showConfirmPassword }))} className="signup-eye-btn" size="small">
                            {this.state.showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                    </div>
                    {this.state.confirmPassword.length > 0 && this.state.newPassword !== this.state.confirmPassword && (
                        <span className="signup-hint signup-hint-error">Passwords do not match</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="signup-submit-btn"
                    disabled={this.state.newPassword.length < 8 || this.state.newPassword !== this.state.confirmPassword || this.state.settingPassword}
                    style={{ width: '100%' }}
                >
                    {this.state.settingPassword ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <CircularProgress size={18} sx={{ color: '#fff' }} /> Setting Password...
                        </span>
                    ) : 'Set Password & Continue'}
                </button>
            </form>
        </div>
    )

    renderPaymentSuccess = () => (
        <div className="signup-card signup-card-centered">
            <CheckCircleOutlineIcon sx={{ fontSize: 56, color: '#4CAF50', marginBottom: '16px' }} />
            <h2 className="signup-title">You're All Set!</h2>

            {this.state.selectedPlanType && this.planDetails[this.state.selectedPlanType] && (
                <div className="signup-plan-banner signup-plan-banner-success" style={{ margin: '20px 0' }}>
                    <div className="signup-plan-banner-left">
                        <span className="signup-plan-banner-duration">{this.planDetails[this.state.selectedPlanType].duration}</span>
                        <span className="signup-plan-banner-desc">Payment confirmed &mdash; your plan is active</span>
                    </div>
                    <div className="signup-plan-banner-price">{this.confirmedPriceLabel(this.state.selectedPlanType)}</div>
                </div>
            )}

            <p className="signup-subtitle" style={{ marginBottom: '24px' }}>
                Your account is ready. Please login to start using aiPlato.
            </p>
            <button className="signup-submit-btn" style={{ width: '100%', maxWidth: '320px' }} onClick={() => { window.location.href = '/login'; }}>
                Go to Login
            </button>
            <button className="signup-secondary-btn" style={{ width: '100%', maxWidth: '320px', marginTop: '12px' }} onClick={() => { window.location.href = '/SignUpPlans'; }}>
                Back to Plans
            </button>
        </div>
    )

    renderPaymentError = () => (
        <div className="signup-card signup-card-centered">
            <ErrorOutlineIcon sx={{ fontSize: 56, color: '#d32f2f', marginBottom: '16px' }} />
            <h2 className="signup-title" style={{ color: '#d32f2f' }}>Payment Verification Failed</h2>
            <p className="signup-subtitle" style={{ marginBottom: '24px' }}>
                {this.state.paymentError || 'We could not verify your payment. Please try again or contact support.'}
            </p>
            <button className="signup-submit-btn" style={{ width: '100%', maxWidth: '320px' }} onClick={() => { window.location.href = '/SignUpPlans'; }}>
                Back to Plans
            </button>
        </div>
    )

    // ---- Main Render ----

    render() {
        const { paymentStep } = this.state;

        // Payment flow states take over the entire page
        if (paymentStep !== PAYMENT_IDLE) {
            return (
                <div className="signup-page">
                    <Container>
                        <Row className="justify-content-center">
                            <Col sm={12} md={10} lg={8}>
                                {paymentStep === PAYMENT_VERIFYING && this.renderPaymentVerifying()}
                                {paymentStep === PAYMENT_REDIRECTING && this.renderPaymentRedirecting()}
                                {paymentStep === PAYMENT_CREATE_PASSWORD && this.renderPaymentCreatePassword()}
                                {paymentStep === PAYMENT_SUCCESS && this.renderPaymentSuccess()}
                                {paymentStep === PAYMENT_ERROR && this.renderPaymentError()}
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
        }

        const canSubmit = !this.state.isSummitUser
            ? this.state.password !== ''
            : this.state.password !== '' && this.state.validLoginEmail;

        const autocompleteSx = {
            '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                minHeight: '48px',
                background: '#fafafa',
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#003392' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#003392', borderWidth: '1.5px' }
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd', borderWidth: '1.5px' }
        };

        const hasPlan = this.state.selectedPlanType && this.planDetails[this.state.selectedPlanType];
        const submitLabel = hasPlan ? `Sign Up & Pay ${this.planDetails[this.state.selectedPlanType].price}` : 'Sign Up';

        return (
            this.state.isPrivate ?
                <>
                    <div className="signup-page">
                        <Container>
                            <Row className="justify-content-center">
                                <Col sm={12} md={10} lg={8}>
                                    <div className="signup-card">
                                        <h2 className="signup-title">
                                            {this.state.isSummitUser ? 'Sign up for Teachers' : 'Sign up for Students'}
                                        </h2>
                                        <p className="signup-subtitle">Create your account to get started</p>

                                        {this.state.backtoPlanshow && (
                                            <Link to="/SignUpPlans" className="signup-back-link">
                                                <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Plans
                                            </Link>
                                        )}

                                        {hasPlan && (
                                            <div className="signup-plan-banner">
                                                <div className="signup-plan-banner-left">
                                                    <span className="signup-plan-banner-duration">{this.planDetails[this.state.selectedPlanType].duration}</span>
                                                    <span className="signup-plan-banner-desc">{this.planDetails[this.state.selectedPlanType].description}</span>
                                                </div>
                                                <div className="signup-plan-banner-price">
                                                    {this.planDetails[this.state.selectedPlanType].price}
                                                </div>
                                            </div>
                                        )}

                                        <form onSubmit={this.handleSubmit} className="signup-form">
                                            <div className="signup-row">
                                                <div className="signup-input-group signup-half">
                                                    <label className="signup-label">First Name</label>
                                                    <input type="text" className="signup-input" name="firstName" autoComplete="given-name" placeholder="First name" autoFocus />
                                                </div>
                                                <div className="signup-input-group signup-half">
                                                    <label className="signup-label">Last Name</label>
                                                    <input type="text" className="signup-input" name="lastName" autoComplete="family-name" placeholder="Last name" />
                                                </div>
                                            </div>

                                            <div className="signup-row">
                                                <div className="signup-input-group signup-half">
                                                    <label className="signup-label">Email Address *</label>
                                                    <input type="email" className="signup-input" name="Emailid" autoComplete="email" placeholder="Enter your email" value={this.state.loginEmail} disabled={this.state.disableEmail} onChange={this.handleEmailChange} required />
                                                    {!this.state.validLoginEmail && (
                                                        <span className="signup-hint signup-hint-error">Invalid email format</span>
                                                    )}
                                                </div>
                                                <div className="signup-input-group signup-half">
                                                    <label className="signup-label">Password *</label>
                                                    <div className="signup-password-wrapper">
                                                        <input type={this.state.showPasswordField ? 'text' : 'password'} className="signup-input signup-input-password" name="Password" autoComplete="new-password" placeholder="Create a password" onChange={(event) => this.setState({ password: event.target.value.trimEnd() })} required />
                                                        <IconButton onClick={this.togglePasswordVisibility} className="signup-eye-btn" size="small">
                                                            {this.state.showPasswordField ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </div>

                                            {!this.state.hideemailfield && !hasPlan && (
                                                <div className="signup-row">
                                                    <div className="signup-input-group signup-half">
                                                        <label className="signup-label">Teacher's Email</label>
                                                        <input type="email" className="signup-input" name="temail" placeholder="Your teacher's email" value={this.state.teacherEmail} disabled={this.state.disableEmail} onChange={this.handleTeacherEmailChange} />
                                                        {!this.state.validTeacherEmail && (
                                                            <span className="signup-hint signup-hint-error">Invalid email format</span>
                                                        )}
                                                        {this.state.teacherEmail === 'FreeAccessTeacher@aiPlato.ai' && (
                                                            <span className="signup-hint signup-hint-info">You can use this prepopulated email for free access if your teacher is not signed up.</span>
                                                        )}
                                                    </div>
                                                    <div className="signup-input-group signup-half">
                                                        <label className="signup-label">STEM Subject</label>
                                                        <Autocomplete multiple fullWidth onChange={this.onselectcurrentcourses} options={this.state.objcurrentcourses}
                                                            getOptionDisabled={(option) => option === this.state.objcurrentcourses[1] || option === this.state.objcurrentcourses[2] || option === this.state.objcurrentcourses[3]}
                                                            renderInput={(params) => (<TextField {...params} placeholder='Select subject' variant="outlined" size="small" sx={autocompleteSx} />)} />
                                                    </div>
                                                </div>
                                            )}

                                            {(this.state.hideemailfield || hasPlan) && (
                                                <div className="signup-input-group">
                                                    <label className="signup-label">STEM Subject of Interest</label>
                                                    <Autocomplete multiple fullWidth onChange={this.onselectcurrentcourses} options={this.state.objcurrentcourses}
                                                        getOptionDisabled={(option) => option === this.state.objcurrentcourses[1] || option === this.state.objcurrentcourses[2] || option === this.state.objcurrentcourses[3]}
                                                        renderInput={(params) => (<TextField {...params} placeholder='Select subject' variant="outlined" size="small" sx={autocompleteSx} />)} />
                                                </div>
                                            )}

                                            {(this.state.disableRole || this.state.isSummitUser) && (
                                                <div className="signup-row">
                                                    <div className="signup-input-group signup-half">
                                                        <label className="signup-label">Institute</label>
                                                        <input type="text" className="signup-input" name="institute" placeholder="Your institute" />
                                                    </div>
                                                    <div className="signup-input-group signup-half">
                                                        <label className="signup-label">Number of STEM Students</label>
                                                        <input type="number" className="signup-input" name="noOfStudents" placeholder="Number of students" />
                                                    </div>
                                                </div>
                                            )}

                                            {this.state.disableRole && (
                                                <div className="signup-input-group">
                                                    <label className="signup-label">User Class</label>
                                                    <input type="text" className="signup-input" name="class" value={this.state.userClass} disabled />
                                                </div>
                                            )}

                                            {!this.state.isSummitUser && (
                                                <div className="signup-input-group">
                                                    <label className="signup-label">Role *</label>
                                                    <Select name="role" id="userRole" required fullWidth onChange={this.handleRoleChange} value={this.state.selectedRole} disabled={this.state.disableRole}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                sx: {
                                                                    '& .MuiList-root': {
                                                                        display: 'flex',
                                                                        flexDirection: 'column'
                                                                    },
                                                                    '& .MuiMenuItem-root': {
                                                                        display: 'flex',
                                                                        width: '100%',
                                                                        justifyContent: 'flex-start',
                                                                        textAlign: 'left',
                                                                        padding: '10px 16px'
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        sx={{
                                                            borderRadius: '10px', height: '48px', background: '#fafafa',
                                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd', borderWidth: '1.5px' },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#003392' },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#003392', borderWidth: '1.5px' }
                                                        }}>
                                                        <MenuItem value="0" disabled>Select Role</MenuItem>
                                                        <MenuItem value="Professor">Professor</MenuItem>
                                                        <MenuItem value="TA">Assistant Teacher / Teaching Assistant</MenuItem>
                                                        <MenuItem value="Student">Student</MenuItem>
                                                    </Select>
                                                </div>
                                            )}

                                            <div className="signup-actions">
                                                <button type="button" className="signup-secondary-btn" onClick={() => window.location.href = '/signUpPlans'}>
                                                    Back
                                                </button>
                                                <button type="submit" className="signup-submit-btn" disabled={!canSubmit}>
                                                    {submitLabel}
                                                </button>
                                            </div>

                                            {hasPlan && (
                                                <p className="signup-payment-note">
                                                    You will be redirected to Stripe for secure payment
                                                </p>
                                            )}

                                            <div className="signup-login-link">
                                                Already have an account? <Link to="/login">Login</Link>
                                            </div>
                                        </form>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>

                    <Modal open={this.state.isOpen} onClose={() => this.setState({ isOpen: false })} aria-describedby="modal-modal-description" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className='signup-modal-content'>
                            <div className='signup-modal-header'>
                                <h3>Welcome to aiPlato!</h3>
                                <IconButton onClick={() => this.setState({ isOpen: false })} size="small">
                                    <CloseIcon />
                                </IconButton>
                            </div>
                            <hr />
                            <div className='copymaindiv'>
                                <p>
                                    ✅ You have now educator-level access to explore practice tests.<br />
                                    ✅ If your students need access, they should sign up using your email address.<br />
                                    ✅ For full educator-level access and classroom management features, request a pilot.
                                </p>
                                <p>Please share the following message with your students to grant them access.</p>
                                <p>Dear Students,</p>
                                <p>I have secured free access to this AI-powered test-prep platform for Physics, including Practice Tests (for entire AP Physics 1, and first semester of AP Physics 1). To get free access, visit 'https://aiplato.ai/Signup/sponsored' and enter my email in the field 'Teacher's Email'.</p>
                                <p>Here is a short 'https://docsend.com/view/fc8dwjbm73dgznbb' demo of this practice test feature.</p>
                                <p>It is from 'https://aiplato.ai', an AI Teaching Assistant for STEM trusted by top universities like Harvard, Rice, and NYU. It is developed by Harvard/Stanford educators and ex-Google/Meta AI/ML experts.</p>
                                <p>
                                    Orientation videos:
                                    <br />
                                    <ul>
                                        <li><a href="https://docsend.com/view/h5j5sjjg2uqiff4z" target="_blank" rel="noreferrer">How to use Practice Tests</a></li>
                                        <li><a href="https://docsend.com/view/pjqsqvz6hqf8kczb" target="_blank" rel="noreferrer">aiPlato Usage Guide</a></li>
                                        <li><a href="https://docsend.com/view/z7arzd7gt9njxw24" target="_blank" rel="noreferrer">Demo of Problem Solving</a></li>
                                    </ul>
                                </p>
                                <h4>What you get:</h4>
                                <ul>
                                    <li>5 Practice Tests with Personalized Test-prep - AP Physics 1</li>
                                    <li>Expert-designed, by physics faculty from Harvard University, University of California, etc.</li>
                                    <li>Instant scoring for your test, by AI that analyzes your equations</li>
                                    <li>Immediate step-by-step feedback, and interactive help</li>
                                    <li>'Proficiency Map' and resources to swiftly address knowledge gaps</li>
                                </ul>
                                <h4>Teacher Tools:</h4>
                                <ul>
                                    <li>After the practice test, students can choose to share with teachers their practice test progress and detailed proficiency map.</li>
                                </ul>
                            </div>
                            <div className='signup-modal-footer'>
                                <button className='signup-submit-btn' onClick={() => { navigator.clipboard.writeText(this.state.copymesssage) }}>Copy Message</button>
                            </div>
                        </div>
                    </Modal>
                </>
                :
                null
        )
    }
}

export default withRouter(SignUp);
