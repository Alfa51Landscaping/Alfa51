const slides = [
  {category:'Backyard BBQ & outdoor kitchens',headline:'A backyard made<br>for getting together.',description:'A built-in BBQ, room to gather, and a kitchen under the open sky. Bring the weekend home.',details:['Outdoor kitchens','BBQ stations','Dining areas']},
  {category:'Garden design & complete makeovers',headline:'From empty yard<br>to everyday escape.',description:'Fresh lawns, layered planting, and a little more privacy. A beautiful garden that feels like yours.',details:['Lawn installation','Planting & greenery','Privacy screening']},
  {category:'Pools & poolside landscaping',headline:'Your favourite getaway.<br>Just outside.',description:'A refreshing pool, beautiful paving, and lush green edges. Make space for your own kind of summer.',details:['Pool surrounds','Non-slip paving','Poolside planting']},
  {category:'Patios, pergolas & fire pits',headline:'Make room for<br>the slower moments.',description:'Morning coffee in the shade. Long evenings around the fire. An outdoor living area for every day.',details:['Paved patios','Pergolas & shade','Fire pit seating']},
  {category:'Outdoor & landscape lighting',headline:'Let the good evenings<br>last a little longer.',description:'Softly lit pathways, glowing gardens, and warm gathering spaces. Bring your backyard to life after dark.',details:['Pathway lighting','Garden uplighting','Ambient lighting']}
];
const options=[...document.querySelectorAll('.option')],scenes=[...document.querySelectorAll('.scene')];
let current=0,timer,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const pauseButton=document.querySelector('#pause');
function schedule(){clearInterval(timer);if(!paused&&!document.hidden)timer=setInterval(()=>show((current+1)%slides.length),8000)}
function show(index){
 current=index;const slide=slides[index];
 scenes.forEach((scene,i)=>scene.classList.toggle('active',i===index));
 options.forEach((option,i)=>{option.classList.remove('selected');option.setAttribute('aria-pressed',String(i===index))});
 void options[index].offsetWidth;options[index].classList.add('selected');
 document.querySelector('#headline').innerHTML=slide.headline;
 if(matchMedia('(max-width:650px)').matches)document.querySelector('.options').scrollTo({left:options[index].offsetLeft,behavior:paused?'instant':'smooth'});
 schedule();
}
function reflectPause(){document.querySelector('.showcase').classList.toggle('paused',paused);pauseButton.innerHTML=paused?'Play <span aria-hidden="true">▷</span>':'Pause <span aria-hidden="true">Ⅱ</span>';pauseButton.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow')}
options.forEach((option,i)=>option.addEventListener('click',()=>show(i)));
pauseButton.addEventListener('click',()=>{paused=!paused;reflectPause();if(!paused)show(current);else schedule()});
document.querySelector('.options').addEventListener('keydown',event=>{if(!['ArrowRight','ArrowLeft'].includes(event.key))return;event.preventDefault();show((current+(event.key==='ArrowRight'?1:-1)+slides.length)%slides.length);options[current].focus()});
document.addEventListener('visibilitychange',schedule);
reflectPause();schedule();

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
