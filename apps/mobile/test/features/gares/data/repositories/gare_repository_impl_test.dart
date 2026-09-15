import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

import 'package:fiche_chargement_app/core/sync/dao/sync_queue_dao.dart';
import 'package:fiche_chargement_app/features/gares/data/dao/gare_dao.dart';
import 'package:fiche_chargement_app/features/gares/data/models/gare_model.dart';
import 'package:fiche_chargement_app/features/gares/data/repositories/gare_repository_impl.dart';
import 'package:fiche_chargement_app/features/gares/domain/entities/gare.dart';

import '../../../../helpers/test_database_helper.dart';

class FakeGareDao extends GareDao {
  final Map<String, GareModel> _gares = {};

  @override
  Future<void> insert(GareModel gare) async {
    _gares[gare.id] = gare;
  }

  @override
  Future<GareModel?> findById(String id) async {
    return _gares[id];
  }

  @override
  Future<List<GareModel>> findAll() async {
    final result = _gares.values.toList();

    result.sort((a, b) => a.nom.compareTo(b.nom));

    return result;
  }

  @override
  Future<void> update(GareModel gare) async {
    _gares[gare.id] = gare;
  }

  @override
  Future<int> count() async {
    return _gares.length;
  }

  @override
  Future<void> delete(String id) async {
    _gares.remove(id);
  }
}

