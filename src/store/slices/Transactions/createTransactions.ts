import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const addTransactionSlice = createSlice({
  name: "createTransaction",
  initialState: {
    saving: false,
    error: false,
    success: false,
    message: "",
    data: {} as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.createAccount.pending, (state) => {
      state.saving = true;
    });
    builder.addCase(
      apis.createAccount.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.saving = false;
        state.success = true;
        state.message = "Created successfully";
        state.data = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.createAccount.rejected,
      (state, action: PayloadAction<any>) => {
        state.saving = false;
        state.error = true;
        state.message = action?.payload?.error?.message;
        state.success = false;
      }
    );
    builder.addCase(apis.reset, (state) => {
      state.saving = false;
      state.error = false;
      state.success = false;
      state.message = "";
      state.data = {} as any;
    });
  },
});

export default addTransactionSlice.reducer;
