/** GA helper */
function sendEvent(group, param) {
  if (!__SERVER__) {
    window.ga("send", "event", group, param);
  }
}

export { sendEvent };
