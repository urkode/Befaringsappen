const start=$('#startView'),finish=$('#finishView');
$('#deleteSketch').onclick=()=>{if(confirm('Slette denne skissen?')){finish.classList.add('hidden');start.classList.remove('hidden');}};
