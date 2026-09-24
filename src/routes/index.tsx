import { createFileRoute, redirect } from "@tanstack/react-router";

// The VibeTunes UI is a standalone vanilla HTML/CSS/JS app served as a
// static asset at /vibetunes.html. Redirect the root route to it so the
// preview opens directly on the music interface.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/vibetunes.html" });
  },
});
