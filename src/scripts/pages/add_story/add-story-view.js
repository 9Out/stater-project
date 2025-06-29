import createAddStoryFormTemplate from './templates/add-story-form-template';
import CameraHelper from '../../utils/camera-helper';
import MapHelper from '../../utils/map-helper'; // Pastikan MapHelper.js sudah dimodifikasi

class AddStoryView {
  constructor({ mainContent }) {
    this._mainContent = mainContent;
    this._map = null;
    this._currentPhotoFile = null;
    this._cameraStream = null;
    this._currentMarker = null; // Tambahkan ini untuk melacak marker saat ini
  }

  render() {
    this._mainContent.innerHTML = createAddStoryFormTemplate();
    this._setupFormElements();
    this._setupCamera();
    this._setupMap();
    this._setupLocationControls(); // Panggil fungsi setup kontrol lokasi
  }

  _setupFormElements() {
    // ... (kode yang sudah ada tetap sama)
    this._descriptionInput = this._mainContent.querySelector('#description');
    this._photoFileInput = this._mainContent.querySelector('#photoFileInput');
    this._latitudeInput = this._mainContent.querySelector('#latitude');
    this._longitudeInput = this._mainContent.querySelector('#longitude');
    this._displayLat = this._mainContent.querySelector('#displayLat');
    this._displayLon = this._mainContent.querySelector('#displayLon');
    this._takePhotoButton = this._mainContent.querySelector('#takePhotoButton');
    this._cameraFeed = this._mainContent.querySelector('#cameraFeed');
    this._photoCanvas = this._mainContent.querySelector('#photoCanvas');
    this._capturedImagePreview = this._mainContent.querySelector('#capturedImagePreview');

    // Tambahan elemen untuk kontrol lokasi baru
    this._useGpsButton = this._mainContent.querySelector('#useGpsButton');
    this._inputManualButton = this._mainContent.querySelector('#inputManualButton');
    this._clearLocationButton = this._mainContent.querySelector('#clearLocationButton');
    this._locationStatus = this._mainContent.querySelector('#locationStatus');
    this._manualLocationInput = this._mainContent.querySelector('#manualLocationInput');
    this._manualLatInput = this._mainContent.querySelector('#manualLat');
    this._manualLonInput = this._mainContent.querySelector('#manualLon');
    this._setManualLocationButton = this._mainContent.querySelector('#setManualLocationButton');

    this._uploadButtonLabel = this._mainContent.querySelector('.upload-button');

    this._photoFileInput.addEventListener('change', (event) => {
      this._currentPhotoFile = event.target.files[0];
      if (this._currentPhotoFile) {
        this._capturedImagePreview.src = URL.createObjectURL(this._currentPhotoFile);
        this._capturedImagePreview.style.display = 'block';
        this._cameraFeed.style.display = 'none';
        this._photoCanvas.style.display = 'none';
        this._takePhotoButton.style.display = 'none';
        CameraHelper.stopCamera(this._cameraStream);
        this._cameraStream = null;
      }
    });
  }

  _setupCamera() {
    // ... (kode _setupCamera Anda tetap sama)
    this._takePhotoButton.addEventListener('click', async () => {
        if (!this._cameraStream) {
            const stream = await CameraHelper.startCamera(this._cameraFeed);
            if (stream) {
                this._cameraStream = stream;
                this._cameraFeed.style.display = 'block';
                this._photoFileInput.style.display = 'none';
            } else {
                alert('Gagal mengakses kamera. Silakan pilih gambar dari perangkat Anda.');
                this._cameraFeed.style.display = 'none';
                this._takePhotoButton.style.display = 'none';
                this._photoFileInput.style.display = 'block';
                return;
            }
        }

        const context = this._photoCanvas.getContext('2d');
        this._photoCanvas.width = this._cameraFeed.videoWidth;
        this._photoCanvas.height = this._cameraFeed.videoHeight;
        context.drawImage(this._cameraFeed, 0, 0, this._photoCanvas.width, this._photoCanvas.height);

        this._photoCanvas.toBlob((blob) => {
            this._currentPhotoFile = new File([blob], `photo-${Date.now()}.png`, { type: 'image/png' });
            this._capturedImagePreview.src = URL.createObjectURL(this._currentPhotoFile);
            this._capturedImagePreview.style.display = 'block';
            this._cameraFeed.style.display = 'none';
            this._photoCanvas.style.display = 'none';
            this._takePhotoButton.style.display = 'none';
            CameraHelper.stopCamera(this._cameraStream);
            this._cameraStream = null;
        }, 'image/png');
    });

    CameraHelper.startCamera(this._cameraFeed)
      .then(stream => {
        if (stream) {
          this._cameraStream = stream;
          this._photoFileInput.style.display = 'none';
        } else {
          this._cameraFeed.style.display = 'none';
          this._takePhotoButton.style.display = 'none';
          this._photoFileInput.style.display = 'block';
        }
      })
      .catch(() => {
        this._cameraFeed.style.display = 'none';
        this._takePhotoButton.style.display = 'none';
        this._photoFileInput.style.display = 'block';
      });
  }

