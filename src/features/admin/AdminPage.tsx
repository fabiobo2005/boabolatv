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
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import type { User, UserRole } from '../../types';

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

const mockUsersList: User[] = [
  { id: '1', email: 'admin@boabolatv.com', name: 'Admin', role: 'ADMIN' },
  { id: '2', email: 'presenter@boabolatv.com', name: 'Apresentador', role: 'PRESENTER' },
  { id: '3', email: 'subscriber@boabolatv.com', name: 'Assinante', role: 'SUBSCRIBER' },
  { id: '4', email: 'user@boabolatv.com', name: 'Usuário', role: 'USER' },
  { id: '5', email: 'visitor@boabolatv.com', name: 'Visitante', role: 'VISITOR' },
];

const roleColors: Record<UserRole, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
  VISITOR: 'default',
  USER: 'primary',
  PRESENTER: 'warning',
  SUBSCRIBER: 'success',
  ADMIN: 'error',
};

export default function AdminPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>(mockUsersList);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER' as UserRole,
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'USER' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'USER' });
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ));
    } else {
      const newUser: User = {
        id: String(Date.now()),
        ...formData,
      };
      setUsers([...users, newUser]);
    }
    handleCloseDialog();
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

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
                {users.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Usuários
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {users.filter(u => u.role === 'SUBSCRIBER').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assinantes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {users.filter(u => u.role === 'PRESENTER').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Apresentadores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color="error.main">
                {users.filter(u => u.role === 'ADMIN').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administradores
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={t('admin.users')} />
          <Tab label={t('admin.videos')} />
          <Tab label={t('admin.settings')} />
        </Tabs>
      </Box>

      {/* Users Tab */}
      <TabPanel value={tabValue} index={0}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Adicionar Usuário
          </Button>
        </Stack>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={roleColors[user.role]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Videos Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Gerenciamento de vídeos em desenvolvimento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Em breve você poderá gerenciar vídeos, categorias e tags diretamente por aqui.
          </Typography>
        </Paper>
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Configurações Gerais
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Nome do Canal"
                  defaultValue="Boa Bola TV"
                />
                <TextField
                  fullWidth
                  label="URL do YouTube"
                  defaultValue="https://youtube.com/@boabolatv"
                />
                <TextField
                  fullWidth
                  label="E-mail de Contato"
                  defaultValue="contato@boabolatv.com"
                />
                <Button variant="contained">
                  Salvar Configurações
                </Button>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Integrações
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="API Key do YouTube"
                  type="password"
                  placeholder="••••••••••••••••"
                />
                <TextField
                  fullWidth
                  label="Webhook URL"
                  placeholder="https://..."
                />
                <Button variant="outlined">
                  Testar Conexão
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Perfil</InputLabel>
              <Select
                value={formData.role}
                label="Perfil"
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <MenuItem value="VISITOR">Visitante</MenuItem>
                <MenuItem value="USER">Usuário</MenuItem>
                <MenuItem value="PRESENTER">Apresentador</MenuItem>
                <MenuItem value="SUBSCRIBER">Assinante</MenuItem>
                <MenuItem value="ADMIN">Administrador</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveUser} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
