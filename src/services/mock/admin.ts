import type {
  Usuario,
  UsuarioFormData,
  AdminVideo,
  AdminVideoFormData,
  ServerParameters,
} from '../../types/admin';

// Mock data for usuarios (simulating PostgreSQL data)
let mockUsuarios: Usuario[] = [
  {
    id: 1,
    login: 'admin',
    email: 'admin@boabolatv.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    login: 'presenter',
    email: 'presenter@boabolatv.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    login: 'subscriber',
    email: 'subscriber@boabolatv.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock data for videos
let mockAdminVideos: AdminVideo[] = [
  {
    id: 1,
    titulo: 'FINAIS COSAT / ITF TENNIS TOUR JUNIORS J60',
    descricao:
      'Transmissão ao vivo das finais do torneio COSAT ITF Tennis Tour Juniors J60.',
    youtube_url: 'https://www.youtube.com/watch?v=meUkV1J7ckM',
    data_upload: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    titulo: 'HENRIQUE KMEZ VS TOMAS MACEDO',
    descricao: 'Jogo completo com placar e scout.',
    youtube_url: 'https://www.youtube.com/watch?v=__7fBOo78F8',
    data_upload: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock server parameters
let mockServerParameters: ServerParameters = {
  db_host: 'boabolatv-server',
  db_port: '5432',
  db_name: 'boabolatv-database',
  db_user: '',
  db_password: '',
  storage_account_name: '',
  storage_account_key: '',
};

let nextUsuarioId = 4;
let nextVideoId = 3;

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// Usuarios API
// ============================================================================

export const usuariosApi = {
  async list(): Promise<Usuario[]> {
    await delay(300);
    return [...mockUsuarios];
  },

  async get(id: number): Promise<Usuario | undefined> {
    await delay(200);
    return mockUsuarios.find((u) => u.id === id);
  },

  async create(data: UsuarioFormData): Promise<Usuario> {
    await delay(400);

    // Check for duplicate login
    if (mockUsuarios.some((u) => u.login === data.login)) {
      throw new Error('Login já existe');
    }

    // Check for duplicate email
    if (mockUsuarios.some((u) => u.email === data.email)) {
      throw new Error('E-mail já existe');
    }

    const newUsuario: Usuario = {
      id: nextUsuarioId++,
      login: data.login,
      email: data.email,
      // Note: In a real implementation, the password would be hashed server-side
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockUsuarios.push(newUsuario);
    return newUsuario;
  },

  async update(
    id: number,
    data: Partial<UsuarioFormData>
  ): Promise<Usuario | undefined> {
    await delay(400);

    const index = mockUsuarios.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Check for duplicate login (excluding current user)
    if (
      data.login &&
      mockUsuarios.some((u) => u.login === data.login && u.id !== id)
    ) {
      throw new Error('Login já existe');
    }

    // Check for duplicate email (excluding current user)
    if (
      data.email &&
      mockUsuarios.some((u) => u.email === data.email && u.id !== id)
    ) {
      throw new Error('E-mail já existe');
    }

    mockUsuarios[index] = {
      ...mockUsuarios[index],
      ...(data.login && { login: data.login }),
      ...(data.email && { email: data.email }),
      updated_at: new Date().toISOString(),
    };

    return mockUsuarios[index];
  },

  async delete(id: number): Promise<boolean> {
    await delay(300);

    const index = mockUsuarios.findIndex((u) => u.id === id);
    if (index === -1) {
      return false;
    }

    mockUsuarios = mockUsuarios.filter((u) => u.id !== id);
    return true;
  },
};

// ============================================================================
// Videos API
// ============================================================================

export const adminVideosApi = {
  async list(): Promise<AdminVideo[]> {
    await delay(300);
    return [...mockAdminVideos];
  },

  async get(id: number): Promise<AdminVideo | undefined> {
    await delay(200);
    return mockAdminVideos.find((v) => v.id === id);
  },

  async create(data: AdminVideoFormData): Promise<AdminVideo> {
    await delay(400);

    // Validate that either youtube_url or file is provided
    if (!data.youtube_url && !data.file) {
      throw new Error('Informe uma URL do YouTube ou faça upload de um arquivo');
    }

    let storagePath: string | undefined;

    // Simulate file upload to storage account
    if (data.file) {
      // In a real implementation, this would upload to Azure Storage
      storagePath = `videos/${Date.now()}_${data.file.name}`;
    }

    const newVideo: AdminVideo = {
      id: nextVideoId++,
      titulo: data.titulo,
      descricao: data.descricao,
      youtube_url: data.youtube_url,
      storage_path: storagePath,
      data_upload: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockAdminVideos.push(newVideo);
    return newVideo;
  },

  async update(
    id: number,
    data: Partial<AdminVideoFormData>
  ): Promise<AdminVideo | undefined> {
    await delay(400);

    const index = mockAdminVideos.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error('Vídeo não encontrado');
    }

    let storagePath = mockAdminVideos[index].storage_path;

    // Simulate file upload if new file is provided
    if (data.file) {
      storagePath = `videos/${Date.now()}_${data.file.name}`;
    }

    mockAdminVideos[index] = {
      ...mockAdminVideos[index],
      ...(data.titulo && { titulo: data.titulo }),
      ...(data.descricao !== undefined && { descricao: data.descricao }),
      ...(data.youtube_url !== undefined && { youtube_url: data.youtube_url }),
      ...(storagePath && { storage_path: storagePath }),
      updated_at: new Date().toISOString(),
    };

    return mockAdminVideos[index];
  },

  async delete(id: number): Promise<boolean> {
    await delay(300);

    const index = mockAdminVideos.findIndex((v) => v.id === id);
    if (index === -1) {
      return false;
    }

    mockAdminVideos = mockAdminVideos.filter((v) => v.id !== id);
    return true;
  },
};

// ============================================================================
// Server Parameters API
// ============================================================================

export const serverParametersApi = {
  async get(): Promise<ServerParameters> {
    await delay(200);
    return { ...mockServerParameters };
  },

  async save(params: ServerParameters): Promise<ServerParameters> {
    await delay(400);

    mockServerParameters = { ...params };
    return mockServerParameters;
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    await delay(500);

    // Simulate connection test
    if (mockServerParameters.db_host && mockServerParameters.db_name) {
      return {
        success: true,
        message: 'Conexão com o banco de dados estabelecida com sucesso!',
      };
    }

    return {
      success: false,
      message: 'Falha ao conectar. Verifique os parâmetros de conexão.',
    };
  },
};
