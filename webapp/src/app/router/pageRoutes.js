import { matchPath } from "react-router-dom";

export const PAGE_ROUTES = [
  {
    page: "home",
    path: "/",
    routePath: "",
    apiPath: "/api/home/",
    label: "Главная",
  },
  {
    page: "team",
    path: "/team/",
    routePath: "team",
    apiPath: "/api/team/",
    label: "Команда",
  },
  {
    page: "matches",
    path: "/matches/",
    routePath: "matches",
    apiPath: "/api/matches/",
    label: "Матчи",
  },
  {
    page: "media",
    path: "/media/",
    routePath: "media",
    apiPath: "/api/media/",
    label: "Медиа",
  },
  {
    page: "contacts",
    path: "/contacts/",
    routePath: "contacts",
    apiPath: "/api/contacts/",
    label: "Контакты",
  },
];

export function normalizePathname(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function getRouteByPage(page) {
  return PAGE_ROUTES.find((route) => route.page === page) || null;
}

export function getRouteByPathname(pathname) {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === "/") {
    return getRouteByPage("home");
  }

  if (matchPath("/team/:playerSlug/", normalizedPath)) {
    return getRouteByPage("team");
  }

  return PAGE_ROUTES.find((route) => route.path === normalizedPath) || null;
}