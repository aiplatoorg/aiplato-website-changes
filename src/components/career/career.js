import React, { Component } from 'react';
import { Row, Col, Container } from "react-bootstrap";
import './career.scss';
import { getIsPrivate } from '../../common/Functions';
import experienceIcon from '../../assets/images/experience-icon.svg';

class Career extends Component {

    state = {
        isPrivate: false,
    }

    componentWillMount() {
        this.setState({ isPrivate: getIsPrivate() })
    }

    render() {
        const scrollTo = (id) => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        };

        return (
            <>
            <div className='mainContainerWrapper'>
                <div className="banner-pt career-wrapper">
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
                                        Current Openings
                                    </div>
                                </div>

                                <div className="pt-3 sub-heading">
                                    Unlock Your Potential with Us: Discover Rewarding <br />
                                    Careers in Education and AI
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='py-5'>
                        <div className="pb-3 inlineHeigth copyText text-center">aiPlato offers an intellectually thriving environment with a stellar team of educators from Harvard/Stanford, AI experts from Silicon Valley giants, and entrepreneurial engineers.</div>

                        <div className='careerLinks'>
                            <button onClick={() => scrollTo('backend-section')} className='btnBlack mx-2'>Backend Engineer</button>
                            <button onClick={() => scrollTo('frontend-section')} className='btnBlack mx-2'>Frontend Engineer</button>
                            <button onClick={() => scrollTo('ml-section')} className='btnBlack mx-2'>AI/ML Engineer</button>
                            <button onClick={() => scrollTo('ux-section')} className='btnBlack mx-2'>UX Designer</button>
                            <button onClick={() => scrollTo('contentAuthor-section')} className='btnBlack mx-2'>Content Authors</button>
                        </div>
                    </div>
                </div>

                {/* Why Join Us */}
                <div className='bg-white pb-5'>
                    <div className='d-flex flex-column justify-content-center align-items-center text-center'>
                        <div className="subheadText">Why Join Us?</div>
                        <div className="pb-3 inlineHeigth copyText" style={{color: "#747575"}}>
                           At aiPlato, you’ll build the backbone of cutting-edge AI technologies while shaping the future of education. You’ll work on scalable backend systems that power intelligent tutoring, personalized learning, and advanced analytics for students in universities and K–12 institutions. If you’re passionate about backend engineering, excited about AI-powered education, and want to make a real impact in students’ lives, we’d love to hear from you!
                        </div>
                    </div>
                </div>
            </div>

                {/* Backend Engineer */}
                <div className='bg-gray1 py-5' id="backend-section" style={{width:"100%" , display:"flex" , justifyContent:"center"}}>
                    <div className='mainContainerWrapper'>
                        <div className="subheadText" style={{ fontSize: "30px"}}>Backend Engineer <span style={{fontSize: "18px"}}>(Python, APIs, AWS)</span></div>
                        <div className="pb-3 inlineHeigth copyText d-flex align-items-center"><span className='border border-dark rounded-pill py-1 px-2 mr-2'>Full Time</span> <img alt='experience-icon' src={experienceIcon} style={{ width: "32px", height: "32px" }} /> 2–4 Years</div>

                        <div className="font-weight-bold">Job Summary</div>
                        <div className='copyText pb-3'>aiPlato is an EdTech startup revolutionizing STEM education for students in universities and K–12 institutions through intelligent, AI-driven platforms. We are looking for a highly motivated Backend Engineer with a strong foundation in computer science and backend systems. The ideal candidate will have hands-on experience in building scalable APIs, deploying cloud-native applications, and supporting AI-driven educational products in production.</div>

                        <div className="font-weight-bold">Key Responsibilities:</div>
                        <ul className='copyText'>
                            <li>Design, develop, and maintain backend services using Python (Django/FastAPI/Flask)</li>
                            <li>Build scalable, secure, and efficient RESTful APIs for AI-powered education products</li>
                            <li>Deploy, monitor, and optimize applications in AWS cloud environments (EC2, S3, RDS, Lambda)</li>
                            <li>Ensure platform reliability, performance, and security for large-scale student usage</li>
                            <li>Collaborate closely with AI/ML engineers, frontend developers, and product teams to deliver end-to-end solutions</li>
                            <li>Implement best practices in backend architecture, database design, and cloud-native deployments</li>
                            <li>Contribute to continuous integration, testing, and release workflows</li>
                        </ul>

                        <div className="font-weight-bold">Required Skills:</div>
                        <ul className='copyText'>
                            <li>Strong Python programming experience with backend frameworks (Django/FastAPI/Flask)</li>
                            <li>Expertise in AWS services (EC2, S3, RDS, Lambda) and deployment workflows</li>
                            <li>Solid experience with REST API design, development, and integration</li>
                            <li>Familiarity with Docker, CI/CD pipelines, and version control (Git)</li>
                            <li>Understanding of performance tuning, caching strategies, and backend security principles</li>
                        </ul>

                        <div className="font-weight-bold">Nice to Have:</div>
                        <ul className='copyText'>
                            <li>Exposure to AI-driven or EdTech applications</li>
                            <li>Experience with serverless architectures and microservices-based systems</li>
                            <li>Knowledge of real-time data processing (e.g., WebSockets, streaming frameworks)</li>
                            <li>Familiarity with monitoring, logging, and observability tools</li>
                            <li>Interest in Physics or educational technology</li>
                        </ul>

                        <div className="font-weight-bold">Education:</div>
                        <div className='copyText'>Bachelor’s/Master’s in Computer Science, Computer Engineering, or a related technical field</div>

                        <div className='text-center pt-4' style={{width: "100%", justifyContent: "center" , display: "flex"}}>
                            <a 
                                href="mailto:career@aiplato.ai" 
                                className="" 
                                style={{
                                display: "inline-block",
                                backgroundColor: "#4252AF",
                                color: "#ffffff",
                                padding: "8px 20px",
                                borderRadius: "25px",
                                fontSize: "16px",
                                textDecoration: "none",
                                fontWeight: "500",
                                transition: "0.3s"}}
                            >
                                Apply Here
                            </a>
                        </div>
                    </div>
                </div>

                {/* Frontend Developer */}
                <div className='py-5' id="frontend-section" style={{width:"100%" , display:"flex" , justifyContent:"center"}}>
                    <div className='mainContainerWrapper '>
                        <div className="subheadText" style={{ fontSize: "30px"}}>Frontend Engineer <span style={{fontSize: "18px"}}>(React / React Native)</span></div>
                        <div className="pb-3 inlineHeigth copyText d-flex align-items-center"><span className='border border-dark rounded-pill py-1 px-2 mr-2'>Full Time</span> <img alt='experience-icon' src={experienceIcon} style={{ width: "32px", height: "32px" }} /> 2–3 Years</div>

                        <div className="font-weight-bold">Job Summary</div>
                        <div className='copyText pb-3'>We are seeking a talented and detail-oriented Frontend Developer with 2–3 years of experience to join our team. The ideal candidate should have solid experience in React, React Native, HTML5, CSS3, and a good understanding of QA processes. Additional knowledge of Python and Django is a plus.</div>

                        <div className="font-weight-bold">Key Responsibilities:</div>
                        <ul className='copyText'>
                            <li>Build responsive and dynamic web and mobile applications using React and React Native.</li>
                            <li>Convert UI/UX designs into clean and functional front-end components using HTML, CSS, and JavaScript (ES6+).</li>
                            <li>Collaborate closely with designers, backend developers, and QA to deliver a seamless user experience.</li>
                            <li>Participate in code reviews and follow best practices in frontend architecture and styling.</li>
                            <li>Support basic QA activities including test case writing, manual testing, and defect validation.</li>
                            <li>Ensure cross-browser compatibility and performance optimization.</li>
                        </ul>

                        <div className="font-weight-bold">Required Skills:</div>
                        <ul className='copyText'>
                            <li>2–3 years of professional experience in Frontend Development.</li>
                            <li>Proficiency in ReactJS and React Native.</li>
                            <li>Strong foundation in HTML5, CSS3, and JavaScript (ES6+).</li>
                            <li>Experience with responsive and mobile-first design principles.</li>
                            <li>Familiarity with version control using Git.</li>
                            <li>Understanding of basic QA/testing processes.</li>
                            <li>Strong communication and problem-solving abilities.</li>
                        </ul>

                        <div className="font-weight-bold">Nice to Have:</div>
                        <ul className='copyText'>
                            <li>Knowledge of Python and Django.</li>
                            <li>Experience with WebSocket for real-time features.</li>
                            <li>Familiarity with Jira or other project management tools.</li>
                            <li>Exposure to testing tools like Jest, React Testing Library, or Cypress.</li>
                            <li>Experience working with RESTful APIs and JSON data.</li>
                            <li>Familiarity with design tools like Figma, Sketch, or Adobe XD.</li>
                            <li>Understanding of CI/CD tools and deployment processes.</li>
                        </ul>

                        <div className="font-weight-bold">Education:</div>
                        <div className='copyText'>Bachelor’s degree in Computer Science, Engineering, or a related field.</div>
                        <div className='text-center pt-4' style={{width: "100%", justifyContent: "center" , display: "flex"}}>
                            <a 
                                href="mailto:career@aiplato.ai" 
                                className="" 
                                style={{
                                display: "inline-block",
                                backgroundColor: "#4252AF",
                                color: "#ffffff",
                                padding: "8px 20px",
                                borderRadius: "25px",
                                fontSize: "16px",
                                textDecoration: "none",
                                fontWeight: "500",
                                transition: "0.3s"}}
                            >
                                Apply Here
                            </a>
                        </div>
                    </div>
                </div>

                {/* AI/ML Engineer */}
                <div className='bg-gray1 py-5' id="ml-section" style={{width:"100%" , display:"flex" , justifyContent:"center"}}>
                    <div className='mainContainerWrapper'>
                        <div className="subheadText" style={{ fontSize: "30px"}}>AI/ML Engineer</div>
                        <div className="pb-3 inlineHeigth copyText d-flex align-items-center"><span className='border border-dark rounded-pill py-1 px-2 mr-2'>Full Time</span> <img alt='experience-icon' src={experienceIcon} style={{ width: "32px", height: "32px" }} /> 2–4 Years</div>

                        <div className="font-weight-bold">Job Summary</div>
                        <div className='copyText pb-3'>aiPlato is an EdTech startup revolutionizing STEM education for students in universities and K–12 institutions through intelligent, AI-driven platforms. We are looking for a highly motivated AI/ML Engineer with a strong foundation in computer science and a passion for physics. The ideal candidate will have hands-on experience in designing, developing, and deploying machine learning models, with deep knowledge of data structures, algorithms, and prompt engineering using state-of-the-art tools like ChatGPT and Retrieval-Augmented Generation (RAG).  </div>

                        <div className="font-weight-bold">Key Responsibilities:</div>
                        <ul className='copyText'>
                            <li>Design, develop, and deploy machine learning and AI models for educational applications  </li>
                            <li>Work on advanced NLP systems including ChatGPT integration and RAG-based pipelines</li>
                            <li>Conduct prompt engineering and iterative tuning to improve AI-generated responses</li>
                            <li>Handle large-scale datasets, perform feature engineering, data preprocessing, and optimization</li>
                            <li>Collaborate with cross-functional teams including subject matter experts in physics and product engineers</li>
                            <li>Optimize model performance and manage deployment workflows in production environments</li>
                            <li>Stay up-to-date with the latest research in AI/ML and apply best practices to ongoing projects</li>
                        </ul>

                        <div className="font-weight-bold">Required Skills:</div>
                        <ul className='copyText'>
                            <li>Strong Python programming skills and experience in ML libraries: NumPy, Pandas, Scikit-learn, TensorFlow or PyTorch</li>
                            <li>Solid grasp of data structures, algorithms, and computational problem solving</li>
                            <li>Hands-on experience with end-to-end ML project lifecycle: data wrangling, model training, evaluation, and deployment</li>
                            <li>Familiarity with modern NLP techniques and LLM APIs (e.g., OpenAI, LangChain, RAG frameworks)</li>
                            <li>Experience with REST APIs, version control (Git), and basic cloud deployment (e.g., AWS, GCP)</li>
                            <li>Ability to work independently and collaboratively in a fast-paced environment</li>
                        </ul>

                        <div className="font-weight-bold">Nice to Have:</div>
                        <ul className='copyText'>
                            <li>Background in Physics or strong interest in the subject, especially university-level courses like PH101</li>
                            <li>Prior experience in EdTech or building AI-powered educational tools</li>
                            <li>Exposure to prompt tuning, embeddings, vector databases (e.g., FAISS, Pinecone)</li>
                            <li>Familiarity with tools like Hugging Face Transformers, MLflow, Docker, and CI/CD pipelines</li>
                            <li>Understanding of MLOps and scalable model serving</li>
                        </ul>

                        <div className="font-weight-bold">Education:</div>
                        <div className='copyText'>Bachelor’s/Master’s/PhD in Computer Science, Data Science, AI/ML, or a related field</div>
                        <div className='copyText'>Degrees in Physics, Mathematics, or Engineering with a computational focus are also welcome</div>
                        <div className='text-center pt-4' style={{width: "100%", justifyContent: "center" , display: "flex"}}>
                            <a 
                                href="mailto:career@aiplato.ai" 
                                className="" 
                                style={{
                                display: "inline-block",
                                backgroundColor: "#4252AF",
                                color: "#ffffff",
                                padding: "8px 20px",
                                borderRadius: "25px",
                                fontSize: "16px",
                                textDecoration: "none",
                                fontWeight: "500",
                                transition: "0.3s"}}
                            >
                                Apply Here
                            </a>
                        </div>
                    </div>
                </div>

                {/* UX Designer */}
                <div className='py-5' id="ux-section" style={{width:"100%" , display:"flex" , justifyContent:"center"}}>
                    <div className='mainContainerWrapper '>
                        <div className="subheadText" style={{ fontSize: "30px"}}>UX Designer</div>
                        <div className="pb-3 inlineHeigth copyText d-flex align-items-center"><span className='border border-dark rounded-pill py-1 px-2 mr-2'>Full Time</span> <img alt='experience-icon' src={experienceIcon} style={{ width: "32px", height: "32px" }} />4–5 Years</div>

                        <div className="font-weight-bold">Job Summary</div>
                        <div className='copyText pb-3'>We are seeking an experienced and user-focused UX Designer with 4–5 years of professional experience to join our team. The ideal candidate should have a strong background in user research, wireframing, prototyping, and usability testing. You will collaborate with product managers, developers, and designers to craft intuitive, engaging, and scalable user experiences for web and mobile applications.</div>

                        <div className="font-weight-bold">Key Responsibilities:</div>
                        <ul className='copyText'>
                            <li>Conduct and lead user research activities including interviews, surveys, and usability testing.</li>
                            <li>Create wireframes, user flows, and interactive prototypes to effectively communicate design concepts.</li>
                            <li>Collaborate closely with stakeholders to translate business requirements into user-centered design solutions.</li>
                            <li>Ensure usability, accessibility, and design consistency across platforms (web and mobile).</li>
                            <li>Facilitate design reviews and provide actionable feedback to enhance product usability.</li>
                            <li>Analyze user feedback and analytics to iterate on designs and improve user journeys.</li>
                            <li>Mentor junior designers and contribute to building a strong UX culture within the team.</li>
                            <li>Stay updated with UX trends, tools, and best practices.</li>
                        </ul>

                        <div className="font-weight-bold">Required Skills:</div>
                        <ul className='copyText'>
                        <li>4–5 years of professional experience in UX Design.</li>
                        <li>Expertise in wireframing and prototyping tools (Figma, Sketch, Adobe XD, or similar).</li>
                        <li>Strong understanding of user-centered design principles and usability heuristics.</li>
                        <li>Proven experience in user research and usability testing.</li>
                        <li>Ability to design for responsive and mobile-first experiences.</li>
                        <li>Strong documentation skills (personas, user journeys, design specifications).</li>
                        <li>Excellent collaboration, communication, and problem-solving abilities.</li>
                        </ul>

                        <div className="font-weight-bold">Nice to Have:</div>
                        <ul className='copyText'>
                        <li>Knowledge of UI design and ability to create high-fidelity mockups.</li>
                        <li>Familiarity with accessibility standards (WCAG).</li>
                        <li>Experience with analytics and user behavior tools (Google Analytics, Hotjar, Mixpanel).</li>
                        <li>Understanding of front-end technologies (HTML, CSS, React) for effective collaboration with developers.</li>
                        <li>Experience in Agile/Scrum environments.</li>
                        <li>Familiarity with Jira or other project management tools.</li>
                        </ul>

                        <div className="font-weight-bold">Education:</div>
                        <div className='copyText'>Bachelor’s degree in Design, Human-Computer Interaction (HCI), Psychology, or a related field.</div>
                        <div className='text-center pt-4' style={{width: "100%", justifyContent: "center" , display: "flex"}}>
                            <a 
                                href="mailto:career@aiplato.ai" 
                                className="" 
                                style={{
                                display: "inline-block",
                                backgroundColor: "#4252AF",
                                color: "#ffffff",
                                padding: "8px 20px",
                                borderRadius: "25px",
                                fontSize: "16px",
                                textDecoration: "none",
                                fontWeight: "500",
                                transition: "0.3s"}}
                            >
                                Apply Here
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Content Author */}
                <div className='bg-gray1 py-5' id="contentAuthor-section" style={{width:"100%" , display:"flex" , justifyContent:"center"}}>
                    <div className='mainContainerWrapper'>
                        <div className="subheadText" style={{ fontSize: "30px"}}>Content Author : Physics Teachers</div>
                        <div className="pb-3 inlineHeigth copyText d-flex align-items-center"><span className='border border-dark rounded-pill py-1 px-2 mr-2'>Full Time</span> <img alt='experience-icon' src={experienceIcon} style={{ width: "32px", height: "32px" }} /> 4–6 Years</div>

