import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase.init.js";

const USER_STORAGE_KEY = "portal-auth-user";

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
    };
};

const loadStoredUser = () => {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        const raw = window.localStorage.getItem(USER_STORAGE_KEY);
        if (!raw) {
            return null;
        }
        return JSON.parse(raw);
    } catch (error) {
        console.warn("Failed to parse stored auth user", error);
        return null;
    }
};

const persistUser = (user) => {
    if (typeof window === "undefined") {
        return;
    }
    if (user) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
        window.localStorage.removeItem(USER_STORAGE_KEY);
    }
};

// Thunk for login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (form, thunkAPI) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
            return mapFirebaseUser(userCredential.user, { email: form.email });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for signup
export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (form, thunkAPI) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const plainUser = {
                uid: userCredential.user.uid,
                email: form.email,
                displayName: userCredential.user.displayName || "",
                photoURL: userCredential.user.photoURL || "",
                phoneNumber: form.phone || "",
                createdAt: serverTimestamp(),
            };
            // Save plain user info in Firestore
            const userDoc = doc(db, "users", plainUser.uid);
            await setDoc(userDoc, plainUser);
            // Store only serializable info in Redux
            return mapFirebaseUser(userCredential.user, {
                email: plainUser.email,
                displayName: plainUser.displayName,
                photoURL: plainUser.photoURL,
                phoneNumber: plainUser.phoneNumber,
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = {
    form: { email: "", password: "", phone: "" },
    user: loadStoredUser(),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setFormData: (state, action) => {
            state.form = { ...state.form, ...action.payload };
        },
        resetForm: (state) => {
            state.form = { email: "", password: "", phone: "" };
        },
        setUser: (state, action) => {
            state.user = action.payload;
            persistUser(action.payload);
        },
        logout: (state) => {
            state.user = null;
            persistUser(null);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Only plain, serializable info
                persistUser(action.payload);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Only plain, serializable info
                persistUser(action.payload);
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});
export const { setFormData, resetForm, logout, setUser } = authSlice.actions;
export default authSlice.reducer;