import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "@/app.jsx";
import "@/app/styles/index.css";

const rootElement = document.getElementById("react-app-root");
const payloadElement = document.getElementById("react-page-data");
const splashElement = document.getElementById("app-boot-splash");

function hideBootSplash() {
  const bootStart = window.__appBootStartedAt || Date.now();
  const sessionKey = "gazprom-public-booted";
  const alreadyBooted = window.sessionStorage.getItem(sessionKey) === "1";

  const minSplashMs = alreadyBooted ? 90 : 240;
  const elapsed = Date.now() - bootStart;
  const remaining = Math.max(0, minSplashMs - elapsed);

  window.setTimeout(() => {
    splashElement?.classList.add("is-hidden");
    document.documentElement.classList.remove("app-booting");
    window.sessionStorage.setItem(sessionKey, "1");

    window.setTimeout(() => {
      splashElement?.remove();
    }, 180);
  }, remaining);
}

if (rootElement && payloadElement?.textContent) {
  try {
    const payload = JSON.parse(payloadElement.textContent);
    const page = rootElement.dataset.page || "home";
    const pathname = rootElement.dataset.path || window.location.pathname;

    createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter>
          <App
            initialPage={page}
            initialPathname={pathname}
            initialPayload={payload}
          />
        </BrowserRouter>
      </React.StrictMode>,
    );

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        hideBootSplash();
      });
    });
  } catch (error) {
    console.error("Failed to hydrate React app payload:", error);
    document.documentElement.classList.remove("app-booting");
    splashElement?.classList.add("is-hidden");
  }
}
