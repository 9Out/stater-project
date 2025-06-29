import createDetailStoryTemplate from './template/detail-story-template';
import MapHelper from '../../utils/map-helper'; // Import MapHelper

class DetailStoryView {
  constructor({ mainContent }) {
    this._mainContent = mainContent;
    this._map = null;
    this._storyData = null; // Untuk menyimpan data cerita yang ditampilkan
  }

  render(story) {
    this._storyData = story; // Simpan data cerita
    this._mainContent.innerHTML = createDetailStoryTemplate(story);

    // Inisialisasi peta jika ada data lokasi
    if (story.lat !== null && story.lon !== null && story.lat !== undefined && story.lon !== undefined) {
      this._setupMap();
    }
  }

  _setupMap() {
    const mapElement = this._mainContent.querySelector('#detailStoryMap');
    if (!mapElement) {
      console.error('Map element #detailStoryMap not found.');
      return;
    }

    const { lat, lon } = this._storyData;
    const center = [lat, lon];

    this._map = MapHelper.initMap(mapElement, center, 15); // Zoom level 15 untuk detail

    // Tambahkan marker untuk lokasi cerita
    MapHelper.addMarker(this._map, center, `<b>${this._storyData.name}</b><br>${this._storyData.description}<br>Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`);

    // Tambahkan Layer Control (opsional, tapi bagus untuk konsistensi)
    const baseLayers = MapHelper.getMapLayers();
    MapHelper.addLayerControl(this._map, baseLayers);

    // Pastikan peta menyesuaikan diri jika div diubah ukurannya atau setelah transisi DOM
    this._map.invalidateSize();
  }

  destroy() {
    if (this._map) {
      this._map.remove(); // Hapus peta dari DOM dan bersihkan event listeners
      this._map = null;
    }
    this._storyData = null;
    // Tidak ada event listener kustom lain yang perlu dihapus di sini
  }
}

export default DetailStoryView;