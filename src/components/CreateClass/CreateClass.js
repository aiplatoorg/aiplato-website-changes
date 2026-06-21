import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Papa from "papaparse";
import { UploadStudentsAndTA, getRoleDetails } from '../../common/API'
import { toast } from 'react-toastify';
import { Input, InputLabel } from '@mui/material';
import { getCurrentUserId, getCurrentUserName } from '../../common/Functions';
import { Select, MenuItem } from "@mui/material";

class CreateClass extends Component {

    state = {
        professorName: '',
        Professor_Id: getCurrentUserId(),
        instituteData: [],
        classData: [],
        bookData: [],
        selectedInstitute: 0,
        className: '',
        classId: -1,
        bookId: -1,
        studentEmailList: [],
        taEmailList: [],
        isAddNewClass: false,
        mainJSON: [],
    }

    componentDidMount() {
        let iDataInstitutes = []

        getRoleDetails(getCurrentUserId()).then(json => {
            this.setState({ mainJSON: json.data.Institutes })
            for (let count = 0; count < Object.keys(json.data.Institutes).length; count++) {
                iDataInstitutes.push({ "value": Object.values(json.data.Institutes)[count].institute_id, "label": Object.keys(json.data.Institutes)[count] })
            }

            this.setState({ instituteData: iDataInstitutes })
        })
    }

    handleInstituteChange = (e) => {
        let iDataClasses = []
        let iDataBooks = []
        this.setState({ selectedInstitute: e.target.value })
        for (let count = 0; count < Object.keys(this.state.mainJSON).length; count++) {
            if (Object.values(this.state.mainJSON)[count].institute_id.toString() === e.target.value.toString()) {
                for (let index = 0; index < Object.values(this.state.mainJSON)[count].classes.length; index++) {
                    iDataClasses.push({ "value": Object.values(this.state.mainJSON)[count].classes[index].class_id, "label": Object.values(this.state.mainJSON)[count].classes[index].name })
                }

                for (let index = 0; index < Object.values(this.state.mainJSON)[count].books.length; index++) {
                    iDataBooks.push({ "value": Object.values(this.state.mainJSON)[count].books[index].book_id, "label": Object.values(this.state.mainJSON)[count].books[index].Book_name })
                }
            }
        }

        this.setState({ classData: iDataClasses, bookData: iDataBooks })
    }

    handleClassChange = (e) => {
        if (e.target.value.toString() === "0")
            this.setState({ isAddNewClass: true, className: "", classId: 0 })
        else if (e.target.value.toString() !== "0" && e.target.value.toString() !== "-1") {
            for (let count = 0; count < Object.keys(this.state.mainJSON).length; count++) {
                if (Object.values(this.state.mainJSON)[count].institute_id.toString() === this.state.selectedInstitute.toString()) {
                    for (let index = 0; index < Object.values(this.state.mainJSON)[count].classes.length; index++) {
                        if (Object.values(this.state.mainJSON)[count].classes[index].class_id.toString() === e.target.value.toString()) {
                            this.setState({ isAddNewClass: false })
                            this.setState({ className: Object.values(this.state.mainJSON)[count].classes[index].name })
                            this.setState({ classId: e.target.value.toString() })
                        }
                    }
                }
            }
        }
    }

    handleBookChange = (e) => {
        this.setState({ bookId: e.target.value.toString() })
    }

    handleClassNameChange = (e) => {
        this.setState({ className: e.target.value, classId: 0 })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.selectedInstitute === "0" && this.state.classId === "-1" && this.state.bookId === "0") {
            toast.error("Please fill up all required fields !", {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
        }
        else {
            const postReqData = {
                Professor_id: getCurrentUserId(),
                institute_id: this.state.selectedInstitute,
                class_id: this.state.classId,
                book_id: this.state.bookId,
                classname: this.state.className,
                studentemaillist: (this.state.studentEmailList !== [] ? this.state.studentEmailList.toString().split(',') : null),
                taemaillist: (this.state.taEmailList !== [] ? this.state.taEmailList.toString().split(',') : null)
            }

            UploadStudentsAndTA(postReqData).then(res => {
                toast.success("Class created successfully! ", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                })
            }).catch(err => {
                toast.error("Error!", {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                })
            })
        }
    }

