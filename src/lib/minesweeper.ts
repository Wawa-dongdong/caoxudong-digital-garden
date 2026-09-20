export const SIZE=9,MINES=10;
export type Cell={mine:boolean;near:number;open:boolean;flag:boolean};
export type Game={cells:Cell[];status:'ready'|'playing'|'won'|'lost';exploded:number|null};
export const neighbors=(i:number)=>{const out:number[]=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=i%SIZE+dx,y=Math.floor(i/SIZE)+dy;if((dx||dy)&&x>=0&&x<SIZE&&y>=0&&y<SIZE)out.push(y*SIZE+x)}return out};
export const newGame=():Game=>({cells:Array.from({length:SIZE*SIZE},()=>({mine:false,near:0,open:false,flag:false})),status:'ready',exploded:null});
export function reveal(game:Game,index:number):Game{
 if(game.status==='won'||game.status==='lost'||game.cells[index].flag||game.cells[index].open)return game;
 const cells=game.cells.map(c=>({...c}));
 if(game.status==='ready'){const safe=new Set([index,...neighbors(index)]);const candidates=cells.map((_,i)=>i).filter(i=>!safe.has(i));for(let i=candidates.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]]}candidates.slice(0,MINES).forEach(i=>cells[i].mine=true);cells.forEach((c,i)=>c.near=neighbors(i).filter(n=>cells[n].mine).length)}
 if(cells[index].mine){cells[index].open=true;return {cells,status:'lost',exploded:index}}
 const todo=[index];while(todo.length){const i=todo.pop()!,c=cells[i];if(c.open||c.flag||c.mine)continue;c.open=true;if(c.near===0)todo.push(...neighbors(i))}
 const won=cells.every(c=>c.mine||c.open);if(won)cells.forEach(c=>{if(c.mine)c.flag=true});return {cells,status:won?'won':'playing',exploded:null};
}
export function toggleFlag(game:Game,index:number):Game{if(['won','lost'].includes(game.status)||game.cells[index].open)return game;return {...game,cells:game.cells.map((c,i)=>i===index?{...c,flag:!c.flag}:c)}}
