window.markdeepOptions = {
    definitionStyle: 'short',
    tocStyle: 'none'
};

{
    const style = document.createElement("style");
    style.innerHTML = `
body { max-width: 680px; margin: auto; padding: 20px; line-height: 140%; -webkit-font-smoothing: antialiased; }

dt { width: 110px; font-family: arial }
dd { padding-bottom: 1px; }
em.asterisk { font-style: normal; font-weight: bold; margin-right:auto; }
em.underscore { font-style: normal; font-weight: bold; }

.md title { font-family: palatino; padding-bottom: 50px; }
.md h1:before, .md h2:before { content: none }
.md p { text-align: left; display: flex; }
.md ul { margin-top: -25px; }
.md ul li.minus { margin-left: -20px; padding-bottom: 5px; }
.md ul li.plus { list-style-type: none; margin-left: -40px; padding-bottom: 10px }
.md table.table { margin-left: -15px; padding-bottom: 20px }
.md table.table tr { vertical-align: top }
.md table.table th { color: #000; background: none; border: none; padding-bottom: 2px }
.md table.table tr:nth-child(even) { background: none }
.md table.table td { background: none; border: none; padding-bottom: 0px; padding-top: 2px }
.md table { page-break-inside: auto }

@media (prefers-color-scheme: dark) {
    body { background-color: #1a1a1a; color: #ddd; }
    .md a { color: #80bfff; }
    em.asterisk, em.underscore { color: inherit; }
}
`;
    document.head.appendChild(style);
}

{
    const style = document.createElement("style");
    style.classList.add("fallback");
    style.innerHTML = 'body{visibility:hidden}';
    document.head.appendChild(style);
}

document.write(`
<!-- Markdeep: --><script src="markdeep.min.js" charset="utf-8"><\/script><script src="https://morgan3d.github.io/markdeep/latest/markdeep.min.js" charset="utf-8"><\/script><script>window.alreadyProcessedMarkdeep||(document.body.style.visibility="visible")<\/script>
`);
