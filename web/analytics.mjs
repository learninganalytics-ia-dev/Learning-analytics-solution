// Deterministic educational analytics. No network calls.
export const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const dist=(a,b)=>a.reduce((s,x,j)=>s+(x-b[j])**2,0);
export function parseCSV(text){
 text=text.replace(/^\uFEFF/,'');
 if(!text.trim())throw Error('Le fichier est vide.');
 const first=text.split(/\r?\n/)[0], delimiter=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?';':',';
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(quoted||cell==='')quoted=!quoted;else throw Error('Guillemets CSV invalides.');}
  else if(c===delimiter&&!quoted){row.push(cell.trim());cell='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell.trim());if(row.some(v=>v!==''))rows.push(row);row=[];cell='';}
  else cell+=c;
 }
 if(quoted)throw Error('Guillemet non fermé.');
 row.push(cell.trim());if(row.some(v=>v!==''))rows.push(row);
 if(rows.length<3)throw Error('Au moins deux observations sont nécessaires.');
 const headers=rows.shift();
 if(headers.some(h=>!h)||new Set(headers).size!==headers.length)throw Error('Les colonnes doivent avoir des noms uniques et non vides.');
 if(rows.some(r=>r.length!==headers.length))throw Error('Le nombre de colonnes varie entre les lignes.');
 if(rows.length>1000)throw Error('Cette version accepte au maximum 1 000 observations.');
 const numeric=headers.map((h,j)=>({name:h,index:j})).filter(({index:j})=>rows.every(r=>r[j]!==''&&Number.isFinite(Number(r[j].replace(',','.')))));
 if(!numeric.length)throw Error('Aucune colonne entièrement numérique. Vérifiez les valeurs manquantes.');
 return {headers,rows,numeric,source:'CSV importé'};
}
export function matrix(dataset,indices){
 if(indices.length<2||indices.length>12)throw Error('Sélectionnez entre 2 et 12 variables numériques.');
 return dataset.rows.map(r=>indices.map(j=>Number(r[j].replace(',','.'))));
}
export function prepare(X,scale=true){
 if(X.length<2||!X[0]?.length||X.some(r=>r.length!==X[0].length||r.some(x=>!Number.isFinite(x))))throw Error('Matrice numérique invalide.');
 const p=X[0].length,n=X.length;
 const means=Array.from({length:p},(_,j)=>mean(X.map(r=>r[j])));
 const sds=means.map((m,j)=>Math.sqrt(X.reduce((s,r)=>s+(r[j]-m)**2,0)/(n-1)));
 if(sds.some(s=>s<1e-12))throw Error('Une variable est constante : retirez-la de la sélection.');
 const scales=sds.map(s=>scale?s:1);
 return {values:X.map(r=>r.map((x,j)=>(x-means[j])/scales[j])),means,scales};
}
export function pca(X,scale=true){
 const prep=prepare(X,scale),A=prep.values,n=A.length,p=A[0].length;
 const C=Array.from({length:p},(_,i)=>Array.from({length:p},(_,j)=>A.reduce((s,r)=>s+r[i]*r[j],0)/(n-1)));
 const V=Array.from({length:p},(_,i)=>Array.from({length:p},(_,j)=>Number(i===j)));
 // Jacobi rotations of the symmetric covariance matrix.
 for(let step=0;step<100*p*p;step++){
  let a=0,b=1,max=0;
  for(let i=0;i<p;i++)for(let j=i+1;j<p;j++)if(Math.abs(C[i][j])>max){max=Math.abs(C[i][j]);a=i;b=j;}
  if(max<1e-12*Math.max(1,...C.map((r,i)=>Math.abs(r[i]))))break;
  const theta=.5*Math.atan2(2*C[a][b],C[b][b]-C[a][a]),c=Math.cos(theta),s=Math.sin(theta);
  const aa=C[a][a],bb=C[b][b],ab=C[a][b];
  for(let i=0;i<p;i++)if(i!==a&&i!==b){const ia=C[i][a],ib=C[i][b];C[i][a]=C[a][i]=c*ia-s*ib;C[i][b]=C[b][i]=s*ia+c*ib;}
  C[a][a]=c*c*aa-2*c*s*ab+s*s*bb;C[b][b]=s*s*aa+2*c*s*ab+c*c*bb;C[a][b]=C[b][a]=0;
  for(let i=0;i<p;i++){const ia=V[i][a],ib=V[i][b];V[i][a]=c*ia-s*ib;V[i][b]=s*ia+c*ib;}
 }
 const order=Array.from({length:p},(_,i)=>i).sort((a,b)=>C[b][b]-C[a][a]);
 const eigenvalues=order.map(i=>Math.max(0,C[i][i])),total=eigenvalues.reduce((a,b)=>a+b,0);
 const components=order.map(i=>V.map(r=>r[i]));
 const scores=A.map(r=>components.map(v=>r.reduce((s,x,j)=>s+x*v[j],0)));
 return {...prep,eigenvalues,ratios:eigenvalues.map(v=>v/total),components,scores};
}
export function kmeans(X,k=3,scale=true){
 if(!Number.isInteger(k)||k<2||k>X.length)throw Error('Nombre de groupes invalide.');
 const prep=prepare(X,scale),A=prep.values,n=A.length,p=A[0].length;
 if(new Set(A.map(r=>JSON.stringify(r))).size<k)throw Error('Pas assez de points distincts pour ce nombre de groupes.');
 let best;
 // Three deterministic farthest-point initializations; no optimality guarantee.
 for(const start of [0,Math.floor(n/3),Math.floor(2*n/3)]){
  let centers=[A[start].slice()];
  while(centers.length<k){let far=0,score=-1;A.forEach((r,i)=>{const d=Math.min(...centers.map(c=>dist(r,c)));if(d>score){score=d;far=i;}});centers.push(A[far].slice());}
  let labels=Array(n).fill(-1),iterations=0,converged=false;
  for(;iterations<100;iterations++){
   const next=A.map(r=>{let id=0;centers.forEach((c,j)=>{if(dist(r,c)<dist(r,centers[id]))id=j;});return id;});
   const counts=Array(k).fill(0),sums=Array.from({length:k},()=>Array(p).fill(0));
   A.forEach((r,i)=>{counts[next[i]]++;r.forEach((x,j)=>sums[next[i]][j]+=x);});
   const stable=next.every((x,i)=>x===labels[i]);labels=next;
   centers=sums.map((r,j)=>counts[j]?r.map(x=>x/counts[j]):centers[j]);
   if(stable){converged=true;break;}
  }
  const inertia=A.reduce((s,r,i)=>s+dist(r,centers[labels[i]]),0);
  if(!best||inertia<best.inertia)best={labels,centers,inertia,iterations:iterations+1,converged};
 }
 return {...best,means:prep.means,scales:prep.scales,
  rawCenters:best.centers.map(c=>c.map((x,j)=>x*prep.scales[j]+prep.means[j]))};
}
export function sampleData(){
 const headers=['observation','activite','valeur','frequence','anciennete'];
 const rows=Array.from({length:72},(_,i)=>{const g=Math.floor(i/24),t=i%24;return ['OBS-'+String(i+1).padStart(3,'0'),String(Math.round(10+g*26+Math.sin(t*1.8)*7)),String(Math.round(30+g*60+Math.cos(t*.7)*19)),String(Math.round(2+g*6+Math.sin(t)*2)),String(Math.round(4+g*12+Math.cos(t*.9)*5))];});
 return {headers,rows,numeric:headers.slice(1).map((name,j)=>({name,index:j+1})),source:'Données synthétiques'};
}
export function answer(question,dataset,index){
 const q=question.toLowerCase(),col=dataset.headers[index],v=dataset.rows.map(r=>Number(r[index].replace(',','.')));
 if(/combien|nombre|effectif/.test(q))return {value:dataset.rows.length,unit:'observations',method:'Comptage des lignes'};
 if(/moyen/.test(q))return {value:mean(v),unit:col,method:'Somme / nombre de lignes'};
 if(/total|somme/.test(q))return {value:v.reduce((s,x)=>s+x,0),unit:col,method:'Somme de la variable'};
 throw Error('Question hors périmètre : demandez le nombre de lignes, la somme ou la moyenne de la variable sélectionnée.');
}
