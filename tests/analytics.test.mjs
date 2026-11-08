import test from 'node:test';import assert from 'node:assert/strict';import {parseCSV,pca,kmeans,answer,sampleData} from '../web/analytics.mjs';
test('CSV quoted delimiters, decimal comma, blank and malformed input',()=>{
 const d=parseCSV('nom;x;y\r\n"a;b";1,5;2\r\nb;2,5;4');assert.equal(d.rows[0][0],'a;b');assert.equal(d.numeric.length,2);
 assert.throws(()=>parseCSV(''));assert.throws(()=>parseCSV('a,a\n1,2\n3,4'));
 assert.throws(()=>parseCSV('a,b\n1,2,3\n3,4'));assert.throws(()=>parseCSV('a,b\n"1,2\n3,4'));
});
test('PCA recovers rank one and orthonormal components',()=>{
 const r=pca([[1,2],[2,4],[3,6],[4,8]]);
 assert.ok(Math.abs(r.ratios[0]-1)<1e-10);
 const [a,b]=r.components;assert.ok(Math.abs(a.reduce((s,x,j)=>s+x*b[j],0))<1e-10);
 assert.ok(Math.abs(r.scores.reduce((s,row)=>s+row[0],0))<1e-10);
});
test('PCA known unscaled covariance eigenvalues and reconstruction',()=>{
 const X=[[1,0],[-1,0],[0,2],[0,-2]],r=pca(X,false);
 assert.ok(Math.abs(r.eigenvalues[0]-8/3)<1e-10);assert.ok(Math.abs(r.eigenvalues[1]-2/3)<1e-10);
 r.scores.forEach((scores,i)=>X[i].forEach((x,j)=>assert.ok(Math.abs(scores.reduce((s,z,k)=>s+z*r.components[k][j],0)-x)<1e-10)));
 assert.throws(()=>pca([[1,2],[1,3]]));
});
test('KMeans separates known groups and reports exact objective',()=>{
 const X=[[0,0],[0,1],[10,10],[10,11]],r=kmeans(X,2,false);
 assert.equal(r.labels[0],r.labels[1]);assert.notEqual(r.labels[0],r.labels[2]);assert.ok(Math.abs(r.inertia-1)<1e-10);
 assert.equal(r.converged,true);assert.throws(()=>kmeans([[1,1],[2,2]],3));
});
test('Sample and local assistant have verifiable totals and refuse unsupported questions',()=>{
 const d=sampleData();assert.equal(answer('combien',d,1).value,72);
 assert.equal(answer('somme',d,1).value,d.rows.reduce((s,r)=>s+Number(r[1]),0));
 assert.throws(()=>answer('prédire demain',d,1));assert.equal(pca(d.rows.map(r=>r.slice(1).map(Number))).scores.length,72);
});
