import React, { useEffect, useState } from "react";
import { apiURL, awsPath, getResourceFileListByType } from "../../common/API";
import { isNil } from "lodash";
import { Row, Col, Container } from "react-bootstrap"


const Resources = () => {
    const [resourceType, setResourceType] = useState("general")
    const [files, setFiles] = useState([])

    useEffect(() => {
        let queryParamsArry = ""
        // if (!isNil(window.location.search) && window.location.search !== '') {
        //     const queryString = window.location.search.slice(1);
        //     queryParamsArry = queryString.split("=")[1];
        //     setResourceType(queryParamsArry)
        // }

        getFolderDetails(queryParamsArry === "" ? resourceType : queryParamsArry)
    }, [])

    const handleTypewiseShowContent = (fType) => {
        setResourceType(fType)
        getFolderDetails(fType)
    }

    const getFolderDetails = (folderType) => {

        let fileList = []
        const reqData = {
            params: {
                folderName: folderType
            }
        }

        getResourceFileListByType(reqData).then((res) => {
            if (res.data.length > 0) {
                res.data.map((file, index) => {
                    if (index > 0) {
                        const parts = file.Path.split('/');
                        const fileName = parts[parts.length - 1];
                        var fName = fileName.split('.')[0]

                        fileList.push({
                            "Name": fName,
                            "Path": awsPath + file.Path
                        })
                    }
                })

                setFiles(fileList)
            }
        })
    }


    return (
        <div className='fwidth'>
            <div className="banner-pt container-fluid bg-gray1">
                <Container className="gradientBannerBg ">
                    <div className="col-12 col-md-12 col-lg-12">
                        <div className='homeBannerHead1'>
                            <h1>Resources</h1>
                            <p className='copyText pt-3'>
                                Please explore different resources shared here <br /> to get the insights of everything you may need.
                            </p>
                        </div>
                    </div>
                </Container>
            </div>
            <div className='container-fluid bg-white py-5'>
                <Container>
                    <div style={{ paddingBottom: '30px', paddingTop: '20px' }}>
                        <div style={{ marginRight: '10px', color: resourceType === 'general' ? 'white' : 'black', backgroundColor: resourceType === 'general' ? '#003392' : 'white', cursor: 'pointer', verticalAlign: 'middle', }}
                            onClick={() => handleTypewiseShowContent('general')}
                            className="btnMain"
                        >General
                        </div>
                        <div style={{ marginRight: '10px', color: resourceType === 'student' ? 'white' : 'black', backgroundColor: resourceType === 'student' ? '#003392' : 'white', cursor: 'pointer', verticalAlign: 'middle', }}
                            onClick={() => handleTypewiseShowContent('student')}
                            className="btnMain"
                        >Student
                        </div>
                        <div style={{ color: resourceType === 'educator' ? 'white' : 'black', backgroundColor: resourceType === 'educator' ? '#003392' : 'white', cursor: 'pointer', verticalAlign: 'middle', }}
                            onClick={() => handleTypewiseShowContent('educator')}
                            className="btnMain"
                        >Educator
                        </div>
                    </div>
                    {/* <div className="subheadText">Resources
                        <span style={{ textTransform: 'capitalize' }}> for {resourceType}</span>
                    </div>
                    <div id="contentAuthor-section" className="pb-3 inlineHeigth copyText">Please find below files for your reference. </div> */}
                    <div>
                        <div className="font-weight-bold">Content List : </div>
                        <ul className='copyText'>
                            {files !== "[]" && files.length > 0 ?
                                files.map((file, index) => (
                                    <li key={index}>
                                        <a href={file.Path} target="_blank" rel="noopener noreferrer">
                                            {file.Name}
                                        </a>
                                    </li>
                                ))
                                :
                                null
                            }
                        </ul>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Resources;