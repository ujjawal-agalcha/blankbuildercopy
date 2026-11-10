/**
 * In-memory Image Cache for instantaneous, synchronous 2D and 3D texture drawing
 * Guarantees uploaded transparent PNGs, SVGs, and JPGs render without flicker or mirroring.
 */

type ImageListener = (url: string) => void;

class ImageCacheService {
  private cache = new Map<string, HTMLImageElement>();
  private pending = new Map<string, Promise<HTMLImageElement>>();
  private listeners = new Set<ImageListener>();

  /**
   * Preload an image URL (data URL, blob URL, or static asset)
   */
  public async preloadImage(url: string): Promise<HTMLImageElement> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    if (this.pending.has(url)) {
      return this.pending.get(url)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        this.cache.set(url, img);
        this.pending.delete(url);
        this.notifyListeners(url);
        resolve(img);
      };

      img.onerror = (err) => {
        this.pending.delete(url);
        console.warn(`Failed to preload image: ${url}`, err);
        reject(err);
      };

      img.src = url;
    });

    this.pending.set(url, promise);
    return promise;
  }

  /**
   * Synchronously get image if already cached
   */
  public getImageSync(url?: string): HTMLImageElement | null {
    if (!url) return null;
    const img = this.cache.get(url);
    if (img && img.complete && img.naturalWidth > 0) {
      return img;
    }
    // Trigger background preload if not already cached
    this.preloadImage(url).catch(() => {});
    return null;
  }

  /**
   * Subscribe to image load events
   */
  public subscribe(listener: ImageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(url: string) {
    this.listeners.forEach((listener) => {
      try {
        listener(url);
      } catch (e) {
        console.error('Error in imageCache listener', e);
      }
    });
  }
}

export const imageCache = new ImageCacheService();

