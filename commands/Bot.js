const login = require("fca-unofficial");
const appState = require("./appstate.json");

login({ appState }, (err, api) => {
  if (err) {
    console.log("❌ Login Error:", err);
    return;
  }

  console.log("✅ Bot login ho gaya");

  api.setOptions({
    listenEvents: true,
    selfListen: false
  });

  api.listenMqtt((err, event) => {
    if (err) return;
    if (event.type !== "message") return;
    if (!event.body) return;

    const msg = event.body.toLowerCase();

    // AUTO TEXT REPLIES
    if (msg.includes("hi") || msg.includes("hello")) {
      api.sendMessage(
        "👋 Hello! Main auto reply bot hoon.",
        event.threadID
      );
    }

    else if (msg.includes("kaise ho")) {
      api.sendMessage(
        "😊 Main theek hoon, aap kaise ho?",
        event.threadID
      );
    }

    else if (msg.includes("bot")) {
      api.sendMessage(
        "🤖 Haan, main Facebook user auto-reply bot hoon.",
        event.threadID
      );
    }

    else {
      api.sendMessage(
        "📩 Message mil gaya 👍",
        event.threadID
      );
    }
  });
});
