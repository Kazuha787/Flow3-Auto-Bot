# 🌊 Flow3 Auto Bot — Kazuha787

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v16%2B-brightgreen)](https://nodejs.org/)
[![Made with ❤️ by Kazuha787](https://img.shields.io/badge/Maintainer-Kazuha787-blue)](https://github.com/Kazuha787)
- 🌐 Open an Issue → [GitHub Issues](https://github.com/Kazuha787/Flow3-Auto-Bot/issues)  
- 💬 Join our community → [TELGRAM](https://t.me/Offical_Im_kazuha)

> Automate your airdrop farming journey on [Flow3](https://app.flow3.tech/)  
> Effortlessly claim tasks, manage multiple accounts, and track earnings — 24/7.

---

## 🎥 Live Bot Demo

> ⚠️ The Bot Dashboard preview.

![Screenshot_2025-04-21-23-03-18-36_6012fa4d4ddec268fc5c7112cbb265e7](https://github.com/user-attachments/assets/c5f2794e-c599-4580-9a21-62de86efbdac)


---

## 🚀 Core Features

- 🔐 **Multi-Account Support** — Process unlimited Flow3 accounts in sequence  
- 🌍 **Rotating Proxy Integration** — Avoid IP blocks and rate limits  
- 🧠 **Smart Task Detection** — Automatically detects and completes available tasks  
- 📊 **Real-Time Point Tracking** — Displays task, internet, referral, and daily earnings  
- ♻️ **Continuous Task Looping** — Runs in background, scanning for new tasks  
- 🔄 **Hot Reload Tokens/Proxies** — Edit `token.txt` or `proxies.txt` without restarting  

---

## ⚙️ Quick Setup

### 1. Clone Repository

```bash
git clone https://github.com/Kazuha787/Flow3-Auto-Bot.git
cd Flow3-Auto-Bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Your Flow3 Tokens

Create a file named `token.txt` in the root directory. Paste your tokens (one per line):

```
eyJhbGciOiJIUzI1NiIsInR5cCI...
eyJhbGciOiJIUzI1NiIsInR5cCI...
```

**How to get your token:**

1. Log into [Flow3](https://app.flow3.tech)  
2. Open DevTools → Network tab  
3. Refresh the page  
4. Click any API call → look under **Request Headers**  
5. Copy the `authorization` value (remove `Bearer ` prefix)

### 4. Add Proxies (Optional)

Create a `proxies.txt` file. Add each proxy on a new line:

```
username:password@ip:port
ip:port
http://username:password@ip:port
```

---

## ▶️ Running the Bot

Start the bot with:

```bash
node index.js
```

It will:

- Load your tokens and proxies  
- Connect to Flow3 API for each account  
- Auto-complete available tasks  
- Output point statistics per cycle  
- Repeat the process indefinitely  

---

## 🖥️ Example Output

```
The `index1.js` script runs a Flow3 Auto-Task bot with a vibrant neo-blessed UI in Termux, featuring a log window, system info box, account info panel, and a running bot box with fake transaction animations. Below is a snapshot of the UI as it appears during execution. Note that dynamic elements like spinners (`⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏`) and scrolling fake transactions update in real-time but are shown statically here.
```
```bash
┌──────────────────────────────[FLOW3-AUTO-BOT v1.0] - SYSTEM ONLINE─────────────────┐
│┌──────────────────────────────────────────────┐┌──────────────┐                                 
││ SYSTEM BOOT SEQUENCE INITIATED                 ││ SYSTEM INFO     │                                
││ FLOW3 AUTO TASK - AIRDROP INSIDERS             │└──────────────┘                     
││----------------------------------              │┌──────────────────────────────┐
││ Starting Flow3 Multi-Token Task Bot...         ││ BALANCE INFO                       │
││ Loaded 5 tokens successfully from token.txt    ││------------------------------------│
││ Starting cycle #1                              ││ Total Points:    123.45            │
││----------------------------------------------  ││ Task Points:     100.00            │
││ Processing Token #1                            ││ Internet Points:  20.00            │
││ Found 3 tasks for Token #1                     ││ Referral Points:   3.45            │
││ Processing: Follow Twitter (idle) - 50 points  ││ Today's Earnings: 10.00            │
││ Claiming task 123... ⠋                         ││ Earning Rate:     5.00/day         │
││ Task 123 claimed successfully!                 ││------------------------------------│
││ Waiting 15 seconds before next cycle... ⠙      │└──────────────────────────────┘
││                                                │┌───────────────────────────────┐
││                                                ││ RUNNING BOT                         │
││                                                ││------------------------------- -----│
││                                                ││ Processing Tx: 0x1a2b3c => 0x4d5e6f │
││                                                ││ Processing Tx: 0x7b8c9d => 0xe1f2a3 │
││                                                ││ Processing Tx: 0x5d6e7f => 0xb2c3d4 │
│└──────────────────────────────────────────────┘└──────────────────────────────┘ 
└────────────────────────────────────────────────────────────────────────────────
----------------------------
```

---

## 📁 Project Structure

```
Flow3-Auto-Bot/
├── index.js           # Main bot logic
├── token.txt          # Your Flow3 auth tokens
├── proxies.txt        # Optional proxy list
├── package.json       # NPM config & dependencies
└── README.md          # Project documentation
```

---

## 🔧 Requirements

- Node.js v16 or newer  
- NPM v8 or newer  
- Internet connection  
- Flow3 account(s)

---

## 📦 Dependencies

| Package              | Description                            |
|----------------------|----------------------------------------|
| `axios`              | For sending HTTP requests              |
| `https-proxy-agent`  | Enables proxy support for axios        |
| `fs` / `path`        | File reading, parsing, and path logic  |

Install all with:

```bash
npm install
```

---

## 🤝 Contribution

Open to improvements, ideas, or PRs.  
Just fork the repo, push your changes, and create a pull request.

---

## ⚠️ Legal & Disclaimer

This software is for **educational and experimental purposes** only.  
By using this tool, you agree to take full responsibility for your actions.  
We are not affiliated with Flow3 and are not liable for any account consequences.

---

## 📄 License

Licensed under the [MIT License](./LICENSE)

---

## 📞 Support

For questions, feature requests, or feedback:

- 🌐 Open an Issue → [GitHub Issues](https://github.com/Kazuha787/Flow3-Auto-Bot/issues)  
- 💬 Join our community → [TELGRAM](https://t.me/Offical_Im_kazuha)

---


# Auto Update at 2025-04-24T03:08:03.201Z by qaoieyy33