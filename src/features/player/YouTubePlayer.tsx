import { Box } from '@mui/material';
import type { VideoPlayerProps } from '../../types';

export default function YouTubePlayer({
  videoId,
  autoplay = false,
  controls = true,
  muted = false,
  width = '100%',
  height = '100%',
}: VideoPlayerProps) {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: controls ? '1' : '0',
    mute: muted ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
  });

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height: height === '100%' ? 0 : height,
        paddingBottom: height === '100%' ? '56.25%' : 0,
        overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: height === '100%' ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: height === '100%' ? '100%' : typeof height === 'number' ? `${height}px` : height,
          border: 'none',
          borderRadius: 8,
        }}
      />
    </Box>
  );
}
