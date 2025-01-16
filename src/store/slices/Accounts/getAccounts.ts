import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const getAccountsSlice = createSlice({
  name: "getAccounts",
  initialState: {
    fetching: false,
    error: false,
    success: false,
    message: "",
    accounts: [] as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.getAccounts.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(
      apis.getAccounts.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.success = true;
        state.accounts = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.getAccounts.rejected,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.error = true;
        state.message = action?.payload?.error?.message;
        state.success = false;
      }
    );
  },
});

export default getAccountsSlice.reducer;
