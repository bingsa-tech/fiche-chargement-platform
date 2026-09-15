import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:fiche_chargement_app/core/sync/dao/sync_queue_dao.dart';
import 'package:fiche_chargement_app/core/sync/sync_queue.dart';

import '../../../helpers/test_database_helper.dart';

void main() {
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;

  late TestDatabaseHelper databaseHelper;
  late SyncQueueDao dao;

  setUp(() async {
    databaseHelper = TestDatabaseHelper(databaseName: 'sync_queue_dao_test.db');

    dao = SyncQueueDao(databaseProvider: databaseHelper);

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
    Map<String, dynamic> payload = const {
      'code': 'GARE001',
      'nom': 'Gare Test',
      'ville': 'Sherbrooke',
    },
  }) {
    return SyncQueueItem(
      id: id,
      entity: entity,
      entityId: entityId,
      operation: operation,
      payload: payload,
      createdAt: DateTime.parse('2026-09-14T10:00:00.000'),
    );
  }

  test('insère un élément dans la file', () async {
    final item = createItem();

    await dao.insert(item);

    final result = await dao.findById('sync-001');

    expect(result, isNotNull);
    expect(result!.id, 'sync-001');
    expect(result.entity, 'GARE');
    expect(result.entityId, 'gare-001');
    expect(result.operation, 'CREATE');
    expect(result.payload['code'], 'GARE001');
  });

  test('retourne les éléments pending dans l ordre de création', () async {
    await dao.insert(createItem(id: 'sync-002', entityId: 'gare-002'));

    await dao.insert(createItem(id: 'sync-001', entityId: 'gare-001'));

    final result = await dao.findPending();

    expect(result.length, 2);
    expect(result.first.id, 'sync-002');
    expect(result.last.id, 'sync-001');
  });

  test('retourne null si l élément est introuvable', () async {
    final result = await dao.findById('inexistant');

    expect(result, isNull);
  });

  test('met à jour le statut d un élément', () async {
    await dao.insert(createItem());

    await dao.updateStatus(
      'sync-001',
      status: 'syncing',
      retryCount: 1,
      lastAttemptAt: DateTime.parse('2026-09-14T10:05:00.000'),
      lastError: null,
    );

    final result = await dao.findById('sync-001');

    expect(result, isNotNull);
  });

  test('supprime un élément de la file', () async {
    await dao.insert(createItem());

    await dao.delete('sync-001');

    final result = await dao.findById('sync-001');

    expect(result, isNull);
  });

  test('retourne le nombre d éléments dans la file', () async {
    expect(await dao.count(), 0);

    await dao.insert(createItem(id: 'sync-001', entityId: 'gare-001'));

    await dao.insert(createItem(id: 'sync-002', entityId: 'gare-002'));

    expect(await dao.count(), 2);
  });
}