                        <div className="font-weight-bold">Job Summary</div>
                        <div className='copyText pb-3'>We are seeking an experienced Physics Content Author to develop engaging and accurate AP Physics curriculum and contribute to innovative AI-driven educational solutions.</div>

                        <div className="font-weight-bold">Key Responsibilities:</div>
                        <ul className='copyText'>
                            <li>Develop content for AP Physics C (Mechanics & E&M) and AP Physics 1 & 2.</li>
                            <li>Curate and enrich the Knowledge Graph of physics with exercises and resources.</li>
                            <li>Contribute to guidelines for teachers and content developers.</li>
                            <li>Review content generated by AI and peers for accuracy and clarity.</li>
                            <li>Participate in research on innovative educational approaches.</li>
                            <li>Extend physics insights to STEM subjects beyond physics.</li>
                        </ul>

                        <div className="font-weight-bold">Required Skills:</div>
                        <ul className='copyText'>
                        <li>4–6 years of teaching or curriculum development experience in physics.</li>
                        <li>Strong expertise in AP Physics C (Mechanics, E&M) and AP Physics 1 & 2.</li>
                        <li>Classroom and online teaching experience.</li>
                        <li>Experience with 1-on-1 mentoring and student engagement.</li>
                        <li>Excellent written communication skills.</li>
                        </ul>

                        <div className="font-weight-bold">Nice to Have:</div>
                        <ul className='copyText'>
                        <li>Experience with digital learning platforms and interactive content.</li>
                        <li>Familiarity with AI-driven educational tools.</li>
                        <li>Passion for transforming education with innovative teaching methods.</li>
                        <li>Ability to source and adapt high-quality physics resources.</li>
                        <li>Openness to interdisciplinary STEM content development.</li>
                        </ul>

                        <div className="font-weight-bold">Education:</div>
                        <div className='copyText'>Bachelor’s or Master’s in Physics, Education, or a related STEM field.</div>
                        <div className='text-center pt-4' style={{width: "100%", justifyContent: "center" , display: "flex"}}>
                            <a 
                                href="mailto:career@aiplato.ai" 
                                className="" 
                                style={{
                                display: "inline-block",
                                backgroundColor: "#4252AF",
                                color: "#ffffff",
                                padding: "8px 20px",
                                borderRadius: "25px",
                                fontSize: "16px",
                                textDecoration: "none",
                                fontWeight: "500",
                                transition: "0.3s"}}
                            >
                                Apply Here
                            </a>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Career;
