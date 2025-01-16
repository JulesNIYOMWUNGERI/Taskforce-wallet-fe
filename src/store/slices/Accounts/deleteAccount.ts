import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const deleteAccountSlice = createSlice({
  name: "deleteAccount",
  initialState: {
    deleting: false,
    error: false,
    success: false,
    message: "",
    data: {} as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.deleteAccount.pending, (state) => {
      state.deleting = true;
    });
    builder.addCase(
      apis.deleteAccount.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.deleting = false;
        state.success = true;
        state.message = "Deleted successfully";
        state.data = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.deleteAccount.rejected,
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

export default deleteAccountSlice.reducer;
