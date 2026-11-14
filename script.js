const slides = [
  {
    "headline": "A backyard made<br>for getting together."
  },
  {
    "headline": "From empty yard<br>to everyday escape."
  },
  {
    "headline": "Your favourite getaway.<br>Just outside."
  },
  {
    "headline": "Make room for<br>the slower moments."
  },
  {
    "headline": "Let the good evenings<br>last a little longer."
  }
];
const options=[...document.querySelectorAll('.option')],scenes=[...document.querySelectorAll('.scene')];
let current=0,timer,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
function schedule(){clearInterval(timer);if(!paused&&!document.hidden)timer=setInterval(()=>show((current+1)%slides.length),matchMedia('(max-width:650px)').matches?16000:8000)}
function show(index){
 current=index;const slide=slides[index];
 scenes.forEach((scene,i)=>scene.classList.toggle('active',i===index));
 options.forEach((option,i)=>{option.classList.remove('selected');option.setAttribute('aria-pressed',String(i===index))});
 void options[index].offsetWidth;options[index].classList.add('selected');
 renderHeadline(slide.headline);
 if(matchMedia('(max-width:650px)').matches)document.querySelector('.options').scrollTo({left:options[index].offsetLeft,behavior:paused?'instant':'smooth'});
 schedule();
}
options.forEach((option,i)=>option.addEventListener('click',()=>show(i)));
document.querySelector('.options').addEventListener('keydown',event=>{if(!['ArrowRight','ArrowLeft'].includes(event.key))return;event.preventDefault();show((current+(event.key==='ArrowRight'?1:-1)+slides.length)%slides.length);options[current].focus()});
document.addEventListener('visibilitychange',schedule);
schedule();

// Translate two identical, viewport-wide groups for a seamless photo loop.
document.querySelectorAll('.photo-carousel').forEach(carousel=>{
 const track=carousel.querySelector('.photo-track');
 const groups=[...track.querySelectorAll('.photo-group')];
 const originals=groups[0].innerHTML;
 const direction=carousel.dataset.direction==='right'?-1:1;
 let offset=0,width=0,last=0,dragging=false,startX=0,startOffset=0;
 const normalize=value=>width?((value%width)+width)%width:0;
 function render(){offset=normalize(offset);track.style.transform=`translate3d(${-offset}px,0,0)`}
 function measure(){
  groups.forEach(group=>group.innerHTML=originals);
  // Every half must fill the viewport even on very wide screens.
  while(groups[0].getBoundingClientRect().width<carousel.clientWidth+1){
   groups.forEach(group=>group.insertAdjacentHTML('beforeend',originals));
  }
  width=groups[0].getBoundingClientRect().width;render();
 }
 new ResizeObserver(measure).observe(carousel);
 function frame(time){
  if(last&&!dragging&&!document.hidden&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   offset+=Math.min(time-last,40)*.035*direction;
  }
  render();last=time;requestAnimationFrame(frame);
 }
 carousel.addEventListener('pointerdown',event=>{
  dragging=true;startX=event.clientX;startOffset=offset;
  carousel.setPointerCapture(event.pointerId);carousel.classList.add('dragging');
 });
 carousel.addEventListener('pointermove',event=>{
  if(dragging){offset=startOffset+startX-event.clientX;render()}
 });
 for(const type of ['pointerup','pointercancel','lostpointercapture']){
  carousel.addEventListener(type,()=>{dragging=false;carousel.classList.remove('dragging')});
 }
 carousel.addEventListener('keydown',event=>{
  if(['ArrowLeft','ArrowRight'].includes(event.key)){
   event.preventDefault();offset+=event.key==='ArrowRight'?220:-220;render();
  }
 });
 measure();requestAnimationFrame(frame);
});

// Native range input supports pointer, touch, and arrow-key comparison.
document.querySelectorAll('.comparison-range').forEach(range=>{
 range.addEventListener('input',()=>{
  range.closest('.comparison').style.setProperty('--split',`${range.value}%`);
  range.setAttribute('aria-valuetext',`${range.value} percent before, ${100-Number(range.value)} percent after`);
 });
});


// Keep the editorial line break and fit both complete lines at every viewport size.
function renderHeadline(markup){
 const heading=document.querySelector('#headline');
 heading.replaceChildren(...markup.split(/<br\s*\/?>/i).map(text=>{
  const line=document.createElement('span');line.textContent=text;return line;
 }));
 fitHeadline();
}
function fitHeadline(){
 const heading=document.querySelector('#headline');
 heading.style.fontSize='';
 const base=parseFloat(getComputedStyle(heading).fontSize);
 const widest=Math.max(...[...heading.children].map(line=>line.scrollWidth));
 if(widest>heading.clientWidth)heading.style.fontSize=`${base*(heading.clientWidth-2)/widest}px`;
}
new ResizeObserver(fitHeadline).observe(document.querySelector('.story'));
document.fonts.ready.then(()=>renderHeadline(slides[current].headline));
renderHeadline(slides[current].headline);

