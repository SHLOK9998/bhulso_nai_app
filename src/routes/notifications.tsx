import { createFileRoute, Navigate } from "@tanstack/react-router";

// Notification settings moved into /settings.
export const Route = createFileRoute("/notifications")({
  component: () => <Navigate to="/settings" />,
});
