import { useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";

const useSessionCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("token");
      if (!token && location.pathname !== "/loginSupAdmin") {
      // if (!token) {
        // If token is not found, redirect to login
        navigate("/login");
      }
    };

    // Check session on component mount
    checkSession();

    // Add an event listener for changes in localStorage (specifically when 'token' is removed)
    window.addEventListener("storage", checkSession);

    return () => {
      window.removeEventListener("storage", checkSession);
    };
  }, [navigate]);
};

export default useSessionCheck;
