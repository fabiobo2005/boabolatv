import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Chip,
  Button,
  Pagination,
  InputAdornment,
  Stack,
} from '@mui/material';
import { Search as SearchIcon, PlayArrow as PlayIcon } from '@mui/icons-material';
import { mockVideos } from '../../services/mock';

const ITEMS_PER_PAGE = 6;

export default function VideoLibraryPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const filteredVideos = useMemo(() => {
    return mockVideos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.description.toLowerCase().includes(search.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      
      return matchesSearch;
    });
  }, [search]);

  const paginatedVideos = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredVideos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVideos, page]);

  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        {t('videos.title')}
      </Typography>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          placeholder={t('videos.searchPlaceholder')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 300 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      {/* Selected Video Player */}
      {selectedVideo && (
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%',
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: 'black',
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </Box>
          <Button 
            onClick={() => setSelectedVideo(null)} 
            sx={{ mt: 1 }}
          >
            {t('videos.closePlayer')}
          </Button>
        </Box>
      )}

      {/* Video Grid */}
      {paginatedVideos.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          {t('videos.noResults')}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {paginatedVideos.map(video => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSelectedVideo(video.youtubeId)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    {video.isLive && (
                      <Chip label="AO VIVO" color="error" size="small" />
                    )}
                    {video.isRestricted && (
                      <Chip label="EXCLUSIVO" color="primary" size="small" />
                    )}
                  </Stack>
                  <Typography variant="subtitle1" component="h2" fontWeight={600} gutterBottom>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {video.description.slice(0, 100)}...
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {video.tags.slice(0, 3).map(tag => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatViewCount(video.viewCount)} {t('videos.views')} • {video.duration}
                  </Typography>
                  <Button 
                    size="small" 
                    startIcon={<PlayIcon />}
                    onClick={() => setSelectedVideo(video.youtubeId)}
                  >
                    {t('videos.watchNow')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
}
