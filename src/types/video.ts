export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  category: VideoCategory;
  tags: string[];
  isLive: boolean;
  isRestricted: boolean;
  viewCount: number;
}

export type VideoCategory = 
  | 'match-highlights'
  | 'analysis'
  | 'interviews'
  | 'tutorials'
  | 'live'
  | 'podcast'
  | 'news';

export interface VideoFilter {
  search: string;
  category: VideoCategory | 'all';
  tags: string[];
  isLive?: boolean;
}

export interface VideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  width?: string | number;
  height?: string | number;
}
