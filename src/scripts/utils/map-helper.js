import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CONFIG from '../config'; // Asumsi ini berisi API Key atau konfigurasi dasar

// Penting: Fix for default Leaflet marker icon not showing up with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  // Pastikan Anda menggunakan .default karena Webpack 5 Asset Modules
  // Jika `require` mengembalikan URL string, .default tidak perlu.
  // Tapi dengan konfigurasi default Asset Modules, ini biasanya diperlukan.
  iconRetinaUrl: 'images/marker-icon-2x.png', // Sesuaikan path ini
  iconUrl: 'images/marker-icon.png',         // Sesuaikan path ini
  shadowUrl: 'images/marker-shadow.png',     // Sesuaikan path ini
});

class MapHelper {
  /**
   * Menginisialisasi peta Leaflet dengan layer dasar.
   * @param {HTMLElement | string} mapElementId The DOM element ID or element itself to render the map into.
   * @param {L.LatLngExpression} center The initial center coordinates (e.g., [latitude, longitude]).
   * @param {number} zoom The initial zoom level.
   * @returns {L.Map} The Leaflet map instance.
   */
  static initMap(mapElementId, center = [0, 0], zoom = 10) {
    const map = L.map(mapElementId).setView(center, zoom);

    // Dapatkan layer dasar default dan tambahkan ke peta
    const defaultLayer = MapHelper.getMapLayers().OpenStreetMap;
    defaultLayer.addTo(map);

    return map;
  }

  /**
   * Menyediakan objek tile layer yang berbeda untuk Layer Control.
   * Anda dapat menambahkan lebih banyak layer di sini.
   * Pastikan untuk mengganti 'YOUR_MAPTILER_API_KEY' dengan API Key Anda yang sebenarnya.
   * @returns {object} Objek berisi base maps untuk L.control.layers.
   */
  static getMapLayers() {
    const mapTilerApiKey = CONFIG.MAPTILER_API_KEY || 'YOUR_MAPTILER_API_KEY'; // Ambil dari CONFIG atau ganti langsung

    return {
      "OpenStreetMap": L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }),
      "MapTiler Streets": L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${mapTilerApiKey}`, {
        maxZoom: 19,
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      }),
      "MapTiler Satellite": L.tileLayer(`https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${mapTilerApiKey}`, {
        maxZoom: 19,
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      }),
      "ESRI World Imagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      // Tambahkan layer kustom lainnya di sini
      // Misalnya, jika Anda punya plugin untuk vector tiles:
      // "My Vector Tiles": L.vectorGrid.protobuf("your-vector-tile-url/{z}/{x}/{y}.pbf", {
      //     vectorTileLayerStyles: {
      //         'your-layer-name': { weight: 0.5, color: '#000000', opacity: 1, fill: true, fillColor: '#ff0000', fillOpacity: 0.5 }
      //     },
      //     rendererFactory: L.canvas.tile,
      //     interactive: true,
      //     getFeatureId: function(feature) { return feature.properties.id; }
      // })
    };
  }

  /**
   * Menambahkan kontrol layer ke peta.
   * @param {L.Map} map The Leaflet map instance.
   * @param {object} baseMaps Objek base maps dari getMapLayers().
   * @param {object} [overlays={}] Objek overlay layers (opsional).
   * @returns {L.Control.Layers} The Leaflet layer control instance.
   */
  static addLayerControl(map, baseMaps, overlays = {}) {
    return L.control.layers(baseMaps, overlays).addTo(map);
  }

  // Metode addMarker, clearMarkers, fitMapToMarkers tetap sama
  /**
   * Adds a marker to the map.
   * @param {L.Map} map The Leaflet map instance.
   * @param {L.LatLngExpression} latlng The coordinates for the marker.
   * @param {string} popupContent The HTML content for the marker's popup.
   * @returns {L.Marker} The Leaflet marker instance.
   */
  static addMarker(map, latlng, popupContent = '') {
    const marker = L.marker(latlng).addTo(map);
    if (popupContent) {
      marker.bindPopup(popupContent);
    }
    return marker;
  }

  /**
   * Clears all markers from the given map.
   * @param {L.Map} map The Leaflet map instance.
   */
  static clearMarkers(map) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
  }

  /**
   * Adjusts the map's view to fit all given coordinates.
   * @param {L.Map} map The Leaflet map instance.
   * @param {L.LatLngExpression[]} latlngs An array of coordinates to fit the map to.
   */
  static fitMapToMarkers(map, latlngs) {
    if (latlngs.length > 0) {
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}

export default MapHelper;