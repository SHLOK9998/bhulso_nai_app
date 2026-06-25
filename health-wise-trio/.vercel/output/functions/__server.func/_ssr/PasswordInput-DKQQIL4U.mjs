import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as Input } from "./label-DNU6CMww.mjs";
import { B as Button } from "./card-Mow16zMX.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { j as EyeOff, E as Eye } from "../_libs/lucide-react.mjs";
const PasswordInput = reactExports.forwardRef(function PasswordInput2(props, ref) {
  const { t } = useTranslation();
  const [show, setShow] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ref, ...props, type: show ? "text" : "password", className: (props.className ?? "") + " pr-11" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        size: "icon",
        variant: "ghost",
        onClick: () => setShow((s) => !s),
        "aria-label": show ? t("auth.hidePassword") : t("auth.showPassword"),
        className: "absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg text-muted-foreground hover:text-foreground",
        children: show ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
      }
    )
  ] });
});
export {
  PasswordInput as P
};
