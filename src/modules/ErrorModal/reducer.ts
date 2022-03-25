import { createSlice } from "@reduxjs/toolkit";

export interface NotificationState {
  errorMessage: string;
  isOpen: boolean;
}

const initialState: NotificationState = {
  errorMessage: "",
  isOpen: false
};

const errorNotificationReducer = createSlice({
  name: "errorNotificationReducer",
  initialState,
  reducers: {
    closeModal: (state, action) => {
      state.errorMessage = action.payload;
      state.isOpen = false;
    },
    openModal: (state, action) => {
      state.errorMessage = action.payload;
      state.isOpen = true;
    }
  }
});

export const { closeModal, openModal } = errorNotificationReducer.actions;

export default errorNotificationReducer.reducer;
