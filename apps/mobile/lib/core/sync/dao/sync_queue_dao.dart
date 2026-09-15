import 'dart:convert';

import 'package:sqflite/sqflite.dart';

import '../../storage/database/database_helper.dart';
import '../../storage/database/database_provider.dart';
import '../sync_queue.dart';

/// DAO de la file de synchronisation SQLite.
///
/// Gère exclusivement la persistance locale des opérations
/// qui doivent être synchronisées avec le backend.
class SyncQueueDao {
  SyncQueueDao({DatabaseProvider? databaseProvider})
    : _databaseProvider = databaseProvider ?? DatabaseHelper.instance;

  final DatabaseProvider _databaseProvider;

  /// Ajoute une opération dans la file de synchronisation.
  Future<void> insert(SyncQueueItem item) async {
    final db = await _databaseProvider.database;

    await db.insert('sync_queue', {
      'id': item.id,
      'entity_type': item.entity,
      'entity_id': item.entityId,
      'operation': item.operation,
      'payload': jsonEncode(item.payload),
      'status': 'pending',
      'retry_count': 0,
      'created_at': item.createdAt.toIso8601String(),
      'last_attempt_at': null,
      'last_error': null,
    }, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  /// Retourne les opérations en attente de synchronisation.
  Future<List<SyncQueueItem>> findPending() async {
    final db = await _databaseProvider.database;

    final rows = await db.query(
      'sync_queue',
      where: 'status = ?',
      whereArgs: ['pending'],
      orderBy: 'created_at ASC',
    );

    return rows.map(_fromMap).toList();
  }

  /// Retourne une opération par son identifiant.
  Future<SyncQueueItem?> findById(String id) async {
    final db = await _databaseProvider.database;

    final rows = await db.query(
      'sync_queue',
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );

    if (rows.isEmpty) {
      return null;
    }

    return _fromMap(rows.first);
  }

  /// Met à jour le statut d'une opération.
  Future<void> updateStatus(
    String id, {
    required String status,
    int? retryCount,
    DateTime? lastAttemptAt,
    String? lastError,
  }) async {
    final db = await _databaseProvider.database;

    final values = <String, dynamic>{
      'status': status,
      'last_attempt_at': lastAttemptAt?.toIso8601String(),
      'last_error': lastError,
    };

    if (retryCount != null) {
      values['retry_count'] = retryCount;
    }

    await db.update('sync_queue', values, where: 'id = ?', whereArgs: [id]);
  }

  /// Supprime une opération de la file.
  Future<void> delete(String id) async {
    final db = await _databaseProvider.database;

    await db.delete('sync_queue', where: 'id = ?', whereArgs: [id]);
  }

  /// Retourne le nombre total d'opérations dans la file.
  Future<int> count() async {
    final db = await _databaseProvider.database;

    final result = await db.rawQuery(
      'SELECT COUNT(*) AS count FROM sync_queue',
    );

    return Sqflite.firstIntValue(result) ?? 0;
  }

  /// Convertit une ligne SQLite en SyncQueueItem.
  SyncQueueItem _fromMap(Map<String, dynamic> map) {
    return SyncQueueItem(
      id: map['id'] as String,
      entity: map['entity_type'] as String,
      entityId: map['entity_id'] as String,
      operation: map['operation'] as String,
      payload: Map<String, dynamic>.from(
        jsonDecode(map['payload'] as String) as Map,
      ),
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }
}
