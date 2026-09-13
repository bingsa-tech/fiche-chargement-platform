import '../entities/gare.dart';

abstract class GareRepository {
  Future<void> insert(Gare gare);

  Future<Gare?> findById(String id);

  Future<List<Gare>> findAll();

  Future<void> update(Gare gare);

  Future<int> count();

  Future<void> delete(String id);
}
