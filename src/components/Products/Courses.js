import React from 'react';
import { Link } from 'react-router-dom';
import './productPage.scss';

const features = [
    'AI-powered, interactive video lectures',
    'AI-powered, interactive lecture notes',
    'Personalised week-by-week learning plan',
    'Weekly progress updates to parents & teachers',
    'Self-paced, with adaptive proficiency checkpoints',
    'ESA-eligible (Education Savings Account) · one-click human tutor access',
];

const roadmap = [
    { icon: '⚡', name: 'AP Physics 1 & 2', status: 'Coming Soon', active: true },
    { icon: '📐', name: 'Pre-Calculus', status: 'Planned' },
    { icon: '∫', name: 'Calculus', status: 'Planned' },
    { icon: '⚗️', name: 'Chemistry', status: 'Planned' },
];

const Courses = () => (
    <div className="productPage">
        <section className="pp-hero">
            <div className="pp-inner">
                <span className="pp-badge">Full Course Experience <span className="pp-badge-soon">Coming Soon</span></span>
                <h1>Full AP courses, delivered by AI</h1>
                <p className="pp-hero-sub">
                    A complete AP course — lectures, homework, and test prep in one place — for students without
                    access to qualified instructors. Self-paced, personalised, and built on aiPlato's teaching core.
                </p>
                <div className="pp-cta-row">
                    <Link to="/signUpPlans" className="pp-btn pp-btn--primary">Notify me when available</Link>
                    <Link to="/products/test-prep" className="pp-btn pp-btn--secondary">Explore AP Test Prep</Link>
                </div>
            </div>
        </section>

        <section className="pp-section">
            <div className="pp-inner">
                <span className="pp-section-tag">What's included</span>
                <h2 className="pp-section-title">Everything a great course has — taught by AI</h2>
                <div className="pp-replaces">Replaces Stride · Coursera · synchronous online tutoring</div>
                <ul className="pp-features">
                    {features.map((f, i) => <li key={i}><span className="pp-check">✓</span> {f}</li>)}
                </ul>
            </div>
        </section>

        <section className="pp-section pp-alt">
            <div className="pp-inner">
                <span className="pp-section-tag">Expansion roadmap</span>
                <h2 className="pp-section-title">Building the AI-native STEM curriculum</h2>
                <p className="pp-section-body">Starting with AP Physics, then expanding across K–12 STEM — so every
                    student can access a complete, high-quality course regardless of where they live.</p>
                <div className="pp-roadmap">
                    {roadmap.map((r, i) => (
                        <div className={r.active ? 'pp-roadmap-card pp-roadmap-card--active' : 'pp-roadmap-card'} key={i}>
                            <div className="pp-rm-icon">{r.icon}</div>
                            <div className="pp-rm-name">{r.name}</div>
                            <div className="pp-rm-status">{r.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="pp-section pp-final-cta">
            <div className="pp-inner">
                <h2>Be the first to know</h2>
                <p>Full AP courses are launching soon. Get notified, or start with AP Test Prep today.</p>
                <div className="pp-cta-row">
                    <Link to="/signUpPlans" className="pp-btn pp-btn--white">Notify me</Link>
                    <Link to="/products/test-prep" className="pp-btn pp-btn--outline-white">Start with Test Prep</Link>
                </div>
            </div>
        </section>
    </div>
);

export default Courses;
