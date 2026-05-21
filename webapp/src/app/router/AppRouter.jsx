import { Route, Routes } from "react-router-dom";

import PublicLayout from "@/widgets/layout/PublicLayout.jsx";
import ContactsPage from "@/pages/ContactsPage/ContactsPage.jsx";
import ErrorPage from "@/pages/ErrorPage/ErrorPage.jsx";
import HomePage from "@/pages/HomePage/HomePage.jsx";
import MatchesPage from "@/pages/MatchesPage/MatchesPage.jsx";
import MediaPage from "@/pages/MediaPage/MediaPage.jsx";
import TeamPage from "@/pages/TeamPage/TeamPage.jsx";
import PlayerPage from "@/pages/TeamPage/PlayerPage.jsx";

export default function AppRouter({ initialPage, initialPathname, initialPayload }) {
  return (
    <Routes>
      <Route
        element={
          <PublicLayout
            initialPage={initialPage}
            initialPathname={initialPathname}
            initialPayload={initialPayload}
          />
        }
      >
        <Route index element={<HomePage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="team/:playerSlug" element={<PlayerPage />} />
        <Route path="matches" element={<MatchesPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="error" element={<ErrorPage type="generic" />} />
        <Route path="*" element={<ErrorPage type="not-found" />} />
      </Route>
    </Routes>
  );
}