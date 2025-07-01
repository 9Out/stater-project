// src/scripts/utils/camera-helper.js
const CameraHelper = {
  _mediaStream: null,

  async startCamera(videoElement) {
    if (this._mediaStream && videoElement.srcObject === this._mediaStream) {
      // Stream already active and assigned to this video element
      return this._mediaStream;
    }

    // Stop any existing stream if it's different or not null
    if (this._mediaStream) {
        this.stopCamera();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this._mediaStream = stream;
      videoElement.srcObject = stream;
      videoElement.play(); // Pastikan video otomatis diputar
      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert(`Gagal mengakses kamera: ${error.name}. Pastikan Anda memberikan izin.`);
      this._mediaStream = null; // Reset if error
      return null;
    }
  },

  stopCamera() {
    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this._mediaStream = null;
    }
  },

  getStream() {
    return this._mediaStream;
  }
};

export default CameraHelper;