import React, { useEffect, useState } from "react";
import { withRouter, useParams } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";
import { toast } from 'react-toastify';
import { FaCheck, FaPlus, FaRocket, FaCalendarAlt, FaSearch, FaLink, FaBook, FaStopwatch, FaCheckCircle, FaTimesCircle, FaClipboardList, FaClock, FaBolt } from "react-icons/fa";
import homeworkPlatformImg from '../../assets/images/tutorimg1.png';
import { verifyTeacherAccessCode, createPlanCheckoutSession } from '../../common/API';
import { WEBSITE_URL, getUserAgent, getlocalsystemtimezone } from '../../common/Functions';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PopupButton } from "react-calendly";
import './SignUpPlans.scss';

const VIEW_PLANS = 'plans';
const VIEW_PERSONAL_PLANS = 'personal_plans';
const VIEW_SPONSORED_FORM = 'sponsored_form';
const VIEW_SPONSORED_SENT = 'sponsored_sent';
const VIEW_SPONSORED_UPGRADED = 'sponsored_upgraded';

const CONTACT_EMAIL = 'mailto:pilot@aiplato.ai';
const CALENDLY_URL = 'https://calendly.com/pilot-aiplato/aiplato';

const SignUpPlans = () => {
    const [currentView, setCurrentView] = useState(VIEW_PLANS);
    const [useruniqueid, setuseruniqueid] = useState(null);
    const [selectedAccessOption, setSelectedAccessOption] = useState(null);
    const [selectedHomeworkOption, setSelectedHomeworkOption] = useState(null);
    const params = useParams();
    const isEmbeddedView = new URLSearchParams(window.location.search).get('embed') === '1';

    const [sponsoredFirstName, setSponsoredFirstName] = useState('');
    const [sponsoredLastName, setSponsoredLastName] = useState('');
    const [sponsoredEmail, setSponsoredEmail] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [shareReportWithProfessor, setShareReportWithProfessor] = useState(true);
    const [sponsoredSubmitting, setSponsoredSubmitting] = useState(false);
    const [sponsoredError, setSponsoredError] = useState('');
    // Type B (Class Key): backend returns requires_payment=true when the code
    // only enrolls (grace) and a Semester Access payment is still needed.
    const [sponsoredRequiresPayment, setSponsoredRequiresPayment] = useState(false);
    const [payingSemester, setPayingSemester] = useState(false);
    // Which door opened the access form: 'sponsored' = free instructor-sponsored
    // (Test Prep card, copy unchanged); 'paid' = bookstore (Type A) / class key
    // (Type B) on the Homework card. Only the copy differs; the backend
    // auto-detects key_type either way.
    const [accessEntryMode, setAccessEntryMode] = useState('sponsored');
    // Course + access-through date echoed back from verify (for the paid door,
    // mirrors how WebAssign/MyLab confirm the class before the student commits).
    const [sponsoredCourseName, setSponsoredCourseName] = useState(null);
    const [sponsoredAccessUntil, setSponsoredAccessUntil] = useState(null);
    // Server-resolved per-student Semester Access price (InstructorAccessCode.price
    // > Course.semester_price > global fallback), echoed from verify. Shown on the
    // pay screen instead of a static amount; the server still resolves the charge.
    const [sponsoredSemesterPrice, setSponsoredSemesterPrice] = useState(null);

    useEffect(() => {
        var userUniqueId = params.useruniqueid;
        if (userUniqueId !== undefined && userUniqueId !== null && userUniqueId !== "") {
            setuseruniqueid(userUniqueId);
        }
    }, []);

    const isValidEmail = (email) => {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    };

    const formatAccessDate = (iso) => {
        if (!iso) return null;
        const d = new Date(iso);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handlePersonalClick = () => {
        setCurrentView(VIEW_PERSONAL_PLANS);
    };

    const handlePersonalPlanSelect = (planType) => {
        const uidSuffix = useruniqueid !== null && useruniqueid !== "null" && useruniqueid !== undefined ? "/" + useruniqueid : "";
        const targetUrl = "/Signup/personal" + uidSuffix + "?plan=" + planType;
        if (isEmbeddedView) {
            window.open(targetUrl, '_top');
            return;
        }
        window.location = targetUrl;
    };

    const navigateToLogin = () => {
        const loginUrl = WEBSITE_URL + "login";
        if (isEmbeddedView) {
            window.open(loginUrl, '_top');
            return;
        }
        window.location = loginUrl;
    };

    const handleSponsoredClick = (mode = 'sponsored') => {
        setAccessEntryMode(mode);
        setCurrentView(VIEW_SPONSORED_FORM);
        setSponsoredFirstName('');
        setSponsoredLastName('');
        setSponsoredEmail('');
        setAccessCode('');
        setShareReportWithProfessor(true);
        setSponsoredError('');
        setSponsoredCourseName(null);
        setSponsoredAccessUntil(null);
    };

    // Type B: send the enrolled (grace) student straight to Stripe for the
    // Semester Access SKU. The Stripe success_url returns to /payment-success,
    // which calls savePaymentDetail(plan_type='semester') -> backend promotes
    // their Class-Key grace entitlement to the semester end.
    const handlePaySemester = () => {
        const email = sponsoredEmail.trim().toLowerCase();
        setPayingSemester(true);
        createPlanCheckoutSession({
            plan_type: 'semester',
            email: email,
            origin: window.location.origin
        })
            .then(res => {
                if (res.data && res.data.url) {
                    window.location.href = res.data.url;
                } else {
                    setPayingSemester(false);
                    toast.error(res.data?.error || "Couldn't start checkout. Please try again.", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                }
            })
            .catch(err => {
                setPayingSemester(false);
                toast.error("Something went wrong starting checkout. Please try again.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
                console.error(err.message);
            });
    };

    const handleBackToPlans = () => {
        setCurrentView(VIEW_PLANS);
        setSelectedAccessOption(null);
        setSelectedHomeworkOption(null);
        setSponsoredFirstName('');
        setSponsoredLastName('');
        setSponsoredEmail('');
        setAccessCode('');
        setShareReportWithProfessor(true);
        setSponsoredError('');
        setSponsoredCourseName(null);
        setSponsoredAccessUntil(null);
    };

    const handleSponsoredSubmit = (e) => {
        e.preventDefault();
        const email = sponsoredEmail.trim().toLowerCase();

        if (!isValidEmail(email)) {
            setSponsoredError("Please enter a valid email address.");
            return;
        }
        if (accessCode.trim() === '') {
            setSponsoredError("Please enter the access code provided by your professor.");
            return;
        }
        setSponsoredSubmitting(true);
        setSponsoredError('');

        const data = {
            first_name: sponsoredFirstName.trim(),
            last_name: sponsoredLastName.trim(),
            email: email,
            access_code: accessCode.trim(),
            share_report_with_professor: shareReportWithProfessor,
            timezone: getlocalsystemtimezone(),
            userAgent: getUserAgent()
        };

        verifyTeacherAccessCode(data)
            .then(res => {
                if (res.data.Success === true || res.data.Success === "Success") {
                    setSponsoredSubmitting(false);
                    setSponsoredRequiresPayment(res.data.requires_payment === true);
                    setSponsoredCourseName(res.data.course_name || null);
                    setSponsoredAccessUntil(res.data.access_until || null);
                    setSponsoredSemesterPrice(res.data.semester_price != null ? res.data.semester_price : null);
                    if (res.data.already_active === true) {
                        setCurrentView(VIEW_SPONSORED_UPGRADED);
                        toast.success(res.data.message || "Your account has been upgraded!", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
                    } else {
                        setCurrentView(VIEW_SPONSORED_SENT);
                        toast.success("Verification link sent! Please check your email.", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
                    }
                } else {
                    setSponsoredSubmitting(false);
                    const errorMsg = res.data.message || "Verification failed. Please check your access code and try again.";
                    setSponsoredError(errorMsg);
                }
            })
            .catch(err => {
                setSponsoredSubmitting(false);
                const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
                setSponsoredError(errorMsg);
                console.error(err.message);
            });
    };

    const coreTestPrepFeatures = [
        "Step-by-step feedback & grading, personalised to your errors",
        "Practice Mode & Exam Mode with instant scoring",
        "Diagnostic analytics & detailed review",
        "Personalised study plan for mastery",
        "AI-recommended problems targeting your weak spots"
    ];

    const personalSubPlans = [
        {
            id: "30day",
            duration: "30-Day Plan",
            price: "$30",
            tag: "",
            description: "Focused revision in the final weeks before your exam",
            testCount: "3 full-length practice tests",
            testDetail: "for your chosen exam",
            features: coreTestPrepFeatures,
            extras: [],
            addon: null
        },
        {
            id: "90day",
            duration: "90-Day Plan",
            price: "$75",
            tag: "Best Value",
            description: "Structured preparation with time to identify and close all gaps",
            testCount: "5 full-length practice tests",
            testDetail: "for your chosen exam",
            features: coreTestPrepFeatures,
            extras: [],
            addon: null
        },
        {
            id: "6month",
            duration: "6-Month Plan",
            price: "$150",
            tag: "",
            description: "Full semester or year-long preparation from day one",
            testCount: "5 full-length practice tests",
            testDetail: "for your chosen exam",
            features: coreTestPrepFeatures,
            extras: ["Unlimited access to 1,000+ practice problems"],
            addon: "2 live sessions with an expert tutor"
        }
    ];

    const homeworkAccessOptions = [
        {
            id: 'code',
            label: 'I have an Access Code or Class Key',
            sub: 'From your campus bookstore, or a class key from your instructor',
            cta: {
                text: 'Enter Code',
                action: (e) => { e.stopPropagation(); handleSponsoredClick('paid'); },
                isLink: false,
                style: 'primary'
            }
        },
        {
            id: 'university',
            label: 'For Universities & Instructors',
            sub: null,
            cta: {
                text: 'Request Access',
                href: CONTACT_EMAIL,
                isLink: true,
                style: 'primary'
            }
        },
        {
            id: 'school',
            label: 'For Schools & Teachers',
            sub: null,
            cta: {
                text: 'Request Access',
                href: CONTACT_EMAIL,
                isLink: true,
                style: 'primary'
            }
        }
    ];

    const accessOptions = [
        {
            id: 'code',
            label: 'Sponsored by My School or Teacher',
            sub: 'Your institution has unlocked aiPlato for your class',
            cta: {
                text: 'Enter Code',
                action: (e) => { e.stopPropagation(); handleSponsoredClick(); },
                isLink: false,
                style: 'primary'
            }
        },
        {
            id: 'individual',
            label: 'Individual Access',
            sub: 'Starting at $30 · or try 2 free tests first (no credit card)',
            cta: {
                text: 'View Plans',
                action: (e) => { e.stopPropagation(); handlePersonalClick(); },
                isLink: false,
                style: 'primary'
            }
        },
        {
            id: 'school',
            label: 'School / Instructor Access',
            sub: null,
            cta: {
                text: 'Contact Us',
                href: CONTACT_EMAIL,
                isLink: true,
                style: 'outline'
            }
        }
    ];

    const howItWorksSteps = [
        { icon: <FaSearch size={22} />, label: "Identify Breakdown", desc: "Pinpoint exactly where understanding breaks down" },
        { icon: <FaLink size={22} />, label: "Fix Weak Link", desc: "Targeted practice to close the specific gap" },
        { icon: <FaBook size={22} />, label: "Reinforce Concept", desc: "Deepen understanding through guided problem-solving" },
        { icon: <FaStopwatch size={22} />, label: "Perform Under Pressure", desc: "Build confidence with real exam simulation" }
    ];

    const renderMain = () => (
        <>
            <div className="sup-header">
                <h1 className="sup-title">Get Access to aiPlato</h1>
                <p className="sup-subtitle">Choose the product that fits your needs</p>
            </div>

            {/* Traditional Platforms vs. aiPlato comparison strip */}
            <div className="sup-vs-strip">
                {/* Seasonal urgency banner inside VS strip — top row */}
                <div className="sup-seasonal-banner">
                    <FaBolt className="sup-seasonal-icon" />
                    <span className="sup-seasonal-text">Exam's Crunch Time?</span>
                    <span className="sup-seasonal-sub">AP exams are approaching — start your prep now</span>
                    <FaBolt className="sup-seasonal-icon" />
                </div>
                <div className="sup-vs-col sup-vs-col--traditional">
                    <h3 className="sup-vs-header">Traditional Test Prep</h3>
                    <ul className="sup-vs-list">
                        {[
                            "Jump to answers",
                            "Gaps stay hidden",
                            "Inconsistent drills",
                            "Unpredictable test scores"
                        ].map((item, i) => (
                            <li key={i}>
                                <FaTimesCircle className="sup-vs-icon sup-vs-icon--bad" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="sup-vs-divider">
                    <span className="sup-vs-badge">VS</span>
                </div>
                <div className="sup-vs-col sup-vs-col--aiplato">
                    <h3 className="sup-vs-header">With aiPlato</h3>
                    <ul className="sup-vs-list">
                        {[
                            "Step-by-step solving",
                            "Identifies misconceptions",
                            "Personalised, interactive feedback",
                            "Mastery of concepts"
                        ].map((item, i) => (
                            <li key={i}>
                                <FaCheckCircle className="sup-vs-icon sup-vs-icon--good" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            <div className="sup-sections">
                {/* Equal 3-column product cards */}
                <div className="sup-three-columns">
                    {/* Card 1: Test Prep */}
                    <div className="sup-section-card sup-section-card--primary">
                        <span className="sup-section-badge">AP Test Prep</span>
                        <h2 className="sup-section-title">Prepare with real AP-style practice tests and AI feedback</h2>
                        <ul className="sup-plan-features">
                            {[
                                "Full-length AP Physics practice tests — Practice & Exam Mode",
                                "Step-by-step AI grading, personalised to your errors",
                                "Instant scoring with diagnostic analytics",
                                "Identifies root causes across 800+ AP micro-concepts",
                                "Personalised plan to reach mastery"
                            ].map((f, i) => (
                                <li key={i}><FaCheck className="sup-check-icon" /><span>{f}</span></li>
                            ))}
                        </ul>

                        {/* Practice Mode / Exam Mode callout */}
                        <div className="sup-mode-callout">
                            <div className="sup-mode-col">
                                <div className="sup-mode-icon"><FaClipboardList size={18} /></div>
                                <div className="sup-mode-name">Practice Mode</div>
                                <ul className="sup-mode-items">
                                    <li>Guided Learning</li>
                                    <li>Concept Feedback</li>
                                </ul>
                            </div>
                            <div className="sup-mode-col sup-mode-col--exam">
                                <div className="sup-mode-icon"><FaClock size={18} /></div>
                                <div className="sup-mode-name">Exam Mode</div>
                                <ul className="sup-mode-items">
                                    <li>Real Test Simulation</li>
                                    <li>Instant Review</li>
                                </ul>
                            </div>
                        </div>

                        <div className="sup-section-divider" />
                        <p className="sup-access-label">Choose Access:</p>
                        <div className="sup-access-options">
                            {accessOptions.map(opt => (
                                <div
                                    key={opt.id}
                                    className={`sup-access-option${selectedAccessOption === opt.id ? ' sup-access-option--selected' : ''}`}
                                    onClick={() => setSelectedAccessOption(selectedAccessOption === opt.id ? null : opt.id)}
                                >
                                    <span className={`sup-radio-dot${selectedAccessOption === opt.id ? ' sup-radio-dot--active' : ''}`} />
                                    <div className="sup-access-option-body">
                                        <span className="sup-access-option-label">{opt.label}</span>
                                        {opt.sub && <span className="sup-access-price">{opt.sub}</span>}
                                        {selectedAccessOption === opt.id && (
                                            opt.cta.isLink
                                                ? <a
                                                    href={opt.cta.href}
                                                    className={`sup-inline-btn${opt.cta.style === 'outline' ? ' sup-inline-btn--outline' : ''}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                  >
                                                    {opt.cta.text}
                                                  </a>
                                                : <button
                                                    className={`sup-inline-btn${opt.cta.style === 'outline' ? ' sup-inline-btn--outline' : ''}`}
                                                    onClick={opt.cta.action}
                                                  >
                                                    {opt.cta.text}
                                                  </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 2: Homework */}
                    <div className="sup-section-card sup-section-card--green">
                        <span className="sup-section-badge sup-section-badge--green">Homework & Class Platform</span>
                        <h2 className="sup-section-title">Assignments with step-by-step grading and insights</h2>
                        <ul className="sup-plan-features">
                            {[
                                "Structured assignments & FRQs",
                                "Step-by-step grading + feedback",
                                "Misconception identification",
                                "Interactive proficiency",
                                "Instructor dashboard + reports",
                                "Canvas / Moodle integration"
                            ].map((f, i) => (
                                <li key={i}><FaCheck className="sup-check-icon" /><span>{f}</span></li>
                            ))}
                        </ul>
                        <div className="sup-card-screenshot">
                            <img src={homeworkPlatformImg} alt="aiPlato Comprehensive Homework Platform" />
                        </div>

                        <div className="sup-section-divider" />
                        <p className="sup-access-label">Choose Access:</p>
                        <div className="sup-access-options">
                            {homeworkAccessOptions.map(opt => (
                                <div
                                    key={opt.id}
                                    className={`sup-access-option${selectedHomeworkOption === opt.id ? ' sup-access-option--selected' : ''}`}
                                    onClick={() => setSelectedHomeworkOption(selectedHomeworkOption === opt.id ? null : opt.id)}
                                >
                                    <span className={`sup-radio-dot${selectedHomeworkOption === opt.id ? ' sup-radio-dot--active' : ''}`} />
                                    <div className="sup-access-option-body">
                                        <span className="sup-access-option-label">{opt.label}</span>
                                        {selectedHomeworkOption === opt.id && (
                                            opt.cta.isLink
                                                ? <a
                                                    href={opt.cta.href}
                                                    className={`sup-inline-btn${opt.cta.style === 'outline' ? ' sup-inline-btn--outline' : ''}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                  >
                                                    {opt.cta.text}
                                                  </a>
                                                : <button
                                                    className={`sup-inline-btn${opt.cta.style === 'outline' ? ' sup-inline-btn--outline' : ''}`}
                                                    onClick={opt.cta.action}
                                                  >
                                                    {opt.cta.text}
                                                  </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 3: Full Course */}
                    <div className="sup-section-card sup-section-card--muted">
                        <span className="sup-section-badge sup-section-badge--muted">Full Course Experience</span>
                        <p className="sup-section-optional">Coming Soon</p>
                        <h2 className="sup-section-title">Complete AP course: lectures, homework & test prep in one place</h2>
                        <ul className="sup-plan-features">
                            {[
                                "AI-powered video lectures — interactive",
                                "AI-powered lecture notes — interactive",
                                "Personalised week-by-week learning plan",
                                "Weekly progress updates to parents & teachers",
                            ].map((f, i) => (
                                <li key={i}><FaCheck className="sup-check-icon" /><span>{f}</span></li>
                            ))}
                            <li className="sup-features-divider">
                                <span className="sup-features-divider-label">Also includes</span>
                            </li>
                            {[
                                "Homework Platform",
                                "AP Test Prep Platform",
                            ].map((f, i) => (
                                <li key={`inc-${i}`} className="sup-feature-included">
                                    <FaPlus className="sup-plus-icon" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="sup-section-divider" />
                        <a href={CONTACT_EMAIL} className="sup-plan-btn sup-plan-btn--link sup-plan-btn--outline-link">Contact Us</a>
                    </div>
                </div>

                {/* How It Works */}
                <div className="sup-how-it-works">
                    <h2 className="sup-how-title">Achieve Mastery</h2>
                    <div className="sup-step-grid">
                        {howItWorksSteps.map((step, i) => (
                            <React.Fragment key={i}>
                                <div className="sup-step-card">
                                    <div className="sup-step-icon">{step.icon}</div>
                                    <div className="sup-step-label">{step.label}</div>
                                    <div className="sup-step-desc">{step.desc}</div>
                                </div>
                                {i < howItWorksSteps.length - 1 && (
                                    <div className="sup-step-arrow">›</div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="sup-footer-cta">
                    <p className="sup-footer-cta-text">Looking to use this for your class or school?</p>
                    <PopupButton
                        url={CALENDLY_URL}
                        rootElement={document.getElementById("root")}
                        text="Schedule a Quick Demo"
                        className="sup-footer-cta-btn"
                    />
                </div>
            </div>

            <div className="sup-login-link">
                Already have an account? <a href={WEBSITE_URL + "login"} target={isEmbeddedView ? "_top" : undefined}>Login</a>
            </div>
        </>
    );

    const renderPersonalPlans = () => (
        <>
            <div className="sup-header">
                <button className="sup-back-btn sup-back-btn-center" onClick={handleBackToPlans} type="button">
                    <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Plans
                </button>
                <h1 className="sup-title">AP Test Prep — Choose Your Plan</h1>
                <p className="sup-subtitle">All plans include AI-powered practice and personalised insights — more time, more tests, more resources as you go up</p>
            </div>

            <div className="sup-personal-grid">
                {personalSubPlans.map((plan) => (
                    <div className={`sup-personal-card ${plan.tag ? 'sup-personal-card--popular' : ''}`} key={plan.id}>
                        {plan.tag && <span className="sup-personal-tag">{plan.tag}</span>}
                        <div className="sup-personal-icon">
                            <FaCalendarAlt size={20} />
                        </div>
                        <h3 className="sup-personal-duration">{plan.duration}</h3>
                        <div className="sup-personal-price">{plan.price}</div>
                        <p className="sup-personal-desc">{plan.description}</p>
                        <div className="sup-personal-test-count">
                            <span className="sup-personal-test-count-num">{plan.testCount}</span>
                            <span className="sup-personal-test-count-detail">{plan.testDetail}</span>
                        </div>
                        <ul className="sup-personal-features">
                            {plan.features.map((feature, idx) => (
                                <li key={idx}>
                                    <FaCheck className="sup-check-icon" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        {plan.extras && plan.extras.length > 0 && (
                            <ul className="sup-personal-features sup-personal-features--extras">
                                <li className="sup-features-divider">
                                    <span className="sup-features-divider-label">Also in this plan</span>
                                </li>
                                {plan.extras.map((extra, idx) => (
                                    <li key={idx}>
                                        <FaCheck className="sup-check-icon" />
                                        <span>{extra}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {plan.addon && (
                            <div className="sup-personal-addon">
                                <span className="sup-personal-addon-divider">Optional add-on</span>
                                <div className="sup-personal-addon-item">
                                    <FaPlus className="sup-plus-icon" />
                                    <span>{plan.addon}</span>
                                </div>
                            </div>
                        )}
                        <button className="sup-plan-btn" onClick={() => handlePersonalPlanSelect(plan.id)}>
                            Get Started
                        </button>
                    </div>
                ))}
            </div>

            <div className="sup-login-link">
                Already have an account? <a href={WEBSITE_URL + "login"} target={isEmbeddedView ? "_top" : undefined}>Login</a>
            </div>
        </>
    );

    const renderSponsoredForm = () => {
      const isPaid = accessEntryMode === 'paid';
      const formTitle = isPaid ? 'Activate Your Course Access' : 'Institution Sponsored Access';
      const formSubtitle = isPaid
          ? "Enter your email and the access code from your campus bookstore, or the class key from your instructor. We'll send you a verification link to activate your account."
          : "Enter your email and the access code your teacher or school provided. We'll send you a verification link to activate your account.";
      const codeLabel = isPaid ? 'Access Code or Class Key' : 'Access Code';
      const codePlaceholder = isPaid ? 'Enter your code' : 'Enter access code from your professor';
      return (
        <div className="sup-form-card">
            <button className="sup-back-btn" onClick={handleBackToPlans} type="button">
                <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Plans
            </button>

            <div className="sup-form-header">
                <span className="sup-form-icon"><FaRocket size={28} /></span>
                <h2 className="sup-form-title">{formTitle}</h2>
                <p className="sup-form-subtitle">
                    {formSubtitle}
                </p>
            </div>

            <form onSubmit={handleSponsoredSubmit} className="sup-form">
                <div className="sup-row">
                    <div className="sup-input-group sup-half">
                        <label className="sup-label">First Name</label>
                        <input
                            type="text"
                            className="sup-input"
                            value={sponsoredFirstName}
                            onChange={(e) => { setSponsoredFirstName(e.target.value); setSponsoredError(''); }}
                            placeholder="First name"
                            autoFocus
                        />
                    </div>
                    <div className="sup-input-group sup-half">
                        <label className="sup-label">Last Name</label>
                        <input
                            type="text"
                            className="sup-input"
                            value={sponsoredLastName}
                            onChange={(e) => { setSponsoredLastName(e.target.value); setSponsoredError(''); }}
                            placeholder="Last name"
                        />
                    </div>
                </div>

                <div className="sup-input-group">
                    <label className="sup-label">Email Address</label>
                    <input
                        type="email"
                        className="sup-input"
                        value={sponsoredEmail}
                        onChange={(e) => { setSponsoredEmail(e.target.value.trim()); setSponsoredError(''); }}
                        placeholder="Enter your email address"
                    />
                </div>

                <div className="sup-input-group">
                    <label className="sup-label">{codeLabel}</label>
                    <input
                        type="text"
                        className="sup-input"
                        value={accessCode}
                        onChange={(e) => { setAccessCode(e.target.value); setSponsoredError(''); }}
                        placeholder={codePlaceholder}
                    />
                </div>

                <div className="sup-input-group">
                    <label
                        className="sup-label"
                        style={{
                            textTransform: 'none',
                            letterSpacing: 0,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: 0
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={shareReportWithProfessor}
                            onChange={(e) => { setShareReportWithProfessor(e.target.checked); setSponsoredError(''); }}
                        />
                        <span>Allow my instructor to view my answers and Proficiency</span>
                    </label>
                    <div style={{ fontFamily: 'proxima-nova, sans-serif', fontSize: '13px', color: '#888', marginTop: '6px', lineHeight: 1.4 }}>
                        This helps your instructor support your learning.
                    </div>
                </div>

                {sponsoredError && (
                    <div className="sup-error-msg">{sponsoredError}</div>
                )}

                <button
                    type="submit"
                    className="sup-submit-btn"
                    disabled={!isValidEmail(sponsoredEmail) || accessCode.trim() === '' || sponsoredSubmitting}
                >
                    {sponsoredSubmitting ? (
                        <>
                            <CircularProgress size={18} sx={{ color: '#fff', marginRight: '8px' }} />
                            Verifying...
                        </>
                    ) : (
                        'Verify & Send Link'
                    )}
                </button>
            </form>
        </div>
      );
    };

    const renderSponsoredSent = () => (
        <div className="sup-form-card sup-form-card-centered">
            <div className="sup-sent-icon">&#9993;</div>
            <h2 className="sup-form-title">Check Your Email</h2>
            <p className="sup-form-subtitle">
                We've sent a verification link to
            </p>
            <p className="sup-sent-email">{sponsoredEmail}</p>
            <p className="sup-sent-description">
                Click the link in your email to verify your address and set up your account.
            </p>
            {accessEntryMode === 'paid' && sponsoredCourseName && (
                <p className="sup-sent-description" style={{ marginTop: '12px' }}>
                    You're joining <strong>{sponsoredCourseName}</strong>
                    {formatAccessDate(sponsoredAccessUntil) && (
                        <> — access through <strong>{formatAccessDate(sponsoredAccessUntil)}</strong></>
                    )}.
                </p>
            )}
            {sponsoredRequiresPayment && (
                <>
                    <p className="sup-sent-description" style={{ marginTop: '12px' }}>
                        Your class key gives you <strong>14 days of access</strong> to get started.
                        Pay for <strong>Semester Access{sponsoredSemesterPrice != null ? ` ($${sponsoredSemesterPrice})` : ''}</strong> to
                        keep access for the full semester (you can also do this later from inside aiPlato).
                    </p>
                    <button className="sup-submit-btn" onClick={handlePaySemester} disabled={payingSemester}>
                        {payingSemester ? 'Redirecting…' : `Pay Semester Access${sponsoredSemesterPrice != null ? ` ($${sponsoredSemesterPrice})` : ''}`}
                    </button>
                </>
            )}
            <button className="sup-secondary-btn" onClick={handleBackToPlans} style={{ marginTop: '10px' }}>
                Back to Plans
            </button>
        </div>
    );

    const renderSponsoredUpgraded = () => (
        <div className="sup-form-card sup-form-card-centered">
            <div className="sup-sent-icon">&#10003;</div>
            <h2 className="sup-form-title">Account Upgraded!</h2>
            <p className="sup-form-subtitle">
                Your account has been upgraded to full instructor-enabled access.
            </p>
            <p className="sup-sent-description">
                You now have full access to aiPlato provided by your instructor. Please login with your existing credentials to continue.
            </p>
            <button className="sup-submit-btn" onClick={navigateToLogin}>
                Go to Login
            </button>
            <button className="sup-secondary-btn" onClick={handleBackToPlans} style={{ marginTop: '10px' }}>
                Back to Plans
            </button>
        </div>
    );

    const isWideView = currentView === VIEW_PLANS || currentView === VIEW_PERSONAL_PLANS;

    return (
        <div className="sup-page">
            <div className="mainContainerWrapper">
                <Row className="justify-content-center">
                    <Col sm={12} md={isWideView ? 12 : 8} lg={isWideView ? 12 : 6}>
                        {currentView === VIEW_PLANS && renderMain()}
                        {currentView === VIEW_PERSONAL_PLANS && renderPersonalPlans()}
                        {currentView === VIEW_SPONSORED_FORM && renderSponsoredForm()}
                        {currentView === VIEW_SPONSORED_SENT && renderSponsoredSent()}
                        {currentView === VIEW_SPONSORED_UPGRADED && renderSponsoredUpgraded()}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default withRouter(SignUpPlans);
