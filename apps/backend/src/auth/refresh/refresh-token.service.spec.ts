import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
} from '@jest/globals';

import { DataSource, Repository } from 'typeorm';

import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

describe('RefreshTokenService - PostgreSQL integration', () => {
  let dataSource: DataSource;
  let repository: Repository<RefreshToken>;
  let service: RefreshTokenService;

  let testUser: Utilisateur;

  const createdTokenIds: number[] = [];

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'db_fiche_chargement',

      /*
       * Important :
       * On charge toutes les entités du backend afin que
       * TypeORM puisse résoudre correctement les relations
       * entre Utilisateur, Role, Gare, Fiche, etc.
       */
      entities: [__dirname + '/../../**/*.entity.ts'],

      synchronize: false,
      logging: false,
    });

    await dataSource.initialize();

    repository = dataSource.getRepository(RefreshToken);

    service = new RefreshTokenService(repository);

    const utilisateurRepository =
      dataSource.getRepository(Utilisateur);

    testUser = await utilisateurRepository.findOne({
      where: {},
    }) as Utilisateur;

    if (!testUser) {
      throw new Error(
        'Aucun utilisateur trouvé dans la table utilisateur.',
      );
    }
  });

  afterEach(async () => {
    if (createdTokenIds.length === 0) {
      return;
    }

    await repository.delete(createdTokenIds);

    createdTokenIds.length = 0;
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('doit générer un refresh token aléatoire', () => {
    const token1 = service.generateToken();
    const token2 = service.generateToken();

    expect(token1).toBeDefined();
    expect(token2).toBeDefined();

    expect(token1).not.toBe(token2);

    expect(token1).toMatch(/^[a-f0-9]+$/);
    expect(token2).toMatch(/^[a-f0-9]+$/);

    expect(token1).toHaveLength(128);
    expect(token2).toHaveLength(128);
  });

  it('doit produire le même hash SHA-256 pour le même token', () => {
    const token = service.generateToken();

    const hash1 = service.hashToken(token);
    const hash2 = service.hashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it('doit créer et enregistrer un refresh token dans PostgreSQL', async () => {
    const expiresAt = service.getExpirationDate(7);

    const result = await service.create(
      testUser,
      expiresAt,
      'Jest Test Agent',
      '127.0.0.1',
    );

    createdTokenIds.push(result.refreshToken.id);

    expect(result.token).toBeDefined();
    expect(result.token).toHaveLength(128);

    expect(result.refreshToken.id).toBeGreaterThan(0);
    expect(result.refreshToken.userId).toBe(testUser.id);

    expect(result.refreshToken.tokenHash).toBe(
      service.hashToken(result.token),
    );

    expect(result.refreshToken.revokedAt).toBeNull();
    expect(result.refreshToken.replacedByTokenId).toBeNull();

    expect(result.refreshToken.userAgent).toBe(
      'Jest Test Agent',
    );

    expect(result.refreshToken.ipAddress).toBe(
      '127.0.0.1',
    );

    const databaseToken = await repository.findOne({
      where: {
        id: result.refreshToken.id,
      },
    });

    expect(databaseToken).not.toBeNull();

    expect(databaseToken?.tokenHash).toBe(
      service.hashToken(result.token),
    );
  });

  it('doit retrouver un refresh token valide', async () => {
    const result = await service.create(
      testUser,
      service.getExpirationDate(7),
    );

    createdTokenIds.push(result.refreshToken.id);

    const found = await service.findValidToken(
      result.token,
    );

    expect(found).not.toBeNull();
    expect(found?.id).toBe(result.refreshToken.id);
    expect(found?.userId).toBe(testUser.id);
  });

  it('ne doit pas retrouver un token inexistant', async () => {
    const found = await service.findValidToken(
      'token-inexistant-pour-le-test',
    );

    expect(found).toBeNull();
  });

  it('ne doit pas retrouver un token expiré', async () => {
    const expiredDate =
      new Date(Date.now() - 60_000);

    const result = await service.create(
      testUser,
      expiredDate,
    );

    createdTokenIds.push(result.refreshToken.id);

    const found = await service.findValidToken(
      result.token,
    );

    expect(found).toBeNull();
  });

  it('doit révoquer un refresh token', async () => {
    const result = await service.create(
      testUser,
      service.getExpirationDate(7),
    );

    createdTokenIds.push(result.refreshToken.id);

    expect(result.refreshToken.revokedAt).toBeNull();

    const revoked = await service.revoke(
      result.refreshToken,
    );

    expect(revoked.revokedAt).not.toBeNull();

    const databaseToken = await repository.findOne({
      where: {
        id: result.refreshToken.id,
      },
    });

    expect(databaseToken?.revokedAt).not.toBeNull();
  });

  it('ne doit plus considérer un token révoqué comme valide', async () => {
    const result = await service.create(
      testUser,
      service.getExpirationDate(7),
    );

    createdTokenIds.push(result.refreshToken.id);

    await service.revoke(result.refreshToken);

    const found = await service.findValidToken(
      result.token,
    );

    expect(found).toBeNull();
  });

  it('doit révoquer un token avec revokeByToken()', async () => {
    const result = await service.create(
      testUser,
      service.getExpirationDate(7),
    );

    createdTokenIds.push(result.refreshToken.id);

    const revoked = await service.revokeByToken(
      result.token,
    );

    expect(revoked).toBe(true);

    const databaseToken = await repository.findOne({
      where: {
        id: result.refreshToken.id,
      },
    });

    expect(databaseToken?.revokedAt).not.toBeNull();
  });

  it('doit retourner false avec revokeByToken() pour un token inexistant', async () => {
    const revoked = await service.revokeByToken(
      'token-inexistant-pour-le-test',
    );

    expect(revoked).toBe(false);
  });

  it('doit marquer un token comme remplacé', async () => {
    const expiresAt =
      service.getExpirationDate(7);

    const original = await service.create(
      testUser,
      expiresAt,
    );

    const replacement = await service.create(
      testUser,
      expiresAt,
    );

    createdTokenIds.push(original.refreshToken.id);
    createdTokenIds.push(replacement.refreshToken.id);

    const updated =
      await service.markAsReplaced(
        original.refreshToken,
        replacement.refreshToken,
      );

    expect(updated.revokedAt).not.toBeNull();

    expect(updated.replacedByTokenId).toBe(
      replacement.refreshToken.id,
    );

    const databaseOriginal =
      await repository.findOne({
        where: {
          id: original.refreshToken.id,
        },
      });

    expect(databaseOriginal?.revokedAt).not.toBeNull();

    expect(
      databaseOriginal?.replacedByTokenId,
    ).toBe(replacement.refreshToken.id);
  });

  it('doit calculer une date d expiration future', () => {
    const before = Date.now();

    const expiration =
      service.getExpirationDate(7);

    const after = Date.now();

    expect(expiration.getTime()).toBeGreaterThan(
      before,
    );

    expect(expiration.getTime()).toBeGreaterThan(
      after,
    );

    const sevenDays =
      7 * 24 * 60 * 60 * 1000;

    expect(
      expiration.getTime() - before,
    ).toBeGreaterThanOrEqual(
      sevenDays - 1000,
    );
  });

  it('doit supprimer les tokens expirés', async () => {
    const expiredDate =
      new Date(Date.now() - 60_000);

    const result = await service.create(
      testUser,
      expiredDate,
    );

    createdTokenIds.push(result.refreshToken.id);

    const beforeDelete =
      await repository.findOne({
        where: {
          id: result.refreshToken.id,
        },
      });

    expect(beforeDelete).not.toBeNull();

    const deletedCount =
      await service.deleteExpired();

    expect(deletedCount).toBeGreaterThanOrEqual(1);

    const afterDelete =
      await repository.findOne({
        where: {
          id: result.refreshToken.id,
        },
      });

    expect(afterDelete).toBeNull();

    const index =
      createdTokenIds.indexOf(
        result.refreshToken.id,
      );

    if (index !== -1) {
      createdTokenIds.splice(index, 1);
    }
  });
});

