import { createFileRoute, Navigate } from "@tanstack/react-router";

// History is now a tab inside /log
export const Route = createFileRoute("/history")({
  component: () => <Navigate to="/log" />,
});
