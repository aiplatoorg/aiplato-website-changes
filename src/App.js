import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar/navbar';
import { Route, useLocation, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home/home';
import Footer from './components/Footer/Footer';
import theme from './theme';
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { isNil } from 'lodash';
const Team = lazy(() => import('./components/Team/team'));
const Career = lazy(() => import('./components/career/career'));
const ContactUs = lazy(() => import('./components/contactUs/contactUs'));
const UserInfo = lazy(() => import('./components/EarlyAccessUser/userInfo'));
const Thankyou = lazy(() => import('./components/Thanks/Thankyou'));
const Student = lazy(() => import('./components/Student/Student'));
const Teacher = lazy(() => import('./components/Teacher/Teacher'));
const SubmitQuestion = lazy(() => import('./components/SubmitQuestion/SubmitQuestion'));
const Login = lazy(() => import('./components/Login/Login'));
const SignUp = lazy(() => import('./components/SignUp/SignUp'));
const CreateClass = lazy(() => import('./components/CreateClass/CreateClass'));
const CameraCapture = lazy(() => import('./components/UploadImage/UploadImage'));
const Feedback = lazy(() => import('./components/Feedback/Feedback'));
const PageNotFound = lazy(() => import('./components/PageNotFound/PageNotFound'));
const Flyer = lazy(() => import('./components/Flyer/Flyer'));
const TermsandCondition = lazy(() => import('./components/PrivacyPolicy/TermsandCondition'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy/PrivacyPolicy'));
const dashboard = lazy(() => import('./components/dashboard/dashboard'));
const SignUpPlans = lazy(() => import('./components/SignUp/SignUpPlans'));
const RequestDemo = lazy(() => import('./components/Teacher/RequestDemo'));
const Resources = lazy(() => import('./components/Resources/Resources'));
const MagicLinkVerify = lazy(() => import('./components/MagicLinkVerify/MagicLinkVerify'));
const TestPrep = lazy(() => import('./components/Products/TestPrep'));


function App() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('');
  const [isLogRocketInitialize, setIsLogRocketInitialize] = useState(false);
  const isEmbeddedView = new URLSearchParams(location.search).get('embed') === '1';

  useEffect(() => {
    setCurrentPage(location.pathname.toLowerCase());
    const initializeLogRocket = async () => {
      if (isLogRocketInitialize) return;

      const [{ default: LogRocket }, { ClientJS }] = await Promise.all([
        import('logrocket'),
        import('clientjs'),
      ]);
      const client = new ClientJS();
      const fingerprint = client.getFingerprint();

      if (!isNil(LogRocket)) {
        LogRocket.identify(fingerprint.toString(), {
          name: fingerprint,
          email: fingerprint + '@aiplato.ai',
        });
        LogRocket.init('zdohul/aiplato');
        setIsLogRocketInitialize(true);
      }
    };

    initializeLogRocket();
  }, [location]);
  return (
    <ThemeProvider theme={theme}>
    <div className="main-container">

      <ToastContainer />
      {!isEmbeddedView && !currentPage.includes('/question') && !currentPage.includes('/termsandcondition') && !currentPage.includes('/privacypolicy') &&
        <Navbar />
      }
      <Suspense fallback={null}>
        <Switch>
          <Route path="/" exact component={Home} />
          {/* <Route path="/home" exact component={Home} /> */}
          <Route path="/earlyaccesspriorityinfo/:earlyaccessid?" exact component={UserInfo} />
          <Route path="/student" exact component={Student} />
          <Route path="/educator" exact component={Teacher} />
          <Route path="/products/test-prep" exact component={TestPrep} />
          <Route path="/team" exact component={Team} />
          <Route path="/careers" exact component={Career} />
          <Route path="/contact" exact component={ContactUs} />
          <Route path="/thankyou" exact component={Thankyou} />
          <Route path="/question" exact component={SubmitQuestion} />
          <Route path="/login" component={Login} />
          {/* <Route path="/signup/:useruniqueid?" component={SignUp} /> */}
          <Route path="/signup/:userplan?/:useruniqueid?" component={SignUp} />
          <Route path="/createclass" component={CreateClass} />
          <Route path="/upload" component={CameraCapture} />
          <Route path="/feedback" component={Feedback} />
          <Route path="/GSVsummitSpecial" component={Flyer} />
          <Route path="/PageNotFound" component={PageNotFound} />
          <Route path="/termsandcondition" exact component={TermsandCondition} />
          <Route path="/privacypolicy" exact component={PrivacyPolicy} />
          <Route path="/ptdashboard" exact component={dashboard} />
          <Route path="/signUpPlans/:useruniqueid?" component={SignUpPlans} />
          <Route path="/requestDemo" exact component={RequestDemo} />
          <Route path="/resources" exact component={Resources} />
          <Route path="/verify-email" exact component={MagicLinkVerify} />
          <Route path="/payment-success" exact component={SignUp} />

          <Redirect to="/PageNotFound" ></Redirect>
        </Switch>
      </Suspense>

      {(!isEmbeddedView && !currentPage.includes('/question') && !currentPage.includes('/upload') && !currentPage.includes('/termsandcondition') && !currentPage.includes('/privacypolicy')) &&
        <div className="footer">
          <Footer></Footer>
        </div>
      }


    </div>
    </ThemeProvider>
  );
}

export default App;
