var {readFileSync, writeFileSync} = require('fs');

const fileName = './www/index.html';
let content = readFileSync(fileName).toString();
content = content.replace('</head>', '<script type="text/javascript" src="cordova.js"></script></head>');
writeFileSync(fileName, content);
