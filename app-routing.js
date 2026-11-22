// Route drawing and canvas input
function selectClickedRoute(e){if(mode!=='select')return;
let el=e.target.closest('[data-route-id]');
if(!el)return;
selectedRoute=routes.find(r=>String(r.id)===el.dataset.routeId)?.id??null;
render()}
function pointerCell(e){let svg=$('#wallSvg'),rect=svg.getBoundingClientRect(),{cellW,rowCenters,pad}=dims(),x=(e.clientX-rect.left)/scale-pad,y=(e.clientY-rect.top)/scale-pad;
return {x:Math.max(0,Math.min(cols-1,Math.round(x/cellW-.5))),y:rowAt(y,rowCenters)}}
function cellsBetween(a,b){let x=a.x,y=a.y,dx=Math.abs(b.x-a.x),dy=Math.abs(b.y-a.y),sx=a.x<b.x?1:-1,sy=a.y<b.y?1:-1,movedX=0,movedY=0,path=[];
while(x!==b.x||y!==b.y){if(x===b.x){y+=sy;
movedY++}else if(y===b.y){x+=sx;
movedX++}else if((movedX+1)*dy<=(movedY+1)*dx){x+=sx;
movedX++}else{y+=sy;
movedY++}path.push({x,y})}return path}
function tileUsedByOtherRoute(p,type,excludeId=null){return routes.some(r=>r.id!==excludeId&&r.type===type&&r.points.some(q=>q.x===p.x&&q.y===p.y))}function addRoutePoint(p){let last=draft.at(-1);
if(last?.x===p.x&&last?.y===p.y)return;
if(tileUsedByOtherRoute(p,mode)){toast("This cabinet already has a "+mode+" route");
pointerDrawing=false;
return}if(draft.some(q=>q.x===p.x&&q.y===p.y)){toast("This cabinet is already in the route");
pointerDrawing=false;
return}draft.push(p);
render()}function drawRouteTo(target){let start=draft.at(-1)||target,path=draft.length?cellsBetween(start,target):[target],changed=false;
for(const p of path){if(tileUsedByOtherRoute(p,mode)){toast('This cabinet already has a '+mode+' route');
pointerDrawing=false;
break}if(draft.some(q=>q.x===p.x&&q.y===p.y)){if(draft.at(-1)?.x===p.x&&draft.at(-1)?.y===p.y)continue;
toast('This cabinet is already in the route');
pointerDrawing=false;
break}draft.push(p);
changed=true}if(changed)render()}
function onPointPointerDown(e){if(e.button===1)return;
if(mode==='signal'&&$('#threadFeaturesToggle')?.getAttribute('aria-pressed')==='true'&&!signalPortArmed){toast('Choose an available port in the bottom bar to start a signal route');
return}if(mode==='power'&&$('#threadFeaturesToggle')?.getAttribute('aria-pressed')==='true'&&(bottomPortMode!=='power'||!powerPortArmed)){toast('Choose an available Power port in the bottom bar to start a power route');
return}if(mode==='select'){let el=e.target.closest('[data-point-index]');
if(!el)return;
e.preventDefault();
selectedRoute=routes.find(r=>String(r.id)===el.dataset.routeId)?.id??null;
if(selectedRoute!==null)draggingPoint={id:selectedRoute,index:+el.dataset.pointIndex};
return}if(e.button!==0||!wallRows.length)return;
e.preventDefault();
pointerDrawing=true;
addRoutePoint(pointerCell(e))}
function columnLabel(n){let s="";
for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;
return s}function rowAt(y,centers){let best=0,distance=Infinity;
for(let i=0;i<centers.length;i++){let d=Math.abs(y-centers[i]);
if(d<distance){best=i;
distance=d}}return best}
function beginPan(e){if(e.button!==1)return;
e.preventDefault();
let board=$('.board');
panning={x:e.clientX,y:e.clientY,left:board.scrollLeft,top:board.scrollTop};
panCursor=document.body.style.cursor;
document.body.style.cursor='grabbing'}function handleCanvasWheel(e){if(!e.ctrlKey)return;
e.preventDefault();
let board=$('.board'),rect=board.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,contentX=board.scrollLeft+x,contentY=board.scrollTop+y,oldScale=scale;
zoom(scale*Math.exp(-e.deltaY*.002));
let ratio=scale/oldScale;
board.scrollLeft=contentX*ratio-x;
board.scrollTop=contentY*ratio-y}
function moveRoutePoint(e){if(panning){let board=$('.board');
board.scrollLeft=panning.left-(e.clientX-panning.x);
board.scrollTop=panning.top-(e.clientY-panning.y);
return}if(pointerDrawing&&wallRows.length){drawRouteTo(pointerCell(e));
return}if(!draggingPoint||!wallRows.length)return;
let p=pointerCell(e),r=routes.find(q=>q.id===draggingPoint.id);
if(!r||r.points.some((q,i)=>i!==draggingPoint.index&&q.x===p.x&&q.y===p.y)||tileUsedByOtherRoute(p,r.type,r.id))return;
r.points[draggingPoint.index]=p;
render()}