    handleStudentFileUpload = (e) => {
        const files = e.target.files;
        const sEmailIds = []
        if (files) {
            Papa.parse(files[0], {
                complete: function (results) {

                    const csvDataWithDelimiter = results.data.toString()
                    let csvDataActual = csvDataWithDelimiter.substring(0, csvDataWithDelimiter.length - 1);

                    Papa.parse(csvDataActual, {
                        delimiter: ',',
                        skipEmptyLines: true,
                        transform: (value) => value.trim(),
                        complete: result => {
                            result.data.map(item => {
                                sEmailIds.push(item)
                            })
                        }
                    })
                }
            })
        }

        this.setState({ studentEmailList: sEmailIds })
    }

    handleTAFileUpload = (e) => {
        const files = e.target.files;
        const taEmailIds = []
        if (files) {
            Papa.parse(files[0], {
                complete: function (results) {

                    const csvDataWithDelimiter = results.data.toString()
                    let csvDataActual = csvDataWithDelimiter.substring(0, csvDataWithDelimiter.length - 1);

                    Papa.parse(csvDataActual, {
                        delimiter: ',',
                        skipEmptyLines: true,
                        transform: (value) => value.trim(),
                        complete: result => {
                            result.data.map(item => {
                                taEmailIds.push(item)
                            })
                        }
                    })
                }
            })
        }

        this.setState({ taEmailList: taEmailIds })
    }

    render() {

        return (
            <div className='fwidth'>
                <div className="homecontmpad container-fluid">
                    <Container className="">
                        <div className="col-12 col-md-12 col-lg-12">
                            <div className='homeBannerHead'>aiPlato<br />
                                <h1>Democratizing 1-on-1 Teaching</h1>
                            </div>

                        </div>
                    </Container>
                </div>
                <div className="container-fluid">
                    <Container className='pt-5' style={{ height: "100vh" }} >
                        <Typography component="h1" variant="h5">
                            Create Class
                        </Typography>
                        <Box component="form" onSubmit={this.handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="professor-name"
                                        name="professor"
                                        required
                                        fullWidth
                                        id="professor"
                                        label="Professor Name"
                                        disabled
                                        value={getCurrentUserName()}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <select
                                        required
                                        name="institute"
                                        id="institute"
                                        className="MuiInputBase-input MuiOutlinedInput-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input"
                                        style={{ border: '1px solid lightgrey' }}
                                        onChange={this.handleInstituteChange}
                                        value={this.state.selectedInstitute}
                                    >
                                        <option key={-1} value="0"> Select Institute</option>
                                        {this.state.instituteData.map((item, index) =>
                                            <option key={index} value={item.value}>{item.label}</option>
                                        )}
                                    </select>
                                </Grid>
                                <Grid item xs={12}>
                                    <select
                                        required
                                        name="class"
                                        id="class"
                                        className="MuiInputBase-input MuiOutlinedInput-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input"
                                        style={{ border: '1px solid lightgrey' }}
                                        onChange={this.handleClassChange}
                                        value={this.state.classId}
                                    >
                                        <option key={-1} value="-1"> Select Class</option>
                                        {this.state.classData.map((item, index) =>
                                            <option key={index} value={item.value}>{item.label}</option>
                                        )}
                                        <option key={-2} value="0"> Add New Class</option>
                                    </select>
                                </Grid>
                                {this.state.isAddNewClass === true ? <Grid item xs={12}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="className"
                                        required
                                        fullWidth
                                        id="className"
                                        label="Class Name"
                                        autoFocus
                                        onChange={this.handleClassNameChange}
                                    />
                                </Grid> : null}
                                <Grid item xs={12}>
                                    <select
                                        required
                                        name="book"
                                        id="book"
                                        className="MuiInputBase-input MuiOutlinedInput-input css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input"
                                        style={{ border: '1px solid lightgrey' }}
                                        onChange={this.handleBookChange}
                                        value={this.state.bookId}
                                    >
                                        <option key={-1} value="0"> Select Book</option>
                                        {this.state.bookData.map((item, index) =>
                                            <option key={index} value={item.value}>{item.label}</option>
                                        )}
                                    </select>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputLabel size="normal">Upload Student CSV File</InputLabel>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Input
                                        type="file"
                                        fullWidth
                                        accept=".csv,.xlsx,.xls"
                                        onChange={this.handleStudentFileUpload}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputLabel size="normal">Upload TA CSV File</InputLabel>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Input
                                        type="file"
                                        fullWidth
                                        accept=".csv,.xlsx,.xls"
                                        onChange={this.handleTAFileUpload}
                                    />
                                </Grid>
                            </Grid>
                            <Button type='submit' fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Create Class </Button>
                        </Box>
                    </Container>
                </div>
            </div>
        )
    }
}

export default withRouter(CreateClass);