import '../../domain/entities/gare.dart';
import '../../domain/repositories/gare_repository.dart';
import '../dao/gare_dao.dart';
import '../models/gare_model.dart';

class GareRepositoryImpl implements GareRepository {
  GareRepositoryImpl({GareDao? gareDao}) : _gareDao = gareDao ?? GareDao();

  final GareDao _gareDao;

  @override
  Future<void> insert(Gare gare) async {
    final model = GareModel.fromEntity(gare);

    await _gareDao.insert(model);
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
  }

  @override
  Future<int> count() async {
    return _gareDao.count();
  }

  @override
  Future<void> delete(String id) async {
    await _gareDao.delete(id);
  }
}
