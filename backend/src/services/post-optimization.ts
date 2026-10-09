export type PostingMode = 'TEXT_ONLY' | 'ALTERNATING' | 'ALWAYS_IMAGE';

export interface PostingBehavior {
  mode: PostingMode;
  frequency: 'DAILY';
  hasImageToday: boolean;
  description: string;
}

export interface PostPayload {
  hasImage: boolean;
  selectedImage: string | null;
  textGenerationRequired: boolean;
  reason: string;
}

export class PostOptimizationService {
  /**
   * 1. Determine base posting mode based on Google Drive stock image count.
   * 
   * @param imageCount Number of stock images in Google Drive
   * @param dayIndex Posting day index (0, 1, 2...)
   */
  public determinePostingBehavior(imageCount: number, dayIndex: number = 0): PostingBehavior {
    if (imageCount === 0) {
      return {
        mode: 'TEXT_ONLY',
        frequency: 'DAILY',
        hasImageToday: false,
        description: '【パターンA】画像ストック0枚: 「画像なし（テキストのみ）」で毎日連続投稿します。'
      };
    } else if (imageCount >= 1 && imageCount <= 9) {
      const hasImageToday = dayIndex % 2 === 0;
      return {
        mode: 'ALTERNATING',
        frequency: 'DAILY',
        hasImageToday,
        description: `【パターンB】画像ストック${imageCount}枚（1〜9枚）: 「画像あり（ローテーション）」と「画像なし」を毎日交互に投稿します。本日は: ${hasImageToday ? '画像あり' : '画像なし'}`
      };
    } else {
      return {
        mode: 'ALWAYS_IMAGE',
        frequency: 'DAILY',
        hasImageToday: true,
        description: `【パターンC】画像ストック${imageCount}枚（10枚以上）: 「常に画像あり」で、画像を順次切り替えながら毎日投稿します。`
      };
    }
  }

  /**
   * 2. Generate post payload determining if image should be included.
   */
  public generatePostPayload(
    stockImages: string[],
    lastPostedIndex: number = -1,
    dayIndex: number = 0
  ): PostPayload {
    const imageCount = stockImages.length;
    const behavior = this.determinePostingBehavior(imageCount, dayIndex);

    if (!behavior.hasImageToday) {
      return {
        hasImage: false,
        selectedImage: null,
        textGenerationRequired: true,
        reason: `${behavior.mode} モードに基づく「画像なし（テキストのみ）」の投稿日です。`
      };
    }

    if (imageCount === 0) {
      return {
        hasImage: false,
        selectedImage: null,
        textGenerationRequired: true,
        reason: '画像ストックが存在しないため、画像なしで投稿します。'
      };
    }

    const nextIndex = (lastPostedIndex + 1) % imageCount;
    const selectedImage = stockImages[nextIndex];

    return {
      hasImage: true,
      selectedImage,
      textGenerationRequired: true,
      reason: `${behavior.mode} モードに基づき、ストック${imageCount}枚からインデックス[${nextIndex}]の画像「${selectedImage}」をローテーション選択しました。`
    };
  }
}
