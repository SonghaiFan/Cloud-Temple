const STORAGE_KEY = 'cloud_temple_buddha_image';

export const storageService = {
  saveImage: (base64Image: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, base64Image);
      return true;
    } catch (e) {
      console.error("Failed to save image to storage", e);
      return false;
    }
  },

  getImage: (): string | null => {
    return localStorage.getItem(STORAGE_KEY);
  },

  clearImage: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};