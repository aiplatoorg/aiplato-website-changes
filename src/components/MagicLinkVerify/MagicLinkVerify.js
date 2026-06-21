import React, { Component } from 'react';
import { Row, Col, Container } from "react-bootstrap";
import { toast } from 'react-toastify';
import { verifyMagicLinkToken, setPasswordAfterVerification, createPlanCheckoutSession } from '../../common/API';
import { WEBSITE_URL } from '../../common/Functions';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import './MagicLinkVerify.scss';

const STEP_VERIFYING = 'verifying';
const STEP_VERIFIED = 'verified';
const STEP_CREATE_PASSWORD = 'create_password';
const STEP_ALREADY_REGISTERED = 'already_registered';
const STEP_SUCCESS = 'success';
const STEP_ERROR = 'error';
const STEP_EXPIRED = 'expired';

class MagicLinkVerify extends Component {
    state = {
        currentStep: STEP_VERIFYING,
        email: '',
        token: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        settingPassword: false,
        errorMessage: '',
        signupMethod: 'tryitout',
        // Type B (Class Key): activated on a grace window, Semester Access still due.
        requiresPayment: false,
        accessExpiresAt: null,
        payingSemester: false,
        // access_kind: 'instructor' (free), 'bookstore' (paid semester), or
        // 'grace' (Class-Key enrolled, payment due). Drives the success screen.
        accessKind: 'instructor',
        courseName: null,
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            this.setState({
                currentStep: STEP_ERROR,
                errorMessage: 'Invalid verification link. No token found in the URL.'
            });
            return;
        }

