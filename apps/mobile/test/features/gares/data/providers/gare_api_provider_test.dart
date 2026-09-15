import 'package:dio/dio.dart';
import 'package:fiche_chargement_app/core/network/providers/network_providers.dart';
import 'package:fiche_chargement_app/features/gares/data/datasources/gare_api_data_source.dart';
import 'package:fiche_chargement_app/features/gares/data/providers/gare_api_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('gareApiDataSourceProvider', () {
    test('fournit une instance de GareApiDataSource', () {
      final dio = Dio();

      final container = ProviderContainer(
        overrides: [dioProvider.overrideWithValue(dio)],
      );

      addTearDown(container.dispose);

      final dataSource = container.read(gareApiDataSourceProvider);

      expect(dataSource, isA<GareApiDataSource>());
    });

    test('utilise le Dio fourni par dioProvider', () {
      final dio = Dio();

      final container = ProviderContainer(
        overrides: [dioProvider.overrideWithValue(dio)],
      );

      addTearDown(container.dispose);

      final dataSource = container.read(gareApiDataSourceProvider);

      expect(dataSource, isA<GareApiDataSource>());
    });
  });
}
