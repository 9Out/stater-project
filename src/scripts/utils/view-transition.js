/**
 * Initiates a View Transition if the browser supports it, otherwise falls back to direct rendering.
 * @param {Function} callback The function containing the DOM update logic that triggers the transition.
 */
const startViewTransitionIfSupported = async (callback) => {
  // Pastikan browser mendukung View Transitions
  if (!document.startViewTransition) {
    await callback(); // Jika tidak didukung, langsung panggil callback dan selesai
    return;
  }

  // Jika didukung, mulai transisi
  // .finished adalah Promise yang akan resolve ketika transisi selesai,
  // animasi CSS telah berjalan dan DOM telah diperbarui.
  try {
    await document.startViewTransition(callback).finished;
    // console.log('View transition finished successfully.'); // Opsional: log untuk debugging
  } catch (error) {
    console.error('View transition interrupted or failed:', error);
    // Tangani kasus jika transisi terinterupsi (misal, user navigasi lagi sebelum selesai)
    // Atau jika ada error dalam callback.
    // DOM mungkin sudah diperbarui, tapi animasi tidak selesai.
  }
};

export { startViewTransitionIfSupported };