import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const getTransactionsSlice = createSlice({
  name: "getTransactions",
  initialState: {
    fetching: false,
    error: false,
    success: false,
    message: "",
    transactions: [] as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.getTransactions.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(
      apis.getTransactions.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.success = true;
        state.transactions = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.getTransactions.rejected,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.error = true;
        state.message = action?.payload?.error?.message;
        state.success = false;
      }
    );
  },
});

export default getTransactionsSlice.reducer;
