import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Snackbar,
} from '@mui/material';
import { useAuth } from '../../shared/hooks';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, successMessage, clearError, clearSuccessMessage } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as LocationState)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login({ email, password });
    if (success) {
      // Short delay to show success message before navigating
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    }
  };

  const handleCloseSuccessSnackbar = () => {
    clearSuccessMessage();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight={700}>
              {t('common.appName')}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              {t('auth.login')}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
              />
              <TextField
                fullWidth
                label={t('auth.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : t('auth.login')}
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" display="block" align="center">
              Credenciais de teste:
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              admin@boabolatv.com / admin123
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              presenter@boabolatv.com / presenter123
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              subscriber@boabolatv.com / subscriber123
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccessSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
