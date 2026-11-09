export const tree=[
 ['ca','CA net HT','commandes × panier moyen'],['commandes','Nombre de commandes','trafic × TT'],['panier_moyen','Panier moyen net','IV × PVM'],['trafic','Trafic','visites ou sessions'],['tt','Taux de transformation','commandes ÷ trafic'],['iv','Indice de vente','unités ÷ commandes'],['pvm','Prix de vente moyen net','prix brut × (1 − taux de démarque)'],['prix_brut','Prix moyen brut HT','CA brut ÷ unités'],['taux_demarque','Taux de démarque commerciale','(CA brut − CA net) ÷ CA brut']];
const rates=new Set(['tt','taux_demarque']);
const fields=['trafic','commandes','unites','ca_brut','ca_net'];
const finite=x=>{if(!Number.isFinite(x))throw Error('Amplitude numérique non prise en charge.');return x;};
function quantity(value,key){
 if(value===null||value===undefined||value==='')return null;
 if(typeof value==='boolean'||(typeof value!=='number'&&typeof value!=='string'))throw Error('invalid_'+key);
 if(typeof value==='string'&&(!/^[0-9]+(?:[.][0-9]{1,6})?$/.test(value)||value.length>40))throw Error('invalid_'+key);
 if(typeof value==='string'){
  const [whole,fraction='']=value.split('.'),integer=BigInt(whole);
  if(integer>1000000000000n||(integer===1000000000000n&&/[1-9]/.test(fraction)))throw Error('invalid_'+key);
  if((key==='ca_brut'||key==='ca_net')&&/[1-9]/.test(fraction.slice(2)))throw Error('invalid_'+key);
  if((key==='trafic'||key==='commandes')&&/[1-9]/.test(fraction))throw Error('invalid_'+key);
 }
 const n=Number(value);if(!Number.isFinite(n)||n<0||n>1e12)throw Error('invalid_'+key);
 if((key==='trafic'||key==='commandes')&&!Number.isInteger(n))throw Error('invalid_'+key);
 if((key==='ca_brut'||key==='ca_net')&&Math.abs(n*100-Math.round(n*100))>0.00001)throw Error('invalid_'+key);
 return n;
}
export function evaluatePeriod(values){
 if(!values||typeof values!=='object'||Array.isArray(values))throw Error('period_data_must_be_object');
 const p=Object.fromEntries(fields.map(k=>[k,quantity(values[k],k)]));const {trafic:t,commandes:c,unites:u,ca_brut:g,ca_net:n}=p;
 if(g!==null&&n!==null&&n>g)throw Error('net_above_gross');
 if(c===0&&u!==null&&u>0)throw Error('units_without_commands');
 if(c===0&&((g!==null&&g>0)||(n!==null&&n>0)))throw Error('amount_without_commands');
 if(u===0&&((g!==null&&g>0)||(n!==null&&n>0)))throw Error('amount_without_units');
 if(t===0&&c!==null&&c>0)throw Error('commands_without_traffic');
 const ratio=(a,b)=>a!==null&&b!==null&&b!==0?finite(a/b):null;
 const tt=ratio(c,t),iv=ratio(u,c),brut=ratio(g,u),pvm=ratio(n,u),markdown=g!==null&&n!==null?ratio(g-n,g):null,basket=ratio(n,c);
 const nodes={ca:n,commandes:c,panier_moyen:basket,trafic:t,tt,iv,pvm,prix_brut:brut,taux_demarque:markdown};
 const checks={};for(const [key,expected] of [['ca',c===null||basket===null?null:c*basket],['commandes',t===null||tt===null?null:t*tt],['panier_moyen',iv===null||pvm===null?null:iv*pvm],['pvm',brut===null||markdown===null?null:brut*(1-markdown)]]){checks[key]=expected===null||nodes[key]===null?'unavailable':Math.abs(expected-nodes[key])<=Math.max(1,Math.abs(nodes[key]))*1e-9?'pass':'fail';}
 if(Object.values(checks).includes('fail'))throw Error('reconciliation_failed');
 const factors=[t,tt,iv,brut,markdown===null?null:1-markdown],complete=factors.every(x=>x!==null);const reconstructed=complete?factors.reduce((s,x)=>finite(s*x),1):null;
 if(complete&&Math.abs(reconstructed-n)>Math.max(1,Math.abs(n))*1e-9)throw Error('global_reconciliation_failed');
 return {inputs:p,nodes,identities:checks,factors,reconstructed,status:complete?'complete':'partial'};
}
export function compareContext(a,b){
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)||Array.isArray(b))throw Error('context_must_be_object');
 const keys=['currency','days','scope','tax','traffic_definition','returns'];const present=v=>v!==undefined&&v!==null&&v!=='';
 if(keys.some(k=>present(a[k])&&present(b[k])&&a[k]!==b[k]))return 'refused';
 for(const c of [a,b]){if(!Number.isInteger(c.days)||c.days<=0)return 'insufficient_context';if(keys.filter(k=>k!=='days').some(k=>typeof c[k]!=='string'||!c[k].trim()))return 'insufficient_context';if(!/^[A-Z]{3}$/.test(c.currency)||c.tax!=='HT')return 'insufficient_context';}
 return 'comparable_declared';
}
export function contributions(a,b){
 if(!Array.isArray(a)||!Array.isArray(b)||!a.length||a.length!==b.length||a.length>5||[...a,...b].some(x=>typeof x!=='number'||!Number.isFinite(x)))throw Error('invalid_factors');
 const product=x=>x.reduce((s,v)=>finite(s*v),1),totals=a.map(()=>0);let count=0;
 function walk(order,left){if(!left.length){const current=[...a];let previous=product(current);for(const i of order){current[i]=b[i];const next=product(current);totals[i]=finite(totals[i]+finite(next-previous));previous=next;}count++;return;}for(const i of left)walk([...order,i],left.filter(j=>i!==j));}
 walk([],a.map((_,i)=>i));return totals.map(x=>finite(x/count));
}
export function buildReport(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('input_must_be_object');
 const periods=[],contexts=[];for(const name of ['reference','comparison']){const item=payload[name];if(!item||typeof item!=='object')throw Error('missing_period_'+name);contexts.push(item.context??{});periods.push(evaluatePeriod(item.data));}
 const contextStatus=compareContext(...contexts);if(contextStatus==='refused')throw Error('incompatible_context');
 const provenance=contexts.every(c=>typeof c.source==='string'&&c.source.trim()),comparable=contextStatus==='comparable_declared'&&provenance;
 const [a,b]=periods;const nodes=tree.map(([id,label,formula])=>{const x=a.nodes[id],y=b.nodes[id],delta=comparable&&x!==null&&y!==null?finite(y-x):null;return {id,label,formula,reference:x,comparison:y,delta,relative:delta!==null&&x!==0?finite(delta/x):null,percentage_points:rates.has(id)&&delta!==null?finite(delta*100):null};});
 let allocation=null;if(comparable&&a.status==='complete'&&b.status==='complete'){const parts=contributions(a.factors,b.factors),delta=b.nodes.ca-a.nodes.ca,total=parts.reduce((s,x)=>finite(s+x),0),residual=finite(total-delta);if(Math.abs(residual)>Math.max(1,Math.abs(delta))*1e-8)throw Error('contribution_reconciliation_failed');allocation={convention:'Moyenne des 120 ordres de remplacement',factors:Object.fromEntries(['trafic','tt','iv','prix_brut','part_conservee'].map((k,i)=>[k,parts[i]])),total,residual,note:'Part conservée = 1 − taux de démarque. Ne pas additionner plusieurs niveaux.'};}
 const warnings=['Les identités et contributions ne démontrent aucune cause.','La comparabilité et les sources sont déclarées, sans vérification des données d’origine.','Prix brut moyen pondéré par les unités ; démarque commerciale pondérée par les montants bruts.','Démarque physique et marge hors de cet arbre.','TT = commandes / trafic ; sa lecture comme probabilité exige une convention adaptée.'];
 if(!comparable)warnings.push('Comparaison suspendue : compléter le contexte et les sources.');if(periods.some(p=>p.status==='partial'))warnings.push('Arbre partiel : certains ratios ne sont pas calculables. Aucune imputation.');
 return {version:'1.0',mode:'local-deterministic',status:!comparable?'context_required':allocation?'complete':'partial',question:String(payload.question||'Diagnostic global du CA').slice(0,2000),contexts:{reference:contexts[0],comparison:contexts[1]},inputs:{reference:a.inputs,comparison:b.inputs},nodes,checks:{reference:a.identities,comparison:b.identities,context:contextStatus,source_declared:provenance},contributions:allocation,warnings,action_executed:false};
}
export const demoPayload=()=>{const context={currency:'EUR',days:7,scope:'Commerce · exemple pédagogique',tax:'HT',traffic_definition:'Sessions',returns:'Ventes et unités hors retours, même convention sur les deux périodes',source:'Exemple synthétique Learning Analytics'};return {synthetic:true,question:'Comment le CA a-t-il évolué et quels facteurs faut-il investiguer ?',reference:{context:{...context},data:{trafic:10000,commandes:1000,unites:2000,ca_brut:32000,ca_net:30000}},comparison:{context:{...context},data:{trafic:10000,commandes:900,unites:1800,ca_brut:28800,ca_net:25200}}};};
export const errorMessage=code=>({net_above_gross:'Le CA net dépasse le CA brut : vérifiez les montants et les conventions de retours.',units_without_commands:'Des unités sont présentes sans commande.',amount_without_commands:'Un montant est présent sans commande.',amount_without_units:'Un montant est présent sans unité.',commands_without_traffic:'Des commandes sont présentes sans trafic.',incompatible_context:'Les périodes utilisent des devises, durées ou conventions incompatibles.',reconciliation_failed:'Les identités ne se réconcilient pas.',global_reconciliation_failed:'L’arbre global ne retrouve pas le CA.',contribution_reconciliation_failed:'Les contributions ne retrouvent pas l’écart de CA.'}[code]||(/invalid_/.test(code)?'Valeur invalide : '+code.replace('invalid_','')+'. Utilisez des valeurs positives ou nulles ; laissez vide si la donnée est inconnue.':code));
