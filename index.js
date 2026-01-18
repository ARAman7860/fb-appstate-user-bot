const fs = require("fs");
const path = require("path");
const login = require("fca-unofficial");

const config = require("./config.json");

// READ APPSTATE
let appState;
try {
  appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));
} catch (e) {
  console.log("❌ appstate.json galat hai ya empty hai");
  process.exit(1);
}

// LOAD COMMANDS
const commands = new Map();
const cmdPath = path.join(__dirname, "commands");

fs.readdirSync(cmdPath).forEach(file => {
  if (!file.endsWith(".js")) return;
  const cmd = require(`./commands/${file}`);
  commands.set(cmd.name, cmd);
  console.log("✅ Loaded:", cmd.name);
});

// LOGIN
login({ appState }, (err, api) => {
  if (err) {
    console.log("❌ Facebook login fail");
    return;
  }

  console.log("✅ Bot login success");

  api.listenMqtt((err, event) => {
    if (err) return;
    if (event.type !== "message" || !event.body) return;

    const msg = event.body.trim();
    if (!msg.startsWith(config.prefix)) return;

    const args = msg.slice(config.prefix.length).split(" ");
    const cmdName = args.shift().toLowerCase();

    const command = commands.get(cmdName);
    if (!command) return;

    command.run({ api, event, args });
  });
});