  _setupMap() {
    const mapElement = this._mainContent.querySelector('#addStoryMap');
    if (!mapElement) {
        console.error('Map element #addStoryMap not found. Ensure it exists in your template.');
        return;
    }

    // Inisialisasi peta dengan lokasi default Surakarta: -7.5561, 110.8315
    this._map = MapHelper.initMap(mapElement, [-7.5561, 110.8315], 13);

    // Tambahkan Layer Control
    const baseLayers = MapHelper.getMapLayers();
    MapHelper.addLayerControl(this._map, baseLayers);

    // Event listener untuk klik peta
    this._map.on('click', (e) => {
      this._updateLocation(e.latlng.lat, e.latlng.lng);
    });

    // Coba dapatkan lokasi awal pengguna
    this._getLocationFromGPS();
  }

  _setupLocationControls() {
    this._useGpsButton.addEventListener('click', () => this._getLocationFromGPS());
    this._inputManualButton.addEventListener('click', () => this._toggleManualInput(true));
    this._setManualLocationButton.addEventListener('click', () => this._setLocationFromManualInput());
    this._clearLocationButton.addEventListener('click', () => this._clearLocation());
  }

  _updateLocation(lat, lon, statusText = '') {
    // Hapus marker sebelumnya
    if (this._currentMarker) {
      this._map.removeLayer(this._currentMarker);
    }

    // Tambahkan marker baru dan atur view peta
    if (lat !== undefined && lon !== undefined) {
      this._latitudeInput.value = lat;
      this._longitudeInput.value = lon;
      this._displayLat.textContent = lat.toFixed(5);
      this._displayLon.textContent = lon.toFixed(5);
      this._currentMarker = MapHelper.addMarker(this._map, [lat, lon], `Lat: ${lat.toFixed(5)}<br>Lon: ${lon.toFixed(5)}`);
      this._map.setView([lat, lon], this._map.getZoom()); // Pertahankan zoom saat ini
      this._locationStatus.textContent = statusText;
      this._locationStatus.className = 'location-status success'; // Gaya sukses
    } else {
      // Jika lat/lon undefined, reset semua
      this._clearLocation(statusText); // Panggil _clearLocation dengan statusText
    }
    this._toggleManualInput(false); // Sembunyikan input manual setelah memilih lokasi
  }

  _getLocationFromGPS() {
    this._locationStatus.textContent = 'Mencari lokasi Anda...';
    this._locationStatus.className = 'location-status info'; // Gaya info

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this._updateLocation(lat, lon, 'Lokasi ditemukan dari GPS.');
          this._map.setView([lat, lon], 15); // Zoom lebih dekat ke lokasi GPS
        },
        (error) => {
          let errorMessage = 'Gagal mendapatkan lokasi - Akses lokasi ditolak.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Akses lokasi ditolak. Izinkan akses lokasi di pengaturan browser Anda.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = 'Informasi lokasi tidak tersedia.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage = 'Waktu permintaan lokasi habis.';
          }
          this._updateLocation(undefined, undefined, errorMessage); // Hapus lokasi, tampilkan error
          this._locationStatus.className = 'location-status error'; // Gaya error
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Opsi untuk akurasi tinggi
      );
    } else {
      this._updateLocation(undefined, undefined, 'Geolocation tidak didukung oleh browser Anda.');
      this._locationStatus.className = 'location-status error'; // Gaya error
    }
  }

  _toggleManualInput(show) {
    this._manualLocationInput.style.display = show ? 'block' : 'none';
    if (show) {
        // Isi input manual dengan koordinat saat ini jika ada
        this._manualLatInput.value = this._latitudeInput.value;
        this._manualLonInput.value = this._longitudeInput.value;
    }
  }

  _setLocationFromManualInput() {
    const lat = parseFloat(this._manualLatInput.value);
    const lon = parseFloat(this._manualLonInput.value);

    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      this._updateLocation(lat, lon, 'Lokasi diatur secara manual.');
      this._map.setView([lat, lon], this._map.getZoom()); // Pertahankan zoom saat ini
    } else {
      alert('Input Latitude dan Longitude tidak valid. Pastikan format angka benar dan dalam rentang yang sesuai.');
      this._locationStatus.textContent = 'Input manual tidak valid.';
      this._locationStatus.className = 'location-status error';
    }
  }

  _clearLocation(statusText = 'Lokasi dihapus.') {
    if (this._currentMarker) {
      this._map.removeLayer(this._currentMarker);
      this._currentMarker = null;
    }
    this._latitudeInput.value = '';
    this._longitudeInput.value = '';
    this._displayLat.textContent = 'N/A';
    this._displayLon.textContent = 'N/A';
    this._locationStatus.textContent = statusText;
    this._locationStatus.className = 'location-status info'; // Gaya info
    this._toggleManualInput(false); // Sembunyikan input manual
  }


  getStoryData() {
    return {
      description: this._descriptionInput.value,
      photo: this._currentPhotoFile || this._photoFileInput.files[0],
      lat: this._latitudeInput.value ? parseFloat(this._latitudeInput.value) : undefined,
      lon: this._longitudeInput.value ? parseFloat(this._longitudeInput.value) : undefined,
    };
  }

  bindSubmit(handler) {
    this._mainContent.querySelector('#addStoryForm').addEventListener('submit', (event) => {
      event.preventDefault();
      handler();
    });
  }

  destroy() {
    CameraHelper.stopCamera(this._cameraStream);
    this._cameraStream = null;
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
    // Hapus event listener yang ditambahkan ke map untuk mencegah memory leaks
    // Pastikan event listener dibersihkan jika tidak menggunakan map.remove()
    // this._map.off('click'); // Jika hanya ada satu event listener 'click'
  }
}

export default AddStoryView;