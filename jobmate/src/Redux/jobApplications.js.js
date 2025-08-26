import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setApplications } from "./jobApplicationsSlice";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function useFetchUserApplications(statusFilter = "applied") {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "jobApplications"),
          where("userId", "==", user.uid),
          where("status", "==", statusFilter)
        );

        const snapshot = await getDocs(q);
        const apps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch(setApplications(apps));
        localStorage.setItem("jobApplications", JSON.stringify(apps));
      } catch (err) {
        console.error(err);

        const cachedApps = localStorage.getItem("jobApplications");
        if (cachedApps) {
          dispatch(setApplications(JSON.parse(cachedApps)));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [statusFilter, dispatch]);

  return loading;
}