const closingSection=document.querySelector('.la-closing');
let closingFrame=false;
function updateClosingScene(){
 const bounds=closingSection.getBoundingClientRect();
 const progress=Math.max(0,Math.min(1,-bounds.top/(innerHeight*.7)));
 closingSection.style.setProperty('--closing-progress',progress);
 closingFrame=false;
}
addEventListener('scroll',()=>{if(!closingFrame){closingFrame=true;requestAnimationFrame(updateClosingScene)}},{passive:true});
addEventListener('resize',updateClosingScene);
updateClosingScene();

const pageTranslations={"en": {"Send us a text": "Send us a text", "Coming soon": "Coming soon", "A backyard made": "A backyard made", "for getting together.": "for getting together.", "From empty yard": "From empty yard", "to everyday escape.": "to everyday escape.", "Your favourite getaway.": "Your favourite getaway.", "Just outside.": "Just outside.", "Make room for": "Make room for", "the slower moments.": "the slower moments.", "Let the good evenings": "Let the good evenings", "last a little longer.": "last a little longer.", "Backyard BBQ": "Backyard BBQ", "& outdoor kitchens": "& outdoor kitchens", "A garden worth": "A garden worth", "coming home to": "coming home to", "Your own": "Your own", "poolside retreat": "poolside retreat", "Patios for": "Patios for", "slowing down": "slowing down", "A little magic": "A little magic", "after sunset": "after sunset", "A little more outside.": "A little more outside.", "A lot more living.": "A lot more living.", "Thoughtful landscapes. Beautiful hardscapes.": "Thoughtful landscapes. Beautiful hardscapes.", "Outdoor spaces that feel like you.": "Outdoor spaces that feel like you.", "Every detail.": "Every detail.", "One complete vision.": "One complete vision.", "Backyard Retreats": "Backyard Retreats", "Pavers & concrete": "Pavers & concrete", "Outdoor Living Spaces": "Outdoor Living Spaces", "Planting & artificial turf": "Planting & artificial turf", "See the transformation": "See the transformation", "for yourself.": "for yourself.", "Before": "Before", "After": "After", "Southern California.": "Southern California.", "Outdoor living.": "Outdoor living.", "Let's create a space": "Let's create a space", "worth coming home to.": "worth coming home to.", "LET'S DISCUSS": "LET'S DISCUSS", "WHAT YOU HAVE IN MIND": "WHAT YOU HAVE IN MIND", "& HEAR BACK FROM US": "& HEAR BACK FROM US", "Your name": "Your name", "Email address": "Email address", "Phone number": "Phone number", "Project location": "Project location", "Your outdoor space": "Your outdoor space", "Save enquiry": "Save enquiry", "Full name": "Full name", "Your phone number": "Your phone number", "City or ZIP code": "City or ZIP code", "Tell us a little about your project": "Tell us a little about your project", "Let's talk outside.": "Let's talk outside.", "Based in": "Based in", "Southern California": "Southern California", "Our neighbourhoods": "Our neighbourhoods", "Contact": "Contact", "Email & phone coming soon": "Email & phone coming soon", "Santa Clarita Valley": "Santa Clarita Valley", "San Fernando Valley": "San Fernando Valley", "Conejo Valley": "Conejo Valley", "Ventura County": "Ventura County", "Thousand Oaks": "Thousand Oaks", "Enquiries are saved on this device. Online delivery coming soon.": "Enquiries are saved on this device. Online delivery coming soon.", "Your enquiry is saved on this device. It has not been sent online.": "Your enquiry is saved on this device. It has not been sent online.", "Unable to save on this device. Please keep a copy of your enquiry.": "Unable to save on this device. Please keep a copy of your enquiry.", "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside."}, "es": {"Send us a text": "Envíanos un mensaje", "Coming soon": "Próximamente", "A backyard made": "Un jardín pensado", "for getting together.": "para reunirse.", "From empty yard": "De un patio vacío", "to everyday escape.": "a tu refugio diario.", "Your favourite getaway.": "Tu escapada favorita.", "Just outside.": "Justo al salir.", "Make room for": "Haz espacio para", "the slower moments.": "los momentos de calma.", "Let the good evenings": "Que las buenas tardes", "last a little longer.": "duren un poco más.", "Backyard BBQ": "Barbacoa en el jardín", "& outdoor kitchens": "y cocinas exteriores", "A garden worth": "Un jardín al que", "coming home to": "siempre quieres volver", "Your own": "Tu propio", "poolside retreat": "refugio junto a la piscina", "Patios for": "Patios para", "slowing down": "tomárselo con calma", "A little magic": "Un poco de magia", "after sunset": "al atardecer", "A little more outside.": "Un poco más al aire libre.", "A lot more living.": "Mucho más para vivir.", "Thoughtful landscapes. Beautiful hardscapes.": "Paisajes con intención. Espacios bien construidos.", "Outdoor spaces that feel like you.": "Espacios exteriores que hablan de ti.", "Every detail.": "Cada detalle.", "One complete vision.": "Una visión completa.", "Backyard Retreats": "Refugios en el jardín", "Pavers & concrete": "Adoquines y hormigón", "Outdoor Living Spaces": "Espacios para vivir al aire libre", "Planting & artificial turf": "Plantación y césped artificial", "See the transformation": "Descubre la transformación", "for yourself.": "por ti mismo.", "Before": "Antes", "After": "Después", "Southern California.": "Sur de California.", "Outdoor living.": "Vida al aire libre.", "Let's create a space": "Creemos un espacio", "worth coming home to.": "al que quieras volver.", "LET'S DISCUSS": "HABLEMOS", "WHAT YOU HAVE IN MIND": "DE LO QUE IMAGINAS", "& HEAR BACK FROM US": "Y TE RESPONDEREMOS", "Your name": "Tu nombre", "Email address": "Correo electrónico", "Phone number": "Teléfono", "Project location": "Ubicación del proyecto", "Your outdoor space": "Tu espacio exterior", "Save enquiry": "Guardar consulta", "Full name": "Nombre completo", "Your phone number": "Tu teléfono", "City or ZIP code": "Ciudad o código postal", "Tell us a little about your project": "Cuéntanos sobre tu proyecto", "Let's talk outside.": "Hablemos de tu jardín.", "Based in": "Nuestra base", "Southern California": "Sur de California", "Our neighbourhoods": "Nuestras zonas", "Contact": "Contacto", "Email & phone coming soon": "Correo y teléfono próximamente", "Santa Clarita Valley": "Valle de Santa Clarita", "San Fernando Valley": "Valle de San Fernando", "Conejo Valley": "Valle de Conejo", "Ventura County": "Condado de Ventura", "Thousand Oaks": "Thousand Oaks", "Enquiries are saved on this device. Online delivery coming soon.": "Las consultas se guardan en este dispositivo. Envío en línea próximamente.", "Your enquiry is saved on this device. It has not been sent online.": "Tu consulta se guardó en este dispositivo. No se ha enviado en línea.", "Unable to save on this device. Please keep a copy of your enquiry.": "No se pudo guardar. Conserva una copia de tu consulta.", "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "Un espacio exterior hermoso es más que la suma de sus partes. Desde jardines acogedores y pavimentos cuidados hasta zonas de reunión y plantaciones, unimos cada elemento. Diseñamos según tu estilo de vida, con materiales, texturas y vegetación que encajan de forma natural en tu hogar.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "Un lugar tranquilo para relajarse y reunirse al aire libre. Combinamos plantas, pavimentos y espacios cómodos alrededor de tu hogar.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "Desde entradas acogedoras hasta senderos y patios, las superficies bien diseñadas aportan estructura, carácter y funcionalidad.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "Haz espacio para comidas compartidas, tardes tranquilas y fines de semana con amigos, con exteriores diseñados para tu estilo de vida.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "Las plantas en capas y el césped artificial de fácil cuidado aportan frescura y vegetación a tu espacio exterior.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "Un poco de planificación cambia tu forma de disfrutar el exterior. Plantas, pavimentos y espacios cómodos transforman un patio olvidado en un lugar acogedor. Descubre un jardín más hermoso, útil y personal.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "Desde valles soleados hasta barrios costeros, creamos exteriores para la vida en el sur de California. Jardines cuidados, pavimentos duraderos y lugares para reunirse, diseñados según tu hogar y tu forma de disfrutar al aire libre."}, "fr": {"Send us a text": "Envoyez-nous un message", "Coming soon": "Bientôt disponible", "A backyard made": "Un jardin conçu", "for getting together.": "pour se retrouver.", "From empty yard": "D’un espace vide", "to everyday escape.": "à votre havre quotidien.", "Your favourite getaway.": "Votre évasion préférée.", "Just outside.": "Juste dehors.", "Make room for": "Faites place", "the slower moments.": "aux instants de calme.", "Let the good evenings": "Que les belles soirées", "last a little longer.": "durent un peu plus.", "Backyard BBQ": "Barbecue au jardin", "& outdoor kitchens": "et cuisines extérieures", "A garden worth": "Un jardin où", "coming home to": "il fait bon rentrer", "Your own": "Votre propre", "poolside retreat": "refuge au bord de l’eau", "Patios for": "Des terrasses pour", "slowing down": "ralentir", "A little magic": "Un peu de magie", "after sunset": "après le coucher du soleil", "A little more outside.": "Un peu plus dehors.", "A lot more living.": "Beaucoup plus de vie.", "Thoughtful landscapes. Beautiful hardscapes.": "Des jardins réfléchis. De beaux aménagements.", "Outdoor spaces that feel like you.": "Des espaces extérieurs à votre image.", "Every detail.": "Chaque détail.", "One complete vision.": "Une vision complète.", "Backyard Retreats": "Refuges au jardin", "Pavers & concrete": "Pavés et béton", "Outdoor Living Spaces": "Espaces de vie extérieurs", "Planting & artificial turf": "Plantations et gazon synthétique", "See the transformation": "Découvrez la transformation", "for yourself.": "par vous-même.", "Before": "Avant", "After": "Après", "Southern California.": "Californie du Sud.", "Outdoor living.": "La vie en plein air.", "Let's create a space": "Créons un espace", "worth coming home to.": "où il fait bon rentrer.", "LET'S DISCUSS": "PARLONS-EN", "WHAT YOU HAVE IN MIND": "DE VOS ENVIES", "& HEAR BACK FROM US": "ET NOUS VOUS RÉPONDRONS", "Your name": "Votre nom", "Email address": "Adresse e-mail", "Phone number": "Téléphone", "Project location": "Lieu du projet", "Your outdoor space": "Votre espace extérieur", "Save enquiry": "Enregistrer la demande", "Full name": "Nom complet", "Your phone number": "Votre numéro de téléphone", "City or ZIP code": "Ville ou code postal", "Tell us a little about your project": "Parlez-nous de votre projet", "Let's talk outside.": "Parlons de votre extérieur.", "Based in": "Basés en", "Southern California": "Californie du Sud", "Our neighbourhoods": "Nos secteurs", "Contact": "Contact", "Email & phone coming soon": "E-mail et téléphone bientôt disponibles", "Santa Clarita Valley": "Vallée de Santa Clarita", "San Fernando Valley": "Vallée de San Fernando", "Conejo Valley": "Vallée de Conejo", "Ventura County": "Comté de Ventura", "Thousand Oaks": "Thousand Oaks", "Enquiries are saved on this device. Online delivery coming soon.": "Les demandes sont enregistrées sur cet appareil. Envoi en ligne bientôt disponible.", "Your enquiry is saved on this device. It has not been sent online.": "Votre demande est enregistrée sur cet appareil. Elle n’a pas été envoyée en ligne.", "Unable to save on this device. Please keep a copy of your enquiry.": "Impossible d’enregistrer. Conservez une copie de votre demande.", "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "Un bel extérieur est plus que la somme de ses éléments. Jardins accueillants, pavages soignés, espaces de convivialité et plantations : nous réunissons chaque détail. Des matériaux, des textures et de la verdure pensés pour votre maison et votre mode de vie.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "Un lieu paisible pour se détendre et se retrouver dehors. Nous associons plantations, pavages et espaces confortables autour de votre maison.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "Des allées d’entrée aux chemins et terrasses, des surfaces bien conçues apportent structure, caractère et praticité.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "Faites place aux repas partagés, aux soirées détendues et aux week-ends entre amis dans un extérieur adapté à votre vie.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "Des plantations variées et un gazon synthétique facile d’entretien apportent douceur, verdure et fraîcheur à votre extérieur.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "Un peu de réflexion transforme votre vie dehors. Le bon équilibre entre plantations, pavages et confort fait d’un jardin oublié un lieu accueillant. Découvrez un extérieur plus beau, plus utile et à votre image.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "Des vallées ensoleillées aux quartiers côtiers, nous créons des extérieurs pour la vie en Californie du Sud. Jardins réfléchis, aménagements durables et lieux de rencontre, conçus pour votre maison et votre plaisir de vivre dehors."}};

Object.assign(pageTranslations["es"],{"Call": "Llamar", "Email": "Correo electrónico"});
Object.assign(pageTranslations["fr"],{"Call": "Appeler", "Email": "E-mail"});
Object.assign(pageTranslations["es"],{"WHERE WE WORK": "DÓNDE TRABAJAMOS", "Landscapes made for you.": "Paisajes hechos para ti.", "SERVICE AREAS": "ZONAS DE SERVICIO"});
Object.assign(pageTranslations["fr"],{"WHERE WE WORK": "OÙ NOUS TRAVAILLONS", "Landscapes made for you.": "Des jardins faits pour vous.", "SERVICE AREAS": "ZONES D’INTERVENTION"});
let selectedLanguage='en';
const originalNodes=new WeakMap(),originalAttributes=new WeakMap();
const englishHeadlines=slides.map(slide=>slide.headline);
function translated(text){return pageTranslations[selectedLanguage]?.[text]??text}
function translatePage(){
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;
 while(node=walker.nextNode()){
  if(node.parentElement.closest('script,style,.nav-brand,.gallery-wordmark,.enquiry-chat,.footer-stacked-brand,.footer-logo,.language-picker,#headline'))continue;
  if(!originalNodes.has(node))originalNodes.set(node,node.textContent);
  const source=originalNodes.get(node),key=source.trim();
  const value=translated(key);
  if(node.textContent!==source.replace(key,value))node.textContent=source.replace(key,value);
 }
 document.querySelectorAll('[placeholder]').forEach(element=>{
  if(element.closest('.enquiry-chat'))return;
  if(!originalAttributes.has(element))originalAttributes.set(element,element.getAttribute('placeholder'));
  element.setAttribute('placeholder',translated(originalAttributes.get(element)));
 });
}
function chooseLanguage(language){
 selectedLanguage=language;
 document.documentElement.lang=language;
 document.documentElement.dataset.language=language;
 slides.forEach((slide,index)=>{slide.headline=englishHeadlines[index].split('<br>').map(translated).join('<br>')});
 renderHeadline(slides[current].headline);
 const areaDescription=document.querySelector('.southern-description');
 areaDescription.textContent=areaDescription.dataset.english;
 translatePage();
 formatAreaDescription();
 document.querySelector('.language-code').textContent=language.toUpperCase();
 document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
 document.querySelector('.geographic-map img').src=language==='en'?'assets/southern-california-illustrated.svg':`assets/map-${language}.svg`;
 try{localStorage.setItem('alfa51-language',language)}catch{}
 closeLanguageMenu();
 if(typeof updateEnquiryLanguage==='function')updateEnquiryLanguage();
}
const languageToggle=document.querySelector('.language-toggle'),languageMenu=document.querySelector('.language-menu');
function closeLanguageMenu(){languageMenu.hidden=true;languageToggle.setAttribute('aria-expanded','false')}
languageToggle.addEventListener('click',()=>{const opening=languageMenu.hidden;languageMenu.hidden=!opening;languageToggle.setAttribute('aria-expanded',String(opening));if(opening)languageMenu.querySelector('[data-language="'+selectedLanguage+'"]').focus()});
languageMenu.addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(button)chooseLanguage(button.dataset.language)});
document.addEventListener('click',event=>{if(!event.target.closest('.language-picker'))closeLanguageMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!languageMenu.hidden){closeLanguageMenu();languageToggle.focus()}});
let translationPending=false;
new MutationObserver(()=>{
 if(translationPending)return;
 translationPending=true;
 queueMicrotask(()=>{translatePage();translationPending=false});
}).observe(document.body,{childList:true,subtree:true,characterData:true});
let savedLanguage='en';try{savedLanguage=localStorage.getItem('alfa51-language')||'en'}catch{}
chooseLanguage(pageTranslations[savedLanguage]?savedLanguage:'en');

