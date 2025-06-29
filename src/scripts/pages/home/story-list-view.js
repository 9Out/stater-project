import createStoryItemTemplate from './templates/story-item-template';
import createStoryListContainerTemplate from './templates/story-list-container-template';
import MapHelper from '../../utils/map-helper'; // Perubahan path import

class StoryListView {
  constructor({ mainContent }) {
    this._mainContent = mainContent;
    this._map = null;
  }

  render(stories) {
    this._mainContent.innerHTML = createStoryListContainerTemplate();
    const storyListContainer = this._mainContent.querySelector('#storyList');
    const storyMapElement = this._mainContent.querySelector('#storyMap');

    storyListContainer.innerHTML = stories.map(story => createStoryItemTemplate(story)).join('');

    this._initializeMap(storyMapElement, stories);
  }

  _initializeMap(mapElement, stories) {
    if (!mapElement) return;

    if (!this._map) {
      this._map = MapHelper.initMap(mapElement, [0, 0], 2);
    } else {
      MapHelper.clearMarkers(this._map);
    }

    const locations = [];
    stories.forEach(story => {
      if (story.lat && story.lon) {
        locations.push([story.lat, story.lon]);
        MapHelper.addMarker(this._map, [story.lat, story.lon], `
          <p><strong>${story.name}</strong></p>
          <p>${story.description.substring(0, 50)}...</p>
          <img src="${story.photoUrl}" alt="${story.name}" style="max-width: 100px; max-height: 100px;">
        `);
      }
    });

    if (locations.length > 0) {
      MapHelper.fitMapToMarkers(this._map, locations);
    } else {
      this._map.setView([0,0], 2);
    }
  }

  destroy() {
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
  }
}
export default StoryListView;