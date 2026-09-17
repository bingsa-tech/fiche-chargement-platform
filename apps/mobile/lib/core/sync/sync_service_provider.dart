import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/gares/data/datasources/gare_api_data_source.dart';
import '../network/providers/network_providers.dart';
import 'dao/sync_queue_dao.dart';
import 'sync_service.dart';

/// Provider du DAO de la file de synchronisation.
final syncQueueDaoProvider = Provider<SyncQueueDao>((ref) {
  return SyncQueueDao();
});

/// Provider de la source de données API des gares.
final gareApiDataSourceProvider = Provider<GareApiDataSource>((ref) {
  final dio = ref.watch(dioProvider);

  return GareApiDataSource(dio: dio);
});

/// Provider du service central de synchronisation.
final syncServiceProvider = Provider<SyncService>((ref) {
  final syncQueueDao = ref.watch(syncQueueDaoProvider);
  final gareApiDataSource = ref.watch(gareApiDataSourceProvider);

  return SyncService(
    syncQueueDao: syncQueueDao,
    gareApiDataSource: gareApiDataSource,
  );
});
