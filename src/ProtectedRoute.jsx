// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";
// import { useMaterialTailwindController } from "@/context";
// export default function ProtectedRoute({ children }) {
//   const [validating, setValidating] = useState(true);
//   const [isAuth, setIsAuth] = useState(false);
//   const [controller, dispatch, { doProfile }] = useMaterialTailwindController();
//   const {profile} = controller
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         // await axios.get("/auth/profile", { withCredentials: true });
//         const profiles = await doProfile();
//         setIsAuth(true);
//       } catch (err) {
//         setIsAuth(false);
//         await axios.get("/auth/logout", { withCredentials: true });
//       } finally {
//         setValidating(false);
//       }
//     };

//     checkAuth();
//     //🔥validate every 10 seconds
//   const interval = setInterval(checkAuth, 10000);

//   return () => clearInterval(interval);
//   }, []);

//   if (validating) return null; // mientras valida el token

//   if (!isAuth) return <Navigate to="/auth/sign-in" replace />;

//   return children;
// }

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useMaterialTailwindController } from "@/context";
import { hasPermission } from "@/utils/permissions";

export default function ProtectedRoute({ children, permission }) {
  const [validating, setValidating] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const [controller, , { doProfile }] = useMaterialTailwindController();
  const { profile } = controller;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await doProfile(); // 🔐 valida token y carga perfil
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
        await axios.get("/auth/logout", { withCredentials: true });
      } finally {
        setValidating(false);
      }
    };

    checkAuth();

    const interval = setInterval(checkAuth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (validating) return null;

  // ❌ No autenticado
  if (!isAuth) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // ❌ Sin permiso
  if (permission && !hasPermission(profile?.role, permission)) {
    return <Navigate to="/dashboard/unauthorized" replace />;
  }

  // ✅ Autorizado
  return children;
}
