import {mean,matrix,pca,kmeans} from './analytics.mjs';
export function validateDataset(dataset){
 if(!dataset||!Array.isArray(dataset.headers)||!Array.isArray(dataset.rows)||dataset.headers.length<2||dataset.headers.length>40||dataset.rows.length<2||dataset.rows.length>1000)throw Error('Données attendues : 2 à 1 000 observations et 2 à 40 colonnes.');
 if(dataset.headers.some(h=>typeof h!=='string'||!h.trim()||h.length>160)||new Set(dataset.headers).size!==dataset.headers.length)throw Error('Noms de colonnes invalides.');
 if(dataset.rows.some(r=>!Array.isArray(r)||r.length!==dataset.headers.length||r.some(v=>typeof v!=='string'||v.length>160)))throw Error('Lignes invalides.');
 return dataset;
}
export function describeDataset(dataset){
 validateDataset(dataset);
 return {rows:dataset.rows.length,columns:dataset.headers.map((name,index)=>({name,index,numeric:dataset.rows.every(r=>r[index].trim()!==''&&Number.isFinite(Number(r[index].replace(',','.'))))})),source:dataset.source||'Données fournies'};
}
export function statistic(dataset,index,operation='mean'){
 const schema=describeDataset(dataset);if(!schema.columns.some(c=>c.index===index&&c.numeric))throw Error('Variable numérique non valide.');
 const v=dataset.rows.map(r=>Number(r[index].replace(',','.')));
 const ops={count:()=>v.length,sum:()=>v.reduce((a,b)=>a+b,0),mean:()=>mean(v),min:()=>Math.min(...v),max:()=>Math.max(...v)};
 if(!ops[operation])throw Error('Opération non prise en charge.');
 return {operation,column:dataset.headers[index],value:ops[operation](),rows:v.length,source:schema.source,filters:'aucun',formula:{count:'nombre de lignes',sum:'somme(x)',mean:'somme(x)/n',min:'minimum(x)',max:'maximum(x)'}[operation]};
}
export function exploration(dataset,indices,method='pca',k=3){
 validateDataset(dataset);if(!Array.isArray(indices)||new Set(indices).size!==indices.length||indices.some(i=>!Number.isInteger(i)||i<0||i>=dataset.headers.length))throw Error('Sélection de variables invalide.');
 const X=matrix(dataset,indices);if(X.some(r=>r.some(x=>!Number.isFinite(x)))||dataset.rows.some(r=>indices.some(i=>!r[i].trim())))throw Error('Valeurs manquantes ou non numériques.');
 const names=indices.map(i=>dataset.headers[i]);
 if(method==='pca'){const r=pca(X,true);return {method:'ACP',variables:names,rows:X.length,standardized:true,explainedRatio:r.ratios,contributions:r.components.slice(0,2).map(v=>v.map(x=>x*x)),limits:'Projection exploratoire ; aucune causalité.'};}
 if(method!=='cluster')throw Error('Méthode non prise en charge.');
 const r=kmeans(X,k,true);return {method:'K-means',variables:names,rows:X.length,standardized:true,k,inertia:r.inertia,converged:r.converged,counts:Array.from({length:k},(_,j)=>r.labels.filter(x=>x===j).length),centers:r.rawCenters.map((center,j)=>r.labels.filter(x=>x===j).length>=3?center:null),limits:'Trois initialisations déterministes ; optimum global non garanti.'};
}
export function runLocalAgent(question,dataset,indices){
 const schema=describeDataset(dataset),q=String(question).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),trace=[{tool:'describe_dataset',result:schema}];
 if(/predi|demain|futur|caus|pourquoi/.test(q))throw Error('Cette demande dépasse l’analyse descriptive ou exploratoire. Aucune prédiction, causalité ou décision individuelle n’est exécutée.');
 if(/\b(par|pour|dont|filtre|entre|apres|avant|superieur|inferieur|seulement|uniquement)\b|20[0-9]{2}|hier|aujourd/.test(q))throw Error('Les filtres, comparaisons temporelles et regroupements métier ne sont pas pris en charge par le mode local. Aucune condition ne sera ignorée.');
 let result;
 if(/acp|composant|projection/.test(q))result=exploration(dataset,indices,'pca');
 else if(/cluster|groupe|segment/.test(q)){const match=q.match(/([2-6])\s*(?:group|cluster|segment)/);result=exploration(dataset,indices,'cluster',match?Number(match[1]):3);}
 else {
  const operation=/combien|nombre|effectif/.test(q)?'count':/moyen/.test(q)?'mean':/total|somme/.test(q)?'sum':/minimum|plus petit|min\b/.test(q)?'min':/maximum|plus grand|max\b/.test(q)?'max':null;
  if(!operation)throw Error('Demandez un nombre, une somme, une moyenne, un minimum, un maximum, une ACP ou un clustering.');
  const named=schema.columns.filter(c=>c.numeric&&q.includes(c.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()));
  const index=named[0]?.index??indices[0];
  if(operation==='count')result={operation,value:dataset.rows.length,rows:dataset.rows.length,source:schema.source,formula:'nombre de lignes'};
  else result=statistic(dataset,index,operation);
 }
 trace.push({tool:result.method==='ACP'?'pca':result.method==='K-means'?'kmeans':'statistic',result});
 return {mode:'local',question,result,trace,source:schema.source,rows:dataset.rows.length,limits:'Agent déterministe à outils limités ; aucune génération de texte par un LLM.'};
}
export function runSummary(run){
 if(run.mode==='local')return {question:run.question,result:run.result,rows:run.rows,source:run.source,limits:run.limits};
 const {method,variables,standardized,explained_ratio,k,inertia,rawCenters,labels,...rest}=run;
 return {method,variables,standardized,...(explained_ratio?{explained_ratio}:{}),...(k?{k,inertia,centers:rawCenters.map((center,j)=>labels.filter(x=>x===j).length>=3?center:null),counts:Array.from({length:k},(_,j)=>labels.filter(x=>x===j).length)}:{}),source:rest.source};
}

export function scopedAnalytics(dataset,indices){
 const schema=describeDataset(dataset);
 if(!Array.isArray(indices)||!indices.length||indices.length>12||new Set(indices).size!==indices.length||indices.some(i=>!Number.isInteger(i)||i<0||i>=dataset.headers.length))throw Error('Sélection de variables invalide.');
 const allowed=new Set(indices);
 return {
  describe:()=>({...schema,columns:schema.columns.filter(c=>allowed.has(c.index))}),
  statistic:(index,operation)=>{if(!allowed.has(index))throw Error('Variable hors sélection.');return statistic(dataset,index,operation);},
  explore:(method,k)=>exploration(dataset,indices,method,k)
 };
}
