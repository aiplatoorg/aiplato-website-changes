import React, { useEffect, useState } from 'react';
import { Row, Col } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import { Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput, Divider, RadioGroup, Radio, FormControlLabel, FormLabel } from "@mui/material";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { requestDemoDetailsSubmit, getRequestDemoDetailsByEmail } from '../../common/API';
import { isNil } from 'lodash';
import { showFullApp } from '../../common/Functions';
import CircularProgress from '@mui/material/CircularProgress';
import { useHistory } from 'react-router-dom';
import "./RequestDemo.scss"


const RequestDemo = () => {
    const history = useHistory();
    // Common styles for smaller fonts
    const smallFontStyle = {
        "& .MuiInputLabel-root": { fontSize: '0.875rem' },
        "& .MuiInputBase-input": { fontSize: '0.875rem' }
    };
    const selectStyle = {
        fontSize: '0.875rem',
        "& .MuiSelect-select": {
            paddingRight: '40px !important',
            paddingLeft: '14px !important',
            minHeight: '1.4375em'
        },
        "& .MuiOutlinedInput-notchedOutline": {
            paddingRight: '40px'
        }
    };
    const inputLabelStyle = { fontSize: '0.875rem' };
    const formControlStyle = { marginBottom: '8px' };
    const sectionBoxStyle = {
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '16px',
        marginBottom: '16px',
        border: '1px solid #e0e0e0'
    };

    const MobileFieldLabel = ({ children }) => (
        <div className="mobileFieldLabel">{children}</div>
    );

    // Define state variables for each form field
    const [requestSource, setRequestSource] = useState('');
    const [educatorName, setEducatorName] = useState('');
    const [instituteName, setInstituteName] = useState('');
    const [typeOfInstitute, setTypeOfInstitute] = useState([]);
    const [noOfStudentInPilot, setNoOfStudentInPilot] = useState();
    const [noOfTAs, setNoOfTAs] = useState('');
    const [courses, setCourses] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [courseType, setCourseType] = useState('');
    const [primaryTopic, setPrimaryTopic] = useState('');
    const [studentPopulation, setStudentPopulation] = useState('');
    const [pilotStartDate, setPilotStartDate] = useState('');
    const [textbook, setTextbook] = useState([]);
    const [homeworkPlatforms, setHomeworkPlatforms] = useState([]);
    const [homeworkProblemsFrom, setHomeworkProblemsFrom] = useState([]);
    const [homeworkGrading, setHomeworkGrading] = useState([]);
    const [freeResponseIn, setFreeResponseIn] = useState([]);
    const [otherAssignmentsGrading, setOtherAssignmentsGrading] = useState([]);
    const [latestTimeToSwitch, setLatestTimeToSwitch] = useState('');
    const [platformDecisionMaker, setPlatformDecisionMaker] = useState([]);
    const [platformPayment, setPlatformPayment] = useState([]);
    const [whoDeterminesTAs, setWhoDeterminesTAs] = useState('');
    const [whoDeterminesTAPositions, setWhoDeterminesTAPositions] = useState('');
    const [tutoringAvailable, setTutoringAvailable] = useState('');
    const [aiInitiatives, setAiInitiatives] = useState('');
    const [aiAdoptionLeader, setAiAdoptionLeader] = useState('');
    const [aiAdoptionLeaderOther, setAiAdoptionLeaderOther] = useState('');
    const [lmsUsed, setLmsUsed] = useState([]);
    const [requesterEmail, setRequesterEmail] = useState('');
    const [validRequesterEmail, setValidRequesterEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const [submitbuttonText, setSubmitbuttonText] = useState("Submit");

    const AUTOSAVE_DEBOUNCE_MS = 2000;

    const autosaveTimerRef = React.useRef(null);
    const lastAutosavePayloadRef = React.useRef(null);

    const normalizeNumberField = (value) => {
        if (value === '' || value === undefined || value === null) {
            return null;
        }
        const num = Number(value);
        return Number.isNaN(num) ? null : num;
    };

    const normalizeToArray = (value) => {
        if (!value) {
            return [];
        }
        if (Array.isArray(value)) {
            return value;
        }
        if (typeof value === 'string') {
            return value
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);
        }
        return [];
    };

    const mapApiDataToFormState = (apiData) => {
        if (!apiData) {
            return null;
        }

        return {
            requestSource: apiData.requestSource || requestSource,
            requesterEmail: apiData.requesterEmail || requesterEmail,
            educatorName: apiData.educatorName || '',
            instituteName: apiData.instituteName || '',
            typeOfInstitute: normalizeToArray(apiData.typeOfInstitute),
            noOfStudentInPilot: apiData.noOfStudentInPilot || '',
            noOfTAs: apiData.noOftasupportingInPilot ?? apiData.noOfTAs ?? '',
            courses: apiData.courses || '',
            courseDuration: apiData.courseDuration || '',
            courseType: apiData.courseType || '',
            primaryTopic: apiData.primaryTopic || '',
            studentPopulation: apiData.studentPopulation || '',
            pilotStartDate: apiData.pilotStartDate || '',
            textbook: normalizeToArray(apiData.textbook),
            homeworkPlatforms: normalizeToArray(apiData.homeworkPlatforms),
            homeworkProblemsFrom: normalizeToArray(apiData.homeworkProblemsFrom),
            homeworkGrading: normalizeToArray(apiData.homeworkGrading),
            freeResponseIn: normalizeToArray(apiData.freeResponseIn),
            otherAssignmentsGrading: normalizeToArray(apiData.otherAssignmentsGrading),
            latestTimeToSwitch: apiData.latestTimeToSwitch || '',
            platformDecisionMaker: normalizeToArray(apiData.platformDecisionMaker),
            platformPayment: normalizeToArray(apiData.platformPayment),
            whoDeterminesTAs: apiData.whoDeterminesTAs || '',
            whoDeterminesTAPositions: apiData.whoDeterminesTAPositions || '',
            tutoringAvailable: apiData.tutoringAvailable || '',
            aiInitiatives: apiData.aiInitiatives || '',
            aiAdoptionLeader: apiData.aiAdoptionLeader || '',
            aiAdoptionLeaderOther: apiData.aiAdoptionLeaderOther || '',
            lmsUsed: normalizeToArray(apiData.lmsUsed),
        };
    };

    const applyFormState = (formState) => {
        if (!formState) {
            return;
        }

        if (formState.requestSource) setRequestSource(formState.requestSource);
        if (formState.requesterEmail) setRequesterEmail(formState.requesterEmail);
        setEducatorName(formState.educatorName || '');
        setInstituteName(formState.instituteName || '');
        setTypeOfInstitute(formState.typeOfInstitute || []);
        setNoOfStudentInPilot(formState.noOfStudentInPilot || '');
        setNoOfTAs(formState.noOfTAs || '');
        setCourses(formState.courses || '');
        setCourseDuration(formState.courseDuration || '');
        setCourseType(formState.courseType || '');
        setPrimaryTopic(formState.primaryTopic || '');
        setStudentPopulation(formState.studentPopulation || '');
        setPilotStartDate(formState.pilotStartDate || '');
        setTextbook(formState.textbook || []);
        setHomeworkPlatforms(formState.homeworkPlatforms || []);
        setHomeworkProblemsFrom(formState.homeworkProblemsFrom || []);
        setHomeworkGrading(formState.homeworkGrading || []);
        setFreeResponseIn(formState.freeResponseIn || []);
        setOtherAssignmentsGrading(formState.otherAssignmentsGrading || []);
        setLatestTimeToSwitch(formState.latestTimeToSwitch || '');
        setPlatformDecisionMaker(formState.platformDecisionMaker || []);
        setPlatformPayment(formState.platformPayment || []);
        setWhoDeterminesTAs(formState.whoDeterminesTAs || '');
        setWhoDeterminesTAPositions(formState.whoDeterminesTAPositions || '');
        setTutoringAvailable(formState.tutoringAvailable || '');
        setAiInitiatives(formState.aiInitiatives || '');
        setAiAdoptionLeader(formState.aiAdoptionLeader || '');
        setAiAdoptionLeaderOther(formState.aiAdoptionLeaderOther || '');
        setLmsUsed(formState.lmsUsed || []);
    };

  
    const loadFormForEmail = async (email) => {
        if (!email || !isValidEmail(email)) {
            return;
        }

        setInitialLoadComplete(false);

        // Clear current form while we load new data for this email
        applyFormState({
            requestSource,
            requesterEmail: email,
            educatorName: '',
            instituteName: '',
            typeOfInstitute: [],
            noOfStudentInPilot: '',
            noOfTAs: '',
            courses: '',
            courseDuration: '',
            courseType: '',
            primaryTopic: '',
            studentPopulation: '',
            pilotStartDate: '',
            textbook: [],
            homeworkPlatforms: [],
            homeworkProblemsFrom: [],
            homeworkGrading: [],
            freeResponseIn: [],
            otherAssignmentsGrading: [],
            latestTimeToSwitch: '',
            platformDecisionMaker: [],
            platformPayment: [],
            whoDeterminesTAs: '',
            whoDeterminesTAPositions: '',
            tutoringAvailable: '',
            aiInitiatives: '',
            aiAdoptionLeader: '',
            aiAdoptionLeaderOther: '',
            lmsUsed: [],
        });

        try {
            const res = await getRequestDemoDetailsByEmail(email);
            if (res && res.data && res.data.status === 'success' && Array.isArray(res.data.data) && res.data.data.length > 0) {
                const apiFormState = mapApiDataToFormState(res.data.data[0]);
                applyFormState(apiFormState);
                toast.info("Loaded your previously submitted details.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            } else {
                // No server data for this email; keep the cleared form
            }
        } catch (error) {
            console.error('Error loading request demo details:', error);
            toast.error("Could not load saved details. You can continue filling the form.", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
        } finally {
            setInitialLoadComplete(true);
        }
    };

    // On mount, set requestSource from the URL and mark initial load complete
    useEffect(() => {
        if (!isNil(window.location.search) && window.location.search !== '') {
            const queryString = window.location.search.slice(1);
            let queryParamsArry = queryString.split("=")[1];
            setRequestSource(queryParamsArry);
        }
        setInitialLoadComplete(true);
    }, [])

    // const hasValidValues = () => {
    //     let isValid = requesterEmail.trim().length > 0 && isValidEmail(requesterEmail.trim()) ? true : false
    //     return isValid
    // }

    const setandValidateRequesterEmail = (e) => {
        const email = e.target.value;
        setRequesterEmail(email);
        if (email !== "") {
            const isValid = email.trim().length > 0 && isValidEmail(email.trim()) ? true : false;
            setValidRequesterEmail(isValid);
            if (isValid && requestSource === 'pilot') {
                loadFormForEmail(email.trim());
            }
        } else {
            setValidRequesterEmail(false);
            setInitialLoadComplete(false);
        }
    }

    const isValidEmail = (email) => {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
    }

    useEffect(() => {
        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current);
        }

        if (requestSource !== 'pilot' || !validRequesterEmail || !requesterEmail || !initialLoadComplete) {
            return;
        }

        const payload = {
            requestSource,
            email: requesterEmail,
            requesterEmail,
            educatorName,
            instituteName,
            typeOfInstitute,
            noOfStudentInPilot: normalizeNumberField(noOfStudentInPilot),
            noOfTAs: normalizeNumberField(noOfTAs),
            courses,
            courseType,
            primaryTopic,
            studentPopulation,
            courseDuration,
            pilotStartDate,
            textbook,
            homeworkPlatforms,
            homeworkProblemsFrom,
            homeworkGrading,
            freeResponseIn,
            otherAssignmentsGrading,
            latestTimeToSwitch,
            platformDecisionMaker,
            platformPayment,
            whoDeterminesTAs,
            whoDeterminesTAPositions,
            tutoringAvailable,
            aiInitiatives,
            aiAdoptionLeader,
            aiAdoptionLeaderOther,
            lmsUsed,
            isDraft: true,
        };

        const payloadString = JSON.stringify(payload);
        if (lastAutosavePayloadRef.current === payloadString) {
            return;
        }

        autosaveTimerRef.current = setTimeout(() => {
            requestDemoDetailsSubmit(payload)
                .then(() => {
                    lastAutosavePayloadRef.current = payloadString;
                })
                .catch((error) => {
                    console.error('Autosave failed:', error);
                });
        }, AUTOSAVE_DEBOUNCE_MS);

        return () => {
            if (autosaveTimerRef.current) {
                clearTimeout(autosaveTimerRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestSource, requesterEmail, educatorName, instituteName, typeOfInstitute, noOfStudentInPilot, noOfTAs, courses, courseDuration, courseType, primaryTopic, studentPopulation, pilotStartDate, textbook, homeworkPlatforms, homeworkProblemsFrom, homeworkGrading, freeResponseIn, otherAssignmentsGrading, latestTimeToSwitch, platformDecisionMaker, platformPayment, whoDeterminesTAs, whoDeterminesTAPositions, tutoringAvailable, aiInitiatives, aiAdoptionLeader, aiAdoptionLeaderOther, lmsUsed, validRequesterEmail])

    const handleBack = () => {
        if (history.length > 1) {
            history.goBack();
            return;
        }
        history.push("/educator");
    }

    const handleSubmit = (e) => {
        setLoading(true)
        setSubmitbuttonText("Submitting...")
        e.preventDefault();
        if (validRequesterEmail) {
            const formData = {
                requestSource,
                email: requesterEmail,
                requesterEmail,
                educatorName,
                instituteName,
                typeOfInstitute,
                noOfStudentInPilot: normalizeNumberField(noOfStudentInPilot),
                noOfTAs: normalizeNumberField(noOfTAs),
                courses,
                courseType,
                primaryTopic,
                studentPopulation,
                courseDuration,
                pilotStartDate,
                textbook,
                homeworkPlatforms,
                homeworkProblemsFrom,
                homeworkGrading,
                freeResponseIn,
                otherAssignmentsGrading,
                latestTimeToSwitch,
                platformDecisionMaker,
                platformPayment,
                whoDeterminesTAs,
                whoDeterminesTAPositions,
                tutoringAvailable,
                aiInitiatives,
                aiAdoptionLeader,
                aiAdoptionLeaderOther,
                lmsUsed,
            };
            // console.log(formData); // Log data for now
            // You can send this data to your backend or API here

            requestDemoDetailsSubmit(formData).then(res => {
                if (res.status === 200) {
                    setLoading(false)
                    setSubmitbuttonText("Submit")
                    if (requestSource === "pilot") {
                        toast.success("Thank you! Our team will contact you shortly to set up your pilot program.", {
                            position: toast.POSITION.BOTTOM_CENTER,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        })
                    }
                    else {
                        toast.success("Thank you! Our team will reach out soon to schedule a demo.", {
                            position: toast.POSITION.BOTTOM_CENTER,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        })
                    }

                    // setTimeout(() => {
                    //     setRequestSource(requestSource)
                    //     setValidRequesterEmail(false)
                    //     setRequesterEmail("")
                    //     setEducatorName("")
                    //     setInstituteName("")
                    //     setTypeOfInstitute([])
                    //     setNoOfStudentInPilot()
                    //     setNoOfTAs("")
                    //     setCourses("")
                    //     setCourseDuration("")
                    //     setCourseType("")
                    //     setPrimaryTopic("")
                    //     setStudentPopulation("")
                    //     setPilotStartDate("")
                    //     // Reset multi-select fields
                    //     setTextbook([])
                    //     setHomeworkPlatforms([])
                    //     setHomeworkProblemsFrom([])
                    //     setHomeworkGrading([])
                    //     setFreeResponseIn([])
                    //     setOtherAssignmentsGrading([])
                    //     setLatestTimeToSwitch("")
                    //     setPlatformDecisionMaker([])
                    //     setPlatformPayment([])
                    //     setWhoDeterminesTAs("")
                    //     setWhoDeterminesTAPositions("")
                    //     setTutoringAvailable("")
                    //     setAiInitiatives("")
                    //     setAiAdoptionLeader("")
                    //     setAiAdoptionLeaderOther("")
                    //     setLmsUsed([])
                    // }, 1000);

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
        else {
            toast.error("Please enter valid email address.", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
        }
    };

    return (

        <div className='fwidth' >
            <div className="banner-pt bg-gray1 pb-3" style={{display:"flex" , justifyContent:"center" , alignItems:"center"}}>
                <div className="mainContainerWrapper mt-2">
                    <div className="col-12 col-md-12 col-lg-12 text-center">
                        <div className='homeBannerHead1 heading-wrapper pt-0'>
                            <div className="heading-rays">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <h2>
                                {requestSource === 'demo' ?
                                    'Schedule a Demo – AI Teaching Assistant for STEM'
                                    :
                                    'Request a Pilot – AI Teaching Assistant for STEM'
                                }</h2>
                            <h3 style={{ marginTop: '10px', marginBottom: '20px' }}>{
                                requestSource === "demo" ?
                                    'Experience AI-Powered Learning'
                                    :
                                    'Bring AI-Powered Learning to Your Classroom'
                            }
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray1">
                <div className="mainContainerWrapper secpad">
                    <Row className="">
                        <Col xs={12} md={12}>
                            <div style={{ marginTop: '-30px' }} className="copyText text-center">
                                {requestSource === 'pilot' ?
                                    'Thank you for expressing interest in participating in aiPlato’s pilot program. We are committed to providing each pilot the resources necessary for maximum impact. To help us better understand your teaching context and ensure the pilot aligns with your needs, we ask you to kindly provide the following details:'
                                    :
                                    'The aiPlato Team is here for you! If you need a walk-through, group pricing, support, or have questions about AI, fill out this form, and we will be in touch.'
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="mainContainerWrapper">
                <div className='pt-2 pb-2'>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ my: { xs: 0.5, sm: 1 }, mx: 'auto', width: "100%" }}
                        className='whiteBG'
                    >
                        <Grid container spacing={2} sx={{ p: { xs: 0, sm: 2 } }}>
                            {/* Email Field */}
                            <Grid item xs={12}>
                                <MobileFieldLabel>Your Email</MobileFieldLabel>
                                <TextField
                                    fullWidth
                                    required
                                    autoFocus
                                    id="email"
                                    label="Your Email"
                                    name="email"
                                    autoComplete="email"
                                    value={requesterEmail}
                                    onChange={(e) => setandValidateRequesterEmail(e)}
                                    sx={{
                                        "& .MuiInputLabel-root": { fontSize: '0.875rem' },
                                        "& .MuiInputBase-input": { fontSize: '0.875rem' },
                                        "& .MuiFormHelperText-root": {
                                            fontSize: "11px !important",
                                            color: (!validRequesterEmail) ? 'red !important' : 'gray !important'
                                        },
                                    }}
                                    helperText={(!validRequesterEmail) ? 'Invalid email format' : 'Highly recommended for support and password recovery'}
                                />
                            </Grid>

                            {/* Section 1: Basic Information */}
                            <Grid item xs={12}>
                                <Box sx={sectionBoxStyle}>
                                    <Typography variant="h6" sx={{ mt: 0, mb: 1, fontWeight: 'bold', color: '#1976d2', fontSize: '1rem' }}>Basic Information</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <MobileFieldLabel>Educator Name</MobileFieldLabel>
                                            <TextField
                                                fullWidth
                                                name="educatorName"
                                                id="educatorName"
                                                label="Educator Name"
                                                value={educatorName}
                                                onChange={(e) => setEducatorName(e.target.value)}
                                                sx={{
                                                    "& .MuiInputLabel-root": { fontSize: '0.875rem' },
                                                    "& .MuiInputBase-input": { fontSize: '0.875rem' }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <MobileFieldLabel>Institution Name</MobileFieldLabel>
                                            <TextField
                                                fullWidth
                                                name="instituteName"
                                                id="instituteName"
                                                label="Institution Name"
                                                value={instituteName}
                                                onChange={(e) => setInstituteName(e.target.value)}
                                                sx={{
                                                    "& .MuiInputLabel-root": { fontSize: '0.875rem' },
                                                    "& .MuiInputBase-input": { fontSize: '0.875rem' }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <MobileFieldLabel>Type of Institution</MobileFieldLabel>
                                            <FormControl fullWidth>
                                                <InputLabel id="typeOfInstitute-label" sx={inputLabelStyle}>Type of Institution</InputLabel>
                                                <Select
                                                    labelId="typeOfInstitute-label"
                                                    id="typeOfInstitute"
                                                    multiple
                                                    value={typeOfInstitute}
                                                    onChange={(e) => setTypeOfInstitute(e.target.value)}
                                                    input={<OutlinedInput label="Type of Institution" />}
                                                    renderValue={(selected) => selected.join(', ')}
                                                    sx={{
                                                        ...selectStyle,
                                                        "& .MuiChip-root": { fontSize: '0.75rem', margin: '2px' },
                                                        "& .MuiSelect-select": {
                                                            paddingRight: '50px !important',
                                                            paddingLeft: '14px !important',
                                                            minHeight: 'auto',
                                                            paddingTop: '14px',
                                                            paddingBottom: '14px'
                                                        }
                                                    }}
                                                >
                                                    {['University', 'K–12 Public', 'K–12 Private', 'Community College', 'Online Course Provider', 'Other'].map((name) => (
                                                        <MenuItem key={name} value={name} sx={{ fontSize: '0.875rem' }}>
                                                            <Checkbox checked={typeOfInstitute.indexOf(name) > -1} />
                                                            <ListItemText primary={name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {requestSource === 'pilot' && (
                                            <>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Number of Students Participating in the Pilot</MobileFieldLabel>
                                                    <TextField
                                                        type='number'
                                                        fullWidth
                                                        name="noOfStudentInPilot"
                                                        id="NoOfStudentInPilot"
                                                        label="Number of Students Participating in the Pilot"
                                                        value={noOfStudentInPilot}
                                                        onChange={(e) => setNoOfStudentInPilot(e.target.value)}
                                                        sx={{
                                                            "& .MuiInputLabel-root": { fontSize: '0.875rem' },
                                                            "& .MuiInputBase-input": { fontSize: '0.875rem' }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Number of TAs Supporting This Course (if any)</MobileFieldLabel>
                                                    <TextField
                                                        type='number'
                                                        fullWidth
                                                        name="noOfTAs"
                                                        id="noOfTAs"
                                                        label="Number of TAs Supporting This Course (if any)"
                                                        value={noOfTAs}
                                                        onChange={(e) => setNoOfTAs(e.target.value)}
                                                        sx={{
                                                            "& .MuiInputLabel-root": { fontSize: '0.875rem' },
                                                            "& .MuiInputBase-input": { fontSize: '0.875rem' }
                                                        }}
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </Box>
                            </Grid>

                            {/* Section 2: Course Details */}
                            {requestSource === 'pilot' && (
                                <>
                                    <Grid item xs={12}>
                                        <Box sx={sectionBoxStyle}>
                                            <Typography variant="h6" sx={{ mt: 0, mb: 1, fontWeight: 'bold', color: '#1976d2', fontSize: '1rem' }}>Course Details</Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <MobileFieldLabel>Course Name(s)</MobileFieldLabel>
                                                    <TextField
                                                        fullWidth
                                                        name="courses"
                                                        id="courses"
                                                        label="Course Name(s)"
                                                        value={courses}
                                                        onChange={(e) => setCourses(e.target.value)}
                                                        sx={{
                                                            "& .MuiInputLabel-root": { fontSize: '0.875rem' },
                                                            "& .MuiInputBase-input": { fontSize: '0.875rem' }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={12}>
                                                    <MobileFieldLabel>Course Duration</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="courseDuration-label" sx={{ fontSize: '0.875rem' }}>Course Duration</InputLabel>
                                                        <Select
                                                            labelId="courseDuration-label"
                                                            id="courseDuration"
                                                            value={courseDuration}
                                                            label="Course Duration"
                                                            onChange={(e) => setCourseDuration(e.target.value)}
                                                            sx={{ fontSize: '0.875rem' }}
                                                        >
                                                            <MenuItem value="Semester" sx={{ fontSize: '0.875rem' }}>Semester</MenuItem>
                                                            <MenuItem value="Quarter" sx={{ fontSize: '0.875rem' }}>Quarter</MenuItem>
                                                            <MenuItem value="Academic Year" sx={{ fontSize: '0.875rem' }}>Academic Year</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={12}>
                                                    <FormControl component="fieldset" fullWidth sx={{ marginBottom: '4px' }}>
                                                        {/* <FormLabel component="legend" sx={{ fontSize: '0.875rem', mb: 0.25, mt: 0 }}>Course Type</FormLabel> */}
                                                        <RadioGroup
                                                            row
                                                            id="courseType"
                                                            value={courseType}
                                                            onChange={(e) => setCourseType(e.target.value)}
                                                            sx={{ mt: 0 }}
                                                        >
                                                            <FormControlLabel value="Algebra-based" control={<Radio size="small" />} label="Algebra-based" sx={{ "& .MuiFormControlLabel-label": { fontSize: '0.875rem' } }} />
                                                            <FormControlLabel value="Calculus-based" control={<Radio size="small" />} label="Calculus-based" sx={{ "& .MuiFormControlLabel-label": { fontSize: '0.875rem' } }} />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={12}>
                                                    <FormControl component="fieldset" fullWidth sx={{ marginBottom: '4px' }}>
                                                        {/* <FormLabel component="legend" sx={{ fontSize: '0.875rem', mb: 0.25, mt: 0 }}>Primary Topic</FormLabel> */}
                                                        <RadioGroup
                                                            row
                                                            id="primaryTopic"
                                                            value={primaryTopic}
                                                            onChange={(e) => setPrimaryTopic(e.target.value)}
                                                            sx={{ mt: 0 }}
                                                        >
                                                            <FormControlLabel value="Mechanics" control={<Radio size="small" />} label="Mechanics" sx={{ "& .MuiFormControlLabel-label": { fontSize: '0.875rem' } }} />
                                                            <FormControlLabel value="Electricity & Magnetism" control={<Radio size="small" />} label="Electricity & Magnetism" sx={{ "& .MuiFormControlLabel-label": { fontSize: '0.875rem' } }} />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={12}>
                                                    <FormControl component="fieldset" fullWidth sx={{ marginBottom: '4px' }}>
                                                        {/* <FormLabel component="legend" sx={{ fontSize: '0.875rem', mb: 0.25, mt: 0 }}>Student Population</FormLabel> */}
                                                        <RadioGroup
                                                            row
                                                            id="studentPopulation"
                                                            value={studentPopulation}
                                                            onChange={(e) => setStudentPopulation(e.target.value)}
                                                            sx={{ mt: 0 }}
                                                        >
                                                            <FormControlLabel value="Engineering majors" control={<Radio size="small" />} label="Engineering majors" sx={{ "& .MuiFormControlLabel-label": { fontSize: '0.875rem' } }} />
                                                            <FormControlLabel value="Life science majors" control={<Radio size="small" />} label="Life science majors" sx={{ "& .MuiFormControlLabel-label": { fontSize: '0.875rem' } }} />
                                                            <FormControlLabel value="Other" control={<Radio size="small" />} label="Other" sx={{ "& .MuiFormControlLabel-label": { fontSize: '0.875rem' } }} />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={12}>
                                                    <MobileFieldLabel>Earliest Start Date for Pilot</MobileFieldLabel>
                                                    <TextField
                                                        type="date"
                                                        fullWidth
                                                        name="pilotStartDate"
                                                        id="pilotStartDate"
                                                        label="Earliest Start Date for Pilot"
                                                        value={pilotStartDate}
                                                        onChange={(e) => setPilotStartDate(e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                        sx={{
                                                            "& .MuiInputLabel-root": { fontSize: '0.875rem' },
                                                            "& .MuiInputBase-input": { fontSize: '0.875rem' }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </>
                            )}

                            {/* Section 3: Teaching Materials & Homework */}
                            {requestSource === 'pilot' && (
                                <>
                                    <Grid item xs={12}>
                                        <Box sx={sectionBoxStyle}>
                                            <Typography variant="h6" sx={{ mt: 0, mb: 1, fontWeight: 'bold', color: '#1976d2', fontSize: '1rem' }}>Teaching Materials & Homework</Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Textbook(s) Used (if any)</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="textbook-label" sx={{ fontSize: '0.875rem' }}>Textbook(s) Used (if any)</InputLabel>
                                                        <Select
                                                            labelId="textbook-label"
                                                            id="textbook"
                                                            multiple
                                                            value={textbook}
                                                            onChange={(e) => setTextbook(e.target.value)}
                                                            input={<OutlinedInput label="Textbook(s) Used (if any)" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            sx={{
                                                                ...selectStyle,
                                                                "& .MuiChip-root": { fontSize: '0.75rem', margin: '2px' },
                                                                "& .MuiSelect-select": {
                                                                    paddingRight: '50px !important',
                                                                    paddingLeft: '14px !important',
                                                                    minHeight: 'auto',
                                                                    paddingTop: '14px',
                                                                    paddingBottom: '14px'
                                                                }
                                                            }}
                                                        >
                                                            {['My lecture notes', 'OpenStax', 'Halliday–Resnick', 'Serway', 'Young & Freedman', 'Knight', 'Giancoli', 'Other'].map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={textbook.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Online Homework Platforms Used (Current or Prior)</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="homeworkPlatforms-label" sx={inputLabelStyle}>Online Homework Platforms Used (Current or Prior)</InputLabel>
                                                        <Select
                                                            labelId="homeworkPlatforms-label"
                                                            id="homeworkPlatforms"
                                                            multiple
                                                            value={homeworkPlatforms}
                                                            onChange={(e) => setHomeworkPlatforms(e.target.value)}
                                                            input={<OutlinedInput label="Online Homework Platforms Used (Current or Prior)" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            sx={selectStyle}
                                                        >
                                                            {['None', 'Mastering Physics', 'WebAssign', 'ExpertTA', 'WileyPlus', 'Achieve', 'Other'].map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={homeworkPlatforms.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Homework Problems are From</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="homeworkProblemsFrom-label" sx={inputLabelStyle}>Homework Problems are From</InputLabel>
                                                        <Select
                                                            labelId="homeworkProblemsFrom-label"
                                                            id="homeworkProblemsFrom"
                                                            multiple
                                                            value={homeworkProblemsFrom}
                                                            onChange={(e) => setHomeworkProblemsFrom(e.target.value)}
                                                            input={<OutlinedInput label="Homework Problems are From" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            sx={selectStyle}
                                                        >
                                                            {['Textbook', 'Online homework platform', 'Instructor-created problem sets'].map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={homeworkProblemsFrom.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Homework Is Graded By</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="homeworkGrading-label" sx={inputLabelStyle}>Homework Is Graded By</InputLabel>
                                                        <Select
                                                            labelId="homeworkGrading-label"
                                                            id="homeworkGrading"
                                                            multiple
                                                            value={homeworkGrading}
                                                            onChange={(e) => setHomeworkGrading(e.target.value)}
                                                            input={<OutlinedInput label="Homework Is Graded By" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            sx={selectStyle}
                                                        >
                                                            {['Online platform', 'Teaching Assistants', 'Instructor'].map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={homeworkGrading.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Free-Response Questions Are Used In</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="freeResponseIn-label" sx={inputLabelStyle}>Free-Response Questions Are Used In</InputLabel>
                                                        <Select
                                                            labelId="freeResponseIn-label"
                                                            id="freeResponseIn"
                                                            multiple
                                                            value={freeResponseIn}
                                                            onChange={(e) => setFreeResponseIn(e.target.value)}
                                                            input={<OutlinedInput label="Free-Response Questions Are Used In" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            sx={selectStyle}
                                                        >
                                                            {['Homework', 'Other assignments', 'Quizzes', 'Midterms'].map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={freeResponseIn.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Other Assignments Are Graded By</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="otherAssignmentsGrading-label" sx={inputLabelStyle}>Other Assignments Are Graded By</InputLabel>
                                                        <Select
                                                            labelId="otherAssignmentsGrading-label"
                                                            id="otherAssignmentsGrading"
                                                            multiple
                                                            value={otherAssignmentsGrading}
                                                            onChange={(e) => setOtherAssignmentsGrading(e.target.value)}
                                                            input={<OutlinedInput label="Other Assignments Are Graded By" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            sx={selectStyle}
                                                        >
                                                            {['Online platform', 'Teaching Assistants', 'Instructor'].map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={otherAssignmentsGrading.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </>
                            )}

                           {/* to enable use pilot instead of dummy */}
                            {requestSource === 'dummy' && (
                                <>
                                    <Grid item xs={12}>
                                        <Box sx={sectionBoxStyle}>
                                            <Typography variant="h6" sx={{ mt: 0, mb: 1, fontWeight: 'bold', color: '#1976d2', fontSize: '1rem' }}>Decision Timeline</Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Latest Time You Can Switch Homework Platforms</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="latestTimeToSwitch-label" sx={inputLabelStyle}>Latest Time You Can Switch Homework Platforms</InputLabel>
                                                        <Select
                                                            labelId="latestTimeToSwitch-label"
                                                            id="latestTimeToSwitch"
                                                            value={latestTimeToSwitch}
                                                            label="Latest Time You Can Switch Homework Platforms"
                                                            onChange={(e) => setLatestTimeToSwitch(e.target.value)}
                                                            sx={selectStyle}
                                                        >
                                                            <MenuItem value="First day of class">First day of class</MenuItem>
                                                            <MenuItem value="1–2 weeks before class">1–2 weeks before class</MenuItem>
                                                            <MenuItem value="3–4 weeks before class">3–4 weeks before class</MenuItem>
                                                            <MenuItem value="4–8 weeks before class">4–8 weeks before class</MenuItem>
                                                            <MenuItem value="Earlier">Earlier</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={12}>
                                                    <MobileFieldLabel>Who Can Choose a New Homework Platform?</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="platformDecisionMaker-label" sx={inputLabelStyle}>Who Can Choose a New Homework Platform?</InputLabel>
                                                        <Select
                                                            labelId="platformDecisionMaker-label"
                                                            id="platformDecisionMaker"
                                                            multiple
                                                            value={platformDecisionMaker}
                                                            onChange={(e) => setPlatformDecisionMaker(e.target.value)}
                                                            input={<OutlinedInput label="Who Can Choose a New Homework Platform?" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            sx={selectStyle}
                                                        >
                                                            {['Individual instructor', 'Course coordinator', 'Department chair / associate chair', 'Faculty committee'].map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={platformDecisionMaker.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </>
                            )}

                            {/* Section 5: Resources & Support */}
                            {requestSource === 'pilot' && (
                                <>
                                    <Grid item xs={12}>
                                        <Box sx={sectionBoxStyle}>
                                            <Typography variant="h6" sx={{ mt: 0, mb: 1, fontWeight: 'bold', color: '#1976d2', fontSize: '1rem' }}>Resources & Support</Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={12}>
                                                    <MobileFieldLabel>Who Pays for the Online Homework Platform?</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="platformPayment-label" sx={inputLabelStyle}>Who Pays for the Online Homework Platform?</InputLabel>
                                                        <Select
                                                            labelId="platformPayment-label"
                                                            id="platformPayment"
                                                            multiple
                                                            value={platformPayment}
                                                            onChange={(e) => setPlatformPayment(e.target.value)}
                                                            input={<OutlinedInput label="Who Pays for the Online Homework Platform?" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            sx={selectStyle}
                                                        >
                                                            {['Student', 'Institution'].map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={platformPayment.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Who Determines the Number of TAs for This Course?</MobileFieldLabel>
                                                    <TextField
                                                        fullWidth
                                                        name="whoDeterminesTAs"
                                                        id="whoDeterminesTAs"
                                                        label="Who Determines the Number of TAs for This Course?"
                                                        value={whoDeterminesTAs}
                                                        onChange={(e) => setWhoDeterminesTAs(e.target.value)}
                                                        sx={smallFontStyle}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Who Determines TA Positions at the Department Level?</MobileFieldLabel>
                                                    <TextField
                                                        fullWidth
                                                        name="whoDeterminesTAPositions"
                                                        id="whoDeterminesTAPositions"
                                                        label="Who Determines TA Positions at the Department Level?"
                                                        value={whoDeterminesTAPositions}
                                                        onChange={(e) => setWhoDeterminesTAPositions(e.target.value)}
                                                        sx={smallFontStyle}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Is Tutoring Available Beyond Office Hours?</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="tutoringAvailable-label" sx={inputLabelStyle}>Is Tutoring Available Beyond Office Hours?</InputLabel>
                                                        <Select
                                                            labelId="tutoringAvailable-label"
                                                            id="tutoringAvailable"
                                                            value={tutoringAvailable}
                                                            label="Is Tutoring Available Beyond Office Hours?"
                                                            onChange={(e) => setTutoringAvailable(e.target.value)}
                                                            sx={selectStyle}
                                                        >
                                                            <MenuItem value="No">No</MenuItem>
                                                            <MenuItem value="Yes – department level">Yes – department level</MenuItem>
                                                            <MenuItem value="Yes – university level">Yes – university level</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </>
                            )}
                            {/* to enable use pilot instead of dummy */}
                            {requestSource === 'dummy' && (
                                <>
                                    <Grid item xs={12}>
                                        <Box sx={sectionBoxStyle}>
                                            <Typography variant="h6" sx={{ mt: 0, mb: 1, fontWeight: 'bold', color: '#1976d2', fontSize: '1rem' }}>AI in Education</Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={12}>
                                                    <MobileFieldLabel>Does Your Institution Have Any Ongoing or Planned AI-in-Education Initiatives?</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="aiInitiatives-label" sx={inputLabelStyle}>Does Your Institution Have Any Ongoing or Planned AI-in-Education Initiatives?</InputLabel>
                                                        <Select
                                                            labelId="aiInitiatives-label"
                                                            id="aiInitiatives"
                                                            value={aiInitiatives}
                                                            label="Does Your Institution Have Any Ongoing or Planned AI-in-Education Initiatives?"
                                                            onChange={(e) => setAiInitiatives(e.target.value)}
                                                            sx={selectStyle}
                                                        >
                                                            <MenuItem value="Yes">Yes</MenuItem>
                                                            <MenuItem value="No">No</MenuItem>
                                                            <MenuItem value="Not sure">Not sure</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <MobileFieldLabel>Who Leads AI Adoption (if any)?</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="aiAdoptionLeader-label" sx={inputLabelStyle}>Who Leads AI Adoption (if any)?</InputLabel>
                                                        <Select
                                                            labelId="aiAdoptionLeader-label"
                                                            id="aiAdoptionLeader"
                                                            value={aiAdoptionLeader}
                                                            label="Who Leads AI Adoption (if any)?"
                                                            onChange={(e) => setAiAdoptionLeader(e.target.value)}
                                                            sx={selectStyle}
                                                        >
                                                            <MenuItem value="No one">No one</MenuItem>
                                                            <MenuItem value="Department chair">Department chair</MenuItem>
                                                            <MenuItem value="Dean">Dean</MenuItem>
                                                            <MenuItem value="Other">Other (please specify)</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                {aiAdoptionLeader === 'Other' && (
                                                    <Grid item xs={12}>
                                                        <MobileFieldLabel>Please specify who leads AI adoption</MobileFieldLabel>
                                                        <TextField
                                                            fullWidth
                                                            name="aiAdoptionLeaderOther"
                                                            id="aiAdoptionLeaderOther"
                                                            label="Please specify who leads AI adoption"
                                                            value={aiAdoptionLeaderOther}
                                                            onChange={(e) => setAiAdoptionLeaderOther(e.target.value)}
                                                            sx={smallFontStyle}
                                                        />
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </>
                            )}

                            {/* Section 7: Learning Management System */}
                            {requestSource === 'pilot' && (
                                <>
                                    <Grid item xs={12}>
                                        <Box sx={sectionBoxStyle}>
                                            <Typography variant="h6" sx={{ mt: 0, mb: 1, fontWeight: 'bold', color: '#1976d2', fontSize: '1rem' }}>Learning Management System</Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={12}>
                                                    <MobileFieldLabel>Which LMS Do You Use?</MobileFieldLabel>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="lmsUsed-label" sx={inputLabelStyle}>Which LMS Do You Use?</InputLabel>
                                                        <Select
                                                            labelId="lmsUsed-label"
                                                            id="lmsUsed"
                                                            multiple
                                                            value={lmsUsed}
                                                            onChange={(e) => setLmsUsed(e.target.value)}
                                                            input={<OutlinedInput label="Which LMS Do You Use?" />}
                                                            renderValue={(selected) => selected.join(', ')}
                                                            sx={selectStyle}
                                                        >
                                                            {['Canvas', 'Moodle', 'Blackboard', 'Other'].map((name) => (
                                                                <MenuItem key={name} value={name}>
                                                                    <Checkbox checked={lmsUsed.indexOf(name) > -1} />
                                                                    <ListItemText primary={name} />
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </>
                            )}

                            {/* For demo requests, show basic fields */}
                            {requestSource === 'demo' && (
                                <>
                                    <Grid item xs={12}>
                                        <MobileFieldLabel>Course Name(s)</MobileFieldLabel>
                                        <TextField
                                            fullWidth
                                            name="courses"
                                            id="courses"
                                            label="Course Name(s)"
                                            value={courses}
                                            onChange={(e) => setCourses(e.target.value)}
                                            sx={smallFontStyle}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        {
                            showFullApp() ?
                                <Grid container spacing={{ xs: 2, sm: 8 }}>
                                    <Grid item xs={12} sm={3}>
                                        <Button
                                            onClick={handleBack}
                                            className='btnMain'
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: { xs: 2, sm: 3 }, mb: { xs: 0, sm: 2 } }}
                                        >
                                            Back
                                        </Button>
                                    </Grid>
                                    <Grid item xs={false} sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Button
                                            onClick={handleSubmit}
                                            className='btnMain'
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: { xs: 0, sm: 3 }, mb: { xs: 2, sm: 2 } }}
                                        >
                                            {submitbuttonText}
                                        </Button>
                                    </Grid>
                                </Grid>
                                :
                                <Grid container spacing={{ xs: 2, sm: 8 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            onClick={handleBack}
                                            className='btnMain'
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: { xs: 2, sm: 3 }, mb: { xs: 0, sm: 2 } }}
                                        >
                                            Back
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            onClick={handleSubmit}
                                            className='btnMain'
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: { xs: 0, sm: 3 }, mb: { xs: 2, sm: 2 } }}
                                        >
                                            {submitbuttonText}
                                        </Button>
                                    </Grid>
                                </Grid>
                        }
                    </Box>
                </div>

                <ToastContainer />
                {
                    loading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: "#164b99",
                                position: 'absolute',
                                bottom: '-130%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    )
                }
            </div>
            {requestSource === 'pilot' ?
                <div style={{ marginTop: '35px', paddingTop: '20px' }} className="bg-gray1">
                    <div className="mainContainerWrapper secpad">
                        <Row className="">
                            <Col xs={12} md={12}>
                                <div style={{ marginTop: '-30px' }} className="copyText">
                                    Please feel free to share any additional context or considerations for your class.
                                    Please send this information to us directly at <a href="mailto:pilot@aiplato.ai">pilot@aiplato.ai</a>.
                                    We value your experience as an educator and look forward to collaborating with you to bring cutting-edge AI tools into physics education. Please don’t hesitate to reach out if you have any questions or need further details about the program.
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                :
                null
            }

        </div>


    );
};

export default RequestDemo;
