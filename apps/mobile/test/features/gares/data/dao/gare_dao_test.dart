import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

import 'package:fiche_chargement_app/core/storage/database/database_helper.dart';
import 'package:fiche_chargement_app/features/gares/data/dao/gare_dao.dart';
import 'package:fiche_chargement_app/features/gares/data/models/gare_model.dart';

void main() {
  sqfliteFfiInit();
  databaseFactory = databaseFactoryFfi;

  late GareDao gareDao;

  const gareId1 = 'TEST-DAO-GARE-001';
  const gareId2 = 'TEST-DAO-GARE-002';

  GareModel createGare({
    required String id,
    required String code,
    required String nom,
  }) {
    final now = DateTime.now();

    return GareModel(
      id: id,
      code: code,
      nom: nom,
      ville: 'Sherbrooke',
      adresse: 'Adresse de test',
      statut: 'ACTIF',
      createdAt: now,
      updatedAt: now,
    );
  }

  setUpAll(() async {
    final db = await DatabaseHelper.instance.database;

    await db.delete(
      'gare',
      where: 'id IN (?, ?)',
      whereArgs: [gareId1, gareId2],
    );
  });

  setUp(() async {
    final db = await DatabaseHelper.instance.database;

    await db.delete(
      'gare',
      where: 'id IN (?, ?)',
      whereArgs: [gareId1, gareId2],
    );

    gareDao = GareDao();
  });

  tearDown(() async {
    final db = await DatabaseHelper.instance.database;

    await db.delete(
      'gare',
      where: 'id IN (?, ?)',
      whereArgs: [gareId1, gareId2],
    );
  });

  tearDownAll(() async {
    await DatabaseHelper.instance.close();
  });

  group('GareDao', () {
    test('insert() doit enregistrer une gare', () async {
      final gare = createGare(id: gareId1, code: 'G001', nom: 'Gare Test 1');

      await gareDao.insert(gare);

      final result = await gareDao.findById(gareId1);

      expect(result, isNotNull);
      expect(result!.id, gareId1);
      expect(result.code, 'G001');
      expect(result.nom, 'Gare Test 1');
      expect(result.ville, 'Sherbrooke');
    });

    test('findById() doit retourner la gare demandée', () async {
      final gare = createGare(id: gareId1, code: 'G001', nom: 'Gare Test 1');

      await gareDao.insert(gare);

      final result = await gareDao.findById(gareId1);

      expect(result, isNotNull);
      expect(result!.id, gareId1);
      expect(result.nom, 'Gare Test 1');
    });

    test('findById() doit retourner null si la gare n’existe pas', () async {
      final result = await gareDao.findById('GARE-INEXISTANTE');

      expect(result, isNull);
    });

    test('findAll() doit retourner toutes les gares', () async {
      final gare1 = createGare(id: gareId1, code: 'G001', nom: 'Gare A');

      final gare2 = createGare(id: gareId2, code: 'G002', nom: 'Gare B');

      await gareDao.insert(gare1);
      await gareDao.insert(gare2);

      final result = await gareDao.findAll();

      expect(result.length, 2);
      expect(result.map((gare) => gare.id), containsAll([gareId1, gareId2]));
    });

    test('update() doit modifier une gare existante', () async {
      final gare = createGare(id: gareId1, code: 'G001', nom: 'Ancien Nom');

      await gareDao.insert(gare);

      final gareUpdated = GareModel(
        id: gare.id,
        code: gare.code,
        nom: 'Nouveau Nom',
        ville: 'Montréal',
        adresse: 'Nouvelle adresse',
        statut: 'INACTIF',
        createdAt: gare.createdAt,
        updatedAt: DateTime.now(),
      );

      await gareDao.update(gareUpdated);

      final result = await gareDao.findById(gareId1);

      expect(result, isNotNull);
      expect(result!.nom, 'Nouveau Nom');
      expect(result.ville, 'Montréal');
      expect(result.adresse, 'Nouvelle adresse');
      expect(result.statut, 'INACTIF');
    });

    test('count() doit retourner le nombre de gares', () async {
      final gare1 = createGare(id: gareId1, code: 'G001', nom: 'Gare A');

      final gare2 = createGare(id: gareId2, code: 'G002', nom: 'Gare B');

      await gareDao.insert(gare1);
      await gareDao.insert(gare2);

      final result = await gareDao.count();

      expect(result, 2);
    });

    test('delete() doit supprimer une gare', () async {
      final gare = createGare(id: gareId1, code: 'G001', nom: 'Gare Test');

      await gareDao.insert(gare);

      var result = await gareDao.findById(gareId1);

      expect(result, isNotNull);

      await gareDao.delete(gareId1);

      result = await gareDao.findById(gareId1);

      expect(result, isNull);
    });
  });
}
