// Admin types for PostgreSQL integration

export interface Usuario {
  id: number;
  login: string;
  email: string;
  senha?: string; // Password field, only used when creating/updating
  created_at?: string;
  updated_at?: string;
}

export interface UsuarioFormData {
  login: string;
  email: string;
  senha: string;
}

export interface AdminVideo {
  id: number;
  titulo: string;
  descricao?: string;
  youtube_url?: string;
  storage_path?: string;
  data_upload?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminVideoFormData {
  titulo: string;
  descricao?: string;
  youtube_url?: string;
  file?: File;
}

export interface ServerParameters {
  db_host: string;
  db_port: string;
  db_name: string;
  db_user: string;
  db_password: string;
  storage_account_name: string;
  storage_account_key: string;
}

export interface ServerParameter {
  id: number;
  param_key: string;
  param_value: string;
  created_at?: string;
  updated_at?: string;
}
