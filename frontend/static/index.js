import { Preact, html } from "./misc/imports.js";
import { App } from "./components/App.js";

// RENDERING THE PAGE
Preact.render(html`<${App} />`, document.getElementById("root"));
