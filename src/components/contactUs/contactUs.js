import React, { useState } from 'react';
import { Row, Col, Container } from "react-bootstrap";
import './contactUs.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { toast, ToastContainer } from 'react-toastify';
import { PopupButton } from "react-calendly";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error("Please enter your name");
            return;
        }
        if (!formData.email.trim() || !isValidEmail(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!formData.message.trim()) {
            toast.error("Please enter your message");
            return;
        }

        setIsSubmitting(true);
        
        // Simulate form submission - replace with actual API call
        setTimeout(() => {
            toast.success("Thank you for your message! We'll get back to you soon.");
            setFormData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className='fwidth contact-page' style={{marginBottom:"20px", paddingTop:"60px", backgroundColor: 'white' }}>
            <div style={{width:"100%" , justifyContent:"center" , display:"flex"}}>
                <div className='mainContainerWrapper'>
                    {/* Hero Section */}
                    <div className="contact-hero">
                        <div className="">
                            <div className="col-12 col-md-12 col-lg-12 mt-5">
                                <div className='text-center'>
                                    <div className="heading-wrapper">
                                            <div className="heading-rays">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                            </div>
                        
                                            <div className="main-heading">
                                                    Get in Touch
                                            </div>
                                    </div>
                                    <div className="pt-3 sub-heading">
                                        Have questions about aiPlato? We'd love to hear from you. <br/>
                                        Send us a message and we'll respond as soon as possible.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="contact-content">
                        <div>
                            <Row>
                                {/* Contact Information Cards */}
                                <Col xs={12} lg={4} className="mb-4 mb-lg-0">
                                    <div className="contact-info-section">
                                        {/* Email Card */}
                                        {/* <div className="contact-card">
                                            <div className="contact-card-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                            </div>
                                            <h3 className="contact-card-title">Email Us</h3>
                                            <p className="contact-card-text">Our team is here to help</p>
                                            <a href="mailto:info@aiplato.ai" className="contact-card-link">info@aiplato.ai</a>
                                        </div> */}

                                        {/* Pilot Program Card */}
                                        <div className="contact-card">
                                            <div className="contact-card-icon pilot-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                                                </svg>
                                            </div>
                                            <h3 className="contact-card-title">Pilot Program</h3>
                                            <p className="contact-card-text">Interested in running a pilot?</p>
                                            <a href="mailto:pilot@aiplato.ai" className="contact-card-link">pilot@aiplato.ai</a>
                                        </div>

                                        {/* Support Card */}
                                        <div className="contact-card">
                                            <div className="contact-card-icon support-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                </svg>
                                            </div>
                                            <h3 className="contact-card-title">Support</h3>
                                            <p className="contact-card-text">Need technical assistance?</p>
                                            <a href="mailto:support@aiplato.ai" className="contact-card-link">support@aiplato.ai</a>
                                        </div>
                                    </div>
                                </Col>

                                {/* Contact Form */}
                                <Col xs={12} lg={8}>
                                    <div className="contact-form-div">
                                        <h2 className="form-title">Send us a Message</h2>
                                        <p className="form-subtitle">Fill out the form below and we'll get back to you within 24 hours.</p>
                                        
                                        <Box component="form" onSubmit={handleSubmit} className="contact-form">
                                            <Row>
                                                <Col xs={12} md={6} className="mb-3">
                                                    <TextField
                                                        fullWidth
                                                        label="Your Name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        required
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '10px',
                                                                backgroundColor: '#f8f9fa'
                                                            }
                                                        }}
                                                    />
                                                </Col>
                                                <Col xs={12} md={6} className="mb-3">
                                                    <TextField
                                                        fullWidth
                                                        label="Email Address"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        required
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '10px',
                                                                backgroundColor: '#f8f9fa'
                                                            }
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} className="mb-3">
                                                    <TextField
                                                        fullWidth
                                                        label="Subject"
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '10px',
                                                                backgroundColor: '#f8f9fa'
                                                            }
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} className="mb-3">
                                                    <TextField
                                                        fullWidth
                                                        label="Your Message"
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        multiline
                                                        rows={5}
                                                        required
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '10px',
                                                                backgroundColor: '#f8f9fa'
                                                            }
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        disabled={isSubmitting}
                                                        className="submit-btn"
                                                        sx={{
                                                            backgroundColor: '#003392',
                                                            borderRadius: '10px',
                                                            padding: '12px 40px',
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            textTransform: 'none',
                                                            '&:hover': {
                                                                backgroundColor: '#002266'
                                                            }
                                                        }}
                                                    >
                                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Box>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="contact-cta">
                <div className='mainContainerWrapper'>
                    <Row className="justify-content-center">
                        <Col xs={12} md={10} lg={8} className="text-center">
                            <h2 className="cta-title">Ready to Transform Your Teaching?</h2>
                            <p className="cta-text">
                                Join educators worldwide who are using aiPlato to enhance student learning outcomes.
                            </p>
                            <div className="cta-buttons">
                                <PopupButton
                                    url="https://calendly.com/pilot-aiplato/aiplato"
                                    rootElement={document.getElementById("root")}
                                    text="Schedule a Demo"
                                    className="cta-btn cta-btn-primary"
                                />
                                <a href="/requestDemo?type=pilot" className="cta-btn cta-btn-secondary">Start a Pilot</a>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default ContactUs;
