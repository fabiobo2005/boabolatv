import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import UsersTab from './UsersTab';
import VideosTab from './VideosTab';
import ServerParametersTab from './ServerParametersTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Stats are now computed from the child components
  // For now, we show placeholder stats
  const stats = useMemo(
    () => ({
      totalUsers: 3,
      subscribers: 1,
      presenters: 1,
      admins: 1,
    }),
    []
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        {t('admin.title')}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="primary">
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('admin.stats.totalUsers')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {stats.subscribers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('admin.stats.subscribers')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {stats.presenters}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('admin.stats.presenters')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="error.main">
                {stats.admins}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('admin.stats.admins')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={t('admin.users')} />
          <Tab label={t('admin.videos')} />
          <Tab label={t('admin.serverParameters')} />
          <Tab label={t('admin.settings')} />
        </Tabs>
      </Box>

      {/* Users Tab */}
      <TabPanel value={tabValue} index={0}>
        <UsersTab />
      </TabPanel>

      {/* Videos Tab */}
      <TabPanel value={tabValue} index={1}>
        <VideosTab />
      </TabPanel>

      {/* Server Parameters Tab */}
      <TabPanel value={tabValue} index={2}>
        <ServerParametersTab />
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Configurações Gerais
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configurações adicionais do sistema em desenvolvimento.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}
