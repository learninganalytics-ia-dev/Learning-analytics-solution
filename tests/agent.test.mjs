import test from 'node:test';import assert from 'node:assert/strict';
import {sampleData} from '../web/analytics.mjs';
import {runLocalAgent,exploration,runSummary,statistic,validateDataset,scopedAnalytics} from '../web/agent-core.mjs';
test('Local agent computes a named metric with tool evidence',()=>{
 const d=sampleData(),r=runLocalAgent('Quelle est la moyenne de valeur ?',d,[1,2,3,4]);
 assert.equal(r.result.column,'valeur');assert.equal(r.trace.length,2);
 assert.equal(r.result.value,d.rows.reduce((s,r)=>s+Number(r[2]),0)/72);
});
test('Unsupported filters and predictions are rejected rather than ignored',()=>{
 const d=sampleData();assert.throws(()=>runLocalAgent('Moyenne de valeur pour 2025',d,[1,2]));
 assert.throws(()=>runLocalAgent('Moyenne de valeur pour la catégorie A',d,[1,2]));
 assert.throws(()=>runLocalAgent('Prédire la valeur demain',d,[1,2]));
 assert.throws(()=>runLocalAgent('Quelle est la météo ?',d,[1,2]));
});
test('ACP and clustering use selected numeric tools',()=>{
 const d=sampleData();assert.equal(runLocalAgent('Lance une ACP',d,[1,2,3,4]).result.method,'ACP');
 const r=runLocalAgent('Crée 3 groupes',d,[1,2,3,4]);assert.equal(r.result.counts.reduce((a,b)=>a+b),72);
 assert.ok(!JSON.stringify(runSummary(r)).includes('"rows":['));
});
test('Small-group centers do not disclose singleton observations in saved/model summaries',()=>{
 const d={headers:['x','y'],rows:[['0','0'],['10','11'],['20','22']]};
 const r=exploration(d,[0,1],'cluster',3);assert.deepEqual(r.centers,[null,null,null]);
 const s=runSummary({method:'K-means',k:3,rawCenters:[[0,0],[10,11],[20,22]],labels:[0,1,2],source:'test'});
 assert.deepEqual(s.centers,[null,null,null]);assert.equal(s.labels,undefined);
});
test('Dataset validation rejects uneven rows, duplicates and invalid selected variables',()=>{
 assert.throws(()=>validateDataset({headers:['x','x'],rows:[['1','2'],['3','4']]}));
 assert.throws(()=>validateDataset({headers:['x','y'],rows:[['1'],['2','3']]}));
 assert.throws(()=>statistic(sampleData(),0,'mean'));
});

test('Model tools cannot inspect or calculate unselected columns',()=>{const operations=scopedAnalytics(sampleData(),[1,2]);assert.deepEqual(operations.describe().columns.map(c=>c.index),[1,2]);assert.throws(()=>operations.statistic(3,'mean'));assert.equal(operations.statistic(2,'mean').column,'valeur');});

test('The same agent supports energy and training fixtures with known reference totals',async()=>{const {readFile}=await import('node:fs/promises');const {parseCSV}=await import('../web/analytics.mjs');for(const [name,question,total]of [['energie','Somme de consommation_kwh',1860],['formation','Somme de sessions',90]]){const d=parseCSV(await readFile(new URL('../examples/domains/'+name+'.csv',import.meta.url),'utf8'));assert.equal(runLocalAgent(question,d,[1,2,3]).result.value,total);}});
