import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/gare_repository_impl.dart';
import '../../domain/entities/gare.dart';
import '../../domain/repositories/gare_repository.dart';

final gareRepositoryProvider = Provider<GareRepository>((ref) {
  return GareRepositoryImpl();
});

// ✅ Déclaration de garesProvider manquante :
final garesProvider = AsyncNotifierProvider<GaresNotifier, List<Gare>>(() {
  return GaresNotifier();
});

final garesListProvider = FutureProvider<List<Gare>>((ref) async {
  final repository = ref.watch(gareRepositoryProvider);
  return repository.findAll();
});

class GaresNotifier extends AsyncNotifier<List<Gare>> {
  late final GareRepository _repository;

  @override
  Future<List<Gare>> build() async {
    _repository = ref.read(gareRepositoryProvider);
    return _repository.findAll();
  }

  Future<void> ajouterGare(Gare gare) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await _repository.insert(gare);
      return _repository.findAll();
    });
  }

  Future<void> supprimerGare(String id) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await _repository.delete(id);
      return _repository.findAll();
    });
  }

  Future<void> actualiser() async {
    state = await AsyncValue.guard(_repository.findAll);
  }
}
