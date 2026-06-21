import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { isNil, random } from 'lodash';
import imageCaptureIcon from '../../assets/images/icon-photo-capture.svg';
import retakeIcon from '../../assets/images/icon-photo-retake.svg';
import imageUploadIcon from '../../assets/images/icon-upload-image.svg';
import './UploadImage.scss';
import { storeCameraImage, saveuseractionswithuploadimage } from '../../common/API';
import { toast } from 'react-toastify';
import configData from '../../common/config.json';



function CameraCapture() {
    const fileInputRef = useRef(null);
    const uploadedFilesRef = useRef([]);
    const [preview, setPreview] = useState(null);
    const [queryParams, setQueryParams] = useState({})
    const [captureButtonEnabled, setCaptureButtonEnabled] = useState(true)
    const [uploadButtonVisible, setuploadButtonVisible] = useState(false)
    const [loader, setLoader] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState([])

    const WS_URL = "wss://kjlkkz8ddi.execute-api.us-east-2.amazonaws.com/production";
    const SCAN_UPLOAD_COMPLETE_EVENT = "scanImageUploaded";
    useEffect(() => {
        if (!isNil(window.location.search) && window.location.search !== '') {
            const queryString = window.atob(window.location.search.slice(1));
            const queryParamsArray = queryString.split('&');
            let tempObj = {}
            queryParamsArray.forEach(param => {
                const [key, value] = param.split('=');
                tempObj[key] = (value); // Use decodeURIComponent to handle special characters
            });

            setQueryParams(tempObj)
        }

    }, [window.location.search]);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }

    };
    const handleRetake = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    const clearAllSelectedPhotos = () => {
        uploadedFilesRef.current = [];
        setUploadedFiles([]);
        setPreview(null);
        setCaptureButtonEnabled(true);
        setuploadButtonVisible(false);
    }

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;
        uploadedFilesRef.current = [...uploadedFilesRef.current, ...files];
        setUploadedFiles(uploadedFilesRef.current)
        const latestFile = files[files.length - 1];
        compressFileToBase64(latestFile).then((base64Data) => {
            setPreview(base64Data);
            setCaptureButtonEnabled(false)
            setuploadButtonVisible(true)
        }).catch((err) => {
            console.error("Image preview generation failed:", err);
        });
        // Allow selecting the same photo again if needed.
        event.target.value = "";
    };

    const compressFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 800;
                    const scaleSize = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(
                        (blob) => {
                            const blobReader = new FileReader();
                            blobReader.onloadend = () => resolve(blobReader.result);
                            blobReader.onerror = reject;
                            blobReader.readAsDataURL(blob);
                        },
                        'image/jpeg',
                        0.7
                    );
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const sendScanUploadSignal = () => {
        if (!WS_URL) return;
        try {
            const socket = new WebSocket(WS_URL);
            const content = {
                boardId: queryParams['boardId'],
                challengeId: queryParams['challengeId'],
                userId: queryParams['userId'],
                assignmentId: queryParams['assignment_id'] || "",
                isProblemTypeImageDiagram: JSON.parse(queryParams['isProblemTypeImageDiagram']) ? 1 : 0
            };
            const payload = {
                type: SCAN_UPLOAD_COMPLETE_EVENT,
                action: "broadcastMessage",
                message: {
                    type: SCAN_UPLOAD_COMPLETE_EVENT,
                    content
                },
                ...content
            };

            socket.onopen = () => {
                socket.send(JSON.stringify(payload));
                socket.close();
            };

            socket.onerror = () => {
                socket.close();
            };
        } catch (err) {
            console.error("Failed to publish scan upload websocket signal:", err);
        }
    }

    const upaloadImage = () => {
        setLoader(true)
        const filesToUpload = Array.isArray(uploadedFilesRef.current) ? [...uploadedFilesRef.current] : [];
        if (!isNil(preview) && filesToUpload.length > 0) {
            const isDiagramOnly = JSON.parse(queryParams['isProblemTypeImageDiagram']) ? 1 : 0;
            const uploadAllImages = async () => {
                for (let idx = 0; idx < filesToUpload.length; idx++) {
                    const file = filesToUpload[idx];
                    const compressedBase64 = await compressFileToBase64(file);
                    let sessionId = random(1000, 500000)
                    const uniqueSource = `scanimageupload_${sessionId}_${idx + 1}`;
                    let params = {
                        user_id: queryParams['userId'],
                        req_type: 'add',
                        session_id: sessionId,
                        image_text: compressedBase64,
                        challenge_id: queryParams['challengeId'],
                        board_id: queryParams['boardId'],
                        assignment_id: queryParams['assignment_id'],
                        isProblemTypeImageDiagram: isDiagramOnly
                    }
                    await storeCameraImage(params);

                    let form_data = new FormData();
                    let challengeId = queryParams['challengeId']
                    let question_id = challengeId.indexOf('c') !== -1 ? challengeId.slice(1, challengeId.length) : challengeId;
                    let assignmentId = queryParams['assignment_id'] !== undefined && queryParams['assignment_id'] !== null && queryParams['assignment_id'] !== "" ? queryParams['assignment_id'] : ""
                    form_data.append('challenge_id', question_id);
                    form_data.append('user_id', queryParams['userId']);
                    form_data.append('source', uniqueSource);
                    form_data.append('assignment_id', assignmentId);
                    form_data.append('problem_source', "interactiveproblems");
                    form_data.append('boardId', queryParams['boardId']);
                    form_data.append('action_name', "captureuploadimage");
                    form_data.append('uploadedFRQImagefile', file);
                    form_data.append('isdiagramonly', isDiagramOnly);
                    await saveuseractionswithuploadimage(form_data);
                }
            };

            uploadAllImages().then(() => {
                sendScanUploadSignal();
                setLoader(false)
                toast('Your image(s) have been uploaded and will appear shortly in the main application.', {
                    type: toast.TYPE.INFO,
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                })
            }).catch(err => {
                setLoader(false)
                console.error(err.message)
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: true,
                    style: { borderRadius: "10px" }
                });
            })
        }
    }

    return (
        <div style={{ marginTop: "100px", textAlign: "center" }} className='mainDiv'>

            <div style={{ marginBottom: "30px" }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    capture="environment"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Hidden input
                />
                {preview && (
                    <>
                        <img
                            aria-label=''
                            src={preview}
                            alt="Preview"
                            style={{ height: "200px", width: "200px", maxHeight: '100%', maxWidth: '100%', marginTop: 20, borderRadius: 10 }}
                        />
                        {uploadedFiles.length > 1 ? (
                            <div style={{ marginTop: "10px", marginBottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                <p style={{ margin: 0, color: "#164b99", fontWeight: 600 }}>
                                    {uploadedFiles.length} photos selected
                                </p>
                                <button
                                    type="button"
                                    onClick={clearAllSelectedPhotos}
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "#007bff",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        padding: 0
                                    }}
                                >
                                    Clear All
                                </button>
                            </div>
                        ) : null}
                    </>
                )}
            </div>
            <div className='d-flex justify-content-center'>
                {
                    captureButtonEnabled ? (<button
                        onClick={handleButtonClick}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Capture Handwritten Solution
                    </button>) : (<button
                        onClick={handleRetake}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Add Another Photo
                    </button>)
                }
                {
                    uploadButtonVisible ? (<button
                        onClick={upaloadImage}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginLeft: "10px"
                        }}
                    >
                        Upload Solution Image
                    </button>) : null
                }
            </div>
            {
                loader && (
                    <>
                        <div style={{
                            color: "#164b99",
                            position: 'absolute',
                            bottom: '50%',
                            left: '40%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                            zIndex: "9999"
                        }}>
                            <button class="btn btn-primary" type="button" disabled>
                                <span style={{ marginRight: '5px' }} class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                Processing...
                            </button>
                        </div>
                    </>
                )
            }
        </div>
    );
}

export default CameraCapture;

