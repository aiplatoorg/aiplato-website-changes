import React from 'react';
import { Link } from 'react-router-dom';
import './TestPrep.scss';

// Content sourced from the live SignUpPlans page (the source of truth for
// product positioning, features and pricing) — laid out as a marketing page.
const features = [
    'Full-length AP Physics practice tests — Practice & Exam Mode',
    'Step-by-step AI grading, personalised to your errors',
    'Instant scoring with diagnostic analytics',
    'Identifies root causes across 800+ AP micro-concepts',
    'Personalised study plan + AI-recommended problems for your weak spots',
];

const traditional = ['Jump to answers', 'Gaps stay hidden', 'Inconsistent drills', 'Unpredictable test scores'];
const withAiplato = ['Step-by-step solving', 'Identifies misconceptions', 'Personalised, interactive feedback', 'Mastery of concepts'];

const masterySteps = [
    { icon: '🔍', label: 'Identify Breakdown', desc: 'Pinpoint exactly where understanding breaks down' },
    { icon: '🔗', label: 'Fix Weak Link', desc: 'Targeted practice to close the specific gap' },
    { icon: '📖', label: 'Reinforce Concept', desc: 'Deepen understanding through guided problem-solving' },
    { icon: '⏱️', label: 'Perform Under Pressure', desc: 'Build confidence with real exam simulation' },
];

const TestPrep = () => (
    <div className="tpPage">
        {/* Hero */}
        <section className="tp-hero">
            <div className="tp-inner">
                <span className="tp-badge">AP Test Prep</span>
                <h1>Prepare with real AP-style practice tests and AI feedback</h1>
                <p className="tp-hero-sub">
                    Full-length AP Physics 1 &amp; 2 practice tests with step-by-step AI grading that
                    pinpoints your misconceptions — so every hour of prep moves you toward mastery, not just a score.
                </p>
                <div className="tp-cta-row">
                    <Link to="/signUpPlans" className="tp-btn tp-btn--primary">Start free — 2 practice tests</Link>
                    <Link to="/signUpPlans" className="tp-btn tp-btn--secondary">View plans</Link>
                </div>
                <div className="tp-hero-note">Starting at $30 · or try 2 free tests first (no credit card)</div>
            </div>
        </section>

        {/* Traditional vs aiPlato */}
        <section className="tp-section tp-vs-section">
            <div className="tp-inner">
                <span className="tp-section-tag">Why it works</span>
                <h2 className="tp-section-title">Test prep that builds mastery, not cramming</h2>
                <div className="tp-vs">
                    <div className="tp-vs-col tp-vs-col--bad">
                        <h3>Traditional Test Prep</h3>
                        <ul>
                            {traditional.map((t, i) => <li key={i}><span className="tp-x">✕</span> {t}</li>)}
                        </ul>
                    </div>
                    <div className="tp-vs-divider"><span>VS</span></div>
                    <div className="tp-vs-col tp-vs-col--good">
                        <h3>With aiPlato</h3>
                        <ul>
                            {withAiplato.map((t, i) => <li key={i}><span className="tp-check">✓</span> {t}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Features */}
        <section className="tp-section tp-features-section">
            <div className="tp-inner">
                <span className="tp-section-tag">What you get</span>
                <h2 className="tp-section-title">Everything you need to ace the AP exam</h2>
                <ul className="tp-features">
                    {features.map((f, i) => <li key={i}><span className="tp-check">✓</span> {f}</li>)}
                </ul>
            </div>
        </section>

        {/* Achieve Mastery */}
        <section className="tp-section tp-mastery-section">
            <div className="tp-inner">
                <span className="tp-section-tag">How it works</span>
                <h2 className="tp-section-title">Achieve Mastery</h2>
                <div className="tp-steps">
                    {masterySteps.map((s, i) => (
                        <div className="tp-step" key={i}>
                            <div className="tp-step-icon">{s.icon}</div>
                            <h4>{s.label}</h4>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="tp-section tp-final-cta">
            <div className="tp-inner">
                <h2>Ready to start your AP prep?</h2>
                <p>Try 2 full practice tests free — no credit card. Plans start at $30.</p>
                <div className="tp-cta-row tp-cta-row--center">
                    <Link to="/signUpPlans" className="tp-btn tp-btn--white">Choose your plan</Link>
                    <Link to="/requestDemo" className="tp-btn tp-btn--outline-white">For schools &amp; instructors</Link>
                </div>
            </div>
        </section>
    </div>
);

export default TestPrep;