        this.setState({ token }, () => {
            this.verifyToken(token);
        });
    }

    verifyToken = (token) => {
        verifyMagicLinkToken({ token })
            .then(res => {
                if (res.data.Success === true || res.data.Success === "Success") {
                    const email = res.data.email || '';
                    const isRegistered = res.data.is_registered === true;
                    const signupMethod = res.data.signup_method || 'tryitout';

                    this.setState({
                        currentStep: STEP_VERIFIED,
                        email: email,
                        signupMethod: signupMethod
                    });

                    setTimeout(() => {
                        if (isRegistered) {
                            this.setState({ currentStep: STEP_ALREADY_REGISTERED });
                        } else {
                            this.setState({ currentStep: STEP_CREATE_PASSWORD });
                        }
                    }, 1500);
                } else if (res.data.expired === true) {
                    this.setState({
                        currentStep: STEP_EXPIRED,
                        errorMessage: 'This verification link has expired. Please request a new one.'
                    });
                } else {
                    this.setState({
                        currentStep: STEP_ERROR,
                        errorMessage: res.data.message || 'Invalid or expired verification link.'
                    });
                }
            })
            .catch(err => {
                console.error(err.message);
                this.setState({
                    currentStep: STEP_ERROR,
                    errorMessage: 'Something went wrong while verifying your email. Please try again.'
                });
            });
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    handleConfirmPasswordChange = (e) => {
        this.setState({ confirmPassword: e.target.value });
    }

    togglePasswordVisibility = () => {
        this.setState(prev => ({ showPassword: !prev.showPassword }));
    }

    toggleConfirmPasswordVisibility = () => {
        this.setState(prev => ({ showConfirmPassword: !prev.showConfirmPassword }));
    }

    isPasswordValid = () => {
        const { password } = this.state;
        return password.length >= 8;
    }

    doPasswordsMatch = () => {
        const { password, confirmPassword } = this.state;
        return password === confirmPassword && confirmPassword.length > 0;
    }

    handleSetPassword = (e) => {
        e.preventDefault();

        if (!this.isPasswordValid()) {
            toast.error("Password must be at least 8 characters long.", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
            return;
        }

        if (!this.doPasswordsMatch()) {
            toast.error("Passwords do not match.", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
            return;
        }

        this.setState({ settingPassword: true });

        const data = {
            token: this.state.token,
            email: this.state.email,
            password: this.state.password
        };

        setPasswordAfterVerification(data)
            .then(res => {
                if (res.data.Success === true || res.data.Success === "Success") {
                    this.setState({
                        currentStep: STEP_SUCCESS,
                        settingPassword: false,
                        requiresPayment: res.data.requires_payment === true,
                        accessExpiresAt: res.data.access_expires_at || null,
                        accessKind: res.data.access_kind || 'instructor',
                        courseName: res.data.course_name || null
                    });
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
                console.error(err.message);
                toast.error("Something went wrong. Please try again.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            });
    }

    goToHome = () => {
        window.open(WEBSITE_URL, '_self');
    }

    goToLogin = () => {
        window.open(WEBSITE_URL + 'login', '_self');
    }

    renderVerifying() {
        return (
            <div className="mlv-step-container">
                <CircularProgress size={60} sx={{ color: '#003392', marginBottom: '24px' }} />
                <h2 className="mlv-title">Verifying Your Email</h2>
                <p className="mlv-subtitle">Please wait while we verify your email...</p>
            </div>
        );
    }

    renderVerified() {
        return (
            <div className="mlv-step-container">
                <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#4CAF50', marginBottom: '16px' }} />
                <h2 className="mlv-title">Email Verified!</h2>
                <p className="mlv-subtitle">
                    Your email <strong>{this.state.email}</strong> has been verified successfully.
                </p>
            </div>
        );
    }

    renderCreatePassword() {
        const { password, confirmPassword, showPassword, showConfirmPassword, settingPassword } = this.state;
        const canSubmit = this.isPasswordValid() && this.doPasswordsMatch() && !settingPassword;

        return (
            <div className="mlv-step-container" style={{width:"100%"}}>
                <CheckCircleOutlineIcon sx={{ fontSize: 48, color: '#4CAF50', marginBottom: '8px' }} />
                <h2 className="mlv-title">Create Your Password</h2>
                <p className="mlv-subtitle">
                    Email verified: <strong>{this.state.email}</strong>
                </p>
                <p className="mlv-description">
                    {this.state.signupMethod === 'instructor_access'
                        ? 'Please create a password for your account. You have full access provided by your instructor.'
                        : <>Please create a password for your account. Your account will be active for <strong>7 days</strong>.</>
                    }
                </p>

                <form onSubmit={this.handleSetPassword} className="mlv-form">
                    <div className="mlv-input-group">
                        <label className="mlv-label">Password</label>
                        <div className="mlv-password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="mlv-input"
                                value={password}
                                onChange={this.handlePasswordChange}
                                placeholder="Enter password (min. 8 characters)"
                                autoFocus
                            />
                            <IconButton
                                onClick={this.togglePasswordVisibility}
                                className="mlv-eye-btn"
                                size="small"
                            >
                                {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                        </div>
                        {password.length > 0 && password.length < 8 && (
                            <span className="mlv-hint mlv-hint-error">Password must be at least 8 characters</span>
                        )}
                        {password.length >= 8 && (
                            <span className="mlv-hint mlv-hint-success">Password strength: Good</span>
                        )}
                    </div>

                    <div className="mlv-input-group">
                        <label className="mlv-label">Confirm Password</label>
                        <div className="mlv-password-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="mlv-input"
                                value={confirmPassword}
                                onChange={this.handleConfirmPasswordChange}
                                placeholder="Re-enter your password"
                            />
                            <IconButton
                                onClick={this.toggleConfirmPasswordVisibility}
                                className="mlv-eye-btn"
                                size="small"
                            >
                                {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                        </div>
                        {confirmPassword.length > 0 && !this.doPasswordsMatch() && (
                            <span className="mlv-hint mlv-hint-error">Passwords do not match</span>
                        )}
                        {this.doPasswordsMatch() && (
                            <span className="mlv-hint mlv-hint-success">Passwords match</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="mlv-submit-btn"
                        disabled={!canSubmit}
                    >
                        {settingPassword ? 'Setting up your account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        );
    }

    renderAlreadyRegistered() {
        return (
            <div className="mlv-step-container">
                <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#4CAF50', marginBottom: '16px' }} />
                <h2 className="mlv-title">Email Verified!</h2>
                <p className="mlv-subtitle">
                    Your email <strong>{this.state.email}</strong> has been verified successfully.
                </p>
                <p className="mlv-description">
                    You already have an account with us. Please login with your existing credentials to continue.
                </p>
                <div className="mlv-action-buttons">
                    <button className="mlv-submit-btn" onClick={this.goToLogin}>
                        Go to Login
                    </button>
                    <button className="mlv-secondary-btn" onClick={this.goToHome}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    handlePaySemester = () => {
        this.setState({ payingSemester: true });
        createPlanCheckoutSession({
            plan_type: 'semester',
            email: this.state.email,
            amount: 99,
            origin: window.location.origin
        })
            .then(res => {
                if (res.data && res.data.url) {
                    window.location.href = res.data.url;
                } else {
                    this.setState({ payingSemester: false });
                    toast.error(res.data?.error || "Couldn't start checkout. Please try again.", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                }
            })
            .catch(err => {
                this.setState({ payingSemester: false });
                toast.error("Something went wrong starting checkout. Please try again.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
                console.error(err.message);
            });
    }

    formatAccessDate(iso) {
        if (!iso) return null;
        const d = new Date(iso);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    renderSuccess() {
        const isInstructorAccess = this.state.signupMethod === 'instructor_access';
        const requiresPayment = this.state.requiresPayment;
        const accessKind = this.state.accessKind;
        const courseName = this.state.courseName;
        const accessThrough = this.formatAccessDate(this.state.accessExpiresAt);
        let graceDays = null;
        if (requiresPayment && this.state.accessExpiresAt) {
            const ms = new Date(this.state.accessExpiresAt).getTime() - Date.now();
            graceDays = Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
        }
        return (
            <div className="mlv-step-container">
                <div className="mlv-success-icon-wrapper">
                    <CheckCircleOutlineIcon sx={{ fontSize: 72, color: '#4CAF50' }} />
                </div>
                <h2 className="mlv-title mlv-title-success">Account Activated!</h2>
                <p className="mlv-subtitle">
                    Your account <strong>{this.state.email}</strong> is now active.
                </p>
                <div className="mlv-success-box">
                    {requiresPayment ? (
                        <>
                            <div className="mlv-success-box-inner">
                                <span className="mlv-success-duration">{graceDays != null ? `${graceDays} Days` : '14 Days'}</span>
                                <span className="mlv-success-label">Grace Access</span>
                            </div>
                            <p className="mlv-success-text">
                                You're enrolled in <strong>{courseName || 'your course'}</strong> with <strong>{graceDays != null ? `${graceDays} days` : '14 days'}</strong> of access to get started.
                                Pay for <strong>Semester Access</strong> to keep full access for the term (you can also do this later from inside aiPlato).
                            </p>
                            <button className="mlv-submit-btn" onClick={this.handlePaySemester} disabled={this.state.payingSemester} style={{ marginTop: '8px' }}>
                                {this.state.payingSemester ? 'Redirecting…' : 'Pay Semester Access'}
                            </button>
                        </>
                    ) : accessKind === 'bookstore' ? (
                        <>
                            <div className="mlv-success-box-inner">
                                <span className="mlv-success-duration">Semester Access</span>
                                <span className="mlv-success-label">{accessThrough ? `Through ${accessThrough}` : 'Full Term'}</span>
                            </div>
                            <p className="mlv-success-text">
                                You're all set for <strong>{courseName || 'your course'}</strong>{accessThrough ? <> through <strong>{accessThrough}</strong></> : ''}. Explore lectures, practice problems, and get personalized AI tutoring.
                            </p>
                        </>
                    ) : isInstructorAccess ? (
                        <>
                            <div className="mlv-success-box-inner">
                                <span className="mlv-success-duration">Full Access</span>
                                <span className="mlv-success-label">Instructor-Enabled</span>
                            </div>
                            <p className="mlv-success-text">
                                You have <strong>full access</strong> to aiPlato, provided by your instructor. Explore lectures, practice problems, and get personalized AI tutoring.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="mlv-success-box-inner">
                                <span className="mlv-success-duration">7 Days</span>
                                <span className="mlv-success-label">Free Access</span>
                            </div>
                            <p className="mlv-success-text">
                                You have <strong>7 days</strong> of full access to aiPlato. Explore lectures, practice problems, and get personalized AI tutoring.
                            </p>
                        </>
                    )}
                </div>
                <div className="mlv-action-buttons">
                    <button className="mlv-submit-btn" onClick={this.goToLogin}>
                        Login to Get Started
                    </button>
                    <button className="mlv-secondary-btn" onClick={this.goToHome}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    renderError() {
        return (
            <div className="mlv-step-container">
                <ErrorOutlineIcon sx={{ fontSize: 64, color: '#f44336', marginBottom: '16px' }} />
                <h2 className="mlv-title mlv-title-error">Verification Failed</h2>
                <p className="mlv-subtitle">{this.state.errorMessage}</p>
                <button className="mlv-submit-btn" onClick={this.goToHome}>
                    Back to Home
                </button>
            </div>
        );
    }

    renderExpired() {
        return (
            <div className="mlv-step-container">
                <ErrorOutlineIcon sx={{ fontSize: 64, color: '#ff9800', marginBottom: '16px' }} />
                <h2 className="mlv-title" style={{ color: '#ff9800' }}>Link Expired</h2>
                <p className="mlv-subtitle">{this.state.errorMessage}</p>
                <button className="mlv-submit-btn" onClick={this.goToHome}>
                    Request a New Link
                </button>
            </div>
        );
    }

    renderCurrentStep() {
        switch (this.state.currentStep) {
            case STEP_VERIFYING:
                return this.renderVerifying();
            case STEP_VERIFIED:
                return this.renderVerified();
            case STEP_CREATE_PASSWORD:
                return this.renderCreatePassword();
            case STEP_ALREADY_REGISTERED:
                return this.renderAlreadyRegistered();
            case STEP_SUCCESS:
                return this.renderSuccess();
            case STEP_EXPIRED:
                return this.renderExpired();
            case STEP_ERROR:
            default:
                return this.renderError();
        }
    }

    render() {
        return (
            <div className="mlv-page">
                <Container>
                    <Row className="justify-content-center">
                        <Col sm={12} md={8} lg={6}>
                            <div className="mlv-card">
                                <div className="mlv-logo-section">
                                    <h3 className="mlv-logo-text" onClick={this.goToHome} style={{ cursor: 'pointer' }}>
                                        aiPlato
                                    </h3>
                                </div>

                                {this.state.currentStep !== STEP_VERIFYING &&
                                    this.state.currentStep !== STEP_ERROR &&
                                    this.state.currentStep !== STEP_EXPIRED &&
                                    this.state.currentStep !== STEP_ALREADY_REGISTERED && (
                                    <div className="mlv-progress-bar">
                                        <div className={`mlv-progress-step ${this.state.currentStep === STEP_VERIFIED || this.state.currentStep === STEP_CREATE_PASSWORD || this.state.currentStep === STEP_SUCCESS ? 'active' : ''}`}>
                                            <span className="mlv-progress-dot"></span>
                                            <span className="mlv-progress-label">Verify Email</span>
                                        </div>
                                        <div className="mlv-progress-line"></div>
                                        <div className={`mlv-progress-step ${this.state.currentStep === STEP_CREATE_PASSWORD || this.state.currentStep === STEP_SUCCESS ? 'active' : ''}`}>
                                            <span className="mlv-progress-dot"></span>
                                            <span className="mlv-progress-label">Create Password</span>
                                        </div>
                                        <div className="mlv-progress-line"></div>
                                        <div className={`mlv-progress-step ${this.state.currentStep === STEP_SUCCESS ? 'active' : ''}`}>
                                            <span className="mlv-progress-dot"></span>
                                            <span className="mlv-progress-label">Account Active</span>
                                        </div>
                                    </div>
                                )}

                                {this.renderCurrentStep()}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default MagicLinkVerify;
