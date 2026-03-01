/* eslint-disable no-unused-vars */
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  // ⭐ localStorage থেকে সঠিকভাবে token চেক করুন
  const storedUserInfo = localStorage.getItem("userInfo");
  let hasToken = false;
  
  if (storedUserInfo) {
    try {
      const parsed = JSON.parse(storedUserInfo);
      hasToken = !!parsed.token;
    } catch (e) {
      console.error("Invalid userInfo in localStorage");
    }
  }

  console.log("PrivateRoute - Redux userInfo:", !!userInfo);
  console.log("PrivateRoute - localStorage token:", hasToken);

  // Redux OR localStorage যেকোনো একটাতে থাকলেই OK
  const isAuthenticated = userInfo?.token || hasToken;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;