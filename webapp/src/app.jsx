import AppRouter from "@/app/router/AppRouter.jsx";
import { I18nProvider } from "@/shared/i18n/index.jsx";

export default function App({ initialPage, initialPathname, initialPayload }) {
  return (
    <I18nProvider>
      <AppRouter
        initialPage={initialPage}
        initialPathname={initialPathname}
        initialPayload={initialPayload}
      />
    </I18nProvider>
  );
}
