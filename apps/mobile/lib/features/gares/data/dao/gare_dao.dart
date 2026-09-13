import 'package:sqflite/sqflite.dart';

import '../../../../core/storage/database/database_helper.dart';
import '../models/gare_model.dart';

class GareDao {
  GareDao({DatabaseHelper? databaseHelper})
    : _databaseHelper = databaseHelper ?? DatabaseHelper.instance;

  final DatabaseHelper _databaseHelper;

  Future<void> insert(GareModel gare) async {
    final db = await _databaseHelper.database;

    await db.insert(
      'gare',
      gare.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<GareModel?> findById(String id) async {
    final db = await _databaseHelper.database;

    final rows = await db.query(
      'gare',
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );

    if (rows.isEmpty) {
      return null;
    }

    return GareModel.fromMap(rows.first);
  }

  Future<List<GareModel>> findAll() async {
    final db = await _databaseHelper.database;

    final rows = await db.query('gare', orderBy: 'nom ASC');

    return rows.map(GareModel.fromMap).toList();
  }

  Future<void> update(GareModel gare) async {
    final db = await _databaseHelper.database;

    await db.update(
      'gare',
      gare.toMap(),
      where: 'id = ?',
      whereArgs: [gare.id],
    );
  }

  Future<void> delete(String id) async {
    final db = await _databaseHelper.database;

    await db.delete('gare', where: 'id = ?', whereArgs: [id]);
  }

  Future<int> count() async {
    final db = await _databaseHelper.database;

    final result = await db.rawQuery('SELECT COUNT(*) AS count FROM gare');

    return Sqflite.firstIntValue(result) ?? 0;
  }
}
