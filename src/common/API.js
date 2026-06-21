import configData from './config.json'

export const awsPath = configData.AWS_PATH;
export const apiURL = configData.API_ENDPOINT;//process.env.NODE_ENV === 'production' ? window.location.protocol + "//" + "app.aiplato.ai/api" : "https://app.aiplato.ai/api";
// export const apiURL = window.location.protocol+"//"+window.location.host+":8001"
const axios = require("axios");
const axiosInstance = axios.create({
    baseURL: apiURL
});


export function checkCredentialsAPI(data) {
    return axiosInstance.post("/check_credentials/", data);
}

export function saveToDbAPI(data) {
    return axiosInstance.post("/save_access_request/", data);
}

export function validIds() {
    return axiosInstance.get("/valid_ids/");
}

export function saveearlyaccess(data) {
    return axiosInstance.post("/earlyaccessuserdetail/", data);
}
export function save_earlyaccesslink(data) {
    return axiosInstance.post("/save_earlyaccesslink/", data);
}

export function getearlyaccessemail(data) {

    return axiosInstance.get(`/getearlyaccessemail/?id= ${data}`);
}

export function getPrivateDetail(data) {
    return axiosInstance.get(`/getPrivatesitetoken/?token=${data}`);
}

export function savecalssroomquestionByStudent(data) {
    return axiosInstance.post("/Classroom_Session_QuestionsActions/", data);
}
export function getrepresentativequestions(data) {
    return axiosInstance.get(`/Representative_Questions_Actions/`, data);
}
export function updatetotalcount(data) {
    return axiosInstance.put("/Representative_Questions_Actions/", data);
}

export function checksessionsexistsforquestionsubmission(data) {
    return axiosInstance.get("/Classroom_Session_Actions/", data);
}

export function getSessionList(data) {
    return axiosInstance.get("/get_student_sesssiondata/", data);
}
export function UploadStudentsAndTA(data) {
    return axiosInstance.post("/uploadUsers/", data);

}

export function SaveUserProfile(data) {
    return axiosInstance.post("/saveUserprofile/", data);
}

export function getRoleDetails(userId) {
    return axiosInstance.get(`/getroledetails/?user_id=${userId}`);
}

export function getUserDetails(emailId) {
    return axiosInstance.get(`/getUserDetails/?email_id=${emailId}`);
}

export function storeCameraImage(data) {
    return axiosInstance.post("/addUserImagetoTable/", data);
}
export function saveFeedbackDetails(data) {
    return axiosInstance.post("/feedback_actions/", data);
}

export function createSessionforFeedback(data) {
    return axiosInstance.post("/Feedback_Session_Creation/", data);
}

export function saveWebsiteVisitors(data) {
    return axiosInstance.post("/savewebsitevisitors/", data);
}

export function websitevisitorsconverted(data) {
    return axiosInstance.put("/websitevisitors_converted/", data);
}

export function getPTTeachers() {
    return axiosInstance.get(`/getPtTeachersList/`);
}

export function getStudentDetails(teacherId) {
    return axiosInstance.get(`/getstudentdetailbyptteacherid/?user_id=${teacherId}`);
}

export function passwordresetsendemail(data) {
    return axiosInstance.post("/passwordresetsendemail/", data);
}

export function getcoursesbyinstituteid(data) {
    return axiosInstance.get("/getcoursesbyinstituteid/", data);
}

export function saveUserEducatorCounter(data) {
    return axiosInstance.post("/saveuseredcatorcounter/", data);
}

export function requestDemoDetailsSubmit(data) {
    return axiosInstance.post("/requestDemoDetailsSubmit/", data);
}

export function getRequestDemoDetailsByEmail(requesterEmail) {
    return axiosInstance.get(`/requestDemoDetailsSubmit/?requesterEmail=${encodeURIComponent(requesterEmail)}`);
}

export function getResourceFileListByType(data) {
    return axiosInstance.get("/getResourceFileListByType/", data);
}
export function saveuseractionswithuploadimage(data) {
    return axiosInstance.post('/challenges/saveuseractions/', data, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    });
}

export function feedbackmailssend(data) {
    return axiosInstance.post("/challenges/feedbackmailssend/", data);
}

export function sendMagicLinkEmail(data) {
    return axiosInstance.post("/send_magic_link/", data);
}

export function verifyMagicLinkToken(data) {
    return axiosInstance.post("/verify_magic_link/", data);
}

export function setPasswordAfterVerification(data) {
    return axiosInstance.post("/set_password_magic_link/", data);
}

export function verifyTeacherAccessCode(data) {
    return axiosInstance.post("/verify_teacher_access_code/", data);
}

export function createCheckoutSession(data) {
    return axiosInstance.post("/create_checkout_session/", data);
}

export function createPlanCheckoutSession(data) {
    return axiosInstance.post("/create_plan_checkout_session/", data);
}

export function verifyPayment(sessionId) {
    return axiosInstance.get(`/verify_payment/?session_id=${sessionId}`);
}

export function fetchPaymentInfo(userId) {
    return axiosInstance.get(`/fetchuserpaymentinfo/?user_id=${userId}`);
}

export function savePaymentDetail(data) {
    return axiosInstance.post("/savepaymentdetail/", data);
}