import { configureStore } from "@reduxjs/toolkit";
import jobApplicationsReducer from "./jobApplicationsSlice";

const store = configureStore({
  reducer: {
    jobApplications: jobApplicationsReducer,
  },
});

export default store;
