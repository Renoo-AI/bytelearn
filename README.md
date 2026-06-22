# ByteLab — Open Source Cybersecurity Training Platform

**110+ free, browser-based security challenges across 11 simulated corporate environments.**

No VMs. No setup. No paywalls. Just open DevTools and start hacking.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
![Free Forever](https://img.shields.io/badge/price-$0-green)

---

## What is ByteLab?

ByteLab is an interactive, game-based platform that teaches cybersecurity through hands-on exploitation and defense. Each "world" is a realistic mockup of a real product — PayPal, Netflix, Amazon, SpaceX, OpenAI, Tesla, and more — with intentionally planted security flaws.

You play as either **Red Team** (attack) or **Blue Team** (defend), modifying client-side code via browser DevTools to find vulnerabilities or writing WAF rules to block them.

## Features

- **110+ Interactive Challenges** — 55 attack + 55 defense levels
- **11 Themed Worlds** — PayPal, Netflix, Amazon, SpaceX, Airbnb, OpenAI, Teladoc, OpenSea, Tesla, FedEx + Discovery
- **Dual-Path System** — Red Team (exploit) and Blue Team (defend) modes
- **Interactive World Map** — Drag, zoom, search, and navigate through worlds
- **Real Attack Vectors** — DOM manipulation, cookie tampering, prototype pollution, SQL injection, XSS, NoSQL injection, SSRF, XXE, and more
- **WAF Coding Challenges** — Write JavaScript validation functions to block attacks
- **Progress Tracking** — Persistent solve tracking, ranks (Recruit → Architect), achievements
- **Dark Mode** — Full light/dark theme with system preference detection
- **Bilingual** — English and Arabic with RTL support
- **Mobile Responsive** — Works on desktop, tablet, and mobile
- **Accessibility** — ARIA labels, keyboard navigation, focus states, screen reader support
- **Zero Setup** — Pure HTML/CSS/JS, runs in any browser
- **100% Free** — No accounts, no paywalls, no premium tiers. MIT licensed.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/bytelab.git

# Open in browser
open bytelab/index.html
# or just double-click index.html
```

That's it. No `npm install`. No build step. Just open and play.

## How to Play

1. Open `index.html` or `game.html` in your browser
2. Select your path: **Red Team** (attack) or **Blue Team** (defend)
3. Choose a world on the interactive map
4. Click a level to enter the challenge
5. **Press F12** to open DevTools
6. Inspect elements, modify CSS, change JavaScript variables, tamper with cookies
7. The platform auto-detects when you solve a challenge
8. Progress is saved locally in your browser

### Red Team Path
Find and exploit client-side vulnerabilities:
- Change `display: none` to `display: block` to reveal hidden data
- Remove `disabled` attributes from buttons
- Modify cookie values to escalate privileges
- Inject hidden form fields
- Pollute JavaScript prototypes
- Execute SQL/NoSQL injection payloads

### Blue Team Path
Write WAF (Web Application Firewall) rules in JavaScript:
```javascript
function check(request) {
  // Block negative quantities
  return request.body && parseInt(request.body.quantity, 10) > 0;
}
```

## World Map

| # | World | Theme | Levels |
|---|-------|-------|--------|
| 0 | Discovery | Tutorial & basics | 5 |
| 1 | PayPal | Financial logic bypass | 5+5 |
| 2 | Netflix | Streaming auth & cookies | 5+5 |
| 3 | Amazon | E-commerce validation | 5+5 |
| 4 | SpaceX | SSO & access control | 5+5 |
| 5 | Airbnb | Scheduling & dates | 5+5 |
| 6 | OpenAI | LLM injection & prompts | 5+5 |
| 7 | Teladoc | Patient data leaks | 5+5 |
| 8 | OpenSea | Web3 storage manipulation | 5+5 |
| 9 | Tesla | IoT telemetry | 5+5 |
| 10 | FedEx | Logistics security | 5+5 |

## Tech Stack

- **Vanilla HTML/CSS/JavaScript** — No frameworks, no build tools
- **Tailwind CSS** — via CDN for utility styling
- **Google Fonts** — Plus Jakarta Sans + JetBrains Mono
- **LocalStorage** — Progress persistence
- **MutationObserver** — Real-time DOM change detection
- **Web Audio API** — Sound effects

## Project Structure

```
bytelab/
├── index.html              # Landing page
├── game.html               # Main academy hub with interactive map
├── game.js                 # Legacy redirect handler
├── profile.html            # Player profile & achievements
├── challenges.js           # 110+ challenge definitions (ATTACK + DEFEND)
├── translations.js         # EN/AR translation dictionary
├── README.md               # You're reading it
├── assets/                 # Images, logos, mascot assets
│   ├── logo.png
│   ├── byte-*.png          # Byte mascot in various moods
│   └── *.png               # World brand logos
├── levels/
│   ├── engine.js           # Shared game engine with EN/AR translations
│   └── {world}/{level}/
│       └── index.html      # Individual challenge pages
├── security/
│   └── {level}/
│       └── index.html      # Defense mode challenge pages
├── attacker/
│   └── {level}/
│       └── index.html      # Legacy attacker pages
└── mypath/
    └── index.html          # Path selection page
```

## Ranks & Achievements

| Rank | Requirement |
|------|-------------|
| Recruit | 0 solves |
| Scripter | 5 solves |
| Explorer | 12 solves |
| Hacker | 22 solves |
| Elite | 35 solves |
| Architect | 48 solves |

**Achievements**: First Blood, Foot in the Door, Red October, Blue Shield, Completionist, World Tour, Architect, Centurion, Dual Path

## Contributing

We welcome contributions! ByteLab is MIT licensed and community-driven.

### Ways to Contribute
- **Add new worlds** — Create a new corporate simulation
- **Add new challenges** — Invent creative client-side exploits or WAF rules
- **Improve translations** — Help translate to more languages
- **Fix bugs** — Report or fix issues
- **Improve UI/UX** — Accessibility, responsiveness, animations
- **Write documentation** — Improve README, add tutorials

### Adding a New Level
1. Add challenge definition to `challenges.js`
2. Create `levels/{world}/{level}/index.html` with the challenge UI
3. Add translations to `levels/engine.js` and `translations.js`
4. Add level metadata to `game.html` LEVELS object

## Security Note

ByteLab is an **educational tool**. All "vulnerabilities" are intentionally planted in client-side mockups. No actual servers, databases, or real systems are involved. The skills taught are for defensive purposes — understanding how attacks work is the first step to preventing them.

## License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2024 ByteLab Contributors

---

**Made with passion for the security community. Always free. Always open source.**
