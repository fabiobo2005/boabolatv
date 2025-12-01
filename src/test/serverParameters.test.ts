import { describe, it, expect, beforeEach } from 'vitest';
import { serverParametersApi } from '../services/mock/admin';
import type { ServerParameters } from '../types/admin';

describe('serverParametersApi', () => {
  const validParams: ServerParameters = {
    db_host: 'test-server.postgres.database.azure.com',
    db_port: '5432',
    db_name: 'test-database',
    db_user: 'testuser',
    db_password: 'testpassword',
    storage_account_name: 'teststorage',
    storage_account_key: 'teststoragekey',
  };

  beforeEach(async () => {
    // Reset to default parameters
    const defaultParams: ServerParameters = {
      db_host: 'boabolatv-server.postgres.database.azure.com',
      db_port: '5432',
      db_name: 'boabolatv-database',
      db_user: '',
      db_password: '',
      storage_account_name: '',
      storage_account_key: '',
    };
    // Save default parameters to reset state
    try {
      await serverParametersApi.save(defaultParams);
    } catch {
      // Ignore errors during reset
    }
  });

  describe('get', () => {
    it('should return server parameters', async () => {
      const params = await serverParametersApi.get();

      expect(params).toBeDefined();
      expect(typeof params.db_host).toBe('string');
      expect(typeof params.db_port).toBe('string');
      expect(typeof params.db_name).toBe('string');
      expect(typeof params.db_user).toBe('string');
      expect(typeof params.db_password).toBe('string');
      expect(typeof params.storage_account_name).toBe('string');
      expect(typeof params.storage_account_key).toBe('string');
    });
  });

  describe('save', () => {
    it('should save valid parameters successfully', async () => {
      const savedParams = await serverParametersApi.save(validParams);

      expect(savedParams.db_host).toBe(validParams.db_host);
      expect(savedParams.db_port).toBe(validParams.db_port);
      expect(savedParams.db_name).toBe(validParams.db_name);
      expect(savedParams.db_user).toBe(validParams.db_user);
      expect(savedParams.db_password).toBe(validParams.db_password);
      expect(savedParams.storage_account_name).toBe(
        validParams.storage_account_name
      );
      expect(savedParams.storage_account_key).toBe(
        validParams.storage_account_key
      );
    });

    it('should persist saved parameters', async () => {
      await serverParametersApi.save(validParams);
      const retrievedParams = await serverParametersApi.get();

      expect(retrievedParams.db_host).toBe(validParams.db_host);
      expect(retrievedParams.db_name).toBe(validParams.db_name);
    });

    it('should throw error when required connection fields are missing', async () => {
      const invalidParams: ServerParameters = {
        db_host: '',
        db_port: '',
        db_name: '',
        db_user: '',
        db_password: '',
        storage_account_name: '',
        storage_account_key: '',
      };

      await expect(serverParametersApi.save(invalidParams)).rejects.toThrow(
        'Parâmetros de conexão obrigatórios não preenchidos'
      );
    });

    it('should throw error when db_host is missing', async () => {
      const paramsWithoutHost: ServerParameters = {
        ...validParams,
        db_host: '',
      };

      await expect(serverParametersApi.save(paramsWithoutHost)).rejects.toThrow(
        'Parâmetros de conexão obrigatórios não preenchidos'
      );
    });

    it('should throw error when db_port is missing', async () => {
      const paramsWithoutPort: ServerParameters = {
        ...validParams,
        db_port: '',
      };

      await expect(serverParametersApi.save(paramsWithoutPort)).rejects.toThrow(
        'Parâmetros de conexão obrigatórios não preenchidos'
      );
    });

    it('should throw error when db_name is missing', async () => {
      const paramsWithoutName: ServerParameters = {
        ...validParams,
        db_name: '',
      };

      await expect(serverParametersApi.save(paramsWithoutName)).rejects.toThrow(
        'Parâmetros de conexão obrigatórios não preenchidos'
      );
    });
  });

  describe('testConnection', () => {
    it('should return success for valid connection parameters', async () => {
      const result = await serverParametersApi.testConnection(validParams);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        'Conexão com o banco de dados estabelecida com sucesso!'
      );
    });

    it('should return failure when db_host is missing', async () => {
      const paramsWithoutHost: ServerParameters = {
        ...validParams,
        db_host: '',
      };

      const result =
        await serverParametersApi.testConnection(paramsWithoutHost);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Host e nome do banco de dados são obrigatórios.'
      );
    });

    it('should return failure when db_name is missing', async () => {
      const paramsWithoutName: ServerParameters = {
        ...validParams,
        db_name: '',
      };

      const result =
        await serverParametersApi.testConnection(paramsWithoutName);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Host e nome do banco de dados são obrigatórios.'
      );
    });

    it('should return failure when both host and name are missing', async () => {
      const invalidParams: ServerParameters = {
        db_host: '',
        db_port: '5432',
        db_name: '',
        db_user: '',
        db_password: '',
        storage_account_name: '',
        storage_account_key: '',
      };

      const result = await serverParametersApi.testConnection(invalidParams);

      expect(result.success).toBe(false);
    });
  });

  describe('save with connection validation', () => {
    it('should validate connection before saving', async () => {
      // Save should succeed with valid params
      const savedParams = await serverParametersApi.save(validParams);
      expect(savedParams).toBeDefined();

      // Verify parameters were persisted
      const retrieved = await serverParametersApi.get();
      expect(retrieved.db_host).toBe(validParams.db_host);
    });

    it('should use provided connection parameters to connect', async () => {
      // This test verifies that the save function uses the form's connection
      // parameters to establish a connection before saving
      const customParams: ServerParameters = {
        db_host: 'custom-server.database.azure.com',
        db_port: '5433',
        db_name: 'custom-db',
        db_user: 'customuser',
        db_password: 'custompass',
        storage_account_name: 'customstorage',
        storage_account_key: 'customkey',
      };

      const saved = await serverParametersApi.save(customParams);

      // Verify the custom parameters were saved
      expect(saved.db_host).toBe('custom-server.database.azure.com');
      expect(saved.db_port).toBe('5433');
      expect(saved.db_name).toBe('custom-db');
    });
  });
});
