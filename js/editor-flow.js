const discardButton = document.querySelector('#discardSketch');

discardButton?.addEventListener('click', () => {
  if (!confirm('Vil du virkelig forkaste denne skissen?')) return;
  stopCamera();
  show(finishedBlob ? 'finishView' : 'startView');
});
