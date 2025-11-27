import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import { mockVideos } from '../../services/mock';
import { YouTubePlayer } from '../player';

export default function LivePage() {
  const { t } = useTranslation();
  
  const liveVideo = mockVideos.find(v => v.isLive);
  const upcomingVideos = mockVideos.filter(v => !v.isLive).slice(0, 3);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        {t('live.title')}
      </Typography>

      {liveVideo ? (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label="AO VIVO" color="error" />
                <Typography variant="h6" fontWeight={600}>
                  {liveVideo.title}
                </Typography>
              </Stack>
              <YouTubePlayer videoId={liveVideo.youtubeId} autoplay />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {liveVideo.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {liveVideo.tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {t('live.upcoming')}
            </Typography>
            <Stack spacing={2}>
              {upcomingVideos.map(video => (
                <Card key={video.id} sx={{ display: 'flex' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 80, objectFit: 'cover' }}
                    image={video.thumbnail}
                    alt={video.title}
                  />
                  <CardContent sx={{ flex: 1, py: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {video.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {video.duration}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {t('live.noLive')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('live.upcoming')}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {upcomingVideos.map(video => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={video.thumbnail}
                    alt={video.title}
                  />
                  <CardContent>
                    <Typography variant="body2" fontWeight={600}>
                      {video.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {video.publishedAt}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
