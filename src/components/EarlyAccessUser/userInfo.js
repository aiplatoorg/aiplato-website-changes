import React, { Component } from 'react';
import { Row, Col, Container, Button } from "react-bootstrap"
import '../contactUs/contactUs.scss';
import './userinfo.css';
import { Multiselect } from "multiselect-react-dropdown";
import Form from 'react-bootstrap/Form';
import { saveearlyaccess, getearlyaccessemail, save_earlyaccesslink } from '../../common/API'
import { toast } from 'react-toastify';

class UserInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            grade: null,
            student_educator: null,
            validated: false,
            currentcourses: null,
            futurecourses: null,
            isteacher: false,
            // objcurrentcourses: [
            //     { key: "High School Physics", cat: "Physics" },
            //     { key: "AP Physics 1", cat: "Physics" },
            //     { key: "AP Physics 2", cat: "Physics" },
            //     { key: "AP Physics C: Mechanics", cat: "Physics" },
            //     { key: "AP Physics C: Electricity and Magnetism", cat: "Physics" },
            //     { key: "High School Chemistry", cat: "Chemistry" },
            //     { key: "AP Chemistry", cat: "Chemistry" },
            //     { key: "Precalculus with Trigonometry", cat: "Math" },
            //     { key: "Single-Variable Calculus", cat: "Math" },
            //     { key: "AP Calculus AB", cat: "Math" },
            //     { key: "AP Calculus BC", cat: "Math" },
            //     { key: "AP Statistics", cat: "Math" },

            // ],
            objcurrentcourses: [
                { key: "Physics", cat: "" },
                { key: "Chemistry", cat: "" },
                { key: "Calculus", cat: "" },
                { key: "Statistics", cat: "" },
            ],

            objcurrentcoursesEducator: [
                { key: "Free Access to AI-assisted Tutoring for Your Classroom", cat: "Engagement Options" },
                { key: "Contribute Your Own content for the AI models", cat: "Engagement Options" },
                { key: "1-on-1 Tutoring, Assisted by AI, for Your Own or aiPlato Students", cat: "Engagement Options" },
                // { key: "Free Access to 1-on-1 AI Plus Tutor for your Classroom Students", cat: "Engagement Options" },
                // { key: "Free Access to AI Teaching Assistant", cat: "Engagement Options" },





            ],
            objnextcourses: [
                { key: "High School Physics", cat: "Physics" },
                { key: "AP Physics 1", cat: "Physics" },
                { key: "AP Physics 2", cat: "Physics" },
                { key: "AP Physics C: Mechanics", cat: "Physics" },
                { key: "AP Physics C: Electricity and Magnetism", cat: "Physics" },
                { key: "High School Chemistry", cat: "Chemistry" },
                { key: "AP Chemistry", cat: "Chemistry" },
                { key: "Precalculus with Trigonometry", cat: "Math" },
                { key: "Single-Variable Calculus", cat: "Math" },
                { key: "AP Calculus AB", cat: "Math" },
                { key: "AP Calculus BC", cat: "Math" },
                { key: "AP Statistics", cat: "Math" },

            ],

        };
    }
    componentDidMount() {

        if (this.props.match.params.earlyaccessid !== undefined) {
            getearlyaccessemail(this.props.match.params.earlyaccessid).then(res => {

                if (res.status === 200) {
                    this.setState({ username: res.data.data.email, student_educator: res.data.data.student_educator })
                    let data = { 'email': res.data.data.email }
                    save_earlyaccesslink(data).then(res => {
                    }).catch(err => {
                        console.error(err.message)
                    })
                }
            }).catch(err => {
                alert(err.message)
                console.error(err.message)
                toast.error("Error!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            })
        }

    }

    handleusername(e) {
        this.setState({
            username: e.target.value
        });
    }
    handlegrade(e) {
        this.setState({
            grade: e.target.value
        });
    }
    onselectcurrentcourseseducator = (selectedList, selectedItem) => {
        this.setState({
            futurecourses: this.state.futurecourses !== null ? this.state.futurecourses + ", " + selectedItem.key : selectedItem.key
        })
    }

    onselectcurrentcourses = (selectedList, selectedItem) => {
        this.setState({
            currentcourses: this.state.currentcourses !== null ? this.state.currentcourses + ", " + selectedItem.key : selectedItem.key
        })
    }
    // onselectfuturecourses = (selectedList, selectedItem) => {
    //     this.setState({
    //         futurecourses: this.state.futurecourses !== null ? this.state.futurecourses + ", " + selectedItem.key : selectedItem.key
    //     })
    // }
    handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {


            let data =
            {
                'username': this.state.username,
                //'grade': this.state.grade,
                'currentcourses': this.state.currentcourses,
                'nextcourses': this.state.futurecourses,
                'isteacher': this.state.student_educator === "Student" ? false : true
            }

            saveearlyaccess(data).then(res => {

                if (res.status === 200) {
                    if (res.data['success'] === true) {
                        this.props.history.push('/thankyou');
                    }
                    else if (res.data['found'] === false) {

                        toast.error("Your email is not found in our system!", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
                    }
                }
                else {
                    toast.error("Server Error !", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                }
            }).catch(err => {
                console.error(err.message)
                toast.error("Error!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            })



        }
        this.setState({
            validated: true
        });

    }

    render() {
        return (
            <div className='fwidth userInfo'>
                <div className="homecontmpad container-fluid">
                    <Container className="">
                        <div className="col-12 col-md-12 col-lg-12">
                            <div className='homeBannerHead' style={{ color: 'white' }}>aiPlato<br />
                                <h1 style={{ color: 'white' }}>Early Access User Information</h1>
                            </div>
                            {/* <div className="mt-4"><a href="mailto:info@aiplato.ai" target='blank' className='btn btn-white'>Contact Us</a></div> */}
                        </div>
                    </Container>
                </div>
                <div className="container-fluid">
                    <Container className='pt-5'>
                        <Row>
                            <Col>
                                <h2 className="oftitle">Thank you for submitting your Early Access Request.</h2>
                                <p>Please take a moment to fill out the details about the courses you are interested in to help us better understand your needs!</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form onSubmit={this.handleSubmit}>

                                    <Form.Group as={Row} className="mb-2" controlId="formchallengename" style={{ alignItems: "center" }}>
                                        <Form.Label column="sm" sm={3} >
                                            User Name
                                        </Form.Label>
                                        <Col sm="9">
                                            <Form.Control placeholder="User Name" size="sm" type="text" disabled
                                                style={{ maxWidth: "455px", padding: "20px 0px 20px 10px" }}
                                                value={this.state.username}
                                                onChange={this.handleusername.bind(this)}
                                            />
                                            {/* <Form.Control.Feedback type="invalid">
                                            Please enter name.
                                        </Form.Control.Feedback> */}

                                        </Col>

                                    </Form.Group>


                                    <Form.Group as={Row} className="py-2" controlId="formsubsection"
                                        style={{ alignItems: "center" }}>
                                        <Form.Label column="sm" sm={3} className='pt-2'>
                                            Courses of Interest
                                        </Form.Label>
                                        <Col sm="9">


                                            <Multiselect
                                                onSelect={this.onselectcurrentcourses}
                                                style={{ width: "140px" }}
                                                options={this.state.objcurrentcourses}
                                                displayValue="key"

                                                placeholder="STEM Subject of Interest"
                                                showCheckbox={true}
                                            />
                                            <Form.Control placeholder="Courses of Interest"
                                                size="sm" type="text"
                                                //required
                                                style={{ width: "0px", display: 'none' }}
                                                value={this.state.currentcourses}

                                            />



                                            {/* <Form.Control.Feedback type="invalid">
                                            Please select current course.
                                        </Form.Control.Feedback> */}
                                        </Col>
                                    </Form.Group>
                                    {
                                        this.state.student_educator === "Educator" ? (

                                            <Form.Group as={Row} className="py-2" controlId="formsubsection"
                                                style={{ alignItems: "center" }}>
                                                <Form.Label column="sm" sm={3} className='pt-2'>
                                                    Involvement Type
                                                </Form.Label>
                                                <Col sm="9">


                                                    <Multiselect
                                                        onSelect={this.onselectcurrentcourseseducator}
                                                        style={{ width: "140px" }}
                                                        options={this.state.objcurrentcoursesEducator}
                                                        displayValue="key"
                                                        groupBy="cat"
                                                        placeholder="Involvement Type"
                                                        showCheckbox={true}
                                                    />
                                                    <Form.Control placeholder="Involvement Type"
                                                        size="sm" type="text"
                                                        //required
                                                        style={{ width: "0px", display: 'none' }}
                                                        value={this.state.currentcourses}

                                                    />



                                                    {/* <Form.Control.Feedback type="invalid">
                                                Please select current course.
                                            </Form.Control.Feedback> */}
                                                </Col>
                                            </Form.Group>
                                        ) : null

                                    }




                                    {/* <Form.Group as={Row} className="mb-2" controlId="formchallengename" style={{ alignItems: "center" }}>
                                <Form.Label column="sm" sm={4}>                                                   
                                    </Form.Label>
                                    <Col sm="5">
                                        <label className="labels" htmlFor="ishidden" style={{fontSize:"0.875rem"}}>
                                            <input
                                                id="ishidden"
                                                type="checkbox"                                   
                                                onChange={(event) => this.setState({isteacher: event.target.checked})}
                                            />
                                            <span style={{marginLeft:"10px"}}>I am a teacher </span>                                                        
                                        </label>
                                    </Col>

                                </Form.Group> */}

                                    {/* <Form.Group as={Row} className="mb-2" controlId="formsubsection" style={{ alignItems: "center" }}>
                                    <Form.Label column="sm" sm={4}>
                                        Future Courses (Planned)
                                    </Form.Label>
                                    <Col sm="8">
                                        <Multiselect
                                            style={{ width: "190px" }}
                                            onSelect={this.onselectfuturecourses}
                                            options={this.state.objnextcourses}
                                            displayValue="key"
                                            groupBy="cat"
                                            placeholder="Future Courses (Planned)"
                                            showCheckbox={true}
                                        />

                                        <Form.Control placeholder="Future Course" size="sm" type="text"
                                            required
                                            style={{ width: "0px", display: 'none' }}
                                            value={this.state.futurecourses}

                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select futur course.
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group> */}

                                    <Form.Group as={Row} className="mb-2" controlId="formthumbnailimage" style={{ marginTop: "20px" }}>
                                        <Form.Label column="sm" sm={3} ></Form.Label>
                                        <Col sm="9">
                                            <Button type="submit" variant="primary" style={{ marginBottom: "20px" }}>Save</Button>

                                        </Col>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>

                    </Container>
                </div>

            </div>

        )
    }
}

export default UserInfo;