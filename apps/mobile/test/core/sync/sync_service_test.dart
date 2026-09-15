import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

import 'package:fiche_chargement_app/core/sync/dao/sync_queue_dao.dart';
import 'package:fiche_chargement_app/core/sync/sync_queue.dart';
import 'package:fiche_chargement_app/core/sync/sync_service.dart';
import 'package:fiche_chargement_app/features/gares/data/datasources/gare_api_data_source.dart';
import 'package:fiche_chargement_app/features/gares/data/models/gare_model.dart';

import '../../helpers/test_database_helper.dart';

class FakeGareApiDataSource extends GareApiDataSource {
  FakeGareApiDataSource({this.shouldFail = false}) : super(dio: Dio());

  final bool shouldFail;

  final List<GareModel> createdGares = [];

  @override
  Future<GareModel> create(GareModel gare) async {
    if (shouldFail) {
      throw Exception('Erreur réseau simulée');
    }

    createdGares.add(gare);

    return gare;
  }
}

void main() {
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;

  late TestDatabaseHelper databaseHelper;
  late SyncQueueDao syncQueueDao;
  late FakeGareApiDataSource fakeGareApiDataSource;
  late SyncService syncService;

  setUp(() async {
    databaseHelper = TestDatabaseHelper(databaseName: 'sync_service_test.db');

    syncQueueDao = SyncQueueDao(databaseProvider: databaseHelper);

    fakeGareApiDataSource = FakeGareApiDataSource();

    syncService = SyncService(
      syncQueueDao: syncQueueDao,
      gareApiDataSource: fakeGareApiDataSource,
    );

    final db = await databaseHelper.database;

    await db.delete('sync_queue');
  });

  tearDown(() async {
    await databaseHelper.close();
  });

  SyncQueueItem createItem({
    String id = 'sync-001',
    String entity = 'GARE',
    String entityId = 'gare-001',
    String operation = 'CREATE',
  }) {
    return SyncQueueItem(
      id: id,
      entity: entity,
      entityId: entityId,
      operation: operation,
      payload: const {
        'id': 'gare-001',
        'code': 'GARE001',
        'nom': 'Gare Test',
        'ville': 'Sherbrooke',
        'adresse': '123 Rue Test',
        'statut': 'ACTIF',
        'latitude': 45.4001,
        'longitude': -71.8929,
        'createdAt': '2026-09-14T10:00:00.000',
        'updatedAt': '2026-09-14T10:00:00.000',
      },
      createdAt: DateTime.parse('2026-09-14T10:00:00.000'),
    );
  }

  test('retourne les éléments en attente', () async {
    await syncQueueDao.insert(createItem());

    final result = await syncService.getPendingItems();

    expect(result.length, 1);
    expect(result.first.id, 'sync-001');
  });

  test('retourne le nombre d éléments en attente', () async {
    expect(await syncService.getPendingCount(), 0);

    await syncQueueDao.insert(createItem(id: 'sync-001', entityId: 'gare-001'));

    await syncQueueDao.insert(createItem(id: 'sync-002', entityId: 'gare-002'));

    expect(await syncService.getPendingCount(), 2);
  });

  test('marque un élément comme syncing', () async {
    await syncQueueDao.insert(createItem());

    await syncService.markAsSyncing('sync-001');

    final db = await databaseHelper.database;

    final rows = await db.query(
      'sync_queue',
      where: 'id = ?',
      whereArgs: ['sync-001'],
    );

    expect(rows.length, 1);
    expect(rows.first['status'], 'syncing');
    expect(rows.first['last_attempt_at'], isNotNull);
  });

  test('marque un élément comme synced', () async {
    await syncQueueDao.insert(createItem());

    await syncService.markAsSynced('sync-001');

    final db = await databaseHelper.database;

    final rows = await db.query(
      'sync_queue',
      where: 'id = ?',
      whereArgs: ['sync-001'],
    );

    expect(rows.length, 1);
    expect(rows.first['status'], 'synced');
    expect(rows.first['last_attempt_at'], isNotNull);
    expect(rows.first['last_error'], isNull);
  });

  test('marque un élément comme failed', () async {
    await syncQueueDao.insert(createItem());

    await syncService.markAsFailed(
      'sync-001',
      error: 'Erreur réseau',
      retryCount: 2,
    );

    final db = await databaseHelper.database;

    final rows = await db.query(
      'sync_queue',
      where: 'id = ?',
      whereArgs: ['sync-001'],
    );

    expect(rows.length, 1);
    expect(rows.first['status'], 'failed');
    expect(rows.first['retry_count'], 2);
    expect(rows.first['last_error'], 'Erreur réseau');
    expect(rows.first['last_attempt_at'], isNotNull);
  });

  test('supprime un élément de la file', () async {
    await syncQueueDao.insert(createItem());

    await syncService.remove('sync-001');

    final result = await syncQueueDao.findById('sync-001');

    expect(result, isNull);
  });

  test('synchronise une création de gare avec succès', () async {
    final item = createItem();

    await syncQueueDao.insert(item);

    await syncService.syncCreateGare(item);

    expect(fakeGareApiDataSource.createdGares.length, 1);
    expect(fakeGareApiDataSource.createdGares.first.code, 'GARE001');

    final db = await databaseHelper.database;

    final rows = await db.query(
      'sync_queue',
      where: 'id = ?',
      whereArgs: ['sync-001'],
    );

    expect(rows.length, 1);
    expect(rows.first['status'], 'synced');
    expect(rows.first['last_error'], isNull);
  });

  test('marque la création comme failed en cas d erreur', () async {
    fakeGareApiDataSource = FakeGareApiDataSource(shouldFail: true);

    syncService = SyncService(
      syncQueueDao: syncQueueDao,
      gareApiDataSource: fakeGareApiDataSource,
    );

    final item = createItem();

    await syncQueueDao.insert(item);

    await expectLater(syncService.syncCreateGare(item), throwsException);

    final db = await databaseHelper.database;

    final rows = await db.query(
      'sync_queue',
      where: 'id = ?',
      whereArgs: ['sync-001'],
    );

    expect(rows.length, 1);
    expect(rows.first['status'], 'failed');
    expect(rows.first['retry_count'], 1);
    expect(rows.first['last_error'], contains('Erreur réseau simulée'));
    expect(rows.first['last_attempt_at'], isNotNull);
  });
}
