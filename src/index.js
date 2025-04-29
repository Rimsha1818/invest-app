import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider, useSelector } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter } from 'react-router-dom';

const Root = () => {

  // zeeshan
  const [primaryColor, setPrimaryColor] = useState("#159aff");
  const [fontFamily, setFontFamily] = useState("Helvetica, Arial, sans-serif");
  // zeeshan

  const { currentUser } = useSelector((state) => state.user);
  const [lightMode, setLightMode] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode !== null) {
      setLightMode(savedMode === 'light');
    }

    const currentTheme= localStorage.getItem('themeMode');
    document.body.className = currentTheme; 


    // zeeshan
    if(currentTheme){
      if(currentTheme == 'light'){
        setPrimaryColor(localStorage.getItem('primary-color'));
        setFontFamily(localStorage.getItem('font-family'));
        
      }else{
        setPrimaryColor(localStorage.getItem('dark_primary-color'));
        setFontFamily(localStorage.getItem('font-family'));
      }
    }
    else{
      if(localStorage.getItem('primary-color') != null){
        setPrimaryColor(localStorage.getItem('primary-color'));
        setFontFamily(localStorage.getItem('font-family'));
      }else{
        setPrimaryColor(primaryColor);
        setFontFamily(fontFamily);
      }
    }
    // zeeshan

  }, []);

  const toggleMode = () => {
    const newMode = !lightMode;
    setLightMode(newMode);
    localStorage.setItem('themeMode', newMode ? 'light' : 'dark');

    // zeeshan
    const currentTheme= localStorage.getItem('themeMode');
    document.body.className = currentTheme; 
    // zeeshan

  };

  // let pc = "159aff";
  // if(primaryColor === null){

  //   console.log("yes it is");
  // }

  return (
    <ConfigProvider
    theme={{
      token: {
        ...(primaryColor ? { colorPrimary: primaryColor } : {}),
        ...(fontFamily ? { fontFamily: fontFamily } : {}),
      },
      algorithm: lightMode ? [theme.defaultAlgorithm, theme.compactAlgorithm] : [theme.darkAlgorithm, theme.compactAlgorithm],
    }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          {currentUser && <div onClick={toggleMode} style={{position: 'fixed', left: '1px', bottom: '10px', zIndex: 9999, cursor: 'pointer'}}>
            {lightMode ? '🌞' : '🌙'}
          </div>}
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <BrowserRouter> {/* Wrap Root inside BrowserRouter */}
      <Root />
    </BrowserRouter>
  </Provider>
);
