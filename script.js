(()=>{const screen=document.querySelector('.access-screen'),form=screen.querySelector('form'),input=screen.querySelector('input'),error=screen.querySelector('p');form.addEventListener('submit',event=>{event.preventDefault();if(input.value==='9628'){document.documentElement.classList.remove('site-locked');const content=document.getElementById('site-content');if(content){content.removeAttribute('inert');content.style.removeProperty('visibility');}screen.remove();dispatchEvent(new Event('resize'));}else{error.textContent='Incorrect password. Please try again.';input.setAttribute('aria-invalid','true');input.focus({preventScroll:true});input.select();}});input.addEventListener('input',()=>{error.textContent='';input.removeAttribute('aria-invalid');});})();
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
const heroMotionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const heroMobile=matchMedia('(max-width:650px)');
let current=0,paused=heroMotionPreference.matches,heroElapsed=0,heroLastFrame=0,heroFrameId=0;
function schedule(){if(!heroFrameId)heroFrameId=requestAnimationFrame(animateHero)}
function animateHero(now){
 heroFrameId=0;
 const locked=document.documentElement.classList.contains('site-locked');
 if(!document.hidden&&!locked&&!paused){
  if(heroLastFrame)heroElapsed+=Math.min(now-heroLastFrame,100);
  const duration=heroMobile.matches?16000:8000;
  if(heroElapsed>=duration)show((current+1)%slides.length);
  if(heroMobile.matches){
   const scene=scenes[current],distance=parseFloat(scene.style.getPropertyValue('--mobile-pan-distance'))||0;
   scene.style.transform=`translate3d(${-distance*Math.min(heroElapsed/duration,1)}px,0,0)`;
  }
 }
 heroLastFrame=now;schedule();
}
function show(index){
 current=index;heroElapsed=0;heroLastFrame=0;const slide=slides[index];
 scenes.forEach(scene=>scene.style.removeProperty('transform'));
 scenes.forEach((scene,i)=>scene.classList.toggle('active',i===index));
 options.forEach((option,i)=>{option.classList.remove('selected');option.setAttribute('aria-pressed',String(i===index))});
 void options[index].offsetWidth;options[index].classList.add('selected');
 renderHeadline(slide.headline);
 if(matchMedia('(max-width:650px)').matches)document.querySelector('.options').scrollTo({left:options[index].offsetLeft,behavior:paused?'instant':'smooth'});
 schedule();
}
options.forEach((option,i)=>option.addEventListener('click',()=>show(i)));
document.querySelector('.options').addEventListener('keydown',event=>{if(!['ArrowRight','ArrowLeft'].includes(event.key))return;event.preventDefault();show((current+(event.key==='ArrowRight'?1:-1)+slides.length)%slides.length);options[current].focus()});
function resumeHero(){heroLastFrame=0;schedule()}
document.addEventListener('visibilitychange',resumeHero);
addEventListener('pageshow',resumeHero);
addEventListener('focus',resumeHero);
heroMotionPreference.addEventListener('change',event=>{paused=event.matches;resumeHero()});
heroMobile.addEventListener('change',()=>{scenes.forEach(scene=>scene.style.removeProperty('transform'));show(current)});
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
Object.assign(pageTranslations,{"fa": {"Send us a text": "به ما پیام بدهید", "A backyard made": "حیاطی ساخته‌شده", "for getting together.": "برای دورهمی.", "From empty yard": "از حیاط خالی", "to everyday escape.": "تا پناهگاه هر روز.", "Your favourite getaway.": "تفریحگاه محبوب شما.", "Just outside.": "درست بیرون خانه.", "Make room for": "جا باز کنید برای", "the slower moments.": "لحظه‌های آرام‌تر.", "Let the good evenings": "بگذارید عصرهای خوب", "last a little longer.": "کمی بیشتر بمانند.", "Backyard BBQ": "باربیکیو در حیاط", "& outdoor kitchens": "و آشپزخانه‌های فضای باز", "A garden worth": "باغی که ارزش دارد", "coming home to": "به خانه برگردید", "Your own": "خلوتگاه شما", "poolside retreat": "کنار استخر", "Patios for": "پاسیوهایی برای", "slowing down": "آرام گرفتن", "A little magic": "کمی جادو", "after sunset": "پس از غروب", "A little more outside.": "کمی بیشتر در فضای باز.", "A lot more living.": "زندگی بسیار بیشتر.", "Thoughtful landscapes. Beautiful hardscapes.": "محوطه‌سازی سنجیده. سنگ‌فرش زیبا.", "Outdoor spaces that feel like you.": "فضاهای بازی که شبیه شما هستند.", "Every detail.": "هر جزئیات.", "One complete vision.": "یک چشم‌انداز کامل.", "Backyard Retreats": "خلوتگاه‌های حیاط", "Pavers & concrete": "سنگ‌فرش و بتن", "Outdoor Living Spaces": "فضاهای زندگی در هوای آزاد", "Planting & artificial turf": "کاشت و چمن مصنوعی", "See the transformation": "تغییر را ببینید", "for yourself.": "با چشمان خود.", "Before": "قبل", "After": "بعد", "Southern California.": "کالیفرنیای جنوبی.", "Landscapes made for you.": "محوطه‌هایی برای شما.", "Let's create a space": "بیایید فضایی بسازیم", "worth coming home to.": "که بازگشت به آن لذت‌بخش باشد.", "LET'S DISCUSS": "بیایید صحبت کنیم", "WHAT YOU HAVE IN MIND": "درباره آنچه در ذهن دارید", "& HEAR BACK FROM US": "و از ما پاسخ بگیرید", "Let's talk outside.": "درباره فضای باز صحبت کنیم.", "WHERE WE WORK": "محل فعالیت ما", "SERVICE AREAS": "مناطق خدمات"}, "ar": {"Send us a text": "أرسل لنا رسالة", "A backyard made": "فناء مصمم", "for getting together.": "للاجتماع معًا.", "From empty yard": "من فناء فارغ", "to everyday escape.": "إلى ملاذ يومي.", "Your favourite getaway.": "ملاذك المفضل.", "Just outside.": "خارج منزلك مباشرة.", "Make room for": "أفسح المجال", "the slower moments.": "للحظات الهادئة.", "Let the good evenings": "دع الأمسيات الجميلة", "last a little longer.": "تدوم قليلًا أكثر.", "Backyard BBQ": "شواء في الفناء", "& outdoor kitchens": "ومطابخ خارجية", "A garden worth": "حديقة تستحق", "coming home to": "العودة إلى المنزل", "Your own": "ملاذك الخاص", "poolside retreat": "بجانب المسبح", "Patios for": "جلسات خارجية", "slowing down": "للاسترخاء", "A little magic": "قليل من السحر", "after sunset": "بعد الغروب", "A little more outside.": "وقت أكثر في الخارج.", "A lot more living.": "حياة أجمل بكثير.", "Thoughtful landscapes. Beautiful hardscapes.": "حدائق مدروسة. أرضيات جميلة.", "Outdoor spaces that feel like you.": "مساحات خارجية تشبهك.", "Every detail.": "كل تفصيلة.", "One complete vision.": "رؤية متكاملة.", "Backyard Retreats": "ملاذات الفناء الخلفي", "Pavers & concrete": "الرصف والخرسانة", "Outdoor Living Spaces": "مساحات المعيشة الخارجية", "Planting & artificial turf": "الزراعة والعشب الصناعي", "See the transformation": "شاهد التحول", "for yourself.": "بنفسك.", "Before": "قبل", "After": "بعد", "Southern California.": "جنوب كاليفورنيا.", "Landscapes made for you.": "حدائق مصممة لك.", "Let's create a space": "لنصنع مساحة", "worth coming home to.": "تستحق العودة إليها.", "LET'S DISCUSS": "لنتحدث", "WHAT YOU HAVE IN MIND": "عما يدور في بالك", "& HEAR BACK FROM US": "وسنتواصل معك", "Let's talk outside.": "لنتحدث عن مساحتك الخارجية.", "WHERE WE WORK": "أين نعمل", "SERVICE AREAS": "مناطق الخدمة"}, "ru": {"Send us a text": "Напишите нам", "A backyard made": "Двор, созданный", "for getting together.": "для встреч.", "From empty yard": "От пустого двора", "to everyday escape.": "к личному оазису.", "Your favourite getaway.": "Ваш любимый отдых.", "Just outside.": "Прямо у дома.", "Make room for": "Найдите место", "the slower moments.": "для спокойных мгновений.", "Let the good evenings": "Пусть хорошие вечера", "last a little longer.": "длятся чуть дольше.", "Backyard BBQ": "Барбекю во дворе", "& outdoor kitchens": "и летние кухни", "A garden worth": "Сад, в который", "coming home to": "хочется возвращаться", "Your own": "Ваш собственный", "poolside retreat": "отдых у бассейна", "Patios for": "Патио для", "slowing down": "неспешной жизни", "A little magic": "Немного волшебства", "after sunset": "после заката", "A little more outside.": "Чуть больше на воздухе.", "A lot more living.": "Гораздо больше жизни.", "Thoughtful landscapes. Beautiful hardscapes.": "Продуманные сады. Красивое мощение.", "Outdoor spaces that feel like you.": "Открытые пространства в вашем стиле.", "Every detail.": "Каждая деталь.", "One complete vision.": "Единый замысел.", "Backyard Retreats": "Уютные дворы", "Pavers & concrete": "Мощение и бетон", "Outdoor Living Spaces": "Зоны отдыха на воздухе", "Planting & artificial turf": "Посадки и искусственный газон", "See the transformation": "Посмотрите на преображение", "for yourself.": "своими глазами.", "Before": "До", "After": "После", "Southern California.": "Южная Калифорния.", "Landscapes made for you.": "Ландшафт для вас.", "Let's create a space": "Давайте создадим место,", "worth coming home to.": "куда хочется возвращаться.", "LET'S DISCUSS": "ДАВАЙТЕ ОБСУДИМ", "WHAT YOU HAVE IN MIND": "ВАШИ ПОЖЕЛАНИЯ", "& HEAR BACK FROM US": "И МЫ С ВАМИ СВЯЖЕМСЯ", "Let's talk outside.": "Поговорим о вашем дворе.", "WHERE WE WORK": "ГДЕ МЫ РАБОТАЕМ", "SERVICE AREAS": "ТЕРРИТОРИЯ ОБСЛУЖИВАНИЯ"}, "uk": {"Send us a text": "Напишіть нам", "A backyard made": "Подвір’я, створене", "for getting together.": "для зустрічей.", "From empty yard": "Від порожнього двору", "to everyday escape.": "до щоденного затишку.", "Your favourite getaway.": "Ваш улюблений відпочинок.", "Just outside.": "Просто біля дому.", "Make room for": "Знайдіть місце", "the slower moments.": "для спокійних миттєвостей.", "Let the good evenings": "Нехай гарні вечори", "last a little longer.": "тривають трохи довше.", "Backyard BBQ": "Барбекю у дворі", "& outdoor kitchens": "та літні кухні", "A garden worth": "Сад, до якого", "coming home to": "хочеться повертатися", "Your own": "Ваш власний", "poolside retreat": "відпочинок біля басейну", "Patios for": "Патіо для", "slowing down": "неквапливого життя", "A little magic": "Трохи магії", "after sunset": "після заходу сонця", "A little more outside.": "Трохи більше надворі.", "A lot more living.": "Набагато більше життя.", "Thoughtful landscapes. Beautiful hardscapes.": "Продумані сади. Гарне мощення.", "Outdoor spaces that feel like you.": "Відкриті простори у вашому стилі.", "Every detail.": "Кожна деталь.", "One complete vision.": "Єдиний задум.", "Backyard Retreats": "Затишні подвір’я", "Pavers & concrete": "Мощення та бетон", "Outdoor Living Spaces": "Зони відпочинку надворі", "Planting & artificial turf": "Насадження та штучний газон", "See the transformation": "Побачте перетворення", "for yourself.": "на власні очі.", "Before": "До", "After": "Після", "Southern California.": "Південна Каліфорнія.", "Landscapes made for you.": "Ландшафти для вас.", "Let's create a space": "Створімо простір,", "worth coming home to.": "куди хочеться повертатися.", "LET'S DISCUSS": "ОБГОВОРІМО", "WHAT YOU HAVE IN MIND": "ВАШІ ПОБАЖАННЯ", "& HEAR BACK FROM US": "І МИ З ВАМИ ЗВ’ЯЖЕМОСЯ", "Let's talk outside.": "Поговорімо про ваш двір.", "WHERE WE WORK": "ДЕ МИ ПРАЦЮЄМО", "SERVICE AREAS": "ТЕРИТОРІЯ ОБСЛУГОВУВАННЯ"}});
Object.assign(pageTranslations["fa"],{"A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "یک فضای باز زیبا از هماهنگی همه اجزای آن شکل می‌گیرد. باغچه، سنگ‌فرش، محل دورهمی و گیاهان را متناسب با خانه و سبک زندگی شما کنار هم قرار می‌دهیم.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "جایی آرام برای استراحت و دورهمی در هوای آزاد. کاشت، سنگ‌فرش و فضاهای راحت را پیرامون خانه شما هماهنگ می‌کنیم.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "از ورودی خانه تا مسیرهای باغ و پاسیو، سطوحی سنجیده به فضای شما ساختار، شخصیت و کاربرد می‌بخشند.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "برای غذا خوردن با هم، عصرهای آرام و آخر هفته با دوستان، فضای بازی متناسب با سبک زندگی شما بسازید.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "کاشت چندلایه و چمن مصنوعی کم‌نیاز به نگهداری، طراوت و سرسبزی به فضای شما می‌بخشند.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "با ترکیب درست گیاهان، سنگ‌فرش و نشیمن راحت، حیاط فراموش‌شده را به مکانی دلپذیر تبدیل کنید. امکان‌های باغی زیباتر و کاربردی‌تر را کشف کنید.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "از دره‌های آفتابی تا محله‌های ساحلی، محوطه‌های زیبا و بادوام برای زندگی در کالیفرنیای جنوبی می‌سازیم؛ متناسب با خانه و شیوه لذت بردن شما از فضای باز."});
Object.assign(pageTranslations["ar"],{"A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "جمال المساحة الخارجية يأتي من تناغم جميع عناصرها. نجمع الحدائق والرصف ومناطق الجلوس والنباتات بما يناسب منزلك وأسلوب حياتك.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "مكان هادئ للاسترخاء والاجتماع في الهواء الطلق. ننسق النباتات والرصف والمساحات المريحة حول منزلك.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "من مداخل المنازل إلى ممرات الحدائق والجلسات، تضيف الأسطح المدروسة طابعًا وبنية وعملية لمساحتك.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "أفسح المجال للوجبات المشتركة والأمسيات الهادئة وعطلات نهاية الأسبوع مع الأصدقاء، في مساحات تناسب حياتك.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "تمنح النباتات المتنوعة والعشب الصناعي سهل العناية نعومة وخضرة وانتعاشًا لمساحتك الخارجية.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "حوّل فناءً مهملًا إلى مكان ترحيبي بالنباتات والرصف والجلسات المريحة. اكتشف حديقة أجمل وأكثر فائدة وتعبيرًا عنك.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "من الوديان المشمسة إلى الأحياء الساحلية، نصمم حدائق وأرضيات متينة وأماكن للاجتماع تناسب منزلك والحياة في جنوب كاليفورنيا."});
Object.assign(pageTranslations["ru"],{"A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "Красивый двор — это гармония всех деталей. Мы объединяем сад, мощение, места для встреч и растения, подбирая материалы и фактуры под ваш дом и образ жизни.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "Тихое место для отдыха и встреч на воздухе. Мы объединяем растения, мощение и комфортные зоны вокруг вашего дома.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "От въезда к дому до садовых дорожек и патио — продуманное мощение добавляет характер, структуру и практичность.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "Создайте место для общих ужинов, спокойных вечеров и выходных с друзьями — с учётом вашего образа жизни.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "Многоуровневые посадки и простой в уходе искусственный газон делают двор зелёным, мягким и свежим.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "Правильное сочетание растений, мощения и удобных зон отдыха превращает забытый двор в уютное место. Откройте возможности более красивого и полезного сада.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "От солнечных долин до прибрежных районов мы создаём сады, долговечное мощение и места для встреч, подходящие вашему дому и жизни в Южной Калифорнии."});
Object.assign(pageTranslations["uk"],{"A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "Гарне подвір’я — це гармонія всіх деталей. Ми поєднуємо сад, мощення, місця для зустрічей і рослини, добираючи матеріали та фактури під ваш дім і спосіб життя.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "Тихе місце для відпочинку й зустрічей надворі. Ми поєднуємо рослини, мощення та зручні зони навколо вашого дому.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "Від в’їзду до будинку до садових доріжок і патіо — продумане мощення додає характеру, структури й практичності.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "Створіть місце для спільних обідів, спокійних вечорів і вихідних із друзями відповідно до вашого способу життя.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "Багаторівневі насадження та простий у догляді штучний газон додають зелені, м’якості й свіжості.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "Правильне поєднання рослин, мощення та зручних зон відпочинку перетворює занедбаний двір на затишне місце. Відкрийте можливості гарнішого й кориснішого саду.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "Від сонячних долин до прибережних районів ми створюємо сади, довговічне мощення та місця для зустрічей, що пасують вашому дому й життю в Південній Каліфорнії."});
let selectedLanguage='en';
const originalNodes=new WeakMap(),originalAttributes=new WeakMap();
const englishHeadlines=slides.map(slide=>slide.headline);
function translated(text){return pageTranslations[selectedLanguage]?.[text]??text}
function translatePage(){
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;
 while(node=walker.nextNode()){
  if(node.parentElement.closest('script,style,.nav-brand,.gallery-wordmark,.enquiry-chat,.footer-stacked-brand,.footer-logo,.language-picker,.access-screen,#headline'))continue;
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
 document.documentElement.dir=['fa','ar'].includes(language)?'rtl':'ltr';
 document.documentElement.dataset.language=language;
 slides.forEach((slide,index)=>{slide.headline=englishHeadlines[index].split('<br>').map(translated).join('<br>')});
 renderHeadline(slides[current].headline);
 const areaDescription=document.querySelector('.southern-description');
 areaDescription.textContent=areaDescription.dataset.english;
 translatePage();
 formatAreaDescription();
 document.querySelector('.language-code').textContent=language.toUpperCase();
 document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
 document.querySelector('.geographic-map img').src=['es','fr','fa','ar','ru','uk'].includes(language)?`assets/map-${language}.svg`:'assets/southern-california-illustrated.svg';
 try{localStorage.setItem('alfa51-language',language)}catch{}
 closeLanguageMenu();
 if(typeof updateEnquiryLanguage==='function')updateEnquiryLanguage();
 if(projectIdeas)renderProjectIdeas();
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
addEventListener('resize',measureMobileHero);
new ResizeObserver(measureMobileHero).observe(document.querySelector('.showcase'));
measureMobileHero();

// Guided enquiry with separate phone and email validation.
var enquiryChatState;
const chatCopy={
 en:{clear:'Clear',greeting:'Hi there! What would you like us to create or improve in your backyard?',start:'What would you love to do with your outdoor space?',project:'Tell us what you have in mind…',namePrompt:'Sounds good! What’s your name?',name:'Your name…',phonePrompt:'Thanks! What phone number can we reach you on?',phone:'Your phone number…',emailInstead:'Use email instead',emailPrompt:'Of course! What email address can we reach you at?',email:'Your email address…',optionalPrompt:'Got it! Would you like to add an email address too? This is optional—you can skip and submit.',skip:'Skip & submit',empty:'Please write a little about your project.',invalidName:'Please enter your name.',invalidPhone:'Please enter a valid phone number, including the area code. For international numbers, start with + and the country code.',invalidEmail:'Please enter a valid email address, such as name@example.com.',saveError:'We couldn’t save your enquiry. Please try again.',send:'Send',thanks:'Thank you!',done:'Our representative will get in touch with you.'},
 es:{clear:'Borrar',greeting:'¡Hola! ¿Qué te gustaría crear o mejorar en tu jardín?',start:'¿Qué te gustaría hacer con tu espacio exterior?',project:'Cuéntanos qué tienes en mente…',namePrompt:'¡Suena bien! ¿Cómo te llamas?',name:'Tu nombre…',phonePrompt:'¡Gracias! ¿A qué teléfono podemos llamarte?',phone:'Tu número de teléfono…',emailInstead:'Usar correo electrónico',emailPrompt:'¡Claro! ¿A qué correo podemos escribirte?',email:'Tu correo electrónico…',optionalPrompt:'¡Perfecto! ¿Quieres añadir un correo? Es opcional; puedes omitirlo y enviar.',skip:'Omitir y enviar',empty:'Cuéntanos un poco sobre tu proyecto.',invalidName:'Introduce tu nombre.',invalidPhone:'Introduce un teléfono válido con el código de área. Para números internacionales, incluye + y el código de país.',invalidEmail:'Introduce un correo válido, como nombre@ejemplo.com.',saveError:'No pudimos guardar tu consulta. Inténtalo de nuevo.',send:'Enviar',thanks:'¡Gracias!',done:'Nuestro representante se pondrá en contacto contigo.'},
 fr:{clear:'Effacer',greeting:'Bonjour ! Qu’aimeriez-vous créer ou améliorer dans votre jardin ?',start:'Qu’aimeriez-vous faire de votre espace extérieur ?',project:'Dites-nous ce que vous avez en tête…',namePrompt:'Très bien ! Comment vous appelez-vous ?',name:'Votre nom…',phonePrompt:'Merci ! À quel numéro pouvons-nous vous joindre ?',phone:'Votre numéro de téléphone…',emailInstead:'Utiliser l’e-mail',emailPrompt:'Bien sûr ! À quelle adresse e-mail pouvons-nous vous joindre ?',email:'Votre adresse e-mail…',optionalPrompt:'Merci ! Souhaitez-vous aussi ajouter un e-mail ? C’est facultatif : vous pouvez ignorer cette étape et envoyer.',skip:'Ignorer et envoyer',empty:'Décrivez brièvement votre projet.',invalidName:'Veuillez saisir votre nom.',invalidPhone:'Saisissez un numéro valide avec l’indicatif régional. Pour un numéro international, commencez par + et l’indicatif du pays.',invalidEmail:'Saisissez un e-mail valide, comme nom@exemple.com.',saveError:'Impossible d’enregistrer votre demande. Réessayez.',send:'Envoyer',thanks:'Merci !',done:'Notre représentant vous contactera prochainement.'}
};
Object.assign(chatCopy,{"fa": {"clear": "پاک کردن", "greeting": "سلام! دوست دارید در حیاط خود چه چیزی بسازیم یا بهتر کنیم؟", "start": "دوست دارید با فضای باز خود چه کنید؟", "project": "ایده خود را بنویسید…", "namePrompt": "عالی است! نام شما چیست؟", "name": "نام شما…", "phonePrompt": "ممنون! با چه شماره‌ای تماس بگیریم؟", "phone": "شماره تلفن شما…", "emailInstead": "به‌جای آن ایمیل", "emailPrompt": "البته! نشانی ایمیل شما چیست؟", "email": "نشانی ایمیل شما…", "optionalPrompt": "مایلید ایمیل هم اضافه کنید؟ اختیاری است؛ می‌توانید رد کنید و ارسال کنید.", "skip": "رد کردن و ارسال", "empty": "لطفاً کمی درباره پروژه بنویسید.", "invalidName": "لطفاً نام خود را وارد کنید.", "invalidPhone": "شماره معتبر با کد منطقه وارد کنید. برای شماره بین‌المللی از + و کد کشور استفاده کنید.", "invalidEmail": "ایمیل معتبر مانند name@example.com وارد کنید.", "saveError": "ذخیره نشد. دوباره تلاش کنید.", "send": "ارسال", "thanks": "متشکریم!", "done": "نماینده ما با شما تماس خواهد گرفت."}, "ar": {"clear": "مسح", "greeting": "مرحبًا! ماذا ترغب في إنشائه أو تحسينه في فنائك؟", "start": "ماذا تحب أن تفعل بمساحتك الخارجية؟", "project": "أخبرنا بما يدور في بالك…", "namePrompt": "رائع! ما اسمك؟", "name": "اسمك…", "phonePrompt": "شكرًا! على أي رقم يمكننا التواصل معك؟", "phone": "رقم هاتفك…", "emailInstead": "استخدام البريد بدلًا من ذلك", "emailPrompt": "بالطبع! ما عنوان بريدك الإلكتروني؟", "email": "بريدك الإلكتروني…", "optionalPrompt": "هل ترغب بإضافة بريد إلكتروني؟ هذا اختياري، يمكنك التخطي والإرسال.", "skip": "تخطي وإرسال", "empty": "يرجى كتابة نبذة عن مشروعك.", "invalidName": "يرجى إدخال اسمك.", "invalidPhone": "أدخل رقمًا صحيحًا مع رمز المنطقة. للأرقام الدولية ابدأ بعلامة + ورمز البلد.", "invalidEmail": "أدخل بريدًا صحيحًا مثل name@example.com.", "saveError": "تعذر الحفظ. حاول مرة أخرى.", "send": "إرسال", "thanks": "شكرًا لك!", "done": "سيتواصل معك أحد ممثلينا."}, "ru": {"clear": "Очистить", "greeting": "Здравствуйте! Что вы хотите создать или улучшить в своём дворе?", "start": "Что вы хотите сделать с вашим двором?", "project": "Расскажите о вашей идее…", "namePrompt": "Отлично! Как вас зовут?", "name": "Ваше имя…", "phonePrompt": "Спасибо! По какому номеру с вами связаться?", "phone": "Ваш телефон…", "emailInstead": "Связаться по электронной почте", "emailPrompt": "Конечно! Какой у вас адрес электронной почты?", "email": "Ваш e-mail…", "optionalPrompt": "Добавить электронную почту? Это необязательно: можно пропустить и отправить.", "skip": "Пропустить и отправить", "empty": "Расскажите немного о проекте.", "invalidName": "Укажите ваше имя.", "invalidPhone": "Введите правильный телефон с кодом региона. Международный номер начинайте с + и кода страны.", "invalidEmail": "Введите правильный e-mail, например name@example.com.", "saveError": "Не удалось сохранить. Попробуйте ещё раз.", "send": "Отправить", "thanks": "Спасибо!", "done": "Наш представитель свяжется с вами."}, "uk": {"clear": "Очистити", "greeting": "Вітаємо! Що ви хочете створити або покращити у своєму дворі?", "start": "Що ви хочете зробити зі своїм подвір’ям?", "project": "Розкажіть про вашу ідею…", "namePrompt": "Чудово! Як вас звати?", "name": "Ваше ім’я…", "phonePrompt": "Дякуємо! За яким номером з вами зв’язатися?", "phone": "Ваш телефон…", "emailInstead": "Зв’язатися електронною поштою", "emailPrompt": "Звісно! Яка ваша електронна адреса?", "email": "Ваша електронна адреса…", "optionalPrompt": "Додати електронну пошту? Це необов’язково: можна пропустити й надіслати.", "skip": "Пропустити й надіслати", "empty": "Розкажіть трохи про проєкт.", "invalidName": "Вкажіть ваше ім’я.", "invalidPhone": "Введіть правильний телефон із кодом регіону. Міжнародний номер починайте з + та коду країни.", "invalidEmail": "Введіть правильну адресу, наприклад name@example.com.", "saveError": "Не вдалося зберегти. Спробуйте ще раз.", "send": "Надіслати", "thanks": "Дякуємо!", "done": "Наш представник зв’яжеться з вами."}});
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

var projectIdeas={en:['Create a backyard BBQ area','Redesign my garden','Add pavers and a patio','Make a family-friendly backyard'],es:['Crear una zona de barbacoa','Rediseñar mi jardín','Añadir adoquines y un patio','Un jardín para toda la familia'],fr:['Créer un espace barbecue','Réaménager mon jardin','Ajouter des pavés et une terrasse','Un jardin pour toute la famille'],fa:['ساخت فضای باربیکیو','طراحی دوباره باغ','سنگ‌فرش و پاسیو','حیاط مناسب خانواده'],ar:['إنشاء منطقة للشواء','إعادة تصميم حديقتي','إضافة رصف وجلسة خارجية','فناء مناسب للعائلة'],ru:['Зона барбекю во дворе','Обновить мой сад','Добавить мощение и патио','Уютный двор для семьи'],uk:['Зона барбекю у дворі','Оновити мій сад','Додати мощення й патіо','Затишний двір для родини']};
function renderProjectIdeas(){const box=document.querySelector('.chat-suggestions');box.replaceChildren(...(projectIdeas[selectedLanguage]||projectIdeas.en).map((text,index)=>{const button=document.createElement('button');button.type='button';const icon=document.createElement('span');icon.className='suggestion-icon';icon.setAttribute('aria-hidden','true');icon.textContent=['♨','❀','▦','⌂'][index];const label=document.createElement('span');label.textContent=text;button.append(icon,label);button.addEventListener('click',()=>{chatInput.value=text;chatInput.dispatchEvent(new Event('input'));chatInput.focus({preventScroll:true});});return button;}));}
renderProjectIdeas();

// A quiet dashed indicator; native touch and wheel scrolling stay on the log.
const chatScrollRail=document.createElement('div');
chatScrollRail.className='chat-scroll-rail';chatScrollRail.setAttribute('aria-hidden','true');
const chatScrollThumb=document.createElement('div');chatScrollThumb.className='chat-scroll-thumb';
chatScrollRail.append(chatScrollThumb);chatBox.append(chatScrollRail);
function updateChatScrollIndicator(){
 const visible=chatLog.clientHeight,total=chatLog.scrollHeight,overflow=total-visible;
 chatScrollRail.hidden=overflow<2||chatLog.hidden||!chatBox.closest('.chat-started');
 if(chatScrollRail.hidden)return;
 chatScrollRail.style.top=chatLog.offsetTop+'px';chatScrollRail.style.height=visible+'px';
 const thumbHeight=Math.min(visible,Math.max(30,visible*visible/total));
 chatScrollThumb.style.height=thumbHeight+'px';
 chatScrollThumb.style.transform=`translateY(${(visible-thumbHeight)*chatLog.scrollTop/overflow}px)`;
}
chatLog.addEventListener('scroll',updateChatScrollIndicator,{passive:true});
new ResizeObserver(updateChatScrollIndicator).observe(chatLog);
new MutationObserver(()=>requestAnimationFrame(updateChatScrollIndicator)).observe(chatBox,{childList:true,subtree:true});
updateChatScrollIndicator();
