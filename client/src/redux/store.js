import { userSlice } from "./userSlice";
import {configureStore} from '@reduxjs/toolkit'
const store = configureStore({
    reducer:{
        users : userSlice.reducer
    }
})
export default store