const start=$('#startView'),finish=$('#finishView');
const legacyDelete=$('#deleteSketch');
if(legacyDelete) legacyDelete.onclick=()=>{if(confirm('Slette denne skissen?')){finish.classList.add('hidden');start.classList.remove('hidden');}};
