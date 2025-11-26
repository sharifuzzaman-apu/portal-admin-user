import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import store from './app/store.js'
import { Provider } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.init.js'
import { setUser } from './pages/features/authSlice.js'

const mapFirebaseUser = (firebaseUser) => {
  if (!firebaseUser) {
    return null;
  }
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName || "",
    photoURL: firebaseUser.photoURL || "",
    phoneNumber: firebaseUser.phoneNumber || "",
  };
};

onAuthStateChanged(auth, (firebaseUser) => {
  const user = mapFirebaseUser(firebaseUser);
  store.dispatch(setUser(user));
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
