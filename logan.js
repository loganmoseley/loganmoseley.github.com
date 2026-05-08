window.markdeepOptions = {
    definitionStyle: 'short',
    tocStyle: 'none'
};

// ─── Mac OS 9 window builder ──────────────────────────────────────────────────

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
    return win;
}

function buildWindows() {
    const md = document.querySelector('.md');
    if (!md) return;

    // Collect direct children before the first section (header content)
    // and all h1-sections (one window each).
    const headerNodes = [];
    const sections = [];
    for (const child of Array.from(md.childNodes)) {
        if (child.nodeType === 1 && child.tagName === 'SECTION') {
            sections.push(child);
        } else if (sections.length === 0) {
            headerNodes.push(child);
        }
    }

    // Header window
    const headerWin = createWindow('Welcome!');
    const headerBody = headerWin.querySelector('.macos9-window-body');
    headerNodes.forEach(n => headerBody.appendChild(n));

    // One window per section; pull the h1 text for the titlebar then remove it
    const sectionWins = sections.map(section => {
        const h1 = section.querySelector('h1');
        const title = h1 ? h1.textContent.trim() : '';
        if (h1) h1.remove();
        const win = createWindow(title);
        win.querySelector('.macos9-window-body').appendChild(section);
        return win;
    });

    // Replace md content with the windows
    while (md.firstChild) md.removeChild(md.firstChild);
    md.appendChild(headerWin);
    sectionWins.forEach(w => md.appendChild(w));
}

document.addEventListener('DOMContentLoaded', () => {
    // Watch for Markdeep to create .md, then build windows and reveal
    const obs = new MutationObserver((_, observer) => {
        if (document.querySelector('.md')) {
            observer.disconnect();
            buildWindows();
            document.body.style.visibility = 'visible';
        }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    // Inject Markdeep dynamically — body exists now, so it won't get null
    const s = document.createElement('script');
    s.src = 'markdeep.min.js';
    s.charset = 'utf-8';
    document.body.appendChild(s);
});

// ─── Favicon ─────────────────────────────────────────────────────────────────

{
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'images/favicon.png';
    document.head.appendChild(link);
}

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
    background-image: url(OS9_Default.png);
    background-repeat: repeat;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 20px 10px 60px;
    min-height: 100vh;

    // Markdeep sets 680px by default, which seems good to me.
    // I'm leaving this as a reminder to myself, just in case.
    // max-width: 680px;
}

/* Markdeep container becomes the windows column */
span.md {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

/* ── Window chrome ── */
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

.macos9-window-body section.h1-section {
    margin: 0;
    padding: 0;
}

/* ── Content within windows ── */
.macos9-window-body .title {
    font-size: 1.4em;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2px;
}

.macos9-window-body .subtitle {
    text-align: center;
    margin-bottom: 6px;
}

.macos9-window-body .afterTitles {
    display: none;
}

.md h1, .md h2 { display: none; }

.md p {
    text-align: left;
    display: flex;
    margin: 6px 0;
}

.md ul {
    margin-top: -4px;
    padding-left: 20px;
}

.md ul li.minus {
    margin-left: 0;
    padding-bottom: 4px;
}

em.asterisk {
    font-style: normal;
    font-weight: bold;
    margin-right: auto;
}

em.underscore {
    font-style: normal;
    color: #555;
    padding-left: 12px;
}

.md a { color: #202a87; }

.md table { page-break-inside: auto; }
.md table.table tr { vertical-align: top; }
.md table.table th { color: #000; background: none; border: none; padding-bottom: 2px; }
.md table.table tr:nth-child(even) { background: none; }
.md table.table td { background: none; border: none; padding-bottom: 0; padding-top: 2px; }

.markdeepFooter { display: none; }

`;
    document.head.appendChild(style);
}

{
    const style = document.createElement('style');
    style.classList.add('fallback');
    style.innerHTML = 'body{visibility:hidden}';
    document.head.appendChild(style);
}

