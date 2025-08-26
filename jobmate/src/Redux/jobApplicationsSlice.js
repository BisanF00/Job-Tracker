import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  applications: [],
};

const jobApplicationsSlice = createSlice({
  name: "jobApplications",
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
  },
});

export const { setApplications } = jobApplicationsSlice.actions;
export default jobApplicationsSlice.reducer;
