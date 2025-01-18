import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const setBudgetLimitSlice = createSlice({
  name: "setBudgetLimit",
  initialState: {
    setting: false,
    error: false,
    success: false,
    message: "",
    data: {} as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.setBudgetLimit.pending, (state) => {
      state.setting = true;
    });
    builder.addCase(
      apis.setBudgetLimit.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.setting = false;
        state.success = true;
        state.message = "Set successfully";
        state.data = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.setBudgetLimit.rejected,
      (state, action: PayloadAction<any>) => {
        state.setting = false;
        state.error = true;
        state.message = action?.payload?.error?.message;
        state.success = false;
      }
    );
    builder.addCase(apis.reset, (state) => {
      state.setting = false;
      state.error = false;
      state.success = false;
      state.message = "";
      state.data = {} as any;
    });
  },
});

export default setBudgetLimitSlice.reducer;
