/* ═══════════════════════════════════════════════════
   ByteLab Shared Utilities v1
   Common helpers for ALL level pages
   ═══════════════════════════════════════════════════ */

const ByteLab = (function() {
    'use strict';

    // ── STORAGE ──────────────────────────────────
    const PREFIX = 'bytelab';

    function getSolved(world, mode) {
        const key = `${PREFIX}_${mode}_${world}`;
        const legacy = [
            `bl_solved_${mode}_${world}`,
            `bytelearn_${mode}_${world}`,
            `bl_w${world}`
        ];
        let arr = JSON.parse(localStorage.getItem(key) || '[]');
        // Migrate legacy keys
        legacy.forEach(lk => {
            const la = JSON.parse(localStorage.getItem(lk) || '[]');
            if (la.length) {
                arr = [...new Set([...arr, ...la])];
                localStorage.removeItem(lk);
            }
        });
        if (arr.length) localStorage.setItem(key, JSON.stringify(arr));
        return arr;
    }

    function saveSolved(world, level, mode) {
        const key = `${PREFIX}_${mode}_${world}`;
        const solved = getSolved(world, mode);
        if (!solved.includes(level)) {
            solved.push(level);
            localStorage.setItem(key, JSON.stringify(solved));
        }
    }

    function getTotal(mode) {
        let t = 0;
        for (let w = 0; w <= 10; w++) t += getSolved(w, mode).length;
        return t;
    }

    // ── AUDIO ─────────────────────────────────────
    const Audio = {
        ctx: null,
        init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
        play(freq, type, duration, vol) {
            this.init();
            const o = this.ctx.createOscillator(), g = this.ctx.createGain();
            o.type = type || 'sine'; o.frequency.setValueAtTime(freq, this.ctx.currentTime);
            g.gain.setValueAtTime(vol || 0.08, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime + duration);
        },
        pop() { this.play(600, 'sine', 0.1, 0.06); },
        chime() {
            this.init();
            [523, 659, 784, 1047].forEach((f, i) => this.play(f, 'sine', 0.3, 0.1));
        },
        error() { this.play(110, 'sawtooth', 0.35, 0.12); }
    };

    // ── THEME ─────────────────────────────────────
    function initTheme() {
        const saved = localStorage.getItem('bytelab_theme');
        if (saved === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (!saved && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.classList.remove('dark');
        }
    }

    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('bytelab_theme', isDark ? 'dark' : 'light');
        return isDark;
    }

    // ── BYTE ASSISTANT (Smart Mascot) ─────────────

    // ── TOAST ─────────────────────────────────────
    function showToast(msg, duration) {
        const el = document.createElement('div');
        el.className = 'bytelab-toast';
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, duration || 3000);
    }

    // ── BYTE ASSISTANT (Smart Mascot) ─────────────
    // Rich hint database + popup actions on mascot click

    const HINTS = {
        0: { // Discovery
            1: ['Inspect the bank card element. Something is hidden with display:none.',
                'Right-click anywhere and choose Inspect. Look for #real-balance.',
                'Change display:none to display:block on the balance element.'],
            2: ['The upgrade price is just text on the page. Find it in the Elements tab.',
                'Double-click the price in DevTools and change it to anything you want.',
                'Modify the price THEN click Upgrade Now — the system reads the live DOM.'],
            3: ['The Transfer button has TWO locks: disabled attribute AND a CSS class.',
                'Remove disabled from the button tag, then find class="locked" and delete it.',
                'Inspect the button, delete disabled, then remove locked from the class list.'],
            4: ['Your role is stored in a data-role attribute on the app shell.',
                'Find data-role="guest" and change it to data-role="admin".',
                'Search for "data-role" in the Elements panel and edit it directly.'],
            5: ['Look for hidden initialization variables in the page source.',
                'Check the Console for any global config objects.',
                'Inspect the page structure — the answer is in the metadata.']
        },
        1: { // PayPal
            1: ['The Transfer Funds menu item has a disabled attribute. Remove it.',
                'Inspect the sidebar link — find disabled and delete it from the HTML.',
                'Right-click the Transfer Funds item, choose Edit as HTML, remove disabled.'],
            2: ['The menu is blocked by CSS pointer-events. Find the locked class.',
                'Inspect the menu item and remove class="locked" from it.',
                'In the Styles panel, uncheck the pointer-events: none rule.'],
            3: ['The transaction fee is a hidden input. Find fee-amount in the DOM.',
                'Change the hidden input value to a negative number like -150.',
                'Search for type="hidden" in the Elements panel and modify the value.'],
            4: ['The real balance is hidden with style="display:none". Find balance-real.',
                'Remove the style attribute or change display:none to display:block.',
                'Use Ctrl+F in Elements to search for balance-real.'],
            5: ['Your role is in a data-role attribute. Change member to admin.',
                'Find data-role="member" and edit it to data-role="admin".',
                'The profile-node element holds your permissions — modify it.']
        },
        2: { // Netflix
            1: ['Your tier is stored in a cookie. Open the Console (F12 → Console tab).',
                'Type: document.cookie = "tier=premium" and press Enter.',
                'If on file://, type: ByteLab.setCookie("tier", "premium")'],
            2: ['A paywall overlay blocks the video. Find subscription-overlay in Elements.',
                'Right-click the overlay div and choose Delete Element.',
                'The overlay is a DOM element like any other — you can delete it.'],
            3: ['The Google SSO button has a data-redirect attribute pointing to a URL.',
                'Change data-redirect to http://evil.com on the Google login button.',
                'Inspect the SSO button and edit its dataset attribute.'],
            4: ['The trial timer is a global variable. Open the Console.',
                'Type: window.trialSecondsRemaining = 999999',
                'Global variables are accessible from anywhere — override them.'],
            5: ['Authorization checks use Object.prototype. Pollute it to bypass.',
                'Type: Object.prototype.isAuthorized = true in the Console.',
                'Prototype pollution affects ALL objects — use it carefully.']
        },
        3: { // Amazon
            1: ['The quantity input has a min="1" restriction. Remove it.',
                'Change the quantity to -10 after removing the min attribute.',
                'Inspect the number input, delete min, then type a negative value.'],
            2: ['The shipping dropdown is locked to paid options. Inject a free one.',
                'Right-click the select, Edit as HTML, add: <option value="0">Free</option>',
                'Or use the Console to add a new option element to the select.'],
            3: ['Sales tax comes from a hidden input. Find tax-rate in the DOM.',
                'Change the hidden tax-rate value from 0.15 to 0.',
                'Hidden inputs are still readable and writable — they just are not visible.'],
            4: ['The coupon field has readonly. Remove that attribute first.',
                'Then type FREE100 into the coupon input and proceed.',
                'readonly prevents typing but does not protect the data.'],
            5: ['The checkout form accepts any input fields. Add a discount field.',
                'Inject: <input type="hidden" id="discount_value" value="500"> into the form.',
                'The backend parses ALL form fields, including ones you add yourself.']
        },
        4: { // SpaceX
            1: ['Your user ID is in a cookie. Change it to 1 for admin access.',
                'Type: document.cookie = "user_id=1" in the Console.',
                'User ID 1 is typically the root administrator.'],
            2: ['The gateway IP check uses a global variable. Override it.',
                'Type: window.gatewayIp = "127.0.0.1" in the Console.',
                'Making the system think you are localhost bypasses network checks.'],
            3: ['The submit button has a data-endpoint attribute. Change the route.',
                'Change data-endpoint to /v1/admin/shutdown on the save button.',
                'The frontend decides where data goes — change the destination.'],
            4: ['Origin validation uses window.originHeader. Spoof it.',
                'Type: window.originHeader = "workspacex.com"',
                'CORS checks on the client side can be bypassed easily.'],
            5: ['SSO status is in localStorage. Set it to authorized.',
                'Type: localStorage.setItem("auth_status", "authorized")',
                'LocalStorage persists across page loads — check Application tab.']
        },
        5: { // Airbnb
            1: ['Date validation happens client-side. Reverse check-in and check-out.',
                'Set check-out to a date BEFORE check-in for a negative stay.',
                'Inspect the date inputs and swap their values.'],
            2: ['Weight validation blocks text. Change type="number" to type="text".',
                'Then type NaN into the weight field to bypass numeric checks.',
                'NaN is technically not-a-number — it slips past max value checks.'],
            3: ['First class seats are disabled. Remove disabled and change data-tier.',
                'Set data-tier to economy on seat 1A to book it at a lower price.',
                'The tier check compares what you send, not what the seat actually is.'],
            4: ['The logo link href can be changed. Point it anywhere.',
                'Change the logo anchor href to http://evil.com.',
                'Open redirects let attackers send users to malicious sites.'],
            5: ['Flight verification uses a global config object. Bypass it.',
                'Set window.flightConfig.bypass_verification to true.',
                'Configuration in global scope is never secure.']
        }
        // Worlds 6-10 use generic hints since they are engine-powered
    };

    function getHint(world, level) {
        const worldHints = HINTS[world];
        if (!worldHints || !worldHints[level]) {
            return [
                'Open DevTools with F12 and inspect the page elements.',
                'Check the Console tab for global variables you can modify.',
                'Look at the Application tab for cookies and localStorage items.',
                'Right-click elements and choose Inspect to examine the DOM.',
                'Try changing CSS properties, HTML attributes, or JavaScript variables.'
            ];
        }
        return worldHints[level];
    }

    function getCurrentHintIndex(world, level) {
        const key = `bytelab_hint_${world}_${level}`;
        return parseInt(localStorage.getItem(key) || '0');
    }

    function advanceHintIndex(world, level) {
        const hints = getHint(world, level);
        const key = `bytelab_hint_${world}_${level}`;
        let idx = getCurrentHintIndex(world, level);
        idx = (idx + 1) % hints.length;
        localStorage.setItem(key, String(idx));
        return hints[idx];
    }

    function createAssistantPopup(world, level, mode, onSkip, onQuit) {
        // Remove any existing popup
        const existing = document.querySelector('.bytelab-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.className = 'bytelab-popup';
        popup.innerHTML = `
            <div class="bytelab-popup-bg" onclick="this.parentElement.remove()"></div>
            <div class="bytelab-popup-card">
                <div class="bytelab-popup-header">
                    <img src="${getMascotImage()}" style="width:48px;height:48px;border-radius:50%;object-fit:contain">
                    <div>
                        <span style="font-weight:800;font-size:.85rem">Byte Assistant</span>
                        <span style="font-size:.7rem;opacity:.5;display:block">World ${world} · Level ${level}</span>
                    </div>
                    <button onclick="this.closest('.bytelab-popup').remove()" style="background:none;border:none;font-size:1.2rem;cursor:pointer;opacity:.5">&times;</button>
                </div>
                <div class="bytelab-popup-actions">
                    <button class="bytelab-popup-btn hint" id="btn-hint">
                        <span>💡</span> Get Hint
                    </button>
                    <button class="bytelab-popup-btn skip" id="btn-skip">
                        <span>⏭️</span> Skip Level
                    </button>
                    <button class="bytelab-popup-btn quit" id="btn-quit">
                        <span>🚪</span> Quit to Hub
                    </button>
                </div>
                <div class="bytelab-popup-hint" id="popup-hint-text" style="display:none"></div>
            </div>
        `;
        document.body.appendChild(popup);

        // Style injection (once)
        if (!document.getElementById('bytelab-popup-styles')) {
            const style = document.createElement('style');
            style.id = 'bytelab-popup-styles';
            style.textContent = `
                .bytelab-popup{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center}
                .bytelab-popup-bg{position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px)}
                .bytelab-popup-card{position:relative;background:var(--surface,#fff);border:1px solid var(--border,#e2e8f0);border-radius:24px;padding:24px;width:90%;max-width:360px;box-shadow:0 20px 60px rgba(0,0,0,.15);animation:blPop .3s ease}
                .dark .bytelab-popup-card{background:#1a1a24;border-color:#1e293b}
                .bytelab-popup-header{display:flex;align-items:center;gap:12px;margin-bottom:20px}
                .bytelab-popup-actions{display:flex;flex-direction:column;gap:8px}
                .bytelab-popup-btn{display:flex;align-items:center;gap:10px;padding:14px 18px;border-radius:14px;border:1px solid var(--border,#e2e8f0);background:var(--surface,#fff);color:var(--text,#0f172a);font-weight:700;font-size:.9rem;cursor:pointer;transition:all .2s;text-align:left}
                .dark .bytelab-popup-btn{background:#13131a;border-color:#1e293b;color:#e2e8f0}
                .bytelab-popup-btn:hover{transform:translateY(-1px)}
                .bytelab-popup-btn.hint:hover{border-color:#6366f1;background:rgba(99,102,241,.06)}
                .bytelab-popup-btn.skip:hover{border-color:#f59e0b;background:rgba(245,158,11,.06)}
                .bytelab-popup-btn.quit:hover{border-color:#ef4444;background:rgba(239,68,68,.06)}
                .bytelab-popup-hint{margin-top:14px;padding:14px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.15);border-radius:14px;font-size:.82rem;line-height:1.5;color:var(--text,#334155)}
                .dark .bytelab-popup-hint{color:#c7d2fe}
            `;
            document.head.appendChild(style);
        }

        // Wire up buttons
        popup.querySelector('#btn-hint').onclick = () => {
            const hint = advanceHintIndex(world, level);
            const hintEl = popup.querySelector('#popup-hint-text');
            hintEl.style.display = 'block';
            hintEl.innerHTML = `<strong>Hint:</strong> ${hint}`;
        };

        popup.querySelector('#btn-skip').onclick = () => {
            popup.remove();
            const s = getSolved(world, mode);
            if (!s.includes(level)) { s.push(level); saveSolved(world, level, mode); }
            if (onSkip) onSkip();
        };

        popup.querySelector('#btn-quit').onclick = () => {
            popup.remove();
            if (onQuit) onQuit();
        };

        return popup;
    }

    function getMascotImage() {
        const img = document.querySelector('#mascot-avatar, #byte-mascot, #mascot, .mascot-image, .mascot-img');
        return img ? img.src : '../../assets/byte-hello.png';
    }

    function initByteAssistant(world, level, mode) {
        // Find all mascot images on the page
        const mascots = document.querySelectorAll('#mascot-avatar, #byte-mascot, #mascot, .mascot-image, .mascot-img');
        mascots.forEach(mascot => {
            if (mascot._byteAssistantReady) return;
            mascot._byteAssistantReady = true;
            mascot.style.cursor = 'pointer';
            mascot.title = 'Click Byte for hints and options';
            mascot.onclick = (e) => {
                e.stopPropagation();
                createAssistantPopup(world, level, mode,
                    // onSkip: navigate to next level
                    () => {
                        const nextLevel = level + 1;
                        const t = document.querySelector('.bytelab-transition');
                        if (t) t.classList.remove('hide');
                        setTimeout(() => { window.location.href = `../${Math.min(nextLevel, 5)}/index.html?mode=${mode}`; }, 500);
                    },
                    // onQuit: go to hub
                    () => {
                        const t = document.querySelector('.bytelab-transition');
                        if (t) t.classList.remove('hide');
                        setTimeout(() => { window.location.href = '../../../game.html'; }, 500);
                    }
                );
            };
        });
    }

    // ── COOKIE HELPERS (file:// safe) ────────────
    // Firefox blocks document.cookie on file:// — we use localStorage as fallback

    const isFileProtocol = window.location.protocol === 'file:';
    const COOKIE_JAR_KEY = 'bytelab_cookie_jar';

    function _getJar() {
        try { return JSON.parse(localStorage.getItem(COOKIE_JAR_KEY)) || {}; }
        catch(e) { return {}; }
    }
    function _saveJar(jar) {
        try { localStorage.setItem(COOKIE_JAR_KEY, JSON.stringify(jar)); } catch(e) {}
    }

    function setCookie(name, value, days) {
        // Always store in localStorage jar (works everywhere)
        const jar = _getJar();
        jar[name] = String(value);
        _saveJar(jar);

        // Also try real cookies if protocol allows
        if (!isFileProtocol) {
            try {
                let expires = '';
                if (days) {
                    const d = new Date();
                    d.setTime(d.getTime() + days * 86400000);
                    expires = '; expires=' + d.toUTCString();
                }
                document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
            } catch(e) { /* file:// — silently use localStorage */ }
        }
    }

    function getCookie(name) {
        // Check localStorage jar first (always works)
        const jar = _getJar();
        if (jar[name] !== undefined) return jar[name];

        // Fall back to real cookies
        if (!isFileProtocol) {
            try {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                if (match) {
                    const val = decodeURIComponent(match[2]);
                    // Sync to jar
                    jar[name] = val; _saveJar(jar);
                    return val;
                }
            } catch(e) {}
        }
        return null;
    }

    function getAllCookies() {
        const map = _getJar();
        // Merge real cookies if available
        if (!isFileProtocol) {
            try {
                document.cookie.split(';').forEach(c => {
                    const parts = c.trim().split('=');
                    if (parts[0]) map[parts[0]] = parts[1] ? decodeURIComponent(parts[1]) : '';
                });
            } catch(e) {}
        }
        return map;
    }

    // Check if document.cookie actually works
    function _canUseRealCookies() {
        if (isFileProtocol) return false;
        try {
            const testKey = '__bytelab_test_' + Date.now();
            document.cookie = testKey + '=1; path=/; max-age=1';
            return document.cookie.indexOf(testKey) !== -1;
        } catch(e) {
            return false;
        }
    }

    const REAL_COOKIES_WORK = _canUseRealCookies();

    // ── DOM DETECTION ─────────────────────────────
    function watchDisplay(id, callback) {
        const el = document.getElementById(id);
        if (!el) return null;
        let done = false;
        function check() {
            if (done) return;
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                done = true; callback();
            }
        }
        const obs = new MutationObserver(check);
        obs.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
        setInterval(check, 500);
        return { stop() { done = true; obs.disconnect(); } };
    }

    function watchAttribute(id, attr, expected, callback) {
        const el = document.getElementById(id);
        if (!el) return null;
        let done = false;
        function check() {
            if (done) return;
            if (!el.hasAttribute(attr) || el.getAttribute(attr) === expected) {
                done = true; callback();
            }
        }
        const obs = new MutationObserver(check);
        obs.observe(el, { attributes: true, attributeFilter: [attr] });
        setInterval(check, 600);
        return { stop() { done = true; obs.disconnect(); } };
    }

    function watchElementRemoved(id, callback) {
        let done = false;
        function check() {
            if (done) return;
            if (!document.getElementById(id)) {
                done = true; callback();
            }
        }
        const obs = new MutationObserver(check);
        obs.observe(document.body, { childList: true, subtree: true });
        setInterval(check, 500);
        return { stop() { done = true; obs.disconnect(); } };
    }

    function watchCookie(name, expected, callback) {
        let done = false;
        function check() {
            if (done) return;
            if (getCookie(name) === expected) {
                done = true; callback();
            }
        }
        setInterval(check, 500);
        return { stop() { done = true; } };
    }

    function watchGlobal(varName, expected, callback) {
        let done = false;
        function check() {
            if (done) return;
            const parts = varName.split('.');
            let val = window;
            for (const p of parts) { val = val?.[p]; if (val === undefined) break; }
            if (val === expected || (expected === true && val)) {
                done = true; callback();
            }
        }
        setInterval(check, 600);
        return { stop() { done = true; } };
    }

    // ── NAVIGATION ────────────────────────────────
    function quitToHub(base) {
        const t = document.querySelector('.bytelab-transition');
        if (t) t.classList.remove('hide');
        setTimeout(() => { window.location.href = (base || '../../../') + 'game.html'; }, 500);
    }

    function goNextLevel(base, world, level) {
        const t = document.querySelector('.bytelab-transition');
        if (t) t.classList.remove('hide');
        setTimeout(() => { window.location.href = `${base || '../'}${level}/index.html`; }, 600);
    }

    // ── INIT ──────────────────────────────────────
    initTheme();

    return {
        getSolved, saveSolved, getTotal,
        Audio,
        toggleTheme, showToast,
        setCookie, getCookie, getAllCookies,
        watchDisplay, watchAttribute, watchElementRemoved,
        watchCookie, watchGlobal,
        quitToHub, goNextLayer: goNextLevel,
        isFileProtocol, REAL_COOKIES_WORK,
        // Byte Assistant
        getHint, getCurrentHintIndex, advanceHintIndex,
        createAssistantPopup, initByteAssistant
    };

})();
