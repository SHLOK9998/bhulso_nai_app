import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell, B as Button, C as Card } from "./card-Mow16zMX.mjs";
import { R as RequireAuth } from "./RequireAuth-D1Lajl0o.mjs";
import { L as Label, I as Input } from "./label-DNU6CMww.mjs";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, b as DialogFooter } from "./dialog-B9296iqD.mjs";
import { s as supabase } from "./client-CRJ153-x.mjs";
import { u as useAuth } from "./router-D98PLsb2.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/i18next.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { q as Plus, y as Users, P as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/use-sync-external-store.mjs";
const COLORS = ["#0EA5A4", "#2563EB", "#F59E0B", "#EC4899", "#8B5CF6", "#10B981"];
function Family() {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [members, setMembers] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [promptMember, setPromptMember] = reactExports.useState(null);
  const load = async () => {
    if (!user) return;
    const {
      data
    } = await supabase.from("family_members").select("*").eq("user_id", user.id).order("created_at");
    setMembers(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, [user]);
  const handleSaved = (m, wasNew) => {
    load();
    if (wasNew && m) setPromptMember(m);
  };
  const remove = async (id) => {
    if (!confirm(t("family.deleteConfirm"))) return;
    await supabase.from("family_members").delete().eq("id", id);
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: t("family.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: t("family.sub") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        setEditing(null);
        setOpen(true);
      }, className: "gap-2 rounded-xl bg-[image:var(--gradient-primary)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        t("family.add")
      ] })
    ] }),
    members.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-8 rounded-2xl border-dashed p-16 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mx-auto h-10 w-10 opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4", children: t("family.noneYet") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: members.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl p-5 shadow-[var(--shadow-soft)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl text-lg font-bold text-white", style: {
        background: m.color ?? "#0EA5A4"
      }, children: m.name.charAt(0).toUpperCase() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: m.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: [m.relation, m.age && `${m.age}y`].filter(Boolean).join(" · ") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
          setEditing(m);
          setOpen(true);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(m.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] })
    ] }) }, m.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MemberDialog, { open, onOpenChange: setOpen, member: editing, onSaved: handleSaved }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!promptMember, onOpenChange: (v) => !v && setPromptMember(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: t("family.addMedPrompt", {
        name: promptMember?.name ?? ""
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "rounded-xl", onClick: () => setPromptMember(null), children: t("family.addMedNo") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "rounded-xl bg-[image:var(--gradient-primary)]", onClick: () => {
          const id = promptMember.id;
          setPromptMember(null);
          nav({
            to: "/medicines",
            search: {
              memberId: id
            }
          });
        }, children: t("family.addMedYes") })
      ] })
    ] }) })
  ] });
}
function MemberDialog({
  open,
  onOpenChange,
  member,
  onSaved
}) {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const [name, setName] = reactExports.useState("");
  const [relation, setRelation] = reactExports.useState("");
  const [age, setAge] = reactExports.useState("");
  const [color, setColor] = reactExports.useState(COLORS[0]);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (member) {
      setName(member.name);
      setRelation(member.relation ?? "");
      setAge(member.age?.toString() ?? "");
      setColor(member.color ?? COLORS[0]);
    } else {
      setName("");
      setRelation("");
      setAge("");
      setColor(COLORS[0]);
    }
  }, [member, open]);
  const save = async (e) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const payload = {
      user_id: user.id,
      name,
      relation,
      age: age ? Number(age) : null,
      color
    };
    const wasNew = !member;
    const {
      data,
      error
    } = member ? await supabase.from("family_members").update(payload).eq("id", member.id).select().maybeSingle() : await supabase.from("family_members").insert(payload).select().maybeSingle();
    setBusy(false);
    if (error) return toast.error(error.message);
    onOpenChange(false);
    onSaved(data ?? null, wasNew);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: member ? t("family.edit") : t("family.add") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("family.name") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("family.relation") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: relation, onChange: (e) => setRelation(e.target.value), placeholder: "Mother, Son...", className: "mt-1.5 h-11 rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("family.age") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: age, onChange: (e) => setAge(e.target.value), className: "mt-1.5 h-11 rounded-xl" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("med.color") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 flex gap-2", children: COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setColor(c), className: `h-10 w-10 rounded-xl ring-2 ring-offset-2 ring-offset-background transition ${color === c ? "ring-foreground" : "ring-transparent"}`, style: {
          background: c
        }, "aria-label": c }, c)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "flex-1 rounded-xl", onClick: () => onOpenChange(false), children: t("med.cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "flex-1 rounded-xl bg-[image:var(--gradient-primary)]", children: busy ? "..." : t("med.save") })
      ] })
    ] })
  ] }) });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAuth, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Family, {}) });
export {
  SplitComponent as component
};