const heroControls=document.querySelector('.slide-controls');
function alignHeroStory(){
 const controlsStyle=getComputedStyle(heroControls);
 const bottom=parseFloat(controlsStyle.bottom)||0;
 const gap=matchMedia('(max-width:650px)').matches?28:32;
 document.querySelector('.showcase').style.setProperty('--hero-story-bottom',`${bottom+heroControls.getBoundingClientRect().height+gap}px`);
}
new ResizeObserver(alignHeroStory).observe(heroControls);
addEventListener('resize',alignHeroStory);
document.fonts.ready.then(alignHeroStory);
alignHeroStory();

function fitAreaText(element){
 element.style.fontSize='';
 const base=parseFloat(getComputedStyle(element).fontSize);
 const width=element.clientWidth;
 const widest=Math.max(...[...element.children].map(line=>line.scrollWidth));
 if(widest>width)element.style.fontSize=`${base*(width-2)/widest}px`;
}
function formatAreaDescription(){
 const paragraph=document.querySelector('.southern-description');
 const text=paragraph.textContent.trim(),words=text.split(/\s+/);
 let split=1,best=Infinity;
 for(let i=1;i<words.length;i++){
  const delta=Math.abs(words.slice(0,i).join(' ').length-words.slice(i).join(' ').length);
  if(delta<best){best=delta;split=i}
 }
 paragraph.replaceChildren(...[words.slice(0,split).join(' ')+' ',words.slice(split).join(' ')].map(text=>{const line=document.createElement('span');line.textContent=text;return line}));
 fitAreaText(paragraph);fitAreaText(document.querySelector('#southern-title'));
}
new ResizeObserver(()=>{fitAreaText(document.querySelector('.southern-description'));fitAreaText(document.querySelector('#southern-title'))}).observe(document.querySelector('.southern-intro'));
document.fonts.ready.then(formatAreaDescription);

