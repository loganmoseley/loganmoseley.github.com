// Include this script into a .md.html file at the top,
// **INSTEAD OF** the markdeep line at the bottom.
//
// <meta charset="utf-8"><script src="starship.js"></script>

window.markdeepOptions = {
    tocStyle: 'long',
    definitionStyle: 'long',
    h1TitleInput: true,
    showLinkPreviews: true};

// Set a favicon to icon.png
{
    const link = document.createElement("link");
    link.rel = "icon"
    link.type = "image/png"
    link.href = "icon.png";
    document.head.appendChild(link);
}


{
    const style = document.createElement("style");
    style.innerHTML = `
@import url("https://fonts.googleapis.com/css2?family=Antonio:wght@400;700&display=swap");

:root {
    --toc-width: 15em;
    
    --section-border-color: #5a5a5a;

    /***************************************************/
    /* Do not change, the layout is hardcoded to these */
    --section-border-top-size: 48px;
    --section-border-right-size: 96px;
    --lcars-antialias-distance: 1px;
    --page-top-padding: 8px;
    --h1-sticky-height: 92px;
    --h2-stick-gap: 32px;
    /***************************************************/

    --lcars-orange: #ff9900;
    --lcars-peach: #ffcc99;
    --lcars-tan: #cc9966;
    --lcars-purple: #cc99cc;
    --lcars-blue: #9999ff;
    --lcars-red: #cc6666;
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  vertical-align: middle;
}

body {
    font-weight: 400;
    font-size: 16px;
    font-family: Helvetica, sans-serif;
    text-align: left;
    line-height: 170%;
    margin: 0px;
    padding: var(--page-top-padding) 16px 8px 8px;
    max-width: unset;
    margin-right: calc(var(--toc-width) + var(--section-border-right-size) - 8px);
    scrollbar-gutter: stable;
    color: #ddd;
    background: #000;
}

body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: calc(var(--page-top-padding) * 2);
    background: #000;
    z-index: 9999;
    pointer-events: none;
    display: block;
    line-height: 0;
}

/* reset heading/link fonts to that of body */
.md a,
.md div.title, contents, .md .tocHeader,
.md h1, .md h2, .md h3, .md h4, .md h5, .md h6,
.md .nonumberh1, .md .nonumberh2, .md .nonumberh3, .md .nonumberh4, .md .nonumberh5, .md .nonumberh6,
.md .shortTOC, .md .mediumTOC, .md .longTOC {
    font-family: inherit;
}

.md .tocHeader, .md tocTop {
    display:none;
    height: 0;
}

.md .longTOC { 
    margin: 0px;
    margin-top: -32px ! important;
    top: -6px;
    padding: 0px;
    padding-right: 8px;
    padding-left: 8px;
    font-family: 'Roboto', Arial, Helvetica, "sans serif";
    font-weight: 300;
    scrollbar-gutter: stable;

    display: block;
    white-space: nowrap;    
    width: calc(var(--toc-width) - 15px);
    overflow-y: auto;
    font-family: inherit;
    position: fixed;
    right: 0px;
    bottom: 0px;
    padding-right: 10px;
    scrollbar-gutter: stable;

}

.md .longTOC a.level1 {
    background: var(--lcars-orange) !important;
    height: 32px;
    border-radius: 16px;
    text-align: left;
    margin: 0;
    color: #000 !important;
    margin-bottom: -26px;
    margin-top: 12px;
    padding-top: 16px !important;
    padding-bottom: 8px !important;
    padding-left: 16px !important;
    line-height: 8px !important;
    display: block;
    box-sizing: border-box;
}
.md .longTOC a.level1 code {
    color: #000 !important;
    font-size: inherit;
    line-height: inherit;
}

.md .longTOC a.level1 .tocNumber { display: none } 
A
/* Rotating LCARS colors for TOC level1 to match h1 colors */
/* Using adjacent sibling combinator to count only level1 elements */
.md .longTOC a.level1 { background: var(--lcars-orange) !important; }
.md .longTOC a.level1 ~ a.level1 { background: var(--lcars-peach) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-tan) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-purple) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-blue) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-red) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-orange) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-peach) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-tan) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-purple) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-blue) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-red) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-orange) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-peach) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-tan) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-purple) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-blue) !important; }
.md .longTOC a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 ~ a.level1 { background: var(--lcars-red) !important; }

.md div.title, .md div.subtitle, .md h1, .md h2, .md h3, .md h4, .md h5, .md h6, .md .longTOC .level1, .md .longTOC .level1 code {
    font-family: Antonio, Arial, Helvetica, "sans serif" !important;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing:-0.05em;
}

.md div.title {
    font-size: 55px;
    text-align: center;
    margin-bottom: 0px;
    width: calc(100% + var(--section-border-right-size));
    padding: 0px;
    margin-top: -8px;
    color: var(--lcars-orange);
}

.md div.afterTitles {
    border: none
}

.md div.subtitle {
    text-align: left;
    font-size: 115%;
}

.md div.afterTitles {
    margin-top: 20px;
    margin-left: -20px;
    margin-right: -20px;
    height: 0px;
    border-bottom: 1px solid #000;
}

.md .tocNumber { display: none; }
.md h2::before { display: none; }
.md h3::before { display: none; }

.md h1 {
    font-size: 55px !important;
    margin-bottom: 0px;
    margin-left:-16px;
    margin-right:32px;
    margin-top: calc(-1 * (var(--section-border-top-size) + 8px + calc(var(--section-border-top-size) * 0.5)));
    padding-left:48px;
    padding-top:0px;
    line-height: 100%;
    white-space: nowrap;
    overflow: hidden;
    max-width: calc(100% - var(--section-border-right-size) + 16px);
    width: fit-content;
    padding-right: 10px;
    border: none;
    position: sticky;
    top: var(--page-top-padding);
    display: block;
    min-height: calc(var(--section-border-top-size) + 5px + calc(var(--section-border-top-size) * 0.5));
    z-index: 2;
}


.md h1::after {
    content: '';
    position: absolute;
    top: 7px;
    left: 40px;
    right: -16px;
    height: calc(var(--section-border-top-size) + 2px);
    background: #000;
    z-index: -1;
    pointer-events: none;
    overflow: visible;
    display: block;
}

.md h1::before {
    content: '';
    display: none;
}

.md section.h1-section {
    margin-bottom: 48px;
    position: relative;
    padding-left: 16px;
}

.md section.h1-section::before {
    content: '';
    position: sticky;
    display: block;
    top: 8px;
    left: 0px;
    margin-left: -16px;
    margin-top: 8px;
    width: calc(100% + var(--section-border-right-size) + 32.5px);
    height: calc(var(--section-border-top-size) + 8px + calc(var(--section-border-top-size) * 0.5));
    z-index: 1;
    pointer-events: none;

    background: 
        /* Inner concave corner - reversed elliptical gradient (transparent center, opaque at radius) - half size */
        radial-gradient(
            calc(var(--section-border-top-size) * 0.75 - var(--lcars-antialias-distance) * 0.5) calc(var(--section-border-top-size) * 0.5 - var(--lcars-antialias-distance) * 0.5) at 0% 100%,
            transparent calc(100% - calc(var(--lcars-antialias-distance) * 0.5)),
            var(--section-border-color) calc(100% + calc(var(--lcars-antialias-distance) * 0.5))) calc(100% - var(--section-border-right-size)) calc(7.5px + var(--section-border-top-size)) / calc(var(--section-border-top-size) * 0.75) calc(var(--section-border-top-size) * 0.5) no-repeat,
        /* Top border - stops before corner */
        linear-gradient(to right, var(--section-border-color), var(--section-border-color)) calc(var(--section-border-top-size) / 2) 8px / calc(100% - var(--section-border-top-size) * 2) var(--section-border-top-size) no-repeat,
        /* Top-left rounded end (half-circle) */
        radial-gradient(circle at calc(var(--section-border-top-size) * 0.5) calc(var(--section-border-top-size) * 0.5 + 8px), var(--section-border-color) calc(var(--section-border-top-size) * 0.5 - calc(var(--lcars-antialias-distance) / 2)), #000 calc(var(--section-border-top-size) * 0.5 + calc(var(--lcars-antialias-distance) / 2))) 0 0 / var(--section-border-top-size) calc(var(--section-border-top-size) + 8px) no-repeat,
        /* Outer convex corner - quarter ellipse fills the gap (wider than tall) - with black fill above */
        radial-gradient(calc(var(--section-border-top-size) * 1.5 - var(--lcars-antialias-distance) * 0.5) var(--section-border-top-size) at 0 100%, var(--section-border-color) calc(100% - calc(var(--lcars-antialias-distance) * 0.5)), #000 calc(100% + calc(var(--lcars-antialias-distance) / 2))) 100% 8px / calc(var(--section-border-top-size) * 1.5) var(--section-border-top-size) no-repeat;
}

.md section.h1-section::after {
    content: '';
    position: absolute;
    top: calc(var(--section-border-top-size) - 17px + calc(var(--section-border-top-size) * 0.5));
    right: calc(-16px - var(--section-border-right-size));
    width: var(--section-border-right-size);
    bottom: 0;
    z-index: 0;
    background: var(--section-border-color);
    pointer-events: none;
}

/* Rotating LCARS colors for sections (h1 inherits) */
.md section.h1-section:nth-of-type(6n+1) { --section-border-color: var(--lcars-orange); }
.md section.h1-section:nth-of-type(6n+2) { --section-border-color: var(--lcars-peach); }
.md section.h1-section:nth-of-type(6n+3) { --section-border-color: var(--lcars-tan); }
.md section.h1-section:nth-of-type(6n+4) { --section-border-color: var(--lcars-purple); }
.md section.h1-section:nth-of-type(6n+5) { --section-border-color: var(--lcars-blue); }
.md section.h1-section:nth-of-type(6n+6) { --section-border-color: var(--lcars-red); }

.md h1 { color: var(--section-border-color) !important; }
.md h2, .md h3, .md h4, .md h5, .md h6 { color: var(--section-border-color) !important; }

.md h2 {
    font-size: 150%;
    border: none;
    position: sticky;
    padding: 0px;
    padding-top:8px;
    padding-bottom:8px;
    margin: 0px;
    top: calc(var(--page-top-padding) + var(--h1-sticky-height) - var(--h2-stick-gap) - 8px);
    min-height: 32px;
    background: #000;
}

.md h1 code, .md h2 code { font-family: inherit; line-height: inherit; color: inherit }

.md h3, .md h4, .md h5, .md h6 {
    font-size: 120%;
}

span.md > p {
    padding-left: 16px;
}

.md code {
    font-size: 90%;
    background: #eee;
    padding-left: 2px;
    padding-right: 2px;
}



.md pre.listing {
    font-size: 100%;
}

.md pre.listing code {
    font-weight: unset;
    background: none;
    color: unset;
}





.md div.longTOC {
    font-size: 15px;
}


.md svg.diagram {
    stroke: #ccc;
    fill: #ccc;
}

.md svg.diagram .opendot {
    fill: #000;
}

.md table.table {
    background-color: #2a2a2a;
}

.md table.table tr:nth-child(even) {
    background-color: #202020;
}

.md table.table td, .md table.table th {
    border: 1px solid #202020;
}

.md table.table th {
    background-color: var(--section-border-color);
    color: #000;
}

.md pre.listing {
    background: #202020;
    border: 1px solid #777;
    box-shadow: 0px 1px 2px rgba(0,0,0,0.5);
}

.md code {
    color: #fff;
    background: unset;
}


.hljs-comment,.hljs-quote{color:#a0f0aa}.hljs-variable,.hljs-template-variable,.hljs-tag,.hljs-name,.hljs-selector-id,.hljs-selector-class,.hljs-regexp,.hljs-deletion{color:#cc6666}.hljs-number,.hljs-built_in,.hljs-builtin-name,.hljs-literal,.hljs-type,.hljs-params,.hljs-meta,.hljs-link{color:#de935f}.hljs-attribute{color:#f0c674}.hljs-string,.hljs-symbol,.hljs-bullet,.hljs-addition{color:#b5bd68}.hljs-title,.hljs-section{color:#81a2be}.hljs-keyword,.hljs-selector-tag{color:#b294bb}.hljs{display:block;overflow-x:auto;background:#1d1f21;color:#c5c8c6;padding:.5em}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:bold}
.hljs-function .hljs-title { color:#81a2be}


.md .admonition {
    position: unset;
    box-shadow: 0px 1px 2px rgba(0,0,0,0.5);
    background: #202020;
    border: 1px solid rgba(68,138,255,1);
    border-left: 2.5rem solid rgba(68,138,255,1);
}

.md .admonition-title {
    border-bottom: 1px solid rgba(68,138,255,1);
}

.md .admonition.warn, .md .admonition.warning {
    border: 1px solid rgba(255,170,0,1);
    border-left: 2.5rem solid rgba(255,170,0,1);
    background: #202020;
}

.md .admonition.warn .admonition-title, .md .admonition.warning .admonition-title {
    border-bottom: 1px solid rgba(255,170,0,1);
}

.md .admonition.tip {
    border: 1px solid rgba(68,138,255,1);
    border-left: 2.5rem solid rgba(68,138,255,1);
    background: #202020;
}
.md .admonition.tip .admonition-title {
    border-bottom: 1px solid rgba(68,138,255,1);
}

.md .admonition.error {
    border: 1px solid rgba(255,23,68,1);
    border-left: 2.5rem solid rgba(255,23,68,1);
    background: #202020;
}

.md .admonition.error .admonition-title {
    border-bottom: 1px solid rgba(255,23,68,1);
}

.md .longTOC a, .md .longTOC code, .md a:link, .md a:visited, .md a:link code, .md a:visited code {
    color: #80bfff !important;
}

/* Hide TOC on small viewports (must be hard-coded constant) */
@media (max-width: 700px) {
    :root {
        --toc-width: 0;
        --section-border-right-size: 800px;
    }
    
    .md .longTOC {
        visibility: hidden;
        position: absolute;
        pointer-events: none;
    }

    .md div.title {
        width: 100%;
    }

    .md h1 {
        max-width: 100%;
    }

    .md section.h1-section::before {
        background:
            linear-gradient(to right, var(--section-border-color), var(--section-border-color)) calc(var(--section-border-top-size) / 2) 8px / calc(100% - var(--section-border-top-size) * 2 + 1px) var(--section-border-top-size) no-repeat,
            radial-gradient(circle at calc(var(--section-border-top-size) / 2) calc(var(--section-border-top-size) / 2 + 8px), var(--section-border-color) calc(var(--section-border-top-size) * 0.5 - calc(var(--lcars-antialias-distance) / 2)), #000 calc(var(--section-border-top-size) * 0.5 + calc(var(--lcars-antialias-distance) / 2))) 0 0 / var(--section-border-top-size) calc(var(--section-border-top-size) + 8px) no-repeat,
            radial-gradient(ellipse calc(var(--section-border-top-size) * 1.5) var(--section-border-top-size) at 0 100%, var(--section-border-color) calc(100% - calc(var(--lcars-antialias-distance) / 2)), #000 calc(100% + calc(var(--lcars-antialias-distance) / 2))) 100% 8px / calc(var(--section-border-top-size) * 1.5) var(--section-border-top-size) no-repeat;
    }

    body {
        margin-right: 0;
        overflow-x: hidden;
    }
}
`;
    document.head.appendChild(style);
}

{
    const style = document.createElement("style");
    style.classList.add("fallback");
    style.innerHTML = 'body{background:#000;color:#EEE;visibility:hidden}';
    document.head.appendChild(style);
}
    
document.write(`
<!-- Markdeep: --><script src="markdeep.min.js" charset="utf-8"></script><script src="https://morgan3d.github.io/markdeep/latest/markdeep.min.js" charset="utf-8"></script><script>window.alreadyProcessedMarkdeep||(document.body.style.visibility="visible")</script>
`);
