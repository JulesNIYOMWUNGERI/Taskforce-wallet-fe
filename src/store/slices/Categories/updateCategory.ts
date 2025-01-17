import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

const updateCategorySlice = createSlice({
  name: "updateCategory",
  initialState: {
    updating: false,
    error: false,
    success: false,
    message: "",
    data: {} as any,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(apis.updateCategory.pending, (state) => {
      state.updating = true;
    });
    builder.addCase(
      apis.updateCategory.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.updating = false;
        state.success = true;
        state.message = "Updated successfully";
        state.data = action?.payload;
        state.error = false;
      }
    );
    builder.addCase(
      apis.updateCategory.rejected,
      (state, action: PayloadAction<any>) => {
        state.updating = false;
        state.error = true;
        state.message = action?.payload?.error?.message;
        state.success = false;
      }
    );
    builder.addCase(apis.reset, (state) => {
      state.updating = false;
      state.error = false;
      state.success = false;
      state.message = "";
      state.data = {} as any;
    });
  },
});

export default updateCategorySlice.reducer;
