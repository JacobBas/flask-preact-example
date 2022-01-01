// IMPORTS
import * as _Preact from "https://cdn.skypack.dev/preact@10.4.7"; // for preact
import * as _Hooks from "https://cdn.skypack.dev/preact@10.4.7/hooks"; // for preact hooks
import htm from "https://cdn.skypack.dev/htm@3.0.4"; // for htm

// EXPORTS
/**
 * specifying exports so that they can be used within other JavaScript scripts
 * in the application. Without these exports we tend to run into import errors with
 * the Preact library so these are essential when using JS Modules.
 */
export const html = htm.bind(_Preact.h);
export const Preact = _Preact;
export const Hooks = _Hooks;
