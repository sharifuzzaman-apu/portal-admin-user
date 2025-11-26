import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {getDocs,collection} from "firebase/firestore";
import { db } from "../../firebase.init.js";

// thunk for fetching users
export const fetchUsers=createAsyncThunk(
    'user/fetchUsers',
    async(__,thunkAPI)=>{
        try{
            const querySnapshot=await getDocs(collection(db,'users'))
            const users=[]
            querySnapshot.forEach((doc)=>{
                users.push({
                    id:doc.id,
                    ...doc.data()
                })
            })
            return users;
        }catch(error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const userSlice=createSlice({
    name:'user',
    initialState:{
        users:[],
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    }
})
export default userSlice.reducer;