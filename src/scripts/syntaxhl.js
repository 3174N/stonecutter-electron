const hljs = require('highlight.js/lib/core');
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
hljs.registerLanguage(
    'markdown',
    require('highlight.js/lib/languages/markdown')
);

/**
 * Takes file-content and reformats it with hl.js annotations
 *
 * @param {String} [language] - The language to format for
 * @return {void}
 */
function highlight(language) {
    let content = $('.file-content').text();
    // console.log('Unformatted: ' + content);
    highlightedCode = hljs.highlight(content, { language: language }).value;
    // console.log('Formatted: ' + highlightedCode);
    $('.file-content').html(highlightedCode);
}
