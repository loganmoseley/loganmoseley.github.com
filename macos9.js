window.markdeepOptions = {
    definitionStyle: 'short',
    tocStyle: 'none'
};

// Resolve assets relative to macos9.js itself, not the HTML file loading it
const _base = new URL('.', document.currentScript.src).href;

// Inject viewport meta early so browsers use it over Markdeep's width=600 version
{
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(meta);
}

// Public API — page-specific scripts call these after macos9:ready
window.macos9 = {};

// ─── Window builder ───────────────────────────────────────────────────────────

function createWindow(title) {
    const win = document.createElement('div');
    win.className = 'macos9-window';
    win.innerHTML = `
        <div class="macos9-window-titlebar">
            <button><span class="button-dots"></span></button>
            <span class="filler"></span>
            <span class="title-text">${title}</span>
            <span class="filler"></span>
            <button class="zoom"><span class="button-dots"></span></button>
            <button class="collapse"><span class="button-dots"></span></button>
        </div>
        <div class="macos9-window-body"></div>
    `;
    win.querySelector('button.zoom').addEventListener('click', () => {
        win.classList.toggle('zoomed');
    });
    win.querySelector('button.collapse').addEventListener('click', () => {
        win.classList.toggle('collapsed');
    });
    return win;
}
window.macos9.createWindow = createWindow;

// ─── Floating window z-index management ──────────────────────────────────────

function nextFloatingZIndex() {
    let max = 9999;
    document.querySelectorAll('.macos9-window-floating').forEach(w => {
        const z = parseInt(w.style.zIndex) || 0;
        if (z > max) max = z;
    });
    return max + 1;
}
window.macos9.nextFloatingZIndex = nextFloatingZIndex;

function bringToFront(win) {
    win.style.zIndex = nextFloatingZIndex();
}
window.macos9.bringToFront = bringToFront;

// ─── Draggable floating windows ───────────────────────────────────────────────

