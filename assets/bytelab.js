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

    // ── TOAST ─────────────────────────────────────
    function showToast(msg, duration) {
        const el = document.createElement('div');
        el.className = 'bytelab-toast';
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, duration || 3000);
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
        isFileProtocol, REAL_COOKIES_WORK
    };

})();
