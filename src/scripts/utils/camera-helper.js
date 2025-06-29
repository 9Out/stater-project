class CameraHelper {
  /**
   * Starts the camera feed and displays it on the given video element.
   * @param {HTMLVideoElement} videoElement The video element to display the camera feed.
   * @returns {Promise<MediaStream|null>} A promise that resolves with the MediaStream object or null if camera access fails.
   */
  static async startCamera(videoElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('getUserMedia not supported in this browser.');
      return null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer rear camera
      });
      videoElement.srcObject = stream;
      videoElement.play();
      return stream;
    } catch (err) {
      console.error('Error accessing camera: ', err);
      alert('Gagal mengakses kamera. Pastikan kamera tidak digunakan oleh aplikasi lain dan berikan izin.');
      return null;
    }
  }

  /**
   * Stops the given camera stream.
   * @param {MediaStream} stream The MediaStream object to stop.
   */
  static stopCamera(stream) {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      console.log('Camera stream stopped.');
    }
  }
}

export default CameraHelper;