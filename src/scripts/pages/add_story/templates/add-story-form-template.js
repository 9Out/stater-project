// src/scripts/pages/add_story/templates/add-story-form-template.js
const createAddStoryFormTemplate = () => `
<section class="add-story-section">
  <h2 class="section-title">Tambahkan Cerita Baru</h2>
  <form id="addStoryForm" class="add-story-form">
    <div class="form-group">
      <label for="description">Deskripsi <span class="required">*</span></label>
      <textarea id="description" name="description" rows="5" placeholder="Tulis cerita Anda..." required></textarea>
      <p class="help-text">Ceritakan pengalaman atau momen yang ingin Anda bagikan</p>
    </div>

    <div class="form-group">
      <label>Foto <span class="required">*</span></label>
      <div class="photo-controls">
        <button type="button" id="cameraButton" class="button button-camera">
          <i class="fas fa-camera"></i> Buka Kamera
        </button>
        <label for="photoFileInput" class="button button-primary upload-button">
          <i class="fas fa-upload"></i> Upload dari Device
        </label>
        <input type="file" id="photoFileInput" accept="image/*" class="hidden-file-input">
        <button type="button" id="deletePhotoButton" class="button button-red" style="display: none;">
          <i class="fas fa-trash-alt"></i> Hapus Foto
        </button>
      </div>
      <p class="help-text">Gunakan kamera untuk mengambil foto langsung atau pilih file dari perangkat</p>

      <div class="camera-display-area">
          <video id="cameraFeed" autoplay class="camera-feed" style="display: none;"></video>
          <canvas id="photoCanvas" style="display: none;"></canvas>
          <img id="capturedImagePreview" class="captured-image-preview" src="#" alt="Pratinjau Gambar" style="display: none;">
          <p id="photoStatusMessage" class="photo-status-message" style="display: none;"></p>
      </div>

      <h4 class="previous-photo-title" style="display: none;">Foto Saat Ini:</h4>
      <img id="previousImagePreview" class="previous-image-preview" src="#" alt="Foto Sebelumnya" style="display: none;">


    </div>

    <div class="form-group location-group">
      <label>Pilih Lokasi (opsional)</label>
      <h3>Pilih Lokasi Cerita</h3>
      <p class="help-text">Klik di peta, gunakan GPS, atau masukkan koordinat manual untuk memilih lokasi</p>

      <div class="location-buttons">
        <button type="button" id="useGpsButton" class="button button-green">
          <i class="fas fa-crosshairs"></i> Gunakan GPS
        </button>
        <button type="button" id="inputManualButton" class="button button-green">
          <i class="fas fa-keyboard"></i> Input Manual
        </button>
        <button type="button" id="clearLocationButton" class="button button-red">
          <i class="fas fa-times-circle"></i> Hapus Lokasi
        </button>
      </div>

      <div id="addStoryMap" class="map-container" style="height: 400px; width: 100%; border-radius: 8px; margin-top: 15px;"></div>

      <div class="location-display-container">
          <p id="locationStatus" class="location-status"></p>
          <p class="current-coords">
              Latitude: <span id="displayLat">N/A</span>, Longitude: <span id="displayLon">N/A</span>
          </p>
      </div>

      <div id="manualLocationInput" class="manual-input-coords" style="display: none;">
          <div class="form-group">
              <label for="manualLat">Latitude:</label>
              <input type="number" step="any" id="manualLat" class="form-control" placeholder="Contoh: -6.200">
          </div>
          <div class="form-group">
              <label for="manualLon">Longitude:</label>
              <input type="number" step="any" id="manualLon" class="form-control" placeholder="Contoh: 106.816">
          </div>
          <button type="button" id="setManualLocationButton" class="button button-primary">Set Lokasi</button>
      </div>

      <input type="hidden" id="latitude" name="latitude">
      <input type="hidden" id="longitude" name="longitude">
    </div>

    <button type="submit" class="button button-primary submit-button">Tambah Cerita</button>
    <p class="form-footer">Pastikan semua informasi sudah benar sebelum mengirim</p>
  </form>
</section>
`;

export default createAddStoryFormTemplate;