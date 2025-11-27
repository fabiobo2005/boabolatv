import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuthStore } from '../../store';

// Mock data for charts
const monthlyViewsData = [
  { month: 'Jan', views: 4000, subscribers: 2400 },
  { month: 'Fev', views: 3000, subscribers: 2210 },
  { month: 'Mar', views: 5000, subscribers: 2290 },
  { month: 'Abr', views: 4780, subscribers: 2000 },
  { month: 'Mai', views: 5890, subscribers: 2181 },
  { month: 'Jun', views: 6390, subscribers: 2500 },
  { month: 'Jul', views: 7490, subscribers: 2700 },
];

const categoryData = [
  { name: 'Melhores Momentos', value: 35 },
  { name: 'Análises', value: 25 },
  { name: 'Entrevistas', value: 15 },
  { name: 'Tutoriais', value: 12 },
  { name: 'Podcast', value: 8 },
  { name: 'Notícias', value: 5 },
];

const playerPerformanceData = [
  { name: 'Alcaraz', aces: 45, winners: 120, errors: 35 },
  { name: 'Sinner', aces: 38, winners: 110, errors: 42 },
  { name: 'Djokovic', aces: 42, winners: 115, errors: 28 },
  { name: 'Medvedev', aces: 35, winners: 95, errors: 45 },
  { name: 'Zverev', aces: 52, winners: 105, errors: 50 },
];

const recentResults = [
  { event: 'ATP Finals', winner: 'Jannik Sinner', runner: 'Taylor Fritz', score: '6-4, 6-4' },
  { event: 'Paris Masters', winner: 'Alexander Zverev', runner: 'Hugo Gaston', score: '6-3, 6-4' },
  { event: 'Vienna Open', winner: 'Alex de Minaur', runner: 'Karen Khachanov', score: '6-3, 7-5' },
  { event: 'Basel Open', winner: 'Giovanni Mpetshi', runner: 'Ben Shelton', score: '7-6, 6-4' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function SubscribersPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        {t('subscribers.title')}
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {t('subscribers.welcome')} {user?.name}
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="primary">
                156
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vídeos Assistidos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="secondary">
                42h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tempo Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="success.main">
                89%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taxa de Conclusão
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                15
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Favoritos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Views Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Visualizações Mensais
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  name="Visualizações"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="#82ca9d" 
                  name="Assinantes"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Category Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Categorias Mais Assistidas
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Player Performance */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {t('subscribers.advancedStats')} - Performance dos Jogadores
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={playerPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="aces" fill="#8884d8" name="Aces" />
                <Bar dataKey="winners" fill="#82ca9d" name="Winners" />
                <Bar dataKey="errors" fill="#ff8042" name="Erros" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Results */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {t('subscribers.results')} Recentes
            </Typography>
            <Stack spacing={2}>
              {recentResults.map((result, index) => (
                <Box key={index}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Chip label={result.event} size="small" color="primary" sx={{ mb: 1 }} />
                      <Typography variant="body2">
                        <strong>{result.winner}</strong> def. {result.runner}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {result.score}
                    </Typography>
                  </Stack>
                  {index < recentResults.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Exclusive Content */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {t('subscribers.exclusiveContent')}
            </Typography>
            <Stack spacing={2}>
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Chip label="NOVO" size="small" color="error" sx={{ mb: 0.5 }} />
                      <Typography variant="body2" fontWeight={600}>
                        Análise Tática: A evolução do jogo de Alcaraz
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      45 min
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Entrevista exclusiva: Bastidores do ATP Finals
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      32 min
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Tutorial avançado: Técnicas de saque
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      28 min
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
