import { runTests } from './tests';
const results = runTests();
for (const result of results) console.log(`${result.pass ? 'PASS' : 'FAIL'} ${result.name}${result.error ? ` — ${result.error}` : ''}`);
console.log(`\n${results.filter(result => result.pass).length}/${results.length} checks passed.`);
if (results.some(result => !result.pass)) process.exitCode = 1;
