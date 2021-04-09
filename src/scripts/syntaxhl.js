hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));

/**
 * Takes file-content and reformats it with hl.js annotations
 * NOTE: currently does not actually change anything visually
 *
 * @param {string} language - The language to format for (TODO: more than json)
 * @return {void}
 */
function highlight(language) {
    let content = document.getElementById('file-content').textContent;
    console.log('Unformatted: ' + content);
    highlightedCode = hljs.highlight(content, { language: language }).value;
    console.log('Formatted: ' + highlightedCode);
    document.getElementById('file-content').innerHTML = highlightedCode;
}
