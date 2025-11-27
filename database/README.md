# Boa Bola TV - Database Schema

Este diretório contém os scripts SQL para o esquema do banco de dados PostgreSQL utilizado pelo Boa Bola TV.

## 🏗️ Estrutura

```
database/
└── migrations/
    └── 001_initial_schema.sql  # Schema inicial com todas as tabelas
```

## 📊 Diagrama de Entidades

```
┌─────────────┐       ┌─────────────┐
│   users     │       │  athletes   │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ name        │       │ name        │
│ email       │       │ country     │
│ password_   │       │ birthdate   │
│   hash      │       │ handedness  │
│ role        │       │ ranking     │
│ avatar_url  │       │ image_url   │
│ created_at  │       │ created_at  │
│ updated_at  │       │ updated_at  │
└─────────────┘       └──────┬──────┘
                             │
      ┌──────────────────────┼──────────────────────┐
      │                      │                      │
      ▼                      ▼                      ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   matches   │       │   scores    │       │   stats     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ match_id(FK)│       │ id (PK)     │
│ sport       │       │ set_number  │       │ match_id(FK)│──────►matches
│ tournament  │       │ games_a     │       │ aces_a/b    │
│ match_date  │       │ games_b     │       │ errors_a/b  │
│ round       │       │ tiebreak_a  │       │ winners_a/b │
│ player_a_id │──────►│ tiebreak_b  │       │ ...         │
│ player_b_id │──────►│ is_completed│       │ updated_at  │
│ winner_id   │       │ created_at  │       └─────────────┘
│ is_live     │       │ updated_at  │
│ start_time  │       └─────────────┘
│ end_time    │
│ created_at  │       ┌─────────────────┐
│ updated_at  │       │ refresh_tokens  │
└─────────────┘       ├─────────────────┤
                      │ id (PK)         │
                      │ user_id (FK)    │──────►users
                      │ token_hash      │
                      │ expires_at      │
                      │ created_at      │
                      │ revoked_at      │
                      │ replaced_by (FK)│
                      └─────────────────┘
```

## 📋 Tabelas

### `users`
Armazena informações de usuários para autenticação e autorização.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | Identificador único |
| name | VARCHAR(255) | Nome do usuário |
| email | VARCHAR(255) UNIQUE | E-mail para login |
| password_hash | TEXT | Hash da senha (bcrypt/argon2) |
| role | ENUM | VISITOR, USER, PRESENTER, SUBSCRIBER, ADMIN |
| avatar_url | TEXT | URL da foto de perfil |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### `athletes`
Armazena informações dos atletas/jogadores.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | Identificador único |
| name | VARCHAR(255) | Nome do atleta |
| country | VARCHAR(100) | País que representa |
| birthdate | DATE | Data de nascimento |
| handedness | ENUM | LEFT ou RIGHT |
| ranking | INTEGER | Ranking atual |
| image_url | TEXT | URL da foto |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### `matches`
Armazena informações das partidas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | Identificador único |
| sport | ENUM | TENNIS, PADEL, BADMINTON, SQUASH |
| tournament | VARCHAR(255) | Nome do torneio |
| match_date | DATE | Data da partida |
| round | VARCHAR(100) | Fase do torneio |
| player_a_id | UUID (FK) | Referência ao atleta A |
| player_b_id | UUID (FK) | Referência ao atleta B |
| winner_id | UUID (FK) | Referência ao vencedor |
| is_live | BOOLEAN | Se a partida está ao vivo |
| start_time | TIMESTAMP | Horário de início |
| end_time | TIMESTAMP | Horário de término |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### `scores`
Armazena os placares set a set.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | Identificador único |
| match_id | UUID (FK) | Referência à partida |
| set_number | INTEGER | Número do set (1, 2, 3...) |
| games_player_a | INTEGER | Games do jogador A |
| games_player_b | INTEGER | Games do jogador B |
| tiebreak_points_a | INTEGER | Pontos no tiebreak (jogador A) |
| tiebreak_points_b | INTEGER | Pontos no tiebreak (jogador B) |
| is_completed | BOOLEAN | Se o set foi finalizado |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### `stats`
Armazena estatísticas detalhadas das partidas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | Identificador único |
| match_id | UUID (FK) | Referência à partida |
| aces_player_a/b | INTEGER | Aces |
| double_faults_a/b | INTEGER | Duplas faltas |
| first_serve_pct_a/b | NUMERIC | % primeiro saque |
| unforced_errors_a/b | INTEGER | Erros não forçados |
| winners_a/b | INTEGER | Winners |
| break_points_converted_a/b | INTEGER | Break points convertidos |
| avg_serve_speed_a/b | NUMERIC | Velocidade média do saque |
| ... | ... | Outras estatísticas |
| updated_at | TIMESTAMP | Data de atualização |

### `refresh_tokens`
Armazena tokens de refresh para autenticação JWT.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID (PK) | Identificador único |
| user_id | UUID (FK) | Referência ao usuário |
| token_hash | TEXT | Hash do token |
| expires_at | TIMESTAMP | Data de expiração |
| created_at | TIMESTAMP | Data de criação |
| revoked_at | TIMESTAMP | Data de revogação |
| replaced_by | UUID (FK) | Token substituto |

## 🔐 Roles e Permissões

O schema define duas roles de banco de dados:

- **boabolatv_readonly**: Acesso somente leitura (SELECT)
- **boabolatv_readwrite**: Acesso de leitura e escrita (SELECT, INSERT, UPDATE, DELETE)

## 🚀 Como Executar

### Configuração de Conexão (Azure)

```bash
export PGHOST=boabolatv-db.postgres.database.azure.com
export PGUSER=admin@MngEnvMCAP198698.onmicrosoft.com
export PGPORT=5432
export PGDATABASE=postgres
export PGPASSWORD="$(az account get-access-token --resource https://ossrdbms-aad.database.windows.net --query accessToken --output tsv)"
```

### Executar Migration

```bash
# Via psql
psql -f database/migrations/001_initial_schema.sql

# Com variáveis de ambiente
psql "host=$PGHOST port=$PGPORT dbname=$PGDATABASE user=$PGUSER password=$PGPASSWORD sslmode=require" \
  -f database/migrations/001_initial_schema.sql
```

## 📝 Notas de Design

1. **UUIDs**: Todas as chaves primárias usam UUID (`gen_random_uuid()`) para melhor distribuição e segurança.

2. **Normalização 3NF**: O schema segue a terceira forma normal:
   - Todos os atributos são atômicos
   - Não há dependências parciais
   - Não há dependências transitivas

3. **Integridade Referencial**: 
   - Chaves estrangeiras garantem relacionamentos válidos
   - `ON DELETE CASCADE` para registros dependentes (scores, stats)
   - `ON DELETE RESTRICT` para prevenir exclusão de atletas com partidas

4. **Índices**: Criados para colunas frequentemente consultadas:
   - `users.email` - Login
   - `athletes.name` - Busca
   - `matches.tournament` - Filtros
   - `matches.is_live` - Partidas ao vivo

5. **Triggers**: Atualização automática de `updated_at` em todas as tabelas.

## 🔄 Integração com APIs

O schema está preparado para integração com:

- **Node.js + Knex**: Use o script SQL como migration manual
- **Prisma**: Gere o schema Prisma com `prisma db pull`
- **TypeORM**: Crie entities baseadas nas tabelas

Os tipos TypeScript em `src/types/` correspondem às tabelas do banco.
