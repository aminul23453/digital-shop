// import React, { useState, useEffect } from 'react'
// import { Routes, Route } from 'react-router-dom'
// import Header from './components/Header'
// import Footer from './components/Footer'
// import Home from './pages/Home'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
// import Checkout from './pages/Checkout'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Account from './pages/Account'
// import { useAuth } from './context/AuthContext'
// import { API_URL } from './services/api'

// function App() {
//   const { isInitialized } = useAuth();
//   const [apiStatus, setApiStatus] = useState({
//     isLoading: true,
//     isConnected: false,
//     error: null
//   });

//   // Check backend API connection
//   useEffect(() => {
//     const checkApiConnection = async () => {
//       try {
//         // Try to access the products endpoint directly
//         const response = await fetch(`${API_URL}/products`);
//         const data = await response.json();
//         console.log('API Products:', data);
        
//         // If we get any response, consider it connected
//         setApiStatus({
//           isLoading: false,
//           isConnected: Array.isArray(data),
//           error: null
//         });
//       } catch (error) {
//         console.error('API Connection Error:', error);
//         setApiStatus({
//           isLoading: false,
//           isConnected: false,
//           error: 'Unable to connect to the backend API'
//         });
//       }
//     };

//     checkApiConnection();
//   }, []);

//   // Wait for auth to initialize before rendering routes
//   if (!isInitialized || apiStatus.isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
//       </div>
//     )
//   }

//   // Show error if API connection failed
//   if (!apiStatus.isConnected) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4">
//         <div className="text-red-500 text-4xl mb-4">⚠️</div>
//         <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
//         <p className="text-gray-700 mb-4 text-center">
//           Unable to connect to the backend API. Please check your connection and try again.
//         </p>
//         <button 
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           onClick={() => window.location.reload()}
//         >
//           Retry Connection
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/product/:slug" element={<ProductDetail />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/account" element={<Account />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default App

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // BrowserRouter should be higher up if not already
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import { useAuth } from './context/AuthContext';
import { API_URL } from './services/api';

function App() {
  const { isInitialized } = useAuth();
  const [apiStatus, setApiStatus] = useState({
    isLoading: true,
    isConnected: false,
    error: null
  });

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch(`${API_URL}/products`); // Django provides array now
        if (!response.ok) { // Check if response status is not 2xx
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log('API Products initial check:', data);
        
        setApiStatus({
          isLoading: false,
          isConnected: Array.isArray(data), // This is now correct for /products
          error: null
        });
      } catch (error) {
        console.error('API Connection Error:', error);
        setApiStatus({
          isLoading: false,
          isConnected: false,
          error: `Unable to connect to the backend API: ${error.message}`
        });
      }
    };

    if (isInitialized) { // Only check API if auth is initialized (or remove this if not dependent)
        checkApiConnection();
    }
  }, [isInitialized]); // Re-run if isInitialized changes, or remove isInitialized dependency if not needed

  if (!isInitialized || apiStatus.isLoading) {
    // ... (loading spinner)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!apiStatus.isConnected) {
    // ... (connection error message)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
        <p className="text-gray-700 mb-4 text-center">
          {apiStatus.error || 'Unable to connect to the backend API. Please check your connection and try again.'}
        </p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()} // Or a more specific retry function
        >
          Retry Connection
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          
          

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;