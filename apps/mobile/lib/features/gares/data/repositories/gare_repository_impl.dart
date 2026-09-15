import 'package:uuid/uuid.dart';

import '../../../../core/sync/dao/sync_queue_dao.dart';
import '../../../../core/sync/sync_queue.dart';
import '../../domain/entities/gare.dart';
import '../../domain/repositories/gare_repository.dart';
import '../dao/gare_dao.dart';
import '../models/gare_model.dart';

class GareRepositoryImpl implements GareRepository {
  GareRepositoryImpl({GareDao? gareDao, SyncQueueDao? syncQueueDao})
    : _gareDao = gareDao ?? GareDao(),
      _syncQueueDao = syncQueueDao ?? SyncQueueDao();

  final GareDao _gareDao;
  final SyncQueueDao _syncQueueDao;

  static const Uuid _uuid = Uuid();

  @override
  Future<void> insert(Gare gare) async {
    final model = GareModel.fromEntity(gare);

    await _gareDao.insert(model);

    await _syncQueueDao.insert(
      SyncQueueItem(
        id: _uuid.v4(),
        entity: 'GARE',
        entityId: gare.id,
        operation: 'CREATE',
        payload: model.toJson(),
        createdAt: DateTime.now(),
      ),
    );
  }

  @override
  Future<Gare?> findById(String id) async {
    return _gareDao.findById(id);
  }

  @override
  Future<List<Gare>> findAll() async {
    return _gareDao.findAll();
  }

  @override
  Future<void> update(Gare gare) async {
    final model = GareModel.fromEntity(gare);

    await _gareDao.update(model);

    await _syncQueueDao.insert(
      SyncQueueItem(
        id: _uuid.v4(),
        entity: 'GARE',
        entityId: gare.id,
        operation: 'UPDATE',
        payload: model.toJson(),
        createdAt: DateTime.now(),
      ),
    );
  }

  @override
  Future<int> count() async {
    return _gareDao.count();
  }

  @override
  Future<void> delete(String id) async {
    await _gareDao.delete(id);

    await _syncQueueDao.insert(
      SyncQueueItem(
        id: _uuid.v4(),
        entity: 'GARE',
        entityId: id,
        operation: 'DELETE',
        payload: {'id': id},
        createdAt: DateTime.now(),
      ),
    );
  }
}
