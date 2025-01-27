import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import './App.css'; // This will contain the styles for the light effect
import { ChatProvider } from './Contexts/chatContext';
import ErrorBoundary from './components/ErrorHandler/ErrorBoundary';
import Home from './components/Home/home.component';
function App() {
  const [showFullPage, setShowFullPage] = useState(true);

  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error listener:', event.error);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  const handleUserRequest = () => {
    setShowFullPage(false);
  };

  return (
    <div className={showFullPage ? "h-[980px] md:h-[910px] bg-light" : "h-full md:h-[100vh] overflow-hidden bg-light"}>
      <div className="bg-custom-image bg-center bg-contain h-full">
        
      <ErrorBoundary>
        <ChatProvider>
        <Routes>
        <Route path='/' element={<Home showFullPage={showFullPage} onRequest={handleUserRequest} />}/>
          </Routes>
        </ChatProvider>
      </ErrorBoundary>
        </div>
      </div>

  );
}

export default App;
