import test from 'node:test';import assert from 'node:assert/strict';
import {createAgentHandler} from '../api/agent.js';import {sampleData} from '../web/analytics.mjs';
const enabled={AI_GENERATIVE_ENABLED:'true',AI_GATEWAY_MODEL:'test/model',AI_ALLOWED_USER_IDS:'owner'};
const body=()=>({question:'Moyenne de valeur',dataset:sampleData(),selected:[1,2],consent:true});
async function request(handler,{method='POST',headers={},payload=body()}={}){
 let text='',result;const res={setHeader(){},statusCode:200,end(value){text=value;}};
 await handler({method,headers:{'content-type':'application/json',...headers},body:payload},res);
 result=JSON.parse(text);return {status:res.statusCode,body:result};
}
test('Disabled generation never authenticates or calls a model',async()=>{
 const h=createAgentHandler({env:{},makeClient:()=>{throw Error('must not run');},generate:()=>{throw Error('must not run');}});
 assert.equal((await request(h)).status,503);assert.equal((await request(h,{method:'GET'})).body.generativeConfigured,false);
});
test('Bearer authentication and approved-user allowlist precede quota and model',async()=>{
 let calls=0;
 const client={auth:{getUser:async()=>({data:{user:{id:'other'}}})},rpc:()=>{throw Error('must not reserve');}};
 const h=createAgentHandler({env:enabled,makeClient:()=>client,generate:()=>{calls++;}});
 assert.equal((await request(h)).status,401);
 assert.equal((await request(h,{headers:{authorization:'Bearer token'}})).status,403);assert.equal(calls,0);
});
test('Consent, payload limits and cross-origin checks reject before billing',async()=>{
 const h=createAgentHandler({env:enabled,makeClient:()=>{throw Error('must not run');}});
 assert.equal((await request(h,{headers:{authorization:'Bearer token'},payload:{...body(),consent:false}})).status,400);
 assert.equal((await request(h,{headers:{origin:'https://malicious.invalid',authorization:'Bearer token'}})).status,403);
 assert.equal((await request(h,{headers:{authorization:'Bearer token'},payload:'x'.repeat(257000)})).status,413);
});
test('Daily quota failure never calls model',async()=>{
 let calls=0;const client={auth:{getUser:async()=>({data:{user:{id:'owner'}}})},rpc:async()=>({error:{code:'P0001'}})};
 const h=createAgentHandler({env:enabled,makeClient:()=>client,generate:()=>{calls++;}});
 assert.equal((await request(h,{headers:{authorization:'Bearer token'}})).status,429);assert.equal(calls,0);
});
test('Verified calls return trace and refuse ungrounded generations',async()=>{
 const client={auth:{getUser:async()=>({data:{user:{id:'owner'}}})},rpc:async()=>({data:'request-id'})};
 const h=createAgentHandler({env:enabled,makeClient:()=>client,generate:async()=>({text:'Moyenne',trace:[{tool:'statistic',result:{value:10}}]})});
 const r=await request(h,{headers:{authorization:'Bearer token'}});assert.equal(r.status,200);assert.equal(r.body.mode,'generative');
 const ungrounded=createAgentHandler({env:enabled,makeClient:()=>client,generate:async()=>({text:'Inventé',trace:[]})});
 assert.equal((await request(ungrounded,{headers:{authorization:'Bearer token'}})).status,422);
});
