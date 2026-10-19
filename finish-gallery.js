/* Persistent, on-device gallery for completed sketches. */
const galleryDatabase = 'befaringsskisse-gallery';
const galleryStore = 'sketches';
let savedSketches = [];

function openGalleryDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(galleryDatabase, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(galleryStore)) {
        request.result.createObjectStore(galleryStore, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function galleryRequest(mode, action) {
  const database = await openGalleryDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(galleryStore, mode);
    const request = action(transaction.objectStore(galleryStore));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error);
  });
}

function sketchFileName(sketch) {
  const rawName = (sketch.name || 'skisse').trim().replace(/[\\/:*?"<>|]+/g, '-');
  const withoutExtension = rawName.replace(/\.(jpe?g)$/i, '') || 'skisse';
  return `${withoutExtension}.jpg`;
}

async function saveSketchRecord(sketch) {
  await galleryRequest('readwrite', store => store.put(sketch));
}

async function removeSketchRecord(id) {
  await galleryRequest('readwrite', store => store.delete(id));
}

function renderGallery() {
  const grid = $('#sketchGrid');
  if (!grid) return;
  grid.replaceChildren();

  savedSketches.forEach(sketch => {
    const card = document.createElement('article');
    card.className = 'sketch-card';

    const preview = document.createElement('div');
    preview.className = 'sketch-preview';
    const image = document.createElement('img');
    image.alt = sketch.name ? `Skisse: ${sketch.name}` : 'Ferdig skisse';
    const imageUrl = URL.createObjectURL(sketch.blob);
    image.src = imageUrl;
    image.onload = () => URL.revokeObjectURL(imageUrl);
    preview.append(image);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'sketch-remove';
    remove.setAttribute('aria-label', 'Slett skisse');
    remove.textContent = '−';
    remove.onclick = async () => {
      if (!confirm('Er du sikker på at du vil slette denne skissen?')) return;
      await removeSketchRecord(sketch.id);
      savedSketches = savedSketches.filter(item => item.id !== sketch.id);
      renderGallery();
    };
    preview.append(remove);

    const name = document.createElement('input');
    name.className = 'sketch-name';
    name.type = 'text';
    name.value = sketch.name || '';
    name.placeholder = 'Filnavn';
    name.autocomplete = 'off';
    name.setAttribute('aria-label', 'Filnavn for skissen');
    let nameTimer;
    name.addEventListener('input', () => {
      sketch.name = name.value;
      clearTimeout(nameTimer);
      nameTimer = setTimeout(() => saveSketchRecord(sketch).catch(() => {}), 250);
    });

    card.append(preview, name);
    grid.append(card);
  });
}

async function loadSavedSketches() {
  try {
    const records = await galleryRequest('readonly', store => store.getAll());
    savedSketches = records.sort((a, b) => b.createdAt - a.createdAt);
  } catch (_) {
    savedSketches = [];
  }
  renderGallery();
}

async function addFinishedSketch(blob) {
  const sketch = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name: 'skisse',
    blob,
    createdAt: Date.now()
  };
  await saveSketchRecord(sketch);
  savedSketches.unshift(sketch);
  renderGallery();
}

async function shareSavedSketches() {
  if (!savedSketches.length) return;
  const files = savedSketches.map(sketch => new File([sketch.blob], sketchFileName(sketch), { type: 'image/jpeg' }));
  if (navigator.share && navigator.canShare?.({ files })) {
    try {
      await navigator.share({ title: 'Befaringsskisser', files });
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }
  files.forEach(file => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1200);
  });
}

/* The editor creates a new saved item every time the user finishes a sketch. */
$('#backToStart').onclick = async () => {
  const blob = await exportImage();
  if (!blob) return;
  finishedBlob = blob;
  await addFinishedSketch(blob);
  show('finishView');
};

$('#shareImage').onclick = shareSavedSketches;
$('#downloadImage').onclick = () => {};
loadSavedSketches();
