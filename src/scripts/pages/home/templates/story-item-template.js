const createStoryItemTemplate = (story) => `
  <article class="story-item" tabindex="0" aria-label="Cerita oleh ${story.name}">
    <div class="story-header">
      <a href="#/stories/${story.id}">
        <img class="story-image" src="${story.photoUrl}" alt="${story.description.substring(0, 50)}..." tabindex="0">
      </a>
    </div>
    <div class="story-content">
      <h3 class="story-name"><a href="#/stories/${story.id}">${story.name}</a></h3>
      <p class="story-description">${story.description.substring(0, 150)}...</p>
      <p class="story-date">Dibuat pada: ${new Date(story.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
      })}</p>
      <button class="btn-save" data-id="${story.id}" aria-label="Simpan cerita ${story.name}">Simpan Cerita</button>
      ${story.lat && story.lon ? `<div class="story-location-btn" data-lat="${story.lat}" data-lon="${story.lon}" aria-label="Lihat lokasi cerita ini di peta">Lihat di Peta</div>` : ''}
    </div>
  </article>
`;
export default createStoryItemTemplate;