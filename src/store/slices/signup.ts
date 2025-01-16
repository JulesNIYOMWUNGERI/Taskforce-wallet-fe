import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {apis} from "../apis";

const signUpSlice = createSlice({
  name: "signup",
  initialState: {
    registering: false,
    error: false,
    success: false,
    succefulMessage: "",
    data: [] as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.signup.pending, (state) => {
      state.registering = true;
    });
    builder.addCase(
      apis.signup.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.registering = false;
        state.success = true;
        state.data = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.signup.rejected,
      (state, action: PayloadAction<any>) => {
        state.registering = false;
        state.error = true;
        state.succefulMessage = action?.payload?.error?.message;
        state.success = false;
      }
    );
  },
});

export default signUpSlice.reducer;
