import '../../features/gares/data/datasources/gare_api_data_source.dart';
import '../../features/gares/data/models/gare_model.dart';
import 'dao/sync_queue_dao.dart';
import 'sync_queue.dart';

/// Service central de synchronisation.
///
/// F10.6 : synchronisation des créations de gares (POST).
class SyncService {
  SyncService({required this._syncQueueDao, required this._gareApiDataSource});

  final SyncQueueDao _syncQueueDao;
  final GareApiDataSource _gareApiDataSource;

  /// Retourne les opérations actuellement en attente.
  Future<List<SyncQueueItem>> getPendingItems() {
    return _syncQueueDao.findPending();
  }

  /// Retourne le nombre d'opérations en attente.
  Future<int> getPendingCount() async {
    final items = await _syncQueueDao.findPending();
    return items.length;
  }

  /// Marque une opération comme étant en cours de synchronisation.
  Future<void> markAsSyncing(String id) async {
    await _syncQueueDao.updateStatus(
      id,
      status: 'syncing',
      lastAttemptAt: DateTime.now(),
      lastError: null,
    );
  }

  /// Marque une opération comme synchronisée.
  Future<void> markAsSynced(String id) async {
    await _syncQueueDao.updateStatus(
      id,
      status: 'synced',
      lastAttemptAt: DateTime.now(),
      lastError: null,
    );
  }

  /// Marque une opération comme échouée.
  Future<void> markAsFailed(
    String id, {
    required String error,
    int retryCount = 0,
  }) async {
    await _syncQueueDao.updateStatus(
      id,
      status: 'failed',
      retryCount: retryCount,
      lastAttemptAt: DateTime.now(),
      lastError: error,
    );
  }

  /// Synchronise une opération CREATE pour une gare.
  ///
  /// F10.6 : POST /gares.
  Future<void> syncCreateGare(SyncQueueItem item) async {
    if (item.entity != 'GARE') {
      throw ArgumentError('Entité non supportée pour CREATE : ${item.entity}');
    }

    if (item.operation != 'CREATE') {
      throw ArgumentError('Opération non supportée : ${item.operation}');
    }

    await markAsSyncing(item.id);

    try {
      final gare = GareModel.fromJson(item.payload);

      await _gareApiDataSource.create(gare);

      await markAsSynced(item.id);
    } catch (error) {
      await markAsFailed(item.id, error: error.toString(), retryCount: 1);

      rethrow;
    }
  }

  /// Supprime une opération de la file.
  Future<void> remove(String id) {
    return _syncQueueDao.delete(id);
  }
}
