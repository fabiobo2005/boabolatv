import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as UploadIcon,
  YouTube as YouTubeIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import type { AdminVideo, AdminVideoFormData } from '../../types/admin';
import { adminVideosApi } from '../../services/mock/admin';

export default function VideosTab() {
  const { t } = useTranslation();
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideo | null>(null);
  const [formData, setFormData] = useState<AdminVideoFormData>({
    titulo: '',
    descricao: '',
    youtube_url: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await adminVideosApi.list();
      setVideos(data);
    } catch {
      setError('Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (video?: AdminVideo) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        titulo: video.titulo,
        descricao: video.descricao || '',
        youtube_url: video.youtube_url || '',
      });
    } else {
      setEditingVideo(null);
      setFormData({ titulo: '', descricao: '', youtube_url: '' });
    }
    setSelectedFile(null);
    setError(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVideo(null);
    setFormData({ titulo: '', descricao: '', youtube_url: '' });
    setSelectedFile(null);
    setError(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Por favor, selecione um arquivo de vídeo');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSaveVideo = async () => {
    setError(null);
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.titulo) {
        setError('Título é obrigatório');
        setSaving(false);
        return;
      }

      // For new videos, either youtube_url or file is required
      if (!editingVideo && !formData.youtube_url && !selectedFile) {
        setError('Informe uma URL do YouTube ou faça upload de um arquivo');
        setSaving(false);
        return;
      }

      const dataToSave: AdminVideoFormData = {
        ...formData,
        file: selectedFile || undefined,
      };

      if (editingVideo) {
        await adminVideosApi.update(editingVideo.id, dataToSave);
        setSuccess(t('admin.messages.videoUpdated'));
      } else {
        await adminVideosApi.create(dataToSave);
        setSuccess(t('admin.messages.videoCreated'));
      }

      await loadVideos();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar vídeo');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este vídeo?')) {
      return;
    }

    try {
      await adminVideosApi.delete(id);
      setSuccess(t('admin.messages.videoDeleted'));
      await loadVideos();
    } catch {
      setError('Erro ao excluir vídeo');
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const getVideoSource = (video: AdminVideo) => {
    if (video.youtube_url) {
      return (
        <Chip
          icon={<YouTubeIcon />}
          label="YouTube"
          color="error"
          size="small"
        />
      );
    }
    if (video.storage_path) {
      return (
        <Chip
          icon={<StorageIcon />}
          label="Storage"
          color="primary"
          size="small"
        />
      );
    }
    return null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t('admin.videoForm.addVideo')}
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t('admin.table.title')}</TableCell>
              <TableCell>{t('admin.table.description')}</TableCell>
              <TableCell>{t('admin.table.source')}</TableCell>
              <TableCell>{t('admin.table.uploadDate')}</TableCell>
              <TableCell align="right">{t('admin.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>{video.id}</TableCell>
                <TableCell>{video.titulo}</TableCell>
                <TableCell>
                  {video.descricao
                    ? video.descricao.slice(0, 50) +
                      (video.descricao.length > 50 ? '...' : '')
                    : '-'}
                </TableCell>
                <TableCell>{getVideoSource(video)}</TableCell>
                <TableCell>{formatDate(video.data_upload)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(video)}
                    title={t('common.edit')}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteVideo(video.id)}
                    title={t('common.delete')}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {videos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    Nenhum vídeo cadastrado
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Video Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingVideo
            ? t('admin.videoForm.editVideo')
            : t('admin.videoForm.newVideo')}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              fullWidth
              label={t('admin.videoForm.title')}
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              placeholder={t('admin.videoForm.titlePlaceholder')}
              required
            />

            <TextField
              fullWidth
              label={t('admin.videoForm.description')}
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              placeholder={t('admin.videoForm.descriptionPlaceholder')}
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label={t('admin.videoForm.youtubeUrl')}
              value={formData.youtube_url}
              onChange={(e) =>
                setFormData({ ...formData, youtube_url: e.target.value })
              }
              placeholder={t('admin.videoForm.youtubeUrlPlaceholder')}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('admin.videoForm.uploadFile')}
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                fullWidth
              >
                {selectedFile
                  ? selectedFile.name
                  : t('admin.videoForm.selectFile')}
              </Button>
              {editingVideo?.storage_path && !selectedFile && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  Arquivo atual: {editingVideo.storage_path}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSaveVideo}
            variant="contained"
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
