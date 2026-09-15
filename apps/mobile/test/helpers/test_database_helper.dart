import 'dart:io';

import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

import 'package:fiche_chargement_app/core/storage/database/database_provider.dart';
import 'package:fiche_chargement_app/core/storage/database/database_schema.dart';

class TestDatabaseHelper implements DatabaseProvider {
  TestDatabaseHelper({required this.databaseName});

  final String databaseName;

  Database? _database;

  @override
  Future<Database> get database async {
    if (_database != null) {
      return _database!;
    }

    final databasesPath = await getDatabasesPath();
    final path = join(databasesPath, databaseName);

    _database = await openDatabase(
      path,
      version: DatabaseSchema.version,
      onConfigure: (db) async {
        await db.execute('PRAGMA foreign_keys = ON');
      },
      onCreate: (db, version) async {
        for (final table in DatabaseSchema.createTables) {
          await db.execute(table);
        }

        for (final index in DatabaseSchema.createIndexes) {
          await db.execute(index);
        }
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        if (oldVersion < 2) {
          await db.execute('ALTER TABLE gare ADD COLUMN latitude REAL');

          await db.execute('ALTER TABLE gare ADD COLUMN longitude REAL');
        }
      },
    );

    return _database!;
  }

  @override
  Future<void> close() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
    }
  }

  Future<void> deleteDatabase() async {
    await close();

    final databasesPath = await getDatabasesPath();
    final path = join(databasesPath, databaseName);

    final file = File(path);

    if (await file.exists()) {
      await file.delete();
    }
  }
}
