import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-D98PLsb2.mjs";
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center text-muted-foreground", children: "Loading…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
export {
  RequireAuth as R
};
