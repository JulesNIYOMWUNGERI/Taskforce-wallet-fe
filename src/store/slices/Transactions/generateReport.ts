import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const generateReportsSlice = createSlice({
  name: "generateReport",
  initialState: {
    fetching: false,
    error: false,
    success: false,
    message: "",
    report: [] as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.generateReport.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(
      apis.generateReport.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.success = true;
        state.report = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.generateReport.rejected,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.error = true;
        state.message = action?.payload?.error?.message;
        state.success = false;
      }
    );
  },
});

export default generateReportsSlice.reducer;
