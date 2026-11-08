import {createClient} from '@supabase/supabase-js';
import {publicConfig} from './config.mjs';
export const supabase=createClient(publicConfig.supabaseUrl,publicConfig.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
let session=null;
export const user=()=>session?.user||null;
export const accessToken=()=>session?.access_token||null;
export function subscribeAuth(callback){
 const {data:{subscription}}=supabase.auth.onAuthStateChange((event,next)=>{session=next;setTimeout(()=>callback(event,user()),0);});
 return ()=>subscription.unsubscribe();
}
const requireUser=()=>{if(!user())throw Error('Connectez-vous pour synchroniser votre espace.');return user().id;};
const checked=({data,error})=>{if(error){const messages={invalid_credentials:'Adresse email ou mot de passe incorrect.',email_not_confirmed:'Confirmez votre adresse email avant de vous connecter.',over_email_send_rate_limit:'Trop de demandes de confirmation. Réessayez plus tard.',email_address_not_authorized:'L’envoi des confirmations doit être configuré par l’administrateur.',weak_password:'Choisissez un mot de passe plus robuste.'};throw Error(messages[error.code]||error.message);}return data;};
export async function signIn(email,password){return checked(await supabase.auth.signInWithPassword({email,password}));}
export async function signUp(email,password){return checked(await supabase.auth.signUp({email,password,options:{emailRedirectTo:publicConfig.siteUrl+'/'}}));}
export async function signOut(){checked(await supabase.auth.signOut());}
export async function confirmEmail(value,email){
 const text=value.trim();
 if(/^https:\/\//.test(text)){
  const url=new URL(text);
  if(url.origin!==publicConfig.supabaseUrl||url.pathname!=='/auth/v1/verify')throw Error('Ce lien ne correspond pas au projet Learning Analytics.');
  const token_hash=url.searchParams.get('token_hash')||url.searchParams.get('token');
  if(!token_hash)throw Error('Le lien ne contient pas de jeton de confirmation.');
  return checked(await supabase.auth.verifyOtp({token_hash,type:'signup'}));
 }
 if(!/^\d{6,10}$/.test(text))throw Error('Saisissez le code reçu ou le lien complet de confirmation.');
 return checked(await supabase.auth.verifyOtp({email,token:text,type:'signup'}));
}
export async function progress(){const id=requireUser();return checked(await supabase.from('la_progress').select('course_id').eq('user_id',id).eq('completed',true)).map(r=>r.course_id);}
export async function setProgress(courseId,completed){const id=requireUser();return checked(await supabase.from('la_progress').upsert({user_id:id,course_id:courseId,completed,updated_at:new Date().toISOString()},{onConflict:'user_id,course_id'}));}
export async function projects(){const id=requireUser();return checked(await supabase.from('la_projects').select('id,title,profile,updated_at').eq('user_id',id).order('updated_at',{ascending:false}).limit(50));}
export async function saveProject(profile,id=null){
 const uid=requireUser(),entry={user_id:uid,title:String(profile.name||'Mon agent').slice(0,180),profile,updated_at:new Date().toISOString()};
 if(id)return checked(await supabase.from('la_projects').update(entry).eq('id',id).eq('user_id',uid).select('id').single());
 return checked(await supabase.from('la_projects').insert(entry).select('id').single());
}
export async function runs(){const id=requireUser();return checked(await supabase.from('la_runs').select('id,method,summary,created_at,project_id').eq('user_id',id).order('created_at',{ascending:false}).limit(30));}
export async function saveRun(method,summary,projectId=null){const id=requireUser();return checked(await supabase.from('la_runs').insert({user_id:id,project_id:projectId,method,summary}).select('id').single());}
