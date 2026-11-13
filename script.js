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
function schedule(){clearInterval(timer);if(!paused&&!document.hidden)timer=setInterval(()=>show((current+1)%slides.length),8000)}
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

const enquiryForm=document.querySelector('.contact-form');
enquiryForm?.addEventListener('submit',event=>{
 event.preventDefault();
 const status=enquiryForm.querySelector('.form-status');
 status.hidden=false;
 try{
  const enquiries=JSON.parse(localStorage.getItem('alfa51-enquiries')||'[]');
  enquiries.push({...Object.fromEntries(new FormData(enquiryForm)),createdAt:new Date().toISOString()});
  localStorage.setItem('alfa51-enquiries',JSON.stringify(enquiries));
  status.textContent=translated("Your enquiry is saved on this device. It has not been sent online.");
  enquiryForm.reset();
 }catch(error){status.textContent=translated("Unable to save on this device. Please keep a copy of your enquiry.");}
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

const pageTranslations={"en": {"Send us a text": "Send us a text", "Coming soon": "Coming soon", "A backyard made": "A backyard made", "for getting together.": "for getting together.", "From empty yard": "From empty yard", "to everyday escape.": "to everyday escape.", "Your favourite getaway.": "Your favourite getaway.", "Just outside.": "Just outside.", "Make room for": "Make room for", "the slower moments.": "the slower moments.", "Let the good evenings": "Let the good evenings", "last a little longer.": "last a little longer.", "Backyard BBQ": "Backyard BBQ", "& outdoor kitchens": "& outdoor kitchens", "A garden worth": "A garden worth", "coming home to": "coming home to", "Your own": "Your own", "poolside retreat": "poolside retreat", "Patios for": "Patios for", "slowing down": "slowing down", "A little magic": "A little magic", "after sunset": "after sunset", "A little more outside.": "A little more outside.", "A lot more living.": "A lot more living.", "Thoughtful landscapes. Beautiful hardscapes.": "Thoughtful landscapes. Beautiful hardscapes.", "Outdoor spaces that feel like you.": "Outdoor spaces that feel like you.", "Every detail.": "Every detail.", "One complete vision.": "One complete vision.", "Backyard Retreats": "Backyard Retreats", "Pavers & concrete": "Pavers & concrete", "Outdoor Living Spaces": "Outdoor Living Spaces", "Planting & artificial turf": "Planting & artificial turf", "See the transformation": "See the transformation", "for yourself.": "for yourself.", "Before": "Before", "After": "After", "Southern California.": "Southern California.", "Outdoor living.": "Outdoor living.", "Let's create a space": "Let's create a space", "worth coming home to.": "worth coming home to.", "LET'S DISCUSS": "LET'S DISCUSS", "WHAT YOU HAVE IN MIND": "WHAT YOU HAVE IN MIND", "& HEAR BACK FROM US": "& HEAR BACK FROM US", "Your name": "Your name", "Email address": "Email address", "Phone number": "Phone number", "Project location": "Project location", "Your outdoor space": "Your outdoor space", "Save enquiry": "Save enquiry", "Full name": "Full name", "Your phone number": "Your phone number", "City or ZIP code": "City or ZIP code", "Tell us a little about your project": "Tell us a little about your project", "Let's talk outside.": "Let's talk outside.", "Based in": "Based in", "Southern California": "Southern California", "Our neighbourhoods": "Our neighbourhoods", "Contact": "Contact", "Email & phone coming soon": "Email & phone coming soon", "Santa Clarita Valley": "Santa Clarita Valley", "San Fernando Valley": "San Fernando Valley", "Conejo Valley": "Conejo Valley", "Ventura County": "Ventura County", "Thousand Oaks": "Thousand Oaks", "Enquiries are saved on this device. Online delivery coming soon.": "Enquiries are saved on this device. Online delivery coming soon.", "Your enquiry is saved on this device. It has not been sent online.": "Your enquiry is saved on this device. It has not been sent online.", "Unable to save on this device. Please keep a copy of your enquiry.": "Unable to save on this device. Please keep a copy of your enquiry.", "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside."}, "es": {"Send us a text": "Envíanos un mensaje", "Coming soon": "Próximamente", "A backyard made": "Un jardín pensado", "for getting together.": "para reunirse.", "From empty yard": "De un patio vacío", "to everyday escape.": "a tu refugio diario.", "Your favourite getaway.": "Tu escapada favorita.", "Just outside.": "Justo al salir.", "Make room for": "Haz espacio para", "the slower moments.": "los momentos de calma.", "Let the good evenings": "Que las buenas tardes", "last a little longer.": "duren un poco más.", "Backyard BBQ": "Barbacoa en el jardín", "& outdoor kitchens": "y cocinas exteriores", "A garden worth": "Un jardín al que", "coming home to": "siempre quieres volver", "Your own": "Tu propio", "poolside retreat": "refugio junto a la piscina", "Patios for": "Patios para", "slowing down": "tomárselo con calma", "A little magic": "Un poco de magia", "after sunset": "al atardecer", "A little more outside.": "Un poco más al aire libre.", "A lot more living.": "Mucho más para vivir.", "Thoughtful landscapes. Beautiful hardscapes.": "Paisajes con intención. Espacios bien construidos.", "Outdoor spaces that feel like you.": "Espacios exteriores que hablan de ti.", "Every detail.": "Cada detalle.", "One complete vision.": "Una visión completa.", "Backyard Retreats": "Refugios en el jardín", "Pavers & concrete": "Adoquines y hormigón", "Outdoor Living Spaces": "Espacios para vivir al aire libre", "Planting & artificial turf": "Plantación y césped artificial", "See the transformation": "Descubre la transformación", "for yourself.": "por ti mismo.", "Before": "Antes", "After": "Después", "Southern California.": "Sur de California.", "Outdoor living.": "Vida al aire libre.", "Let's create a space": "Creemos un espacio", "worth coming home to.": "al que quieras volver.", "LET'S DISCUSS": "HABLEMOS", "WHAT YOU HAVE IN MIND": "DE LO QUE IMAGINAS", "& HEAR BACK FROM US": "Y TE RESPONDEREMOS", "Your name": "Tu nombre", "Email address": "Correo electrónico", "Phone number": "Teléfono", "Project location": "Ubicación del proyecto", "Your outdoor space": "Tu espacio exterior", "Save enquiry": "Guardar consulta", "Full name": "Nombre completo", "Your phone number": "Tu teléfono", "City or ZIP code": "Ciudad o código postal", "Tell us a little about your project": "Cuéntanos sobre tu proyecto", "Let's talk outside.": "Hablemos de tu jardín.", "Based in": "Nuestra base", "Southern California": "Sur de California", "Our neighbourhoods": "Nuestras zonas", "Contact": "Contacto", "Email & phone coming soon": "Correo y teléfono próximamente", "Santa Clarita Valley": "Valle de Santa Clarita", "San Fernando Valley": "Valle de San Fernando", "Conejo Valley": "Valle de Conejo", "Ventura County": "Condado de Ventura", "Thousand Oaks": "Thousand Oaks", "Enquiries are saved on this device. Online delivery coming soon.": "Las consultas se guardan en este dispositivo. Envío en línea próximamente.", "Your enquiry is saved on this device. It has not been sent online.": "Tu consulta se guardó en este dispositivo. No se ha enviado en línea.", "Unable to save on this device. Please keep a copy of your enquiry.": "No se pudo guardar. Conserva una copia de tu consulta.", "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "Un espacio exterior hermoso es más que la suma de sus partes. Desde jardines acogedores y pavimentos cuidados hasta zonas de reunión y plantaciones, unimos cada elemento. Diseñamos según tu estilo de vida, con materiales, texturas y vegetación que encajan de forma natural en tu hogar.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "Un lugar tranquilo para relajarse y reunirse al aire libre. Combinamos plantas, pavimentos y espacios cómodos alrededor de tu hogar.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "Desde entradas acogedoras hasta senderos y patios, las superficies bien diseñadas aportan estructura, carácter y funcionalidad.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "Haz espacio para comidas compartidas, tardes tranquilas y fines de semana con amigos, con exteriores diseñados para tu estilo de vida.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "Las plantas en capas y el césped artificial de fácil cuidado aportan frescura y vegetación a tu espacio exterior.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "Un poco de planificación cambia tu forma de disfrutar el exterior. Plantas, pavimentos y espacios cómodos transforman un patio olvidado en un lugar acogedor. Descubre un jardín más hermoso, útil y personal.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "Desde valles soleados hasta barrios costeros, creamos exteriores para la vida en el sur de California. Jardines cuidados, pavimentos duraderos y lugares para reunirse, diseñados según tu hogar y tu forma de disfrutar al aire libre."}, "fr": {"Send us a text": "Envoyez-nous un message", "Coming soon": "Bientôt disponible", "A backyard made": "Un jardin conçu", "for getting together.": "pour se retrouver.", "From empty yard": "D’un espace vide", "to everyday escape.": "à votre havre quotidien.", "Your favourite getaway.": "Votre évasion préférée.", "Just outside.": "Juste dehors.", "Make room for": "Faites place", "the slower moments.": "aux instants de calme.", "Let the good evenings": "Que les belles soirées", "last a little longer.": "durent un peu plus.", "Backyard BBQ": "Barbecue au jardin", "& outdoor kitchens": "et cuisines extérieures", "A garden worth": "Un jardin où", "coming home to": "il fait bon rentrer", "Your own": "Votre propre", "poolside retreat": "refuge au bord de l’eau", "Patios for": "Des terrasses pour", "slowing down": "ralentir", "A little magic": "Un peu de magie", "after sunset": "après le coucher du soleil", "A little more outside.": "Un peu plus dehors.", "A lot more living.": "Beaucoup plus de vie.", "Thoughtful landscapes. Beautiful hardscapes.": "Des jardins réfléchis. De beaux aménagements.", "Outdoor spaces that feel like you.": "Des espaces extérieurs à votre image.", "Every detail.": "Chaque détail.", "One complete vision.": "Une vision complète.", "Backyard Retreats": "Refuges au jardin", "Pavers & concrete": "Pavés et béton", "Outdoor Living Spaces": "Espaces de vie extérieurs", "Planting & artificial turf": "Plantations et gazon synthétique", "See the transformation": "Découvrez la transformation", "for yourself.": "par vous-même.", "Before": "Avant", "After": "Après", "Southern California.": "Californie du Sud.", "Outdoor living.": "La vie en plein air.", "Let's create a space": "Créons un espace", "worth coming home to.": "où il fait bon rentrer.", "LET'S DISCUSS": "PARLONS-EN", "WHAT YOU HAVE IN MIND": "DE VOS ENVIES", "& HEAR BACK FROM US": "ET NOUS VOUS RÉPONDRONS", "Your name": "Votre nom", "Email address": "Adresse e-mail", "Phone number": "Téléphone", "Project location": "Lieu du projet", "Your outdoor space": "Votre espace extérieur", "Save enquiry": "Enregistrer la demande", "Full name": "Nom complet", "Your phone number": "Votre numéro de téléphone", "City or ZIP code": "Ville ou code postal", "Tell us a little about your project": "Parlez-nous de votre projet", "Let's talk outside.": "Parlons de votre extérieur.", "Based in": "Basés en", "Southern California": "Californie du Sud", "Our neighbourhoods": "Nos secteurs", "Contact": "Contact", "Email & phone coming soon": "E-mail et téléphone bientôt disponibles", "Santa Clarita Valley": "Vallée de Santa Clarita", "San Fernando Valley": "Vallée de San Fernando", "Conejo Valley": "Vallée de Conejo", "Ventura County": "Comté de Ventura", "Thousand Oaks": "Thousand Oaks", "Enquiries are saved on this device. Online delivery coming soon.": "Les demandes sont enregistrées sur cet appareil. Envoi en ligne bientôt disponible.", "Your enquiry is saved on this device. It has not been sent online.": "Votre demande est enregistrée sur cet appareil. Elle n’a pas été envoyée en ligne.", "Unable to save on this device. Please keep a copy of your enquiry.": "Impossible d’enregistrer. Conservez une copie de votre demande.", "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "Un bel extérieur est plus que la somme de ses éléments. Jardins accueillants, pavages soignés, espaces de convivialité et plantations : nous réunissons chaque détail. Des matériaux, des textures et de la verdure pensés pour votre maison et votre mode de vie.", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "Un lieu paisible pour se détendre et se retrouver dehors. Nous associons plantations, pavages et espaces confortables autour de votre maison.", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "Des allées d’entrée aux chemins et terrasses, des surfaces bien conçues apportent structure, caractère et praticité.", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "Faites place aux repas partagés, aux soirées détendues et aux week-ends entre amis dans un extérieur adapté à votre vie.", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "Des plantations variées et un gazon synthétique facile d’entretien apportent douceur, verdure et fraîcheur à votre extérieur.", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "Un peu de réflexion transforme votre vie dehors. Le bon équilibre entre plantations, pavages et confort fait d’un jardin oublié un lieu accueillant. Découvrez un extérieur plus beau, plus utile et à votre image.", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "Des vallées ensoleillées aux quartiers côtiers, nous créons des extérieurs pour la vie en Californie du Sud. Jardins réfléchis, aménagements durables et lieux de rencontre, conçus pour votre maison et votre plaisir de vivre dehors."}, "hi": {"Send us a text": "हमें मैसेज करें", "Coming soon": "जल्द आ रहा है", "A backyard made": "एक ऐसा आँगन", "for getting together.": "जहाँ सब साथ आएँ।", "From empty yard": "खाली आँगन से", "to everyday escape.": "रोज़ के सुकून तक।", "Your favourite getaway.": "आपकी पसंदीदा सुकून की जगह।", "Just outside.": "बस घर के बाहर।", "Make room for": "जगह बनाएँ", "the slower moments.": "फ़ुर्सत के पलों के लिए।", "Let the good evenings": "खुशगवार शामों को", "last a little longer.": "थोड़ा और जी लें।", "Backyard BBQ": "आँगन में बारबेक्यू", "& outdoor kitchens": "और आउटडोर किचन", "A garden worth": "एक ऐसा बगीचा", "coming home to": "लौटने का मन करे", "Your own": "आपका अपना", "poolside retreat": "पूल के किनारे सुकून", "Patios for": "ऐसे आँगन", "slowing down": "जहाँ सुकून मिले", "A little magic": "थोड़ा सा जादू", "after sunset": "सूरज ढलने के बाद", "A little more outside.": "थोड़ा और बाहर।", "A lot more living.": "बहुत ज़्यादा ज़िंदगी।", "Thoughtful landscapes. Beautiful hardscapes.": "सोच-समझकर बने बगीचे। खूबसूरत पत्थर के काम।", "Outdoor spaces that feel like you.": "बाहर की जगह, आपके अंदाज़ में।", "Every detail.": "हर बारीकी।", "One complete vision.": "एक पूरी सोच।", "Backyard Retreats": "आँगन में सुकून", "Pavers & concrete": "पेवर और कंक्रीट", "Outdoor Living Spaces": "बाहर जीने की जगहें", "Planting & artificial turf": "पौधे और आर्टिफिशियल घास", "See the transformation": "बदलाव देखें", "for yourself.": "अपनी आँखों से।", "Before": "पहले", "After": "बाद में", "Southern California.": "दक्षिणी कैलिफ़ोर्निया।", "Outdoor living.": "बाहर की ज़िंदगी।", "Let's create a space": "आइए ऐसी जगह बनाएँ", "worth coming home to.": "जहाँ लौटने का मन करे।", "LET'S DISCUSS": "आइए बात करें", "WHAT YOU HAVE IN MIND": "आपकी सोच के बारे में", "& HEAR BACK FROM US": "और हम आपसे संपर्क करेंगे", "Your name": "आपका नाम", "Email address": "ईमेल पता", "Phone number": "फ़ोन नंबर", "Project location": "प्रोजेक्ट की जगह", "Your outdoor space": "आपकी बाहरी जगह", "Save enquiry": "पूछताछ सेव करें", "Full name": "पूरा नाम", "Your phone number": "आपका फ़ोन नंबर", "City or ZIP code": "शहर या ज़िप कोड", "Tell us a little about your project": "अपने प्रोजेक्ट के बारे में बताएँ", "Let's talk outside.": "बाहर की जगह की बात करें।", "Based in": "हमारा क्षेत्र", "Southern California": "दक्षिणी कैलिफ़ोर्निया", "Our neighbourhoods": "हमारे इलाके", "Contact": "संपर्क", "Email & phone coming soon": "ईमेल और फ़ोन जल्द उपलब्ध होंगे", "Santa Clarita Valley": "सांता क्लैरिटा वैली", "San Fernando Valley": "सैन फ़र्नांडो वैली", "Conejo Valley": "कोनेहो वैली", "Ventura County": "वेंचुरा काउंटी", "Thousand Oaks": "थाउज़ेंड ओक्स", "Enquiries are saved on this device. Online delivery coming soon.": "पूछताछ इस डिवाइस पर सेव होती है। ऑनलाइन भेजने की सुविधा जल्द आएगी।", "Your enquiry is saved on this device. It has not been sent online.": "आपकी पूछताछ इस डिवाइस पर सेव है। इसे ऑनलाइन नहीं भेजा गया है।", "Unable to save on this device. Please keep a copy of your enquiry.": "इस डिवाइस पर सेव नहीं हुआ। अपनी पूछताछ की कॉपी रखें।", "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "खूबसूरत बाहरी जगह सिर्फ अलग-अलग चीज़ों का जोड़ नहीं होती। आरामदायक आँगन, सलीके से बिछी पेविंग, साथ बैठने की जगह और सोच-समझकर लगाए पौधे—हम सबको एक साथ लाते हैं। आपकी जीवनशैली के अनुसार ऐसी सामग्री, बनावट और हरियाली चुनते हैं जो घर का हिस्सा लगे।", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "आराम करने और साथ समय बिताने की शांत जगह। घर के आसपास पौधों, पेविंग और आरामदायक जगहों को साथ लाते हैं।", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "घर के सामने के ड्राइववे से बगीचे के रास्तों और आँगन तक, सलीके से बनी सतहें सुंदरता और रोज़ की सुविधा बढ़ाती हैं।", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "साथ खाने, सुकून भरी शामों और दोस्तों के साथ वीकेंड के लिए अपनी जीवनशैली के अनुसार बाहर की जगह बनाएँ।", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "अलग-अलग ऊँचाई के पौधे और आसान देखभाल वाली आर्टिफिशियल घास बाहर की जगह में हरियाली और ताज़गी लाती है।", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "थोड़ी सी सोच बाहर जीने का अंदाज़ बदल सकती है। पौधों, पेविंग और आरामदायक जगहों का सही मेल एक अनदेखे आँगन को सबके साथ बैठने की खूबसूरत जगह बना देता है। ऐसा बगीचा सोचें जो ज़्यादा सुंदर, उपयोगी और आपके जैसा हो।", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "धूप भरी घाटियों से समुद्र किनारे के इलाकों तक, हम दक्षिणी कैलिफ़ोर्निया की ज़िंदगी के लिए बाहरी जगहें बनाते हैं। सोच-समझकर की गई लैंडस्केपिंग, टिकाऊ पेविंग और साथ बैठने की जगहें—आपके घर और पसंद के अनुसार।"}, "pa": {"Send us a text": "ਸਾਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ", "Coming soon": "ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ", "A backyard made": "ਇੱਕ ਅਜਿਹਾ ਵਿਹੜਾ", "for getting together.": "ਜਿੱਥੇ ਸਭ ਇਕੱਠੇ ਹੋਣ।", "From empty yard": "ਖਾਲੀ ਵਿਹੜੇ ਤੋਂ", "to everyday escape.": "ਰੋਜ਼ ਦੇ ਸਕੂਨ ਤੱਕ।", "Your favourite getaway.": "ਤੁਹਾਡੀ ਮਨਪਸੰਦ ਸਕੂਨ ਦੀ ਥਾਂ।", "Just outside.": "ਬਸ ਘਰ ਦੇ ਬਾਹਰ।", "Make room for": "ਥਾਂ ਬਣਾਓ", "the slower moments.": "ਵਿਹਲ ਦੇ ਪਲਾਂ ਲਈ।", "Let the good evenings": "ਖ਼ੂਬਸੂਰਤ ਸ਼ਾਮਾਂ ਨੂੰ", "last a little longer.": "ਥੋੜ੍ਹਾ ਹੋਰ ਜੀਓ।", "Backyard BBQ": "ਵਿਹੜੇ ਵਿੱਚ ਬਾਰਬੀਕਿਊ", "& outdoor kitchens": "ਅਤੇ ਬਾਹਰੀ ਰਸੋਈਆਂ", "A garden worth": "ਇੱਕ ਅਜਿਹਾ ਬਗੀਚਾ", "coming home to": "ਜਿੱਥੇ ਮੁੜਨ ਨੂੰ ਜੀਅ ਕਰੇ", "Your own": "ਤੁਹਾਡਾ ਆਪਣਾ", "poolside retreat": "ਪੂਲ ਦੇ ਕੰਢੇ ਸਕੂਨ", "Patios for": "ਅਜਿਹੇ ਵੇਹੜੇ", "slowing down": "ਜਿੱਥੇ ਸਕੂਨ ਮਿਲੇ", "A little magic": "ਥੋੜ੍ਹਾ ਜਿਹਾ ਜਾਦੂ", "after sunset": "ਸੂਰਜ ਡੁੱਬਣ ਮਗਰੋਂ", "A little more outside.": "ਥੋੜ੍ਹਾ ਹੋਰ ਬਾਹਰ।", "A lot more living.": "ਬਹੁਤ ਹੋਰ ਜ਼ਿੰਦਗੀ।", "Thoughtful landscapes. Beautiful hardscapes.": "ਸੋਚ-ਸਮਝ ਕੇ ਬਣੇ ਬਗੀਚੇ। ਖ਼ੂਬਸੂਰਤ ਪੱਥਰ ਦੇ ਕੰਮ।", "Outdoor spaces that feel like you.": "ਬਾਹਰੀ ਥਾਵਾਂ, ਤੁਹਾਡੇ ਅੰਦਾਜ਼ ਵਿੱਚ।", "Every detail.": "ਹਰ ਬਾਰੀਕੀ।", "One complete vision.": "ਇੱਕ ਪੂਰੀ ਸੋਚ।", "Backyard Retreats": "ਵਿਹੜੇ ਵਿੱਚ ਸਕੂਨ", "Pavers & concrete": "ਪੇਵਰ ਅਤੇ ਕੰਕਰੀਟ", "Outdoor Living Spaces": "ਬਾਹਰ ਰਹਿਣ ਦੀਆਂ ਥਾਵਾਂ", "Planting & artificial turf": "ਪੌਦੇ ਅਤੇ ਬਣਾਵਟੀ ਘਾਹ", "See the transformation": "ਬਦਲਾਅ ਵੇਖੋ", "for yourself.": "ਆਪਣੀਆਂ ਅੱਖਾਂ ਨਾਲ।", "Before": "ਪਹਿਲਾਂ", "After": "ਬਾਅਦ ਵਿੱਚ", "Southern California.": "ਦੱਖਣੀ ਕੈਲੀਫ਼ੋਰਨੀਆ।", "Outdoor living.": "ਬਾਹਰ ਦੀ ਜ਼ਿੰਦਗੀ।", "Let's create a space": "ਆਓ ਅਜਿਹੀ ਥਾਂ ਬਣਾਈਏ", "worth coming home to.": "ਜਿੱਥੇ ਮੁੜਨ ਨੂੰ ਜੀਅ ਕਰੇ।", "LET'S DISCUSS": "ਆਓ ਗੱਲ ਕਰੀਏ", "WHAT YOU HAVE IN MIND": "ਤੁਹਾਡੀ ਸੋਚ ਬਾਰੇ", "& HEAR BACK FROM US": "ਅਤੇ ਅਸੀਂ ਤੁਹਾਨੂੰ ਜਵਾਬ ਦੇਵਾਂਗੇ", "Your name": "ਤੁਹਾਡਾ ਨਾਮ", "Email address": "ਈਮੇਲ ਪਤਾ", "Phone number": "ਫ਼ੋਨ ਨੰਬਰ", "Project location": "ਪ੍ਰੋਜੈਕਟ ਦੀ ਥਾਂ", "Your outdoor space": "ਤੁਹਾਡੀ ਬਾਹਰੀ ਥਾਂ", "Save enquiry": "ਪੁੱਛਗਿੱਛ ਸੰਭਾਲੋ", "Full name": "ਪੂਰਾ ਨਾਮ", "Your phone number": "ਤੁਹਾਡਾ ਫ਼ੋਨ ਨੰਬਰ", "City or ZIP code": "ਸ਼ਹਿਰ ਜਾਂ ਜ਼ਿਪ ਕੋਡ", "Tell us a little about your project": "ਆਪਣੇ ਪ੍ਰੋਜੈਕਟ ਬਾਰੇ ਦੱਸੋ", "Let's talk outside.": "ਬਾਹਰੀ ਥਾਂ ਬਾਰੇ ਗੱਲ ਕਰੀਏ।", "Based in": "ਸਾਡਾ ਖੇਤਰ", "Southern California": "ਦੱਖਣੀ ਕੈਲੀਫ਼ੋਰਨੀਆ", "Our neighbourhoods": "ਸਾਡੇ ਇਲਾਕੇ", "Contact": "ਸੰਪਰਕ", "Email & phone coming soon": "ਈਮੇਲ ਅਤੇ ਫ਼ੋਨ ਜਲਦੀ ਉਪਲਬਧ ਹੋਣਗੇ", "Santa Clarita Valley": "ਸਾਂਤਾ ਕਲੈਰਿਟਾ ਵੈਲੀ", "San Fernando Valley": "ਸੈਨ ਫਰਨਾਂਡੋ ਵੈਲੀ", "Conejo Valley": "ਕੋਨੇਹੋ ਵੈਲੀ", "Ventura County": "ਵੈਂਚੂਰਾ ਕਾਊਂਟੀ", "Thousand Oaks": "ਥਾਊਜ਼ੈਂਡ ਓਕਸ", "Enquiries are saved on this device. Online delivery coming soon.": "ਪੁੱਛਗਿੱਛ ਇਸ ਡਿਵਾਈਸ ਉੱਤੇ ਸੰਭਾਲੀ ਜਾਂਦੀ ਹੈ। ਆਨਲਾਈਨ ਭੇਜਣ ਦੀ ਸਹੂਲਤ ਜਲਦੀ ਆਵੇਗੀ।", "Your enquiry is saved on this device. It has not been sent online.": "ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਇਸ ਡਿਵਾਈਸ ਉੱਤੇ ਸੰਭਾਲੀ ਗਈ ਹੈ। ਇਹ ਆਨਲਾਈਨ ਨਹੀਂ ਭੇਜੀ ਗਈ।", "Unable to save on this device. Please keep a copy of your enquiry.": "ਇਸ ਡਿਵਾਈਸ ਉੱਤੇ ਸੰਭਾਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ। ਆਪਣੀ ਪੁੱਛਗਿੱਛ ਦੀ ਕਾਪੀ ਰੱਖੋ।", "A beautiful outdoor space is more than the sum of its parts. From inviting backyard retreats and carefully laid paving to comfortable gathering spaces and thoughtful planting, we bring every element together. Designed around the way you live, with materials, textures, and greenery that feel naturally at home.": "ਖ਼ੂਬਸੂਰਤ ਬਾਹਰੀ ਥਾਂ ਸਿਰਫ਼ ਵੱਖ-ਵੱਖ ਚੀਜ਼ਾਂ ਦਾ ਜੋੜ ਨਹੀਂ ਹੁੰਦੀ। ਆਰਾਮਦਾਇਕ ਵਿਹੜੇ, ਸੁਚੱਜੀ ਪੇਵਿੰਗ, ਇਕੱਠੇ ਬੈਠਣ ਦੀ ਥਾਂ ਅਤੇ ਸੋਚ-ਸਮਝ ਕੇ ਲਾਏ ਪੌਦੇ—ਅਸੀਂ ਸਭ ਨੂੰ ਇਕੱਠਾ ਲਿਆਉਂਦੇ ਹਾਂ। ਤੁਹਾਡੀ ਜੀਵਨਸ਼ੈਲੀ ਮੁਤਾਬਕ ਸਮੱਗਰੀ, ਬਣਾਵਟ ਅਤੇ ਹਰਿਆਲੀ ਚੁਣਦੇ ਹਾਂ ਜੋ ਘਰ ਦਾ ਹਿੱਸਾ ਲੱਗੇ।", "A quiet place to unwind, gather, and enjoy being outside. We bring planting, paving, and comfortable spaces together around your home.": "ਆਰਾਮ ਕਰਨ ਅਤੇ ਇਕੱਠੇ ਸਮਾਂ ਬਿਤਾਉਣ ਲਈ ਸ਼ਾਂਤ ਥਾਂ। ਘਰ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਪੌਦੇ, ਪੇਵਿੰਗ ਅਤੇ ਆਰਾਮਦਾਇਕ ਥਾਵਾਂ ਇਕੱਠੀਆਂ ਕਰਦੇ ਹਾਂ।", "From welcoming front driveways to garden paths and patios, thoughtfully laid surfaces add structure, character, and everyday practicality.": "ਘਰ ਦੇ ਸਾਹਮਣੇ ਡਰਾਈਵਵੇਅ ਤੋਂ ਬਗੀਚੇ ਦੇ ਰਸਤਿਆਂ ਅਤੇ ਵਿਹੜਿਆਂ ਤੱਕ, ਸੁਚੱਜੀਆਂ ਸਤਹਾਂ ਸੁੰਦਰਤਾ ਅਤੇ ਰੋਜ਼ ਦੀ ਸਹੂਲਤ ਵਧਾਉਂਦੀਆਂ ਹਨ।", "Make room for shared meals, relaxed evenings, and weekends with friends, with outdoor spaces designed around the way you live.": "ਇਕੱਠੇ ਖਾਣੇ, ਸਕੂਨ ਭਰੀਆਂ ਸ਼ਾਮਾਂ ਅਤੇ ਦੋਸਤਾਂ ਨਾਲ ਹਫ਼ਤੇ ਦੇ ਅਖੀਰ ਲਈ ਆਪਣੀ ਜੀਵਨਸ਼ੈਲੀ ਮੁਤਾਬਕ ਬਾਹਰੀ ਥਾਂ ਬਣਾਓ।", "Layered planting and easy-care artificial turf bring softness, greenery, and a fresh finish to your outdoor space.": "ਵੱਖ-ਵੱਖ ਉਚਾਈ ਦੇ ਪੌਦੇ ਅਤੇ ਸੌਖੀ ਸੰਭਾਲ ਵਾਲਾ ਬਣਾਵਟੀ ਘਾਹ ਬਾਹਰੀ ਥਾਂ ਵਿੱਚ ਹਰਿਆਲੀ ਅਤੇ ਤਾਜ਼ਗੀ ਲਿਆਉਂਦੇ ਹਨ।", "A little thought can change the way you live outside. From an overlooked yard to a welcoming place to gather, the right combination of planting, paving, and comfortable outdoor spaces makes all the difference. Explore the possibilities for a garden that feels more beautiful, more useful, and more like you.": "ਥੋੜ੍ਹੀ ਜਿਹੀ ਸੋਚ ਬਾਹਰ ਰਹਿਣ ਦਾ ਅੰਦਾਜ਼ ਬਦਲ ਸਕਦੀ ਹੈ। ਪੌਦਿਆਂ, ਪੇਵਿੰਗ ਅਤੇ ਆਰਾਮਦਾਇਕ ਥਾਵਾਂ ਦਾ ਸਹੀ ਮੇਲ ਅਣਗੌਲੇ ਵਿਹੜੇ ਨੂੰ ਇਕੱਠੇ ਬੈਠਣ ਦੀ ਖ਼ੂਬਸੂਰਤ ਥਾਂ ਬਣਾ ਦਿੰਦਾ ਹੈ। ਅਜਿਹਾ ਬਗੀਚਾ ਸੋਚੋ ਜੋ ਹੋਰ ਸੁੰਦਰ, ਲਾਭਦਾਇਕ ਅਤੇ ਤੁਹਾਡੇ ਵਰਗਾ ਹੋਵੇ।", "From sun-filled valleys to coastal neighbourhoods, we create outdoor spaces made for Southern California living. Thoughtful landscaping, lasting hardscapes, and places to gather—designed around your home and the way you enjoy being outside.": "ਧੁੱਪ ਵਾਲੀਆਂ ਵਾਦੀਆਂ ਤੋਂ ਸਮੁੰਦਰੀ ਇਲਾਕਿਆਂ ਤੱਕ, ਅਸੀਂ ਦੱਖਣੀ ਕੈਲੀਫ਼ੋਰਨੀਆ ਦੀ ਜ਼ਿੰਦਗੀ ਲਈ ਬਾਹਰੀ ਥਾਵਾਂ ਬਣਾਉਂਦੇ ਹਾਂ। ਸੋਚ-ਸਮਝ ਕੇ ਕੀਤੀ ਲੈਂਡਸਕੇਪਿੰਗ, ਟਿਕਾਊ ਪੇਵਿੰਗ ਅਤੇ ਇਕੱਠੇ ਬੈਠਣ ਦੀਆਂ ਥਾਵਾਂ—ਤੁਹਾਡੇ ਘਰ ਅਤੇ ਪਸੰਦ ਮੁਤਾਬਕ।"}};

Object.assign(pageTranslations["es"],{"Call": "Llamar", "Email": "Correo electrónico"});
Object.assign(pageTranslations["fr"],{"Call": "Appeler", "Email": "E-mail"});
Object.assign(pageTranslations["hi"],{"Call": "कॉल करें", "Email": "ईमेल"});
Object.assign(pageTranslations["pa"],{"Call": "ਕਾਲ ਕਰੋ", "Email": "ਈਮੇਲ"});
Object.assign(pageTranslations["es"],{"WHERE WE WORK": "DÓNDE TRABAJAMOS", "Landscapes made for you.": "Paisajes hechos para ti.", "SERVICE AREAS": "ZONAS DE SERVICIO"});
Object.assign(pageTranslations["fr"],{"WHERE WE WORK": "OÙ NOUS TRAVAILLONS", "Landscapes made for you.": "Des jardins faits pour vous.", "SERVICE AREAS": "ZONES D’INTERVENTION"});
Object.assign(pageTranslations["hi"],{"WHERE WE WORK": "हम कहाँ काम करते हैं", "Landscapes made for you.": "आपके लिए बने बगीचे।", "SERVICE AREAS": "हमारे सेवा क्षेत्र"});
Object.assign(pageTranslations["pa"],{"WHERE WE WORK": "ਅਸੀਂ ਕਿੱਥੇ ਕੰਮ ਕਰਦੇ ਹਾਂ", "Landscapes made for you.": "ਤੁਹਾਡੇ ਲਈ ਬਣੇ ਬਗੀਚੇ।", "SERVICE AREAS": "ਸਾਡੇ ਸੇਵਾ ਖੇਤਰ"});
let selectedLanguage='en';
const originalNodes=new WeakMap(),originalAttributes=new WeakMap();
const englishHeadlines=slides.map(slide=>slide.headline);
function translated(text){return pageTranslations[selectedLanguage]?.[text]??text}
function translatePage(){
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;
 while(node=walker.nextNode()){
  if(node.parentElement.closest('script,style,.nav-brand,.gallery-wordmark,.footer-stacked-brand,.footer-logo,.language-picker,#headline'))continue;
  if(!originalNodes.has(node))originalNodes.set(node,node.textContent);
  const source=originalNodes.get(node),key=source.trim();
  const value=translated(key);
  if(node.textContent!==source.replace(key,value))node.textContent=source.replace(key,value);
 }
 document.querySelectorAll('[placeholder]').forEach(element=>{
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
