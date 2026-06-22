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
        0: {
            1: ['Something on this page is hidden from view. Where might sensitive data be tucked away?',
                'Check the Elements panel — look for an element that has a style making it invisible.',
                'Find the element with display:none. What happens if you change none to block?'],
            2: ['The price shown on screen is just text. What if you could edit it before the system reads it?',
                'Right-click the price and choose Inspect. Double-click the number in the HTML.',
                'Change the price in DevTools, THEN click the upgrade button. The system reads the live DOM.'],
            3: ['The Transfer button looks clickable but something is blocking it. Check its attributes.',
                'A button can be disabled in two ways: an HTML attribute AND a CSS class.',
                'Inspect the button — remove disabled from the tag, then find and delete the locked class.'],
            4: ['The dashboard treats you like a guest. But your role is written somewhere in the page.',
                'Look for data attributes on the main container element. They often control permissions.',
                'Search for data-role in the Elements panel. Change guest to admin.'],
            5: ['The answer is hidden in the page structure itself. Look deeper than what you see.',
                'Check for hidden input fields, comments in the HTML, or global JavaScript variables.',
                'Right-click → View Page Source. Sometimes the answer is in a comment or a meta tag.']
        },
        1: {
            1: ['The transfer screen shows $5,000. But is that the real amount being sent? Check the button itself.',
                'HTML elements can carry hidden data using attributes. Inspect the Send button closely.',
                'Look for data-amount on the button. What happens if you change that value before clicking?'],
            2: ['The currency dropdown has 3 fixed options. Dropdowns are HTML select elements you can edit.',
                'Right-click the select element and choose Edit as HTML. You can add your own option tags.',
                'Inject an option with value=0. A zero exchange rate means zero conversion fees.'],
            3: ['The recipient list only shows 3 accounts. But you are not limited to what the page shows you.',
                'Select elements are just HTML. Right-click and edit the dropdown to add a new recipient.',
                'Add an option with value=hacker@evil.com. The system trusts whatever value the select sends.'],
            4: ['Your daily limit is $5,000 and you have used $4,750. The reset uses the browser clock.',
                'Check the Console. Is there a global variable controlling the current date shown?',
                'Change window.clientDate to a future date. The system will think the daily limit has reset.'],
            5: ['This transfer needs 3 signatures. The approval status is checked from browser storage.',
                'Open the Application tab in DevTools. Look under Local Storage for signature flags.',
                'Set sig_cfo, sig_cto, and sig_ceo all to true. The system only checks localStorage values.']
        },
        2: {
            1: ['Your streaming tier limits what you can watch. That tier is saved somewhere by your browser.',
                'Open the Application tab in DevTools (F12). Look under Storage → Cookies.',
                'Your tier is a key=value pair. What if the value changed from free to something better?'],
            2: ['Something is covering the video player. But everything on a webpage is just HTML.',
                'Inspect the overlay blocking the content. It is just a div element you can interact with.',
                'Right-click the paywall overlay and choose Delete Element. What is underneath?'],
            3: ['The Google login button sends you somewhere. That destination is configurable.',
                'Buttons and links often store their target URLs in data attributes.',
                'Inspect the SSO button and look for data-redirect. Where could you redirect it instead?'],
            4: ['Your free trial has a countdown. That timer is controlled by something you can access.',
                'JavaScript variables in the global scope can be read and written from the Console.',
                'Type window in the Console and explore. Look for a variable related to time remaining.'],
            5: ['Authorization checks compare your permissions against a baseline. What if you changed the baseline?',
                'In JavaScript, all objects inherit from Object.prototype. Changing it affects everything.',
                'Open the Console. What happens if you add a property to Object.prototype?']
        },
        3: {
            1: ['Your cart total seems fixed. But quantities are just numbers sent by your browser.',
                'Inspect the quantity input field. Look for restrictions on what numbers are allowed.',
                'What if you removed the minimum limit? Could a negative quantity reverse the charge?'],
            2: ['Shipping costs are selected from a dropdown. Dropdowns are just HTML select elements.',
                'Right-click the shipping dropdown and choose Edit as HTML. You can add new options.',
                'Add an option with value=0 and the label Free. Select it before checkout.'],
            3: ['Sales tax is calculated from a number stored on the page. Find where that number lives.',
                'Hidden inputs carry data the user cannot see but the form still submits.',
                'Search for tax-rate in the DOM. What happens if you change its value?'],
            4: ['The coupon field refuses to let you type. That restriction is just an HTML attribute.',
                'readonly is an attribute that prevents editing. Attributes can be removed.',
                'Inspect the coupon input and delete the readonly attribute. Then try typing a discount code.'],
            5: ['The checkout form sends all its fields to the server. What if you added your own field?',
                'Forms collect all input elements inside them — even ones you create yourself.',
                'Edit the form HTML and add a hidden input named discount_value. Set it to a high number.']
        },
        4: {
            1: ['The system knows who you are from a piece of stored data. Where does the browser keep user identity?',
                'Open the Application tab in DevTools. Check what is stored under Cookies.',
                'Your user ID is a number. What number would an administrator typically have?'],
            2: ['The network gateway checks where requests come from. That check happens in JavaScript.',
                'Global variables are accessible from anywhere. Type window. in the Console to explore.',
                'Look for a variable related to IP address or gateway. Can you make the system think you are local?'],
            3: ['The Save button sends data to a specific URL. That URL is stored right on the button itself.',
                'HTML elements can carry custom data using data-* attributes. Inspect the button.',
                'Find data-endpoint on the submit button. Change the path to an admin-only endpoint.'],
            4: ['The server checks where requests originate from. That check uses a JavaScript variable.',
                'CORS (Cross-Origin Resource Sharing) validation sometimes happens client-side.',
                'Search for origin in the global scope. Can you impersonate the internal domain?'],
            5: ['Single Sign-On status determines if you are logged in. That status is saved locally.',
                'localStorage persists data across browser sessions. Check what is stored there.',
                'Look for keys related to auth or session. Can you set yourself as authorized?']
        },
        5: {
            1: ['Your booking duration is calculated from two dates. What if the dates were backwards?',
                'Inspect the check-in and check-out date inputs. Try swapping which date is earlier.',
                'Set the departure date BEFORE the arrival date. How does the system handle negative stays?'],
            2: ['The weight limit blocks heavy luggage. But weight is checked as a number — what is not a number?',
                'Input fields have types. A type=number field can be changed to accept different values.',
                'Change the input type from number to text. Then type something that is not a number at all.'],
            3: ['First class seats are locked for economy users. The seat tier is stored in the element itself.',
                'Inspect a premium seat button. Look for disabled and data attributes controlling access.',
                'Remove disabled and change the tier data attribute. Can you book a premium seat at economy price?'],
            4: ['The company logo links to the homepage. Links can point anywhere you want.',
                'Anchor tags have an href attribute determining their destination. Inspect the logo.',
                'Change the logo href to an external URL. This is called an open redirect vulnerability.'],
            5: ['Flight booking runs verification checks. Those checks are controlled by a configuration object.',
                'Configuration objects in global scope can be modified by anyone with a Console.',
                'Look for a config object related to flights. Is there a flag that bypasses verification?']
        }
        // Worlds 6-10 use generic progressive hints
    };

    function getHint(world, level) {
        const worldHints = HINTS[world];
        if (!worldHints || !worldHints[level]) {
            return [
                'Start by opening DevTools (F12). Look at the Elements tab — what do you see that seems unusual?',
                'Check the Console tab for any global variables you can inspect. Type window. and explore.',
                'Look at the Application tab — are there cookies, localStorage items, or session data you can modify?',
                'Try right-clicking elements and choosing Inspect. Every visible (and hidden) element is in the DOM.',
                'Think about what the challenge is asking you to do. Is there a value, attribute, or style you could change?'
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
            const hints = getHint(world, level);
            const idx = (getCurrentHintIndex(world, level) + 1) % hints.length;
            localStorage.setItem(`bytelab_hint_${world}_${level}`, String(idx));
            const hint = hints[idx];
            const hintEl = popup.querySelector('#popup-hint-text');
            hintEl.style.display = 'block';
            hintEl.innerHTML = `<strong>Hint ${idx + 1}/${hints.length}:</strong> ${hint}`;
            // Update button text
            popup.querySelector('#btn-hint').innerHTML = `<span>💡</span> Next Hint (${(idx + 1) % hints.length + 1}/${hints.length})`;
        };

        popup.querySelector('#btn-skip').onclick = () => {
            if (!confirm('Skip this level? It will be marked as solved and you will advance to the next challenge.')) return;
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

    // ── VICTORY / LOSE OVERLAYS ──────────────────

    function showVictory(data) {
        const d = data || {};
        const title = d.title || 'CHALLENGE COMPLETE';
        const subtitle = d.subtitle || 'You found the vulnerability!';
        const xp = d.xp || 10;
        const what = d.what || 'You identified and exploited a client-side security flaw.';
        const lesson = d.lesson || 'Never trust client-side validation. Always enforce security server-side.';
        const onNext = d.onNext || (() => {});
        const onStay = d.onStay || (() => removeOverlay('victory'));

        removeOverlay('victory');

        const overlay = document.createElement('div');
        overlay.id = 'bl-victory-overlay';
        overlay.className = 'bl-overlay';
        overlay.innerHTML = `
            <div class="bl-overlay-bg"></div>
            <div class="bl-confetti" id="bl-confetti"></div>
            <div class="bl-victory-card">
                <div class="bl-victory-trophy">
                    <svg viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="60" r="55" fill="rgba(255,215,0,0.08)" stroke="#FFD700" stroke-width="2"/>
                        <path d="M60 20L70 45L98 48L77 67L83 93L60 79L37 93L43 67L22 48L50 45L60 20Z" fill="#FFD700" stroke="#FFA500" stroke-width="1.5"/>
                        <path d="M60 32L66 46L82 49L70 58L73 73L60 65L47 73L50 58L38 49L54 46L60 32Z" fill="#FFF3CD"/>
                        <rect x="50" y="92" width="20" height="8" rx="2" fill="#FFD700"/>
                        <rect x="42" y="100" width="36" height="5" rx="2" fill="#FFD700"/>
                    </svg>
                </div>
                <h2 class="bl-victory-title">${title}</h2>
                <p class="bl-victory-sub">${subtitle}</p>
                <div class="bl-xp-badge">+${xp} XP</div>
                <div class="bl-victory-btns">
                    <button class="bl-btn-primary" id="bl-btn-next">Next Level →</button>
                    <button class="bl-btn-ghost" id="bl-btn-stay">Review</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Wire buttons
        overlay.querySelector('#bl-btn-next').onclick = onNext;
        overlay.querySelector('#bl-btn-stay').onclick = onStay;

        // Confetti burst
        spawnConfetti();

        // Animate in
        requestAnimationFrame(() => overlay.classList.add('active'));

        // Play victory sound
        Audio.chime();
    }

    function showLose(data) {
        const d = data || {};
        const title = d.title || 'NOT QUITE';
        const subtitle = d.subtitle || 'The vulnerability is still hidden. Byte believes in you.';
        const onRetry = d.onRetry || (() => { removeOverlay('lose'); location.reload(); });
        const onQuit = d.onQuit || (() => { window.location.href = '../../../game.html'; });

        removeOverlay('lose');

        const overlay = document.createElement('div');
        overlay.id = 'bl-lose-overlay';
        overlay.className = 'bl-overlay';
        overlay.innerHTML = `
            <div class="bl-overlay-bg"></div>
            <div class="bl-lose-card">
                <div class="bl-lose-byte">
                    <img src="${getMascotImage()}" alt="Byte" style="width:80px;height:80px;border-radius:50%;object-fit:contain;animation:blShake 0.8s ease">
                </div>
                <h2 class="bl-lose-title">${title}</h2>
                <p class="bl-lose-sub">${subtitle}</p>
                <div class="bl-victory-btns">
                    <button class="bl-btn-retry" id="bl-btn-retry">Try Again</button>
                    <button class="bl-btn-ghost" id="bl-btn-quit">Back to Hub</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#bl-btn-retry').onclick = onRetry;
        overlay.querySelector('#bl-btn-quit').onclick = onQuit;

        requestAnimationFrame(() => overlay.classList.add('active'));
        Audio.error();
    }

    function removeOverlay(type) {
        const el = document.getElementById('bl-' + type + '-overlay');
        if (el) {
            el.classList.remove('active');
            setTimeout(() => el.remove(), 300);
        }
    }

    function spawnConfetti() {
        const box = document.getElementById('bl-confetti');
        if (!box) return;
        const colors = ['#FFD700','#FFA500','#FFC107','#FFB300','#FF8F00','#FFD54F','#FFE082','#6366f1','#10b981'];
        for (let i = 0; i < 90; i++) {
            const p = document.createElement('div');
            p.className = 'bl-confetti-piece';
            p.style.left = Math.random() * 100 + '%';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.width = (4 + Math.random() * 8) + 'px';
            p.style.height = (4 + Math.random() * 8) + 'px';
            p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            p.style.animationDuration = (2 + Math.random() * 3) + 's';
            p.style.animationDelay = Math.random() * 1.2 + 's';
            box.appendChild(p);
        }
    }

    // ── OVERLAY STYLES (injected once) ────────────
    function injectOverlayStyles() {
        if (document.getElementById('bl-overlay-styles')) return;
        const s = document.createElement('style');
        s.id = 'bl-overlay-styles';
        s.textContent = `
            .bl-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .4s}
            .bl-overlay.active{opacity:1;pointer-events:auto}
            .bl-overlay-bg{position:absolute;inset:0;background:rgba(5,5,15,.88);backdrop-filter:blur(12px)}
            .bl-confetti{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}
            .bl-confetti-piece{position:absolute;top:-20px;animation:blConfettiFall linear forwards}
            @keyframes blConfettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
            .bl-victory-card,.bl-lose-card{position:relative;z-index:2;background:#0f0f23;border-radius:28px;padding:36px 32px;max-width:440px;width:90%;text-align:center;border:1px solid rgba(255,215,0,.12);box-shadow:0 0 80px rgba(255,215,0,.06),inset 0 0 60px rgba(255,215,0,.015);transform:scale(.85);transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
            .bl-overlay.active .bl-victory-card,.bl-overlay.active .bl-lose-card{transform:scale(1)}
            .bl-lose-card{border-color:rgba(239,68,68,.15);box-shadow:0 0 60px rgba(239,68,68,.04)}
            .bl-victory-trophy{width:90px;height:90px;margin:0 auto 14px;animation:blTrophyBounce .7s cubic-bezier(.34,1.56,.64,1)}
            .bl-victory-trophy svg{width:100%;height:100%;filter:drop-shadow(0 0 24px rgba(255,215,0,.3))}
            @keyframes blTrophyBounce{0%{transform:scale(0) rotate(-15deg)}60%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0)}}
            .bl-victory-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:2rem;font-weight:900;background:linear-gradient(135deg,#FFD700,#FFA500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:2px;letter-spacing:-1px}
            .bl-victory-sub{color:#94a3b8;font-size:.85rem;margin-bottom:12px}
            .bl-xp-badge{display:inline-block;background:rgba(255,215,0,.1);color:#FFD700;padding:5px 20px;border-radius:99px;font-weight:800;font-size:.95rem;margin-bottom:16px;border:1px solid rgba(255,215,0,.15)}
            .bl-victory-btns{display:flex;gap:8px;margin-top:8px}
            .bl-btn-primary,.bl-btn-retry,.bl-btn-ghost{flex:1;padding:13px 20px;border-radius:14px;font-weight:800;font-size:.85rem;border:none;cursor:pointer;transition:all .2s}
            .bl-btn-primary{background:linear-gradient(135deg,#FFD700,#FFA500);color:#0f0f23;box-shadow:0 4px 18px rgba(255,215,0,.15)}
            .bl-btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(255,215,0,.25)}
            .bl-btn-retry{background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.2)}
            .bl-btn-retry:hover{background:rgba(239,68,68,.2);transform:translateY(-2px)}
            .bl-btn-ghost{background:rgba(255,255,255,.04);color:#94a3b8;border:1px solid rgba(255,255,255,.06)}
            .bl-btn-ghost:hover{background:rgba(255,255,255,.08);color:#fff}
            .bl-lose-byte{margin-bottom:14px}
            .bl-lose-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.8rem;font-weight:900;color:#ef4444;margin-bottom:4px}
            .bl-lose-sub{color:#94a3b8;font-size:.85rem;margin-bottom:18px;line-height:1.5}
        `;
        document.head.appendChild(s);
    }

    // Inject styles immediately
    injectOverlayStyles();

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
        createAssistantPopup, initByteAssistant,
        // Victory / Lose
        showVictory, showLose, removeOverlay
    };

})();
