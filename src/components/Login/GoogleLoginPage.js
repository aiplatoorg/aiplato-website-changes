import React from 'react';
// import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
// import { Button } from 'bootstrap';
import { SaveUserProfile, checkCredentialsAPI, getUserDetails, getRoleDetails, websitevisitorsconverted } from '../../common/API'
import { toast } from 'react-toastify';
import { APP_URL, User_Role, getIsPrivate, getUserAgent, setCookies } from '../../common/Functions';
import { ClientJS } from 'clientjs';
import { FaBullseye } from 'react-icons/fa';

const GoogleLoginPage = () => {

    const parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
    const responseGoogle = (response) => {

        const userObject = parseJwt(response.credential);

        const postReqData = {
            Username: userObject.name,
            course: "Physics",
            useruniquecode: null,
            signupmethod: "google",
            Password: "",
            role: User_Role.Student,
            Emailid: userObject.email,
            referURL: document.referrer,
            userAgent: getUserAgent()
        }

        SaveUserProfile(postReqData).then(res => {
            if (res.data.Success === "exist" || res.data.Success === "Success") {
                const client = new ClientJS();
                const form_data1 = new FormData();
                const fingerprint = client.getFingerprint();
                form_data1.append("userId", fingerprint)
                form_data1.append('converted_from', "G");
                form_data1.append("userdata", userObject.email)
                websitevisitorsconverted(form_data1).then(res => {
                })
                let data = { 'email': userObject.email, password: "", signupmethod: "google" }

                checkCredentialsAPI(data).then(res => {
                    if (res.status === 200) {
                        if (res.data['found'] === true) {
                            addValidationCookie(userObject.email,
                                res.data.userId,
                                res.data.role,
                                res.data.name,
                                res.data.status,
                                res.data.tryThisPinsEnabled,
                                res.data.QATestFlag,
                                convertDurationToSeonds(res.data.timeLimit),
                                res.data.institute_id,
                                res.data.user_timezone, res.data.user_professor_id, res.data.isTA)
                            toast.success("Valid Demo Credentials!", {
                                position: toast.POSITION.BOTTOM_RIGHT,
                                autoClose: true,
                                style: { borderRadius: "10px" }
                            });

                            window.open(APP_URL, '_self')
                        }
                        else if (res.data['isexpired'] === true) {
                            toast.error("Your account is expired, please get in touch with support team!", {
                                position: toast.POSITION.BOTTOM_RIGHT,
                                autoClose: true,
                                style: { borderRadius: "10px" }
                            });
                            this.setState({ shoowearlyaccess: true, showemaildiv: false })
                        }
                        else {
                            toast.error("Please enter valid email id and password.", {
                                position: toast.POSITION.BOTTOM_RIGHT,
                                autoClose: true,
                                style: { borderRadius: "10px" }
                            });
                            this.setState({ shoowearlyaccess: false, showemaildiv: true })
                        }
                    } else {
                        toast.error("Server Error !", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: true,
                            style: { borderRadius: "10px" }
                        });
                    }
                }).catch(err => {
                    console.error(err.message)
                    toast.error("Please enter valid email id and password.", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: true,
                        style: { borderRadius: "10px" }
                    });
                })
            }
        }).catch(err => {
            toast.error("Error!", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                style: { borderRadius: "10px" }
            });
            console.error(err.message)
        })
        // localStorage.setItem('user', JSON.stringify(userObject));
    }

    const addValidationCookie = (email, userId, role, name, status, tryThisPinsEnabled, QATestFlag, timeLimit, institute_id, usertimezone, user_professor_id, isTA) => {
        setCookies(email, userId, role, name, status, tryThisPinsEnabled, QATestFlag, timeLimit, institute_id, usertimezone, "", false, false, false, "", false, "", user_professor_id, isTA)
    }

    const convertDurationToSeonds = (duration) => {
        const a = duration.split(':');
        return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    }

    return (
        <div className="">
            <div className="">
                <GoogleOAuthProvider
                    clientId={`410631443026-af16oo9qj5ptqdt2foo0u5q9d29midpi.apps.googleusercontent.com`}
                >
                    <GoogleLogin
                        render={(renderProps) => (
                            <button
                                type="button"
                                className=""
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                            >
                                Sign in with google
                            </button>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy="single_host_origin"
                    />
                </GoogleOAuthProvider>
            </div>
        </div>
    )
}

export default GoogleLoginPage