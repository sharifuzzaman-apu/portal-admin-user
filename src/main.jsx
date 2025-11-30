import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import store from './app/store.js'
import { Provider } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase.init.js'
import { setUser } from './pages/features/authSlice.js'
import { doc, getDoc } from 'firebase/firestore'

const mapFirebaseUser = (firebaseUser, overrides = {}) => {
  if (!firebaseUser) {
    return null;
  }
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || overrides.email || "",
    displayName: firebaseUser.displayName || overrides.displayName || "",
    photoURL: firebaseUser.photoURL || overrides.photoURL || "",
    phoneNumber: firebaseUser.phoneNumber || overrides.phoneNumber || "",
    isAdmin: Boolean(overrides.isAdmin),
  };
};

onAuthStateChanged(auth, async (firebaseUser) => {
  if (!firebaseUser) {
    store.dispatch(setUser(null));
    return;
  }
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    const user = mapFirebaseUser(firebaseUser, userData);
    store.dispatch(setUser(user));
  } catch (error) {
    console.warn('Failed to hydrate user record', error);
    store.dispatch(setUser(mapFirebaseUser(firebaseUser)));
  }
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
