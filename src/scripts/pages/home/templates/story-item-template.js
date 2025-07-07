const createStoryItemTemplate = (story) => `
  <article class="story-item" tabindex="0" aria-label="Cerita oleh ${story.name}">
    <div class="story-header">
      <img class="story-image" src="${story.photoUrl}" alt="${story.description.substring(0, 50)}..." tabindex="0">
    </div>
    <div class="story-content">
      <h2 class="story-name" tabindex="0">${story.name}</h2>
      <p class="story-description" tabindex="0">${story.description.substring(0, 150)}...</p>
      <p class="story-date" tabindex="0">Dibuat pada: ${new Date(story.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
      })}</p>
      ${story.lat && story.lon ? `<div class="story-location-btn" data-lat="${story.lat}" data-lon="${story.lon}" aria-label="Lihat lokasi cerita ini di peta">Lihat Selengkapnya</div>` : ''}
    </div>
  </article>
`;
export default createStoryItemTemplate;