function makeDraggable(win) {
    const titlebar = win.querySelector('.macos9-window-titlebar');

    win.addEventListener('mousedown', () => bringToFront(win));

    titlebar.addEventListener('mousedown', e => {
        if (e.target.closest('button')) return;
        e.preventDefault();

        if (win.style.transform) {
            const r = win.getBoundingClientRect();
            win.style.transform = '';
            win.style.left = r.left + 'px';
            win.style.top  = r.top  + 'px';
        }

        const ox = e.clientX - win.getBoundingClientRect().left;
        const oy = e.clientY - win.getBoundingClientRect().top;

        const onMove = e => {
            win.style.left = (e.clientX - ox) + 'px';
            win.style.top  = (e.clientY - oy) + 'px';
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup',   onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
    });
}
window.macos9.makeDraggable = makeDraggable;

// ─── Finder-style icon grid ───────────────────────────────────────────────────
//
// files: [{ label, href, fold }]  — fold is the dog-ear color

window.macos9.createFinderGrid = function(files) {
    const grid = document.createElement('div');
    grid.className = 'finder-icon-grid';
    for (const f of files) {
        const a = document.createElement('a');
        a.className = 'finder-icon';
        a.href = f.href;
        a.innerHTML = `
            <svg class="finder-doc-icon" width="40" height="48" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2 L26 2 L38 14 L38 46 L2 46 Z" fill="white" stroke="#333" stroke-width="1.5"/>
                <path d="M26 2 L26 14 L38 14" fill="${f.fold}" stroke="#333" stroke-width="1.5"/>
            </svg>
            <span class="finder-label">${f.label}</span>
        `;
        grid.appendChild(a);
    }
    return grid;
};

// ─── Finder-style icon window ─────────────────────────────────────────────────

window.macos9.openFinderWindow = function(id, title, files) {
    const existing = document.getElementById(id);
    if (existing) { existing.style.display = ''; return; }

    const win = createWindow(title);
    win.id = id;
    win.classList.add('macos9-window-floating');
    Object.assign(win.style, {
        position:  'fixed',
        top:       '50%',
        left:      '50%',
        transform: 'translate(-50%, -50%)',
        width:     '360px',
        zIndex:    nextFloatingZIndex(),
    });

    win.querySelector('button').addEventListener('click', () => win.remove());

    const body = win.querySelector('.macos9-window-body');
    body.appendChild(window.macos9.createFinderGrid(files));

    makeDraggable(win);
    document.body.appendChild(win);
};

// ─── Markdeep → windows ───────────────────────────────────────────────────────

function buildWindows() {
    const md = document.querySelector('.md');
    if (!md) return;

    const headerNodes = [];
    const sections = [];
    for (const child of Array.from(md.childNodes)) {
        if (child.nodeType === 1 && child.tagName === 'SECTION') {
            sections.push(child);
        } else if (sections.length === 0) {
            headerNodes.push(child);
        }
    }

    const footer = document.querySelector('.markdeepFooter');

    const headerTitle = (window.macos9Config && window.macos9Config.headerTitle) || '';
    const headerWin = createWindow(headerTitle);
    headerNodes.forEach(n => headerWin.querySelector('.macos9-window-body').appendChild(n));

    const sectionWins = sections.map(section => {
        const heading = section.querySelector('h1, h2');
        const title = heading ? heading.textContent.trim() : '';
        if (heading) heading.remove();
        const win = createWindow(title);
        win.querySelector('.macos9-window-body').appendChild(section);
        return win;
    });

    while (md.firstChild) md.removeChild(md.firstChild);
    md.appendChild(headerWin);
    sectionWins.forEach(w => md.appendChild(w));

    if (footer) {
        const container = document.createElement('div');
        container.id = 'markdeep-footer-container';
        container.appendChild(footer);
        md.appendChild(container);
    }
}

// ─── Menu bar ─────────────────────────────────────────────────────────────────

function buildMenuBar() {
    const bar = document.createElement('div');
    bar.id = 'menubar';
    bar.innerHTML = `
        <div id="menubar-left">
            <button id="menubar-apple">&#xF8FF;</button>
            <button>File</button>
            <button>Edit</button>
            <button>View</button>
        </div>
        <div id="menubar-right">
            <button id="menubar-clock"></button>
        </div>
    `;
    document.body.prepend(bar);

    function tick() {
        document.getElementById('menubar-clock').textContent =
            new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    tick();
    setInterval(tick, 1000);
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const obs = new MutationObserver((_, observer) => {
        if (document.querySelector('.md')) {
            observer.disconnect();
            buildWindows();
            buildMenuBar();
            document.body.style.visibility = 'visible';
            document.dispatchEvent(new CustomEvent('macos9:ready'));
        }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    const s = document.createElement('script');
    s.src = _base + 'markdeep.min.js';
    s.charset = 'utf-8';
    document.body.appendChild(s);
});

// ─── Styles ───────────────────────────────────────────────────────────────────

{
    const style = document.createElement('style');
    style.innerHTML = `

/* Force our font everywhere, overriding Markdeep's injected font rules */
body, body * {
    font-family: Lucida Grande, Lucida Sans, Lucida Sans Unicode, Geneva, Verdana, sans-serif !important;
}

/* Desktop */
body {
    font-family: Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    background-color: #ccccff;
    background-image: url(${_base}OS9_Default.png);
    background-repeat: repeat;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 20px 10px 60px;
    min-height: 100vh;
}

/* ── Menu bar ── */
#menubar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 20px;
    background-color: #cccccc;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #000000;
    box-shadow: inset 0 -1px 0 #999999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 9999;
    padding: 0 4px;
}

#menubar-left, #menubar-right {
    display: flex;
    align-items: center;
}

#menubar button {
    appearance: none;
    -webkit-appearance: none;
    background: none;
    border: none;
    padding: 1px 7px;
    font-weight: bold;
    font-size: 13px;
    line-height: 20px;
    cursor: default;
    border-radius: 3px;
    color: #000;
    -webkit-tap-highlight-color: transparent;
}

#menubar button:active {
    background-color: #333394;
    color: #ffffff;
}

#menubar-apple {
    font-size: 14px !important;
    margin-top: 2px;
    padding: 0 8px !important;
}

/* Markdeep container becomes the windows column */
span.md {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
}

/* ── Window chrome ── */
.macos9-window.collapsed .macos9-window-body { display: none; }
.macos9-window.zoomed {
    max-width: none;
    width: calc(100vw - 40px);
    margin-left: calc(50% - 50vw + 20px);
}

.macos9-window {
    overflow: hidden;
    position: relative;
    background-color: #cccccc;
    border: 1px solid #262626;
    box-shadow: 2px 2px 0 #262626;
}

.macos9-window::before {
    content: "";
    pointer-events: none;
    inset: 0;
    position: absolute;
    z-index: 1;
    box-shadow: inset 1px 1px #fff, inset -1px -1px 0 #999999;
}

/* ── Titlebar ── */
.macos9-window-titlebar {
    padding: 2px 4px;
    background-color: #cccccc;
    display: flex;
    gap: 4px;
    align-items: center;
    user-select: none;
}

.macos9-window-floating .macos9-window-titlebar {
    cursor: move;
}

.macos9-window-titlebar > span.filler {
    flex: 1;
    background-color: #dddddd;
    background-image: linear-gradient(#fff, #fff 50%, #777 50%, #777);
    background-repeat: repeat;
    background-size: 100% 2px;
    height: 12px;
    position: relative;
}

.macos9-window-titlebar > span.filler::before {
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 1px;
    background-image: linear-gradient(#fff, #fff 50%, #cccccc 50%, #cccccc);
    background-size: 100% 2px;
}

.macos9-window-titlebar > span.filler::after {
    content: "";
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 1px;
    background-image: linear-gradient(#cccccc, #cccccc 50%, #777 50%, #777);
    background-size: 100% 2px;
}

.macos9-window-titlebar > span.title-text {
    background-color: #cccccc;
    display: inline-block;
    font-size: 0.75rem;
    max-width: 80%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 2px;
}

/* ── Window control buttons ── */
.macos9-window-titlebar > button {
    appearance: none;
    -webkit-appearance: none;
    border: none;
    padding: 0;
    height: 13px;
    width: 13px;
    flex-shrink: 0;
    background: transparent;
    background-image: linear-gradient(135deg, #9a9a9a, #f1f1f1);
    background-size: 9px 9px;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow:
        inset  1px  1px 0 #808080,
        inset -1px -1px 0 #ffffff,
        inset  0    0   0 2px #262626,
        inset  3px  3px 0 #ffffff,
        inset -3px -3px 0 #808080;
    position: relative;
    cursor: default;
}

.macos9-window-titlebar > button .button-dots {
    position: absolute;
    inset: 0;
    display: block;
}

.macos9-window-titlebar > button .button-dots::before {
    content: "";
    position: absolute;
    top: 0; right: 0;
    width: 1px; height: 1px;
    background-color: #cccccc;
}

.macos9-window-titlebar > button .button-dots::after {
    content: "";
    position: absolute;
    bottom: 0; left: 0;
    width: 1px; height: 1px;
    background-color: #cccccc;
}

.macos9-window-titlebar > button.zoom::after {
    content: "";
    position: absolute;
    z-index: 2;
    top: 1px; left: 1px;
    width: 7px; height: 7px;
    box-shadow: inset 0 0 0 1px #262626;
}

.macos9-window-titlebar > button.collapse::after {
    content: "";
    position: absolute;
    z-index: 2;
    top: 5px; left: 1px; right: 1px;
    height: 3px;
    box-shadow: inset 0 0 0 1px #262626;
}

/* ── Window body ── */
.macos9-window-body {
    display: block;
    margin: 0 4px 4px;
    border: 1px solid #262626;
    box-shadow:
        -1px -1px 0 #999999,
        -1px  0   0 #999999,
         0   -1px 0 #999999,
         1px  1px 0 #ffffff,
         1px  0   0 #ffffff,
         0    1px 0 #ffffff;
    background-color: #ffffff;
    padding: 14px 18px;
}

.macos9-window-body section.h1-section,
.macos9-window-body section.h2-section {
    margin: 0;
    padding: 0;
}

/* ── Finder icon grid ── */
.finder-icon-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 12px 8px;
}

.finder-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 6px 4px;
    text-decoration: none;
    color: #000;
    border-radius: 2px;
}

.finder-icon:hover {
    background-color: #336699;
    color: #fff;
}

.finder-icon:hover .finder-doc-icon path[fill="white"] {
    fill: #eef;
}

.finder-label {
    font-size: 10px !important;
    text-align: center;
    line-height: 1.3;
    word-break: break-all;
}

/* ── Markdeep footer ── */
#markdeep-footer-container {
    display: flex;
    justify-content: flex-end;
}

.markdeepFooter {
    color: #ffffff;
    padding-right: 4px;
}

.markdeepFooter a {
    color: #ccccff !important;
}

`;
    document.head.appendChild(style);
}

{
    const style = document.createElement('style');
    style.classList.add('fallback');
    style.innerHTML = 'body{visibility:hidden}';
    document.head.appendChild(style);
}
