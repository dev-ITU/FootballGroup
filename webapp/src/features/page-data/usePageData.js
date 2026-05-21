import { useOutletContext } from "react-router-dom";

export default function usePageData() {
  const context = useOutletContext();

  if (!context) {
    throw new Error("usePageData must be used inside PublicLayout outlet context.");
  }

  if (!context.data && context.route) {
    throw new Error(`Page data for route "${context.route.page}" is not ready yet.`);
  }

  return context;
}