import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  SportsTennis as TennisIcon,
} from '@mui/icons-material';
import { mockLiveMatch, mockMatchHistory, mockPlayers, createEmptyPlayerStats } from '../../services/mock';
import type { ShotType, MatchStats, Player } from '../../types';

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

const shotTypes: { value: ShotType; label: string }[] = [
  { value: 'ace', label: 'Ace' },
  { value: 'double-fault', label: 'Dupla Falta' },
  { value: 'forehand-winner', label: 'Winner de Forehand' },
  { value: 'backhand-winner', label: 'Winner de Backhand' },
  { value: 'forehand-unforced-error', label: 'Erro não forçado de Forehand' },
  { value: 'backhand-unforced-error', label: 'Erro não forçado de Backhand' },
  { value: 'serve-unforced-error', label: 'Erro não forçado de Saque' },
  { value: 'volley-winner', label: 'Winner de Voleio' },
  { value: 'volley-error', label: 'Erro de Voleio' },
  { value: 'overhead-winner', label: 'Winner de Smash' },
  { value: 'overhead-error', label: 'Erro de Smash' },
  { value: 'drop-shot-winner', label: 'Winner de Drop Shot' },
  { value: 'drop-shot-error', label: 'Erro de Drop Shot' },
  { value: 'lob-winner', label: 'Winner de Lob' },
  { value: 'lob-error', label: 'Erro de Lob' },
  { value: 'net-point', label: 'Ponto na Rede' },
];

export default function StatsPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [currentMatch, setCurrentMatch] = useState<MatchStats>(mockLiveMatch);
  const [selectedPlayer1, setSelectedPlayer1] = useState<string>('');
  const [selectedPlayer2, setSelectedPlayer2] = useState<string>('');
  const [selectedShotType, setSelectedShotType] = useState<ShotType>('ace');
  const [pointWinner, setPointWinner] = useState<'player1' | 'player2'>('player1');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatGameScore = (score: number) => {
    if (score === 0) return '0';
    if (score === 1) return '15';
    if (score === 2) return '30';
    if (score === 3) return '40';
    if (score === 4) return 'AD';
    return score.toString();
  };

  const handleStartNewMatch = () => {
    if (!selectedPlayer1 || !selectedPlayer2) return;
    
    const player1 = mockPlayers.find(p => p.id === selectedPlayer1);
    const player2 = mockPlayers.find(p => p.id === selectedPlayer2);
    
    if (!player1 || !player2) return;

    const newMatch: MatchStats = {
      id: `match-${Date.now()}`,
      sport: 'tennis',
      player1,
      player2,
      sets: [{ player1: 0, player2: 0 }],
      currentGame: { player1: 0, player2: 0 },
      currentServer: 'player1',
      isLive: true,
      startTime: new Date(),
      points: [],
      statistics: {
        player1: createEmptyPlayerStats(),
        player2: createEmptyPlayerStats(),
      },
    };
    
    setCurrentMatch(newMatch);
    setTabValue(1);
  };

  const handleAddPoint = () => {
    // Simplified point addition - just updates the display
    const newMatch = { ...currentMatch };
    const winner = pointWinner;
    const currentGame = { ...newMatch.currentGame };
    
    if (currentGame[winner] < 3) {
      currentGame[winner]++;
    } else if (currentGame[winner] === 3 && currentGame[winner === 'player1' ? 'player2' : 'player1'] < 3) {
      // Game won
      currentGame.player1 = 0;
      currentGame.player2 = 0;
      const currentSetIndex = newMatch.sets.length - 1;
      newMatch.sets[currentSetIndex] = {
        ...newMatch.sets[currentSetIndex],
        [winner]: newMatch.sets[currentSetIndex][winner] + 1,
      };
    } else {
      currentGame[winner]++;
    }
    
    newMatch.currentGame = currentGame;
    
    // Update statistics based on shot type
    const stats = { ...newMatch.statistics[winner] };
    if (selectedShotType === 'ace') stats.aces++;
    if (selectedShotType === 'double-fault') stats.doubleFaults++;
    if (selectedShotType === 'forehand-winner') stats.forehandWinners++;
    if (selectedShotType === 'backhand-winner') stats.backhandWinners++;
    if (selectedShotType.includes('error')) {
      if (selectedShotType.includes('forehand')) stats.forehandErrors++;
      if (selectedShotType.includes('backhand')) stats.backhandErrors++;
    }
    stats.totalPointsWon++;
    
    newMatch.statistics[winner] = stats;
    setCurrentMatch(newMatch);
  };

  const renderScoreboard = (match: MatchStats) => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={4}>
        <Box sx={{ textAlign: 'center', minWidth: 150 }}>
          <Typography variant="h6" fontWeight={600}>
            {match.player1.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {match.player1.country} • #{match.player1.ranking}
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2} alignItems="center">
          {match.sets.map((set, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>
                {set.player1}
              </Typography>
              {set.tiebreak && (
                <Typography variant="caption" color="text.secondary">
                  ({set.tiebreak.player1})
                </Typography>
              )}
            </Box>
          ))}
          <Box sx={{ mx: 2, textAlign: 'center' }}>
            <Chip 
              label={`${formatGameScore(match.currentGame.player1)} - ${formatGameScore(match.currentGame.player2)}`}
              color={match.isLive ? 'error' : 'default'}
            />
          </Box>
          {match.sets.map((set, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>
                {set.player2}
              </Typography>
              {set.tiebreak && (
                <Typography variant="caption" color="text.secondary">
                  ({set.tiebreak.player2})
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
        
        <Box sx={{ textAlign: 'center', minWidth: 150 }}>
          <Typography variant="h6" fontWeight={600}>
            {match.player2.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {match.player2.country} • #{match.player2.ranking}
          </Typography>
        </Box>
      </Stack>
      
      {match.isLive && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Chip 
            icon={<TennisIcon />} 
            label={match.currentServer === 'player1' ? match.player1.name : match.player2.name} 
            size="small"
            color="primary"
          />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Sacando
          </Typography>
        </Box>
      )}
    </Paper>
  );

  const renderStatsTable = (match: MatchStats) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{match.player1.name}</TableCell>
            <TableCell align="center">Estatística</TableCell>
            <TableCell align="right">{match.player2.name}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{match.statistics.player1.aces}</TableCell>
            <TableCell align="center">{t('stats.aces')}</TableCell>
            <TableCell align="right">{match.statistics.player2.aces}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{match.statistics.player1.doubleFaults}</TableCell>
            <TableCell align="center">{t('stats.doubleFaults')}</TableCell>
            <TableCell align="right">{match.statistics.player2.doubleFaults}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{match.statistics.player1.firstServePercentage}%</TableCell>
            <TableCell align="center">{t('stats.firstServe')} %</TableCell>
            <TableCell align="right">{match.statistics.player2.firstServePercentage}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{match.statistics.player1.firstServePointsWon}%</TableCell>
            <TableCell align="center">{t('stats.firstServe')} pontos ganhos</TableCell>
            <TableCell align="right">{match.statistics.player2.firstServePointsWon}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{match.statistics.player1.breakPointsConverted}%</TableCell>
            <TableCell align="center">{t('stats.breakPoints')} convertidos</TableCell>
            <TableCell align="right">{match.statistics.player2.breakPointsConverted}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{match.statistics.player1.forehandWinners}</TableCell>
            <TableCell align="center">{t('stats.forehand')} {t('stats.winners')}</TableCell>
            <TableCell align="right">{match.statistics.player2.forehandWinners}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{match.statistics.player1.forehandErrors}</TableCell>
            <TableCell align="center">{t('stats.forehand')} {t('stats.errors')}</TableCell>
            <TableCell align="right">{match.statistics.player2.forehandErrors}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{match.statistics.player1.backhandWinners}</TableCell>
            <TableCell align="center">{t('stats.backhand')} {t('stats.winners')}</TableCell>
            <TableCell align="right">{match.statistics.player2.backhandWinners}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{match.statistics.player1.backhandErrors}</TableCell>
            <TableCell align="center">{t('stats.backhand')} {t('stats.errors')}</TableCell>
            <TableCell align="right">{match.statistics.player2.backhandErrors}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{match.statistics.player1.netPointsWon}/{match.statistics.player1.netPoints}</TableCell>
            <TableCell align="center">Pontos na Rede</TableCell>
            <TableCell align="right">{match.statistics.player2.netPointsWon}/{match.statistics.player2.netPoints}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><strong>{match.statistics.player1.totalPointsWon}</strong></TableCell>
            <TableCell align="center"><strong>Total de Pontos</strong></TableCell>
            <TableCell align="right"><strong>{match.statistics.player2.totalPointsWon}</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        {t('stats.title')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={t('stats.newMatch')} />
          <Tab label={t('stats.liveMatches')} />
          <Tab label={t('stats.matchHistory')} />
          <Tab label={t('stats.h2h')} />
        </Tabs>
      </Box>

      {/* New Match Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('stats.startMatch')}
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('stats.player1')}</InputLabel>
                  <Select
                    value={selectedPlayer1}
                    label={t('stats.player1')}
                    onChange={(e) => setSelectedPlayer1(e.target.value)}
                  >
                    {mockPlayers.map(player => (
                      <MenuItem key={player.id} value={player.id} disabled={player.id === selectedPlayer2}>
                        {player.name} ({player.country}) - #{player.ranking}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>{t('stats.player2')}</InputLabel>
                  <Select
                    value={selectedPlayer2}
                    label={t('stats.player2')}
                    onChange={(e) => setSelectedPlayer2(e.target.value)}
                  >
                    {mockPlayers.map(player => (
                      <MenuItem key={player.id} value={player.id} disabled={player.id === selectedPlayer1}>
                        {player.name} ({player.country}) - #{player.ranking}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleStartNewMatch}
                  disabled={!selectedPlayer1 || !selectedPlayer2}
                >
                  {t('stats.startMatch')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Live Match Tab */}
      <TabPanel value={tabValue} index={1}>
        {renderScoreboard(currentMatch)}
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('stats.addPoint')}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Vencedor do Ponto</InputLabel>
                <Select
                  value={pointWinner}
                  label="Vencedor do Ponto"
                  onChange={(e) => setPointWinner(e.target.value as 'player1' | 'player2')}
                >
                  <MenuItem value="player1">{currentMatch.player1.name}</MenuItem>
                  <MenuItem value="player2">{currentMatch.player2.name}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tipo de Golpe</InputLabel>
                <Select
                  value={selectedShotType}
                  label="Tipo de Golpe"
                  onChange={(e) => setSelectedShotType(e.target.value as ShotType)}
                >
                  {shotTypes.map(shot => (
                    <MenuItem key={shot.value} value={shot.value}>
                      {shot.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddPoint}
              >
                {t('stats.addPoint')}
              </Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            {renderStatsTable(currentMatch)}
          </Grid>
        </Grid>
      </TabPanel>

      {/* Match History Tab */}
      <TabPanel value={tabValue} index={2}>
        <Stack spacing={3}>
          {mockMatchHistory.map(match => (
            <Box key={match.id}>
              {renderScoreboard(match)}
              {renderStatsTable(match)}
              <Divider sx={{ mt: 3 }} />
            </Box>
          ))}
        </Stack>
      </TabPanel>

      {/* H2H Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('stats.player1')}</InputLabel>
              <Select
                value={selectedPlayer1}
                label={t('stats.player1')}
                onChange={(e) => setSelectedPlayer1(e.target.value)}
              >
                {mockPlayers.map((player: Player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name} ({player.country})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('stats.player2')}</InputLabel>
              <Select
                value={selectedPlayer2}
                label={t('stats.player2')}
                onChange={(e) => setSelectedPlayer2(e.target.value)}
              >
                {mockPlayers.map((player: Player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name} ({player.country})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {selectedPlayer1 && selectedPlayer2 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              {mockPlayers.find(p => p.id === selectedPlayer1)?.name} vs {mockPlayers.find(p => p.id === selectedPlayer2)?.name}
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={4} sx={{ my: 3 }}>
              <Box>
                <Typography variant="h2" fontWeight={700} color="primary">
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary">Vitórias</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="h2" fontWeight={700} color="secondary">
                  2
                </Typography>
                <Typography variant="body2" color="text.secondary">Vitórias</Typography>
              </Box>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Último confronto: Roland Garros 2024 - 6-4, 7-6(5)
            </Typography>
          </Paper>
        )}
      </TabPanel>
    </Box>
  );
}
