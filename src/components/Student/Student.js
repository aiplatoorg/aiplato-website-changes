import React from 'react';
import { Link } from 'react-router-dom';
import './Student.scss';

// Student-facing marketing page. Positioning/features mirror the live
// SignUpPlans + product content; CTAs funnel into /signUpPlans.
const learnCards = [
    { icon: '🎯', title: 'Feedback on your own work', desc: 'Step-by-step AI grading pinpoints exactly where your understanding breaks down — not just whether the answer is right.' },
    { icon: '💬', title: 'A 24/7 AI tutor', desc: 'Ask questions any time and get guided hints that help you solve it yourself, so you are never stuck for long.' },
    { icon: '📈', title: 'Practice that targets your gaps', desc: 'AI-recommended problems across 800+ micro-concepts focus your time exactly where it moves your grade most.' },
    { icon: '✍️', title: 'Learn by doing', desc: 'Interactive lectures and problems with handwriting, stylus, or keyboard input — active learning, not passive videos.' },
];

const products = [
    { icon: '🎯', title: 'AP Test Prep', desc: 'Full-length AP Physics 1 & 2 practice tests with step-by-step AI grading and diagnostic analytics.', to: '/products/test-prep', cta: 'Explore Test Prep →' },
    { icon: '📚', title: 'Homework Help', desc: 'Get instant, step-by-step feedback on assignments — understand every problem, master every concept.', to: '/signUpPlans', cta: 'Get started →' },
    { icon: '🎓', title: 'Full AP Courses', desc: 'Complete AI-delivered AP Physics courses — lectures, homework, and test prep in one place.', to: null, cta: 'Coming soon' },
];

const masterySteps = [
    { icon: '🔍', label: 'Identify Breakdown', desc: 'Pinpoint exactly where understanding breaks down' },
    { icon: '🔗', label: 'Fix Weak Link', desc: 'Targeted practice to close the specific gap' },
    { icon: '📖', label: 'Reinforce Concept', desc: 'Deepen understanding through guided problem-solving' },
    { icon: '⏱️', label: 'Perform Under Pressure', desc: 'Build confidence with real exam simulation' },
];

const Student = () => (
    <div className="studentPage">
        {/* Hero */}
        <section className="sp-hero">
            <div className="sp-inner">
                <span className="sp-badge">For Students</span>
                <h1>Master STEM with an AI tutor that actually teaches</h1>
                <p className="sp-hero-sub">
                    Get step-by-step feedback on your own work, understand where you go wrong, and build
                    real mastery — not just answers. Built by educators, available 24/7.
                </p>
                <div className="sp-cta-row">
                    <Link to="/signUpPlans" className="sp-btn sp-btn--primary">Start free — 7-day trial</Link>
                    <Link to="/products/test-prep" className="sp-btn sp-btn--secondary">Explore AP Test Prep</Link>
                </div>
                <div className="sp-hero-note">Starting at $30 · or try 2 free practice tests (no credit card)</div>
            </div>
        </section>

        {/* How aiPlato helps you learn */}
        <section className="sp-section">
            <div className="sp-inner">
                <span className="sp-section-tag">Why students love it</span>
                <h2 className="sp-section-title">How aiPlato helps you learn</h2>
                <div className="sp-grid sp-grid--4">
                    {learnCards.map((c, i) => (
                        <div className="sp-card" key={i}>
                            <div className="sp-card-icon">{c.icon}</div>
                            <h4>{c.title}</h4>
                            <p>{c.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Products for students */}
        <section className="sp-section sp-products-section">
            <div className="sp-inner">
                <span className="sp-section-tag">What you can use</span>
                <h2 className="sp-section-title">Built for how you study</h2>
                <div className="sp-grid sp-grid--3">
                    {products.map((p, i) => (
                        <div className="sp-product-card" key={i}>
                            <div className="sp-card-icon">{p.icon}</div>
                            <h3>{p.title}</h3>
                            <p>{p.desc}</p>
                            {p.to
                                ? <Link to={p.to} className="sp-card-link">{p.cta}</Link>
                                : <span className="sp-card-link sp-card-link--soon">{p.cta}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Achieve Mastery */}
        <section className="sp-section">
            <div className="sp-inner">
                <span className="sp-section-tag">How it works</span>
                <h2 className="sp-section-title">Achieve Mastery</h2>
                <div className="sp-steps">
                    {masterySteps.map((s, i) => (
                        <div className="sp-step" key={i}>
                            <div className="sp-step-icon">{s.icon}</div>
                            <h4>{s.label}</h4>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="sp-section sp-final-cta">
            <div className="sp-inner">
                <h2>Ready to start learning?</h2>
                <p>Try 2 full practice tests free — no credit card. Plans start at $30.</p>
                <div className="sp-cta-row sp-cta-row--center">
                    <Link to="/signUpPlans" className="sp-btn sp-btn--white">Get started free</Link>
                    <Link to="/products/test-prep" className="sp-btn sp-btn--outline-white">See AP Test Prep</Link>
                </div>
            </div>
        </section>
    </div>
);

export default Student;
