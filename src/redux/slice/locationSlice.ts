import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    // state:[],
    // city:[],
    communityId:[],
    code:""

}

 const locationSlice = createSlice({
    name:'location',
    initialState,
    reducers:{
        setLocation: (state, action) => {
            // state.state = action.payload.state;
            // state.city = action.payload.city;
            state.communityId = action.payload.communityId;
            state.code = action.payload.code
          },
    }

})



export const {setLocation } =locationSlice.actions;
export default locationSlice.reducer;