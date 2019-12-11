/** GA helper */
function sendEvent(group, param) {
  if (!__SERVER__) {
    typeof window.ga === "function" && window.ga("send", "event", group, param);
  }
}

export { sendEvent };
