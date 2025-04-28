import React, { useState, useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import reduxStore from './reduxStorage/combinedReducers';
import 'react-toastify/dist/ReactToastify.css';
import Header from './shared/Header';
import Menu from './shared/Menu';
import Footer from './shared/Footer';


const App = () => {
  const [isFullPageLayout, setIsFullPageLayout] = useState(false);

  const location = useLocation()

  const fullPageLayoutRoutes = [
    '/Login',
    '/login',
    '/Onboarding',
    '/onboarding',
    '/congratulations',
    '/sendResetLink',
    '/resetPassword',
  ];

  useEffect(() => {
    onRouteChanged();
  });

  const onRouteChanged = () => {
    window.scrollTo(0, 0);
    let flag = false;
    fullPageLayoutRoutes.map((path) => {
      if (location.pathname === path) {
        flag = true
      }
    })
    setIsFullPageLayout(flag);
  }

  return (

    <Provider store={reduxStore}>
      {!isFullPageLayout ? (
        <>
          <div className="wrapper">
            <Header />
            <Menu />
            <div className="content-wrapper">
              <AppRoutes />
            </div>
            <Footer />
            <ToastContainer
              position="top-center"
              limit={1}
              containerId="myHalfContainer"
            />
          </div>
        </>
      ) : (
        <>
          <ToastContainer position="top-center" />
          <AppRoutes />
        </>
      )}

    </Provider>

  );
}

export default App;

