import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Stack,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, Sync as TestIcon } from '@mui/icons-material';
import type { ServerParameters } from '../../types/admin';
import { serverParametersApi } from '../../services/mock/admin';

export default function ServerParametersTab() {
  const { t } = useTranslation();
  const [params, setParams] = useState<ServerParameters>({
    db_host: '',
    db_port: '',
    db_name: '',
    db_user: '',
    db_password: '',
    storage_account_name: '',
    storage_account_key: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadParameters();
  }, []);

  const loadParameters = async () => {
    setLoading(true);
    try {
      const data = await serverParametersApi.get();
      setParams(data);
    } catch {
      setError('Erro ao carregar parâmetros');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);

    try {
      await serverParametersApi.save(params);
      setSuccess(t('admin.messages.parametersSaved'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar parâmetros');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setError(null);
    setTesting(true);

    try {
      const result = await serverParametersApi.testConnection();
      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao testar conexão');
    } finally {
      setTesting(false);
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Database Configuration */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('admin.serverParams.database')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <TextField
                fullWidth
                label={t('admin.serverParams.dbHost')}
                value={params.db_host}
                onChange={(e) =>
                  setParams({ ...params, db_host: e.target.value })
                }
                placeholder="boabolatv-server"
              />
              <TextField
                fullWidth
                label={t('admin.serverParams.dbPort')}
                value={params.db_port}
                onChange={(e) =>
                  setParams({ ...params, db_port: e.target.value })
                }
                placeholder="5432"
              />
              <TextField
                fullWidth
                label={t('admin.serverParams.dbName')}
                value={params.db_name}
                onChange={(e) =>
                  setParams({ ...params, db_name: e.target.value })
                }
                placeholder="boabolatv-database"
              />
              <TextField
                fullWidth
                label={t('admin.serverParams.dbUser')}
                value={params.db_user}
                onChange={(e) =>
                  setParams({ ...params, db_user: e.target.value })
                }
                placeholder="postgres"
              />
              <TextField
                fullWidth
                label={t('admin.serverParams.dbPassword')}
                type="password"
                value={params.db_password}
                onChange={(e) =>
                  setParams({ ...params, db_password: e.target.value })
                }
                placeholder="••••••••"
              />

              <Button
                variant="outlined"
                startIcon={testing ? <CircularProgress size={20} /> : <TestIcon />}
                onClick={handleTestConnection}
                disabled={testing || saving}
              >
                {t('admin.serverParams.testConnection')}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Storage Configuration */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('admin.serverParams.storage')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <TextField
                fullWidth
                label={t('admin.serverParams.storageAccountName')}
                value={params.storage_account_name}
                onChange={(e) =>
                  setParams({ ...params, storage_account_name: e.target.value })
                }
                placeholder="boabolatvstorage"
              />
              <TextField
                fullWidth
                label={t('admin.serverParams.storageAccountKey')}
                type="password"
                value={params.storage_account_key}
                onChange={(e) =>
                  setParams({ ...params, storage_account_key: e.target.value })
                }
                placeholder="••••••••"
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving || testing}
          size="large"
        >
          {t('admin.serverParams.saveParameters')}
        </Button>
      </Box>
    </Box>
  );
}
