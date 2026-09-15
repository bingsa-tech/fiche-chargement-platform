import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/providers/network_providers.dart';
import '../datasources/gare_api_data_source.dart';

final gareApiDataSourceProvider = Provider<GareApiDataSource>((ref) {
  final dio = ref.watch(dioProvider);

  return GareApiDataSource(dio: dio);
});
