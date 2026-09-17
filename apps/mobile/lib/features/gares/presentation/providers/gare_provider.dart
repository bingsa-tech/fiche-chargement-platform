import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/sync/sync_service.dart';
import '../../../../core/sync/sync_service_provider.dart';
import '../../data/repositories/gare_repository_impl.dart';
import '../../domain/entities/gare.dart';
import '../../domain/repositories/gare_repository.dart';

final gareRepositoryProvider = Provider<GareRepository>((ref) {
  return GareRepositoryImpl();
});

final garesProvider = AsyncNotifierProvider<GaresNotifier, List<Gare>>(
  GaresNotifier.new,
);

class GaresNotifier extends AsyncNotifier<List<Gare>> {
  late final GareRepository _repository;
  late final SyncService _syncService;

  @override
  Future<List<Gare>> build() async {
    _repository = ref.read(gareRepositoryProvider);
    _syncService = ref.read(syncServiceProvider);

    return _repository.findAll();
  }

  Future<void> ajouterGare(Gare gare) async {
    state = const AsyncLoading();

    state = await AsyncValue.guard(() async {
      await _repository.insert(gare);

      // La gare est d'abord enregistrée localement.
      // La synchronisation est ensuite tentée.
      //
      // Si l'API est indisponible, SyncService marque
      // l'opération comme FAILED et ne doit pas empêcher
      // la gare locale d'être conservée.
      try {
        await _syncService.syncPending();
      } catch (_) {
        // Offline First :
        // une erreur réseau ne doit pas annuler
        // l'enregistrement local.
      }

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
