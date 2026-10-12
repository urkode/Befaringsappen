const start=$('#startView'),finish=$('#finishView');
$('#sendToSystem').onclick=()=>{const order=$('#orderSelect').value,status=$('#sendStatus');if(!order){status.textContent='Velg en ordre forst.';return;}status.textContent=`Skissen er sendt til ${order} (demonstrasjon).`;};
$('#deleteSketch').onclick=()=>{if(confirm('Slette denne skissen?')){finish.classList.add('hidden');start.classList.remove('hidden');}};
