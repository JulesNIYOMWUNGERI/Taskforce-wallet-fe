import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const deleteCategorySlice = createSlice({
  name: "deleteCategory",
  initialState: {
    deleting: false,
    error: false,
    success: false,
    message: "",
    data: {} as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.deleteCategory.pending, (state) => {
      state.deleting = true;
    });
    builder.addCase(
      apis.deleteCategory.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.deleting = false;
        state.success = true;
        state.message = "Deleted successfully";
        state.data = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.deleteCategory.rejected,
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

export default deleteCategorySlice.reducer;
