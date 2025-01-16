import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {apis} from "../apis";

const signInSlice = createSlice({
  name: "signin",
  initialState: {
    loading: false,
    error: false,
    success: false,
    succefulMessage: "",
    data: [] as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.signin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      apis.signin.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.data = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.signin.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = true;
        state.succefulMessage = action?.payload?.error?.message;
        state.success = false;
      }
    );
    builder.addCase(apis.reset, (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.succefulMessage = "";
      state.data = [] as any;
    });
  },
});

export default signInSlice.reducer;
