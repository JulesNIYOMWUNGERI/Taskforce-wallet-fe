import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const getCategoriesSlice = createSlice({
  name: "getCategories",
  initialState: {
    fetching: false,
    error: false,
    success: false,
    message: "",
    categories: [] as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.getCategories.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(
      apis.getCategories.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.success = true;
        state.categories = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.getCategories.rejected,
      (state, action: PayloadAction<any>) => {
        state.fetching = false;
        state.error = true;
        state.message = action?.payload?.error?.message;
        state.success = false;
      }
    );
  },
});

export default getCategoriesSlice.reducer;
