import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

import 'database_provider.dart';
import 'database_schema.dart';

/// Gestionnaire principal de la base SQLite.
///
/// Cette classe est utilisée par l'application Flutter pour :
/// - ouvrir la base SQLite ;
/// - créer les tables ;
/// - créer les index ;
/// - gérer les migrations ;
/// - fermer proprement la base.
class DatabaseHelper implements DatabaseProvider {
  DatabaseHelper._internal();

  /// Instance singleton utilisée par l'application.
  static final DatabaseHelper instance = DatabaseHelper._internal();

  /// Nom de la base SQLite.
  static const String _databaseName = 'fiche_chargement.db';

  /// Instance SQLite ouverte.
  Database? _database;

  /// Retourne l'instance SQLite.
  ///
  /// Si la base n'est pas encore ouverte, elle est initialisée.
  @override
  Future<Database> get database async {
    if (_database != null && _database!.isOpen) {
      return _database!;
    }

    _database = await _initDatabase();

    return _database!;
  }

  /// Initialise et ouvre la base SQLite.
  Future<Database> _initDatabase() async {
    final databasePath = await getDatabasesPath();
    final path = join(databasePath, _databaseName);

    return openDatabase(
      path,
      version: DatabaseSchema.version,
      onConfigure: _onConfigure,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  /// Configuration exécutée avant l'ouverture complète de la base.
  ///
  /// Activation des contraintes de clés étrangères.
  Future<void> _onConfigure(Database db) async {
    await db.execute('PRAGMA foreign_keys = ON');
  }

  /// Création initiale de la base.
  Future<void> _onCreate(Database db, int version) async {
    // Création des tables.
    for (final table in DatabaseSchema.createTables) {
      await db.execute(table);
    }

    // Création des index.
    for (final index in DatabaseSchema.createIndexes) {
      await db.execute(index);
    }
  }

  /// Gestion des migrations SQLite.
  ///
  /// Pour l'instant, la version actuelle est 1.
  /// Les migrations seront ajoutées lorsque la version augmentera.
  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Exemple futur :
    //
    // if (oldVersion < 2) {
    //   await db.execute(
    //     'ALTER TABLE vehicule ADD COLUMN ...',
    //   );
    // }
    //
    // if (oldVersion < 3) {
    //   ...
    // }
  }

  /// Ferme la base SQLite.
  @override
  Future<void> close() async {
    final db = _database;

    if (db != null && db.isOpen) {
      await db.close();
    }

    _database = null;
  }
}
