import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { TargetListAPI } from "../../API";

export const getCommentsList: any = createAsyncThunk("comments/getCommentsList", async ({ entityType, entityIdList, last }: { entityType: string; entityIdList: number; last: boolean }) => {
  const { data }: AxiosResponse<commentsType> = await TargetListAPI.getComments(entityType, entityIdList, last);
  return data;
});

export interface CommentOgj {
  id: number;
  commentDate: string;
  username: string;
  valueComment: string;
  eventName: string;
  fixationPeriodId: number;
}

export type commentsType = Array<CommentOgj>;

export type Comments = {
  comments: commentsType;
  status: string | null;
};

const initialState: Comments = {
  comments: [],
  status: null
};

const commentsReducer = createSlice({
  name: "commentsReducer",
  initialState,
  reducers: {},
  extraReducers: {
    [getCommentsList.fulfilled]: (state, action) => {
      state.comments = action.payload;
      state.status = "success";
    },
    [getCommentsList.pending]: (state) => {
      state.status = "loading";
    },
    [getCommentsList.rejected]: (state) => {
      state.status = "error";
    }
  }
});

export default commentsReducer.reducer;
