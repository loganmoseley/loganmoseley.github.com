document.addEventListener('macos9:ready', () => {
    const body = document.querySelector('.macos9-window-body');
    if (!body) return;

    body.innerHTML = '';
    body.appendChild(window.macos9.createFinderGrid([
        { label: 'Resume.docx',  href: 'Logan%20Moseley%20Resume.docx',  fold: '#6699ff' },
        { label: 'Resume.pages', href: 'Logan%20Moseley%20Resume.pages', fold: '#ff9933' },
        { label: 'Resume.pdf',   href: 'Logan%20Moseley%20Resume.pdf',   fold: '#ff6666' },
        { label: 'Resume.rtf',   href: 'Logan%20Moseley%20Resume.rtf',   fold: '#aaaaaa' },
    ]));
});
