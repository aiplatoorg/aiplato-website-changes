import React from 'react';
import Cookies from 'universal-cookie';
import { isNil } from 'lodash';
import configData from './config.json'

const cookies = new Cookies();
export const APP_URL = configData.APP_URL;
export const WEBSITE_URL = configData.WEBSITE_URL
var isPrivate = false;
var token = null;

export const DESKTOP = 'desktop';
export const MOBILE = 'mobile';
export const TABLET = 'tablet';
export const setCookies = (email, userId, role, name, status, tryThisPinsEnabled, QATestFlag, timeLimit, institute_id, institute_name
    , usertimezone, user_fingerprint = "", isDemoUser = false, isDemoUserFlagged = false, isPtTeacher = false, menuselecteditem = ""
    , isAdminUser = false, userPlan = "", user_professor_id = "", isTA = false, isinternaluser = false, registered = true,
    assignmentCollection, paymentStatus, external_id = "", signupmethod = "") => {
    const cookies = new Cookies();
    const LONG_TTL = 60 * 60 * 24 * 30; // 30 days
    const hostnameParts = window.location.hostname.split('.');
    const domainName = hostnameParts.length > 1 ? hostnameParts[hostnameParts.length - 2] + "." + hostnameParts[hostnameParts.length - 1] : hostnameParts[hostnameParts.length - 1];
    cookies.set('isValid', 'yes', { path: '/', domain: domainName, maxAge: timeLimit });
    cookies.set('age', timeLimit, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('domain', domainName, { path: '/', domain: domainName, maxAge: LONG_TTL })
    cookies.set('email', email, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('userId', userId, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('name', name, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('role', role, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('status', status, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('tryThisPinsEnabled', tryThisPinsEnabled, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('QATestFlag', QATestFlag, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('usertimezone', usertimezone, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('institute_id', institute_id, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('institute_name', institute_name, { path: '/', domain: domainName, maxAge: LONG_TTL });

    cookies.set('user_fingerprint', user_fingerprint, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set('is_DemoUser', isDemoUserFlagged, { path: '/', domain: domainName, maxAge: LONG_TTL });//Try it out user
    cookies.set('isDemoUserFlagged', isDemoUserFlagged, { path: '/', domain: domainName, maxAge: LONG_TTL }); // Demo user
    cookies.set('signupmethod', signupmethod, { path: '/', domain: domainName, maxAge: LONG_TTL }); // tryitout, instructor_access, or ''
    cookies.set('isPtTeacher', isPtTeacher, { path: '/', domain: domainName, maxAge: LONG_TTL }); // Pt Teacher
    // cookies.set('menuselecteditem', menuselecteditem, { path: '/', domain: domainName, maxAge: timeLimit }); // course_id
    cookies.set('isAdminUser', isAdminUser, { path: '/', domain: domainName, maxAge: LONG_TTL }); // admin user
    cookies.set('userplan', userPlan, { path: '/', domain: domainName, maxAge: LONG_TTL }); // admin user
    cookies.set('user_professor_id', user_professor_id, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set("isSaMsgViewInAssList", false, { path: '/', domain: domainName, maxAge: LONG_TTL })
    cookies.set("isSaMsgViewInAssDetail", false, { path: '/', domain: domainName, maxAge: LONG_TTL })
    cookies.set("uploadImageTourDailog", false, { path: '/', domain: domainName, maxAge: LONG_TTL })
    cookies.set("isTA", isTA, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set("isinternaluser", isinternaluser, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set("registered", registered, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set("assignmentFilter", assignmentCollection, { path: '/', domain: domainName, maxAge: LONG_TTL });
    cookies.set("paymentStatus", paymentStatus, { path: '/', domain: domainName, maxAge: LONG_TTL });

    cookies.set('external_id', external_id, { path: '/', domain: domainName, maxAge: LONG_TTL });
    console.log('cookies are ', cookies.get('isValid'), domainName);

    identifyClarityUser();
}

export const identifyClarityUser = () => {
    if (typeof window.clarity === 'function') {
        const userId = cookies.get('userId');
        const userName = cookies.get('name');
        const email = cookies.get('email');
        if (userId) {
            window.clarity('identify', userId.toString(), null, null, userName || '');
            if (email) {
                window.clarity('set', 'email', email);
            }
        }
    }
};

export const setCourse = (courseId) => {
    cookies.set('menuselecteditem', courseId)
}
export const User_Role = {
    Admin: 'Admin',
    TeacherAssistant: 'TeacherAssistant',
    Student: 'Student',
    Professor: 'Professor',
}

export const setIsPrivate = (value) => {
    isPrivate = value;
}
export const getIsPrivate = () => {
    return true;
}

export const setToken = (value) => {
    token = value;
}
export const getToken = () => {
    return token;
}


export const getCurrentUserName = () => {
    return cookies.get('name')
}

export const getCurrentUserId = (hasQuestionPage = false) => {
    if (cookies.get('userId')) {
        return Number(cookies.get('userId'))
    } else {
        if (hasQuestionPage) {
            return undefined;
        } else {
            console.log('user session ends!');
            window.location.href = process.env.REACT_APP_BASE_URL
        }

    }
}

export const getCurrentUserEmail = () => {
    return cookies.get('email')
}

export const getCurrentUserRole = () => {
    return cookies.get('role')
}

export const getCurrentUserStatus = () => {
    return cookies.get('status')
}

export const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric', weekday: 'long' };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);

    const options1 = { weekday: 'long' };
    const currentDayOfWeek = formattedDate.toLocaleString('en-US', options1);

    const sDay = currentDayOfWeek.split(',')[0].substring(0, 3) + ", "
    const sDate = currentDayOfWeek.split(',')[1].split(" ")[1]
    const sMonth = currentDayOfWeek.split(',')[1].split(" ")[2]
    const sYear = currentDayOfWeek.split(',')[2]

    // Return the formatted date with uppercase month abbreviation and desired format
    return `${sDay} ${sDate} ${sMonth}`;
}

export const getInstituteName = () => {
    const regex = /@([a-zA-Z0-9.-]+)$/;
    if (!isNil(getCurrentUserEmail())) {
        const match = getCurrentUserEmail().match(regex);
        return match[1];
    } else {
        return ''
    }

}
export const getlocalsystemtimezone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone;
}

export const demoUserId = 393

export const showFullApp = () => {
    //   return detectDevice() === DESKTOP ? true : false
    return (detectDevice() === DESKTOP || detectDevice() === TABLET) ? true : false
}




export const getUserAgent = () => {

    const userAgent = window.navigator.userAgent;
    if (/iPhone|iPod/i.test(userAgent)) {
        return 'iPhone'
    } else if (/iPad/i.test(userAgent)) {
        return 'iPad';
    } else if (/Android/i.test(userAgent)) {
        return 'Android';
    } else if (/Windows Phone/i.test(userAgent)) {
        return 'Windows Phone';
    } else if (/Mac/i.test(userAgent)) {
        return 'Mac';
    } else if (/Windows/i.test(userAgent)) {
        return 'Windows';
    } else if (/Linux/i.test(userAgent)) {
        return 'Linux';
    } else {
        return '';
    }
}

function isPhone() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

function isTablet() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Check for iPad specifically, and for Android tablets (Android without 'Mobile')
    return /iPad|Android(?!.*Mobile)|Silk|Kindle|PlayBook|Tablet|Nexus 7|Nexus 10/i.test(userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isDesktop() {
    return !isPhone() && !isTablet();
}
export const detectDevice = () => {

    if (isPhone()) {
        return MOBILE;
    } else if (isTablet()) {
        return TABLET
    } else if (isDesktop()) {
        return DESKTOP;
    }
}

// export const InitializeLogRocket = () => {
//     if (!isNil(window.location.origin) && window.location.origin.search('https://aiplato.ai') !== -1) {
//         try {
//             window.LogRocket.identify(getCurrentUserId().toString(), {
//                 name: getCurrentUserName(),
//                 email: getCurrentUserEmail(),
//             });
//             window.LogRocket.init('rtjo6m/aiplato');
//         }
//         catch (err) {
//             console.log(err);
//         }
//     }
// } 