import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const deleteTransactionSlice = createSlice({
  name: "deleteTransaction",
  initialState: {
    deleting: false,
    error: false,
    success: false,
    message: "",
    data: {} as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.deleteTransaction.pending, (state) => {
      state.deleting = true;
    });
    builder.addCase(
      apis.deleteTransaction.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.deleting = false;
        state.success = true;
        state.message = "Deleted successfully";
        state.data = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.deleteTransaction.rejected,
      (state, action: PayloadAction<any>) => {
        state.deleting = false;
        state.error = true;
        state.message = action?.payload?.error?.message;
        state.success = false;
      }
    );
    builder.addCase(apis.reset, (state) => {
      state.deleting = false;
      state.error = false;
      state.success = false;
      state.message = "";
      state.data = {} as any;
    });
  },
});

export default deleteTransactionSlice.reducer;
