import React from 'react';
import { Link } from 'react-router-dom';
import './productPage.scss';

const features = [
    'Free-response auto-grading — equations, text & diagrams at ~99% accuracy',
    'Step-by-step grading with personalised, on-each-attempt feedback',
    'Misconception identification — pinpoints the root cause of each error',
    'Interactive proficiency map across 800+ physics micro-concepts',
    'Handwritten, stylus, or keyboard equation input',
    'Instructor dashboard, class reports & TA Copilot™',
];

const Homework = () => (
    <div className="productPage">
        <section className="pp-hero">
            <div className="pp-inner">
                <span className="pp-badge">Homework &amp; Class Platform</span>
                <h1>The most advanced online homework system for Physics</h1>
                <p className="pp-hero-sub">
                    Assignments and exams with step-by-step AI grading and insights — students get instant,
                    personalised feedback, and instructors save hours while seeing exactly where the class struggles.
                </p>
                <div className="pp-cta-row">
                    <Link to="/signUpPlans" className="pp-btn pp-btn--primary">Get started</Link>
                    <Link to="/educator" className="pp-btn pp-btn--secondary">For educators</Link>
                </div>
            </div>
        </section>

        <section className="pp-section">
            <div className="pp-inner">
                <span className="pp-section-tag">What it does</span>
                <h2 className="pp-section-title">Free-response grading that actually teaches</h2>
                <div className="pp-replaces">Replaces WebAssign · Pearson MyLab · WileyPLUS · Cengage</div>
                <ul className="pp-features">
                    {features.map((f, i) => <li key={i}><span className="pp-check">✓</span> {f}</li>)}
                </ul>
            </div>
        </section>

        <section className="pp-section pp-alt">
            <div className="pp-inner">
                <span className="pp-section-tag">Built for both sides of the classroom</span>
                <h2 className="pp-section-title">One platform, two jobs done</h2>
                <div className="pp-two">
                    <div className="pp-aud-card">
                        <div className="pp-aud-icon">🎓</div>
                        <h3>For students</h3>
                        <p>Submit your work the way you actually solve it — handwriting, stylus or keyboard — and get
                            step-by-step feedback that explains where you went wrong, 24/7.</p>
                        <Link to="/signUpPlans" className="pp-btn pp-btn--primary">Start free</Link>
                    </div>
                    <div className="pp-aud-card">
                        <div className="pp-aud-icon">👩‍🏫</div>
                        <h3>For educators</h3>
                        <p>Assign auto-graded homework and exams with partial credit, cut grading time by 70–80%, and
                            see class-level misconception analytics in real time.</p>
                        <Link to="/educator" className="pp-btn pp-btn--primary">See educator tools</Link>
                    </div>
                </div>
            </div>
        </section>

        <section className="pp-section pp-final-cta">
            <div className="pp-inner">
                <h2>Ready to upgrade your homework experience?</h2>
                <p>Start free as a student, or book a walkthrough for your course.</p>
                <div className="pp-cta-row">
                    <Link to="/signUpPlans" className="pp-btn pp-btn--white">Get started free</Link>
                    <Link to="/requestDemo" className="pp-btn pp-btn--outline-white">Request a demo</Link>
                </div>
            </div>
        </section>
    </div>
);

export default Homework;
