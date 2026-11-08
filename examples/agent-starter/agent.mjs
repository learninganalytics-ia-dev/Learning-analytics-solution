#!/usr/bin/env node
// Standalone local analytics agent. No API key, network call or paid model.
import {readFile} from 'node:fs/promises';
import {parseCSV,sampleData} from '../../web/analytics.mjs';
import {runLocalAgent,describeDataset} from '../../web/agent-core.mjs';
const args=process.argv.slice(2),option=name=>{const i=args.indexOf(name);if(i<0)return null;if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Valeur absente pour '+name);return args[i+1];};
try{
 if(args.includes('--help')){console.log('node agent-local.mjs [--csv donnees.csv] [--profile mon-agent.json] [--question "Moyenne de valeur"]');process.exit(0);}
 const csv=option('--csv'),profilePath=option('--profile'),question=option('--question')||'Combien d’observations ?';
 const dataset=csv?parseCSV(await readFile(csv,'utf-8')):sampleData();
 const profile=profilePath?JSON.parse(await readFile(profilePath,'utf-8')):{name:'Mon agent analytics',domain:'Démonstration'};
 const indices=describeDataset(dataset).columns.filter(c=>c.numeric).slice(0,12).map(c=>c.index);
 const result=runLocalAgent(question,dataset,indices);
 console.log(JSON.stringify({agent:profile.name||'Mon agent',domain:profile.domain||'',...result},null,2));
}catch(error){console.error('Erreur : '+error.message);process.exitCode=1;}
