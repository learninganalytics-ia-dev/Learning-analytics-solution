import {mkdir,cp,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await cp('web','dist',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
for(const file of ['index.html','app.mjs','analytics.mjs','courses.mjs','styles.css']) await readFile('dist/'+file);
console.log('Build ready: dist/ — no external dependencies.');
