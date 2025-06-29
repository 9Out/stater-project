const createDetailStoryTemplate = (story) => {
  const date = new Date(story.createdAt);
  const formattedDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const hasLocation = story.lat !== null && story.lon !== null && story.lat !== undefined && story.lon !== undefined;

  const googleMapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${story.lat},${story.lon}`
    : '#';
  const openStreetMapUrl = hasLocation
    ? `https://www.openstreetmap.org/?mlat=${story.lat}&mlon=${story.lon}#map=15/${story.lat}/${story.lon}`
    : '#';

  return `
    <section class="detail-story-section">
      <div class="story-detail-card">
        <img class="story-detail-image" src="${story.photoUrl}" alt="${story.description}">
        <div class="story-detail-content">
          <h2 class="story-detail-title">${story.name}</h2>
          <p class="story-detail-description">${story.description}</p>
          <p class="story-detail-date">Tanggal: ${formattedDate}</p>

          ${hasLocation ? `
            <div class="location-info-card">
              <h3>Lokasi Cerita</h3>
              <p>Latitude: <span id="detailLat">${story.lat.toFixed(5)}</span></p>
              <p>Longitude: <span id="detailLon">${story.lon.toFixed(5)}</span></p>
              <div class="location-actions">
                <a href="${googleMapsUrl}" target="_blank" rel="noopener" class="button button-green">
                  <i class="fas fa-map-marker-alt"></i> Buka di Google Maps
                </a>
                <a href="${openStreetMapUrl}" target="_blank" rel="noopener" class="button button-primary">
                  <i class="fas fa-map-marked-alt"></i> Buka di OpenStreetMap
                </a>
              </div>
            </div>
            <div id="detailStoryMap" class="map-container" style="height: 350px; width: 100%; border-radius: 8px; margin-top: 15px;"></div>
          ` : `
            <div class="location-info-card no-location">
              <h3>Lokasi Cerita</h3>
              <p>Lokasi tidak tersedia untuk cerita ini.</p>
            </div>
          `}
        </div>
      </div>
    </section>
  `;
};

export default createDetailStoryTemplate;