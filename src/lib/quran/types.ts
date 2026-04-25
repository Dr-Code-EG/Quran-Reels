export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  translation: string;
  audioUrl: string;
}

export interface Reciter {
  id: string;
  name: string;
  nameAr: string;
  style: string;
  subfolder: string;
}

export interface PlatformConfig {
  name: string;
  nameAr: string;
  width: number;
  height: number;
  aspectRatio: string;
  maxDuration: number;
  fps: number;
  icon: string;
}

export interface VideoSettings {
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  reciterId: string;
  backgroundUrl: string;
  backgroundType: "image" | "gradient";
  platform: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  overlayColor: string;
  showTranslation: boolean;
  translationLang: string;
}
