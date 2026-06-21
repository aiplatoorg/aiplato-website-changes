import React, { useEffect, useState } from 'react';
import { isNil, orderBy } from 'lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import './dashboard.scss'
import { getPTTeachers, getStudentDetails } from '../../common/API';

const loadEcharts = () => {
    if (!isNil(window.echarts)) {
        return Promise.resolve(window.echarts);
    }

    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[data-echarts="true"]');
        if (!isNil(existingScript)) {
            existingScript.addEventListener('load', () => resolve(window.echarts));
            existingScript.addEventListener('error', reject);
            return;
        }

        const script = document.createElement('script');
        script.src = `${process.env.PUBLIC_URL}/echarts.js`;
        script.async = true;
        script.dataset.echarts = 'true';
        script.onload = () => resolve(window.echarts);
        script.onerror = reject;
        document.body.appendChild(script);
    });
};


function Dashboard() {
    const [teacherOptions, setTeacherOptions] = useState(null)
    const [selectedTeacher, setSelectedTeacher] = useState(-1)
    const [studentsList, setStudentsList] = useState([])

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#a4a4a4",
            color: theme.palette.common.white,
            padding: "10px",
            fontSize: 16,
            fontWeight: "bold"
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            padding: "7px"
        },
    }));

    const StyledTableCellbody = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            //backgroundColor: theme.palette.common.black,
            //color: theme.palette.common.white,
            padding: "10px",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            padding: "7px"
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    useEffect(() => {

        getPTTeachers().then(res => {
            let teachersData = []
            if (!isNil(res) && !isNil(res.data)) {
                res.data.data.forEach(element => {
                    teachersData.push({ value: element.numberofstudents, name: element.name, email: element.email, userId: element.userId })
                });

                teachersData = orderBy(teachersData, ['value'], ['desc']);
                setSelectedTeacher(teachersData[0]['userId'])
            }

            setTeacherOptions({
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {

                        return `${params.data.email}<br />
                              ${'Name'}: ${params.data.name} <br />
                              ${'No. of Students'}: ${params.data.value}`;
                    }
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 'left'
                // },
                labelLine: {
                    show: false
                },
                series: [
                    {
                        name: 'Teacher',
                        type: 'pie',
                        radius: '50%',
                        data: teachersData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        })
    }, []);

    useEffect(() => {
        let teacherChart = null;

        if (!isNil(teacherOptions)) {
            loadEcharts()
                .then(() => {
                    const chartElement = document.getElementById('teacherChart');
                    if (isNil(chartElement) || isNil(window.echarts)) return;

                    teacherChart = window.echarts.init(chartElement);
                    teacherChart.setOption(teacherOptions);
                    teacherChart.on('click', function (params) {
                        setSelectedTeacher(params.data.userId);
                    });
                })
                .catch((err) => {
                    console.error('Failed to load echarts:', err);
                });
        }

        return () => {
            if (!isNil(teacherChart)) {
                teacherChart.dispose();
            }
        };

    }, [teacherOptions])

    useEffect(() => {
        if (selectedTeacher !== -1) {
            getStudentDetails(selectedTeacher).then((res) => {
                setStudentsList(res.data.data)
            })
        }
    }, [selectedTeacher])

    return (
        <div className='dashboardContainer'>
            <div id='teacherChart' className='teacherChart'></div>
            <div className='studentChart'>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>User Id</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Attempted</StyledTableCell>
                                <StyledTableCell>Completed</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                studentsList !== undefined && studentsList !== null && studentsList.length > 0 ? (
                                    studentsList.map((row) => {
                                        row.attempted = ''
                                        if (row.attemptedpt !== undefined && row.attemptedpt !== null && row.attemptedpt.length > 0) {
                                            row.attemptedpt.forEach((element, index) => {
                                                row.attempted += index === 0 ? element.title : "," + element.title
                                            })
                                        }
                                        row.completed = ''
                                        if (row.submittedpt !== undefined && row.submittedpt !== null && row.submittedpt.length > 0) {
                                            row.submittedpt.forEach((element, index) => {
                                                row.completed += index === 0 ? element.title : "," + element.title
                                            })
                                        }

                                        return (
                                            <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                                <StyledTableCellbody component="th" scope="row">
                                                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                                        <div className='mt-2'>{row.userId}</div>
                                                    </div>
                                                </StyledTableCellbody>
                                                <StyledTableCellbody >
                                                    {row.name}
                                                </StyledTableCellbody>
                                                <StyledTableCellbody >
                                                    {row.email}
                                                </StyledTableCellbody>
                                                <StyledTableCellbody >
                                                    {row.attempted}
                                                </StyledTableCellbody>
                                                <StyledTableCellbody >
                                                    {row.completed}
                                                </StyledTableCellbody>
                                            </StyledTableRow>
                                        )
                                    }
                                    )
                                ) : (<div style={{ padding: "20px" }}>No Student Found!</div>)
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default Dashboard;