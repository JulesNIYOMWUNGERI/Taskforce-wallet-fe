import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const getUserBudgetLimitSlice = createSlice({
  name: "getUserBudget",
  initialState: {
    fetching: false,
    error: false,
    success: false,
    message: "",
    budget: [] as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.getUserBudget.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(
      apis.getUserBudget.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.success = true;
        state.budget = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.getUserBudget.rejected,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.error = true;
        state.message = action?.payload?.error?.message;
        state.success = false;
      }
    );
  },
});

export default getUserBudgetLimitSlice.reducer;
