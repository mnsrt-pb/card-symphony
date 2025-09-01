import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { registerSW } from "virtual:pwa-register";

import { Memory } from "./components/Memory";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Memory />
  </StrictMode>,
);

// register service worker
registerSW({
  onNeedRefresh() {},
  onOfflineReady() {
    console.log("App is ready to work offline!");
  },
});
