// ─── CV-specific configuration for macos9.js ─────────────────────────────────

window.macos9Config = {
    headerTitle: 'Welcome!',
};

// Favicon
{
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'images/favicon.png';
    document.head.appendChild(link);
}

// CV-specific styles
{
    const style = document.createElement('style');
    style.innerHTML = `

.macos9-window-body .title {
    font-size: 1.4em !important;
    font-weight: bold;
    font-family: Palatino, 'Palatino Linotype', Georgia, serif !important;
    text-align: left !important;
    margin-bottom: 2px;
    padding-top: 0 !important;
}

.macos9-window-body .subtitle {
    text-align: center;
    margin-bottom: 6px;
}

.macos9-window-body .afterTitles { display: none; }

.md h1, .md h2 { display: none; }

.md p {
    text-align: left;
    margin: 12px 0;
}

.md p:has(em.asterisk) {
    display: flex;
}

.md hr { border-color: #ccc; border-width: 0.5px; }

.md ul { margin-top: -4px; padding-left: 20px; }

.md ul li.minus { margin-left: 0; padding-bottom: 4px; }

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

`;
    document.head.appendChild(style);
}

// ─── CV-specific behaviors, wired up after macos9 builds the windows ──────────

document.addEventListener('macos9:ready', () => {
    const viewBtn = Array.from(document.querySelectorAll('#menubar-left button'))
        .find(b => b.textContent === 'View');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            const id = 'photo-window';
            const existing = document.getElementById(id);
            if (existing) { existing.style.display = ''; return; }

            const win = window.macos9.createWindow('Logan Moseley');
            win.id = id;
            win.classList.add('macos9-window-floating');
            Object.assign(win.style, {
                position:  'fixed',
                top:       '50%',
                left:      '50%',
                transform: 'translate(-50%, -50%)',
                width:     '260px',
                zIndex:    window.macos9.nextFloatingZIndex(),
            });

            win.querySelector('button').addEventListener('click', () => win.remove());

            const img = document.createElement('img');
            img.src = 'images/logan-dithered.jpg';
            img.style.width = '100%';
            win.querySelector('.macos9-window-body').appendChild(img);

            window.macos9.makeDraggable(win);
            document.body.appendChild(win);
        });
    }

    const resumeLink = document.querySelector('a[href="resume"]');
    if (!resumeLink) return;

    resumeLink.addEventListener('click', e => {
        e.preventDefault();
        window.macos9.openFinderWindow('resume-window', 'Resume', [
            { label: 'Resume.docx',  href: 'resume/Logan%20Moseley%20Resume.docx',  fold: '#6699ff' },
            { label: 'Resume.pages', href: 'resume/Logan%20Moseley%20Resume.pages', fold: '#ff9933' },
            { label: 'Resume.pdf',   href: 'resume/Logan%20Moseley%20Resume.pdf',   fold: '#ff6666' },
            { label: 'Resume.rtf',   href: 'resume/Logan%20Moseley%20Resume.rtf',   fold: '#aaaaaa' },
        ]);
    });
});
