const service=document.querySelector('#service'),dynamic=document.querySelector('#dynamic'),form=document.querySelector('#form'),success=document.querySelector('#success'),error=document.querySelector('#error');
document.querySelector('#year').textContent=new Date().getFullYear();

const FORMSUBMIT_URL='https://formsubmit.co/ajax/guerini16marco@gmail.com';
const commonTime=`<div class="field"><label>QUANDO?</label><div class="grid"><input id="date" name="data" type="date" required><input id="time" name="orario" type="time" required></div></div>`;
const commonLocation=`<div class="field"><label for="location">DOVE?</label><input id="location" name="luogo" placeholder="Indica il luogo" required></div>`;
const common=commonTime+commonLocation;
function checks(name,arr){return `<div class="check-grid">${arr.map(x=>`<label><input type="checkbox" name="${name}" value="${x}"> ${x}</label>`).join('')}</div>`}
function fieldSelect(label,name,options,required=true){return `<div class="field"><label>${label}</label><select name="${name}" ${required?'required':''}><option value="">Seleziona</option>${options.map(x=>`<option>${x}</option>`).join('')}</select></div>`}
function fieldTextarea(label,name,placeholder,required=true){return `<div class="field"><label>${label}</label><textarea name="${name}" placeholder="${placeholder}" ${required?'required':''}></textarea></div>`}
function fieldFile(label,name='allegato'){return `<div class="field"><label>${label}</label><input type="file" name="${name}" accept="image/*,.pdf"></div>`}

function render(v){
 let h='';
 if(v==='Ripetizioni') h=fieldSelect('MATERIA','materia',['Matematica','Fisica','Filosofia','Scienze','Storia','Geografia','Italiano'])+fieldTextarea('DI COSA HAI BISOGNO?','argomento','Scrivi l\'argomento che vuoi studiare o in cosa hai bisogno di aiuto...')+fieldSelect('DURATA','durata',['1 ora','1 ora e 30 minuti','2 ore','Altro'])+fieldSelect('DOVE?','luogo',['Casa mia','Casa del cliente','Altro luogo'])+commonTime;
 else if(v==='Piccoli lavori & aiuto pratico') h=`<div class="field"><label>TIPO DI AIUTO</label>${checks('tipo_aiuto',['Spostamento scatoloni','Montaggio','Smontaggio','Assemblaggio','Riordino / sistemazione','Spostamento oggetti','Altro'])}</div>`+fieldTextarea('RACCONTAMI IL LAVORO','descrizione','Descrivi cosa ti serve...')+fieldFile('FOTO (OPZIONALE)')+common;
 else if(v==='Giardinaggio / piccoli lavori esterni') h=`<div class="field"><label>TIPO DI LAVORO</label>${checks('tipo_giardinaggio',["Taglio dell'erba",'Annaffiamento','Travaso piante','Sistemazione vasi','Riordino giardino/balcone','Raccolta foglie','Altro'])}</div>`+fieldTextarea('RACCONTAMI IL LAVORO','descrizione','Descrivi cosa ti serve...')+fieldSelect('DIMENSIONE AREA','dimensione_area',['Piccola','Media','Grande','Non saprei'])+fieldFile('FOTO (OPZIONALE)')+common;
 else if(v==='Dogsitting / controllo animali') h=fieldSelect('ANIMALE','animale',['Cane','Gatto','Coniglio','Altro'])+`<div class="field"><label>TIPO DI SERVIZIO</label>${checks('tipo_dogsitting',['Passeggiata','Controllo','Cibo/acqua','Compagnia','Altro'])}</div>`+fieldSelect('DURATA','durata',['Un giorno','Più giorni'])+fieldTextarea('INFORMAZIONI IMPORTANTI','informazioni_animale','Scrivi tutto ciò che è utile sapere...')+common;
 else if(v==='Servizio particolare / richiesta personalizzata') h=fieldTextarea('COSA TI SERVE?','descrizione','Raccontami la richiesta nel modo più chiaro possibile...')+fieldFile('FOTO / FILE (OPZIONALE)')+common;
 dynamic.innerHTML=h; bindReview(); update();
}
function update(){
 document.querySelector('#rService').textContent=service.value||'—';
 const d=document.querySelector('#date')?.value||'',t=document.querySelector('#time')?.value||'';
 document.querySelector('#rDate').textContent=[d,t].filter(Boolean).join(' · ')||'—';
 document.querySelector('#rLocation').textContent=document.querySelector('#location')?.value||'—';
 document.querySelector('#rContact').textContent=document.querySelector('#contact')?.value||'—';
}
function bindReview(){dynamic.querySelectorAll('input,select,textarea').forEach(x=>x.addEventListener('input',update));dynamic.querySelectorAll('input,select,textarea').forEach(x=>x.addEventListener('change',update));}
service.addEventListener('change',()=>{render(service.value);});
document.querySelector('#contact').addEventListener('change',update);
document.querySelectorAll('.card button').forEach(b=>b.addEventListener('click',()=>{service.value=b.dataset.service;render(service.value);document.querySelector('#richiedi').scrollIntoView({behavior:'smooth'});}));

form.addEventListener('submit',async e=>{
 e.preventDefault(); error.textContent='';
 if(!form.checkValidity()){error.textContent='Controlla i campi obbligatori prima di inviare.';form.reportValidity();return;}
 const submit=form.querySelector('.submit'); submit.disabled=true; submit.textContent='Invio in corso…';
 const serviceField=document.createElement('input');serviceField.type='hidden';serviceField.name='servizio';serviceField.value=service.value;form.appendChild(serviceField);
 const replyField=document.createElement('input');replyField.type='hidden';replyField.name='_replyto';replyField.value=document.querySelector('#email').value;form.appendChild(replyField);
 try{
   const response=await fetch(FORMSUBMIT_URL,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)});
   const data=await response.json().catch(()=>({success:response.ok}));
   if(!response.ok || data.success===false) throw new Error(data.message||'Invio non riuscito');
   form.hidden=true; success.hidden=false;
 }catch(err){
   error.textContent='Non riesco a inviare la richiesta in questo momento. Riprova tra poco.';
   submit.disabled=false;submit.textContent='Invia richiesta ↗';
 }finally{serviceField.remove();replyField.remove();}
});
document.querySelector('#reset').addEventListener('click',()=>{form.reset();dynamic.innerHTML='';success.hidden=true;form.hidden=false;error.textContent='';form.querySelector('.submit').disabled=false;form.querySelector('.submit').textContent='Invia richiesta ↗';update();});