// Use compositor transforms for reliable mobile Safari photo panning.
const heroImageSizes=new WeakMap();
function measureMobileHero(){
 const hero=document.querySelector('.showcase'),width=hero.clientWidth,height=hero.clientHeight;
 scenes.forEach(scene=>{
  const size=heroImageSizes.get(scene);
  if(size)scene.style.setProperty('--mobile-pan-distance',`${Math.max(0,height*size.width/size.height-width)}px`);
 });
}
scenes.forEach(scene=>{
 const source=scene.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
 if(!source)return;
 const photo=new Image();
 photo.onload=()=>{heroImageSizes.set(scene,{width:photo.naturalWidth,height:photo.naturalHeight});measureMobileHero()};
 photo.src=source;
});
addEventListener('resize',()=>{measureMobileHero();schedule()});

// Guided enquiry with separate phone and email validation.
var enquiryChatState;
const chatCopy={
 en:{clear:'Clear',greeting:'Hi there! What would you like us to create or improve in your backyard?',start:'What would you love to do with your outdoor space?',project:'Tell us what you have in mind…',namePrompt:'Sounds good! What’s your name?',name:'Your name…',phonePrompt:'Thanks! What phone number can we reach you on?',phone:'Your phone number…',emailInstead:'Use email instead',emailPrompt:'Of course! What email address can we reach you at?',email:'Your email address…',optionalPrompt:'Got it! Would you like to add an email address too? This is optional—you can skip and submit.',skip:'Skip & submit',empty:'Please write a little about your project.',invalidName:'Please enter your name.',invalidPhone:'Please enter a valid phone number, including the area code. For international numbers, start with + and the country code.',invalidEmail:'Please enter a valid email address, such as name@example.com.',saveError:'We couldn’t save your enquiry. Please try again.',send:'Send',thanks:'Thank you!',done:'Our representative will get in touch with you.'},
 es:{clear:'Borrar',greeting:'¡Hola! ¿Qué te gustaría crear o mejorar en tu jardín?',start:'¿Qué te gustaría hacer con tu espacio exterior?',project:'Cuéntanos qué tienes en mente…',namePrompt:'¡Suena bien! ¿Cómo te llamas?',name:'Tu nombre…',phonePrompt:'¡Gracias! ¿A qué teléfono podemos llamarte?',phone:'Tu número de teléfono…',emailInstead:'Usar correo electrónico',emailPrompt:'¡Claro! ¿A qué correo podemos escribirte?',email:'Tu correo electrónico…',optionalPrompt:'¡Perfecto! ¿Quieres añadir un correo? Es opcional; puedes omitirlo y enviar.',skip:'Omitir y enviar',empty:'Cuéntanos un poco sobre tu proyecto.',invalidName:'Introduce tu nombre.',invalidPhone:'Introduce un teléfono válido con el código de área. Para números internacionales, incluye + y el código de país.',invalidEmail:'Introduce un correo válido, como nombre@ejemplo.com.',saveError:'No pudimos guardar tu consulta. Inténtalo de nuevo.',send:'Enviar',thanks:'¡Gracias!',done:'Nuestro representante se pondrá en contacto contigo.'},
 fr:{clear:'Effacer',greeting:'Bonjour ! Qu’aimeriez-vous créer ou améliorer dans votre jardin ?',start:'Qu’aimeriez-vous faire de votre espace extérieur ?',project:'Dites-nous ce que vous avez en tête…',namePrompt:'Très bien ! Comment vous appelez-vous ?',name:'Votre nom…',phonePrompt:'Merci ! À quel numéro pouvons-nous vous joindre ?',phone:'Votre numéro de téléphone…',emailInstead:'Utiliser l’e-mail',emailPrompt:'Bien sûr ! À quelle adresse e-mail pouvons-nous vous joindre ?',email:'Votre adresse e-mail…',optionalPrompt:'Merci ! Souhaitez-vous aussi ajouter un e-mail ? C’est facultatif : vous pouvez ignorer cette étape et envoyer.',skip:'Ignorer et envoyer',empty:'Décrivez brièvement votre projet.',invalidName:'Veuillez saisir votre nom.',invalidPhone:'Saisissez un numéro valide avec l’indicatif régional. Pour un numéro international, commencez par + et l’indicatif du pays.',invalidEmail:'Saisissez un e-mail valide, comme nom@exemple.com.',saveError:'Impossible d’enregistrer votre demande. Réessayez.',send:'Envoyer',thanks:'Merci !',done:'Notre représentant vous contactera prochainement.'}
};
function enquiryCopy(){return chatCopy[selectedLanguage]||chatCopy.en}
function updateEnquiryLanguage(){
 if(!enquiryChatState)return;
 const box=document.querySelector('.enquiry-chat'),copy=enquiryCopy(),step=enquiryChatState.step;
 box.querySelectorAll('[data-chat-copy]').forEach(node=>node.textContent=copy[node.dataset.chatCopy]);
 const input=box.querySelector('textarea');
 input.placeholder=copy[step==='optionalEmail'?'email':step]||copy.project;
 input.setAttribute('aria-label',input.placeholder);
 input.inputMode=step==='phone'?'tel':step==='email'||step==='optionalEmail'?'email':'text';
 input.autocomplete=step==='name'?'name':step==='phone'?'tel':step==='email'||step==='optionalEmail'?'email':'off';
 requestAnimationFrame(()=>{input.style.height='auto';input.style.height=Math.min(Math.max(input.scrollHeight,matchMedia('(max-width:650px)').matches?58:42),145)+'px'});
 box.querySelector('.chat-send').setAttribute('aria-label',copy.send);
 box.querySelector('.chat-clear').textContent=copy.clear;
 box.querySelector('.chat-email-instead').textContent=copy.emailInstead;
 box.querySelector('.chat-skip-email').textContent=copy.skip;
 box.querySelector('.chat-options').hidden=!['phone','optionalEmail'].includes(step);
 box.querySelector('.chat-email-instead').hidden=step!=='phone';
 box.querySelector('.chat-skip-email').hidden=step!=='optionalEmail';
 box.querySelector('.chat-complete h3').textContent=copy.thanks;
 box.querySelector('.chat-complete p').textContent=copy.done;
 const error=box.querySelector('.chat-error');if(error.dataset.error)error.textContent=copy[error.dataset.error];
}
const chatBox=document.querySelector('.enquiry-chat'),chatForm=chatBox.querySelector('.chat-composer'),chatInput=chatBox.querySelector('textarea'),chatLog=chatBox.querySelector('.chat-conversation'),chatError=chatBox.querySelector('.chat-error');
function freshEnquiry(){return {step:'project',project:'',name:'',phone:'',email:'',preferredContact:'phone'}}
enquiryChatState=freshEnquiry();
function addChatMessage(text,kind,key){
 const bubble=document.createElement('p');bubble.className='chat-message '+kind;
 if(key)bubble.dataset.chatCopy=key;
 bubble.textContent=text;chatLog.append(bubble);chatLog.scrollTop=chatLog.scrollHeight;
}
function chatValidationError(key){chatError.hidden=false;chatError.dataset.error=key;chatError.textContent=enquiryCopy()[key];chatInput.setAttribute('aria-invalid','true');chatInput.focus({preventScroll:true})}
function clearChatError(){chatError.hidden=true;delete chatError.dataset.error;chatInput.removeAttribute('aria-invalid')}
function isValidPhone(value){
 if(!/^\+?[\d\s().-]+$/.test(value))return false;
 const digits=value.replace(/\D/g,'');
 if(/^(\d)\1+$/.test(digits))return false;
 if(value.trim().startsWith('+')&&!digits.startsWith('1'))return digits.length>=8&&digits.length<=15&&!digits.startsWith('0');
 const national=digits.length===11&&digits.startsWith('1')?digits.slice(1):digits;
 return /^[2-9]\d{2}[2-9]\d{6}$/.test(national);
}
function isValidEmail(value){return /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(value)&&value.length<=254}
function completeEnquiry(){
 try{
  const saved=JSON.parse(localStorage.getItem('alfa51-enquiries')||'[]');
  saved.push({message:enquiryChatState.project,name:enquiryChatState.name,email:enquiryChatState.email,phone:enquiryChatState.phone,preferredContact:enquiryChatState.preferredContact,language:selectedLanguage,createdAt:new Date().toISOString()});
  localStorage.setItem('alfa51-enquiries',JSON.stringify(saved));
 }catch{chatValidationError('saveError');return false}
 chatForm.hidden=true;chatLog.hidden=true;chatError.hidden=true;chatBox.querySelector('.chat-clear').hidden=true;chatBox.querySelector('.chat-options').hidden=true;
 chatBox.querySelector('.chat-complete').hidden=false;enquiryChatState.step='complete';chatInput.value='';return true;
}
function nextChatStep(){chatInput.value='';chatInput.style.height='auto';clearChatError();updateEnquiryLanguage();chatInput.focus();chatLog.scrollTop=chatLog.scrollHeight}
addChatMessage(enquiryCopy().start,'assistant','start');updateEnquiryLanguage();
chatInput.addEventListener('input',()=>{chatInput.style.height='auto';chatInput.style.height=Math.min(chatInput.scrollHeight,145)+'px';clearChatError()});
chatInput.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing&&matchMedia('(pointer:fine)').matches){event.preventDefault();chatForm.requestSubmit()}});
function isGreetingOnly(value){
 const normalized=value.toLocaleLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
 if(!normalized)return false;
 const remainder=normalized.replace(/\b(good morning|good afternoon|good evening|how are you|how are you doing|how s it going|what s up|buenos días|buenas tardes|buenas noches|cómo estás|como estas|qué tal|que tal|comment allez vous|comment ça va|comment ca va|salut|bonjour|bonsoir|coucou|hola|buenas|hello|hiya|howdy|heya|hey|hi|greetings|there|everyone|team|guys|sir|madam)\b/giu,'').trim();
 return !remainder;
}
chatForm.addEventListener('submit',event=>{
 event.preventDefault();const value=chatInput.value.trim(),step=enquiryChatState.step;
 if(!value)return chatValidationError(step==='project'?'empty':step==='name'?'invalidName':step==='phone'?'invalidPhone':'invalidEmail');
 if(step==='name'&&(value.length<2||!/[\p{L}]/u.test(value)))return chatValidationError('invalidName');
 if(step==='phone'&&!isValidPhone(value))return chatValidationError('invalidPhone');
 if((step==='email'||step==='optionalEmail')&&!isValidEmail(value))return chatValidationError('invalidEmail');
 chatBox.closest('.glass-footer').classList.add('chat-started');chatBox.querySelector('.chat-clear').hidden=false;
 chatLog.querySelector('[data-chat-copy="start"]')?.remove();
 if(step==='email'||step==='optionalEmail'){enquiryChatState.email=value;completeEnquiry();return}
 addChatMessage(value,'visitor');
 if(step==='project'){
  if(isGreetingOnly(value)){addChatMessage(enquiryCopy().greeting,'assistant','greeting');nextChatStep();return}
  enquiryChatState.project=value;enquiryChatState.step='name';addChatMessage(enquiryCopy().namePrompt,'assistant','namePrompt');
 }else if(step==='name'){
  enquiryChatState.name=value;enquiryChatState.step='phone';addChatMessage(enquiryCopy().phonePrompt,'assistant','phonePrompt');
 }else if(step==='phone'){
  enquiryChatState.phone=value;enquiryChatState.step='optionalEmail';addChatMessage(enquiryCopy().optionalPrompt,'assistant','optionalPrompt');
 }
 nextChatStep();
});
chatBox.querySelector('.chat-email-instead').addEventListener('click',()=>{
 if(enquiryChatState.step!=='phone')return;
 enquiryChatState.step='email';enquiryChatState.preferredContact='email';
 addChatMessage(enquiryCopy().emailInstead,'visitor','emailInstead');addChatMessage(enquiryCopy().emailPrompt,'assistant','emailPrompt');nextChatStep();
});
chatBox.querySelector('.chat-skip-email').addEventListener('click',()=>{
 if(enquiryChatState.step!=='optionalEmail')return;
 enquiryChatState.email='';completeEnquiry();
});
chatBox.querySelector('.chat-clear').addEventListener('click',()=>{
 const draft=enquiryChatState.project||chatLog.querySelector('.chat-message.visitor')?.textContent||'';
 enquiryChatState=freshEnquiry();chatLog.replaceChildren();addChatMessage(enquiryCopy().start,'assistant','start');
 chatForm.hidden=false;chatLog.hidden=false;clearChatError();chatBox.querySelector('.chat-complete').hidden=true;chatBox.querySelector('.chat-clear').hidden=true;
 chatBox.closest('.glass-footer').classList.remove('chat-started');chatInput.value=draft;
 updateEnquiryLanguage();chatInput.focus();chatInput.setSelectionRange(draft.length,draft.length);
});
