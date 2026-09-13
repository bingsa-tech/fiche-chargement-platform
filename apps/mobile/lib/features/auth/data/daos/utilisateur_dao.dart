import 'package:sqflite/sqflite.dart';
import 'package:fiche_chargement_app/core/storage/database/database_helper.dart';

import '../models/utilisateur_model.dart';

class UtilisateurDao {
  final DatabaseHelper _dbHelper = DatabaseHelper.instance;

  /// Sauvegarde ou met à jour l'utilisateur connecté dans SQLite.
  Future<void> insertOrUpdate(UtilisateurModel user) async {
    final db = await _dbHelper.database;

    // On nettoie d'abord la table pour ne conserver que la session de l'utilisateur actif localement
    await clearCache();

    await db.insert(
      'utilisateur',
      user.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Récupère l'utilisateur actuellement stocké en cache local.
  Future<UtilisateurModel?> getSavedUser() async {
    final db = await _dbHelper.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'utilisateur',
      limit: 1,
    );

    if (maps.isEmpty) {
      return null;
    }

    return UtilisateurModel.fromMap(maps.first);
  }

  /// Supprime la session utilisateur locale lors de la déconnexion.
  Future<void> clearCache() async {
    final db = await _dbHelper.database;
    await db.delete('utilisateur');
  }
}