void main() {
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;

  late FakeGareDao fakeGareDao;
  late TestDatabaseHelper databaseHelper;
  late SyncQueueDao syncQueueDao;
  late GareRepositoryImpl repository;

  const gareId1 = 'REPO-GARE-001';
  const gareId2 = 'REPO-GARE-002';

  Gare createGare({
    required String id,
    required String code,
    required String nom,
  }) {
    final now = DateTime.now();

    return Gare(
      id: id,
      code: code,
      nom: nom,
      ville: 'Sherbrooke',
      adresse: 'Adresse de test',
      statut: 'ACTIF',
      latitude: 45.4001,
      longitude: -71.8929,
      createdAt: now,
      updatedAt: now,
    );
  }

  setUp(() async {
    fakeGareDao = FakeGareDao();

    databaseHelper = TestDatabaseHelper(
      databaseName: 'gare_repository_sync_test.db',
    );

    syncQueueDao = SyncQueueDao(databaseProvider: databaseHelper);

    final db = await databaseHelper.database;

    await db.delete('sync_queue');

    repository = GareRepositoryImpl(
      gareDao: fakeGareDao,
      syncQueueDao: syncQueueDao,
    );
  });

  tearDown(() async {
    await databaseHelper.close();
  });

  group('GareRepositoryImpl', () {
    test('insert() doit convertir et enregistrer une gare', () async {
      final gare = createGare(
        id: gareId1,
        code: 'G001',
        nom: 'Gare de Sherbrooke',
      );

      await repository.insert(gare);

      final result = await fakeGareDao.findById(gareId1);

      expect(result, isNotNull);
      expect(result!.id, gare.id);
      expect(result.code, gare.code);
      expect(result.nom, gare.nom);
      expect(result.ville, gare.ville);
      expect(result.adresse, gare.adresse);
      expect(result.statut, gare.statut);
      expect(result.latitude, gare.latitude);
      expect(result.longitude, gare.longitude);
      expect(result.createdAt, gare.createdAt);
      expect(result.updatedAt, gare.updatedAt);
    });

    test('insert() doit ajouter une opération CREATE dans la file', () async {
      final gare = createGare(
        id: gareId1,
        code: 'G001',
        nom: 'Gare de Sherbrooke',
      );

      await repository.insert(gare);

      final pendingItems = await syncQueueDao.findPending();

      expect(pendingItems.length, 1);

      final item = pendingItems.first;

      expect(item.entity, 'GARE');
      expect(item.entityId, gare.id);
      expect(item.operation, 'CREATE');
      expect(item.payload['id'], gare.id);
      expect(item.payload['code'], gare.code);
      expect(item.payload['nom'], gare.nom);
      expect(item.payload['ville'], gare.ville);
    });

    test('findById() doit retourner la gare demandée', () async {
      final gare = createGare(
        id: gareId1,
        code: 'G001',
        nom: 'Gare de Sherbrooke',
      );

      await fakeGareDao.insert(GareModel.fromEntity(gare));

      final result = await repository.findById(gareId1);

      expect(result, isNotNull);
      expect(result!.id, gare.id);
      expect(result.code, gare.code);
      expect(result.nom, gare.nom);
      expect(result.ville, gare.ville);
      expect(result.latitude, gare.latitude);
      expect(result.longitude, gare.longitude);
    });

    test('findById() doit retourner null si la gare n’existe pas', () async {
      final result = await repository.findById('GARE-INEXISTANTE');

      expect(result, isNull);
    });

    test('findAll() doit retourner toutes les gares', () async {
      final gare1 = createGare(id: gareId1, code: 'G001', nom: 'Gare A');

      final gare2 = createGare(id: gareId2, code: 'G002', nom: 'Gare B');

      await fakeGareDao.insert(GareModel.fromEntity(gare1));
      await fakeGareDao.insert(GareModel.fromEntity(gare2));

      final result = await repository.findAll();

      expect(result.length, 2);
      expect(result.map((gare) => gare.id), containsAll([gareId1, gareId2]));
    });

    test('update() doit convertir et modifier une gare', () async {
      final gare = createGare(id: gareId1, code: 'G001', nom: 'Ancien Nom');

      await repository.insert(gare);

      final gareUpdated = Gare(
        id: gare.id,
        code: gare.code,
        nom: 'Nouveau Nom',
        ville: 'Montréal',
        adresse: 'Nouvelle adresse',
        statut: 'INACTIF',
        latitude: 45.5017,
        longitude: -73.5673,
        createdAt: gare.createdAt,
        updatedAt: DateTime.now(),
      );

      await repository.update(gareUpdated);

      final result = await repository.findById(gareId1);

      expect(result, isNotNull);
      expect(result!.id, gareUpdated.id);
      expect(result.code, gareUpdated.code);
      expect(result.nom, 'Nouveau Nom');
      expect(result.ville, 'Montréal');
      expect(result.adresse, 'Nouvelle adresse');
      expect(result.statut, 'INACTIF');
      expect(result.latitude, gareUpdated.latitude);
      expect(result.longitude, gareUpdated.longitude);
      expect(result.createdAt, gareUpdated.createdAt);
      expect(result.updatedAt, gareUpdated.updatedAt);
    });

    test('update() doit ajouter une opération UPDATE dans la file', () async {
      final gare = createGare(id: gareId1, code: 'G001', nom: 'Ancien Nom');

      await repository.insert(gare);

      final gareUpdated = Gare(
        id: gare.id,
        code: gare.code,
        nom: 'Nouveau Nom',
        ville: 'Montréal',
        adresse: 'Nouvelle adresse',
        statut: 'INACTIF',
        latitude: 45.5017,
        longitude: -73.5673,
        createdAt: gare.createdAt,
        updatedAt: DateTime.now(),
      );

      await repository.update(gareUpdated);

      final pendingItems = await syncQueueDao.findPending();

      expect(pendingItems.length, 2);

      final updateItem = pendingItems.last;

      expect(updateItem.entity, 'GARE');
      expect(updateItem.entityId, gareUpdated.id);
      expect(updateItem.operation, 'UPDATE');
      expect(updateItem.payload['id'], gareUpdated.id);
      expect(updateItem.payload['nom'], 'Nouveau Nom');
      expect(updateItem.payload['ville'], 'Montréal');
      expect(updateItem.payload['statut'], 'INACTIF');
      expect(updateItem.payload['latitude'], 45.5017);
      expect(updateItem.payload['longitude'], -73.5673);
    });

    test('count() doit retourner le nombre de gares', () async {
      final gare1 = createGare(id: gareId1, code: 'G001', nom: 'Gare A');

      final gare2 = createGare(id: gareId2, code: 'G002', nom: 'Gare B');

      await repository.insert(gare1);
      await repository.insert(gare2);

      final result = await repository.count();

      expect(result, 2);
    });

    test('delete() doit supprimer une gare', () async {
      final gare = createGare(id: gareId1, code: 'G001', nom: 'Gare Test');

      await repository.insert(gare);

      var result = await repository.findById(gareId1);

      expect(result, isNotNull);

      await repository.delete(gareId1);

      result = await repository.findById(gareId1);

      expect(result, isNull);
    });

    test('delete() doit ajouter une opération DELETE dans la file', () async {
      final gare = createGare(id: gareId1, code: 'G001', nom: 'Gare Test');

      await repository.insert(gare);

      await repository.delete(gareId1);

      final pendingItems = await syncQueueDao.findPending();

      expect(pendingItems.length, 2);

      final deleteItem = pendingItems.last;

      expect(deleteItem.entity, 'GARE');
      expect(deleteItem.entityId, gareId1);
      expect(deleteItem.operation, 'DELETE');
      expect(deleteItem.payload['id'], gareId1);
    });
  });
}
