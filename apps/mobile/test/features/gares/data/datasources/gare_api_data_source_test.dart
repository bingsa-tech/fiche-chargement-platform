import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:fiche_chargement_app/features/gares/data/datasources/gare_api_data_source.dart';
import 'package:fiche_chargement_app/features/gares/data/models/gare_model.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  late Dio dio;
  late GareApiDataSource dataSource;

  final gareJson = {
    'id': 'gare-001',
    'code': 'GARE01',
    'nom': 'Gare Centrale',
    'ville': 'Sherbrooke',
    'adresse': '123 Rue Principale',
    'statut': 'ACTIF',
    'latitude': 45.4000,
    'longitude': -71.9000,
    'createdAt': '2026-01-01T10:00:00.000Z',
    'updatedAt': '2026-01-01T10:00:00.000Z',
  };

  setUp(() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://test.local',
        validateStatus: (status) {
          return status != null && status < 500;
        },
      ),
    );

    dataSource = GareApiDataSource(dio: dio);
  });

  group('GareApiDataSource', () {
    test('findAll() récupère la liste des gares', () async {
      dio.httpClientAdapter = _MockHttpClientAdapter(
        statusCode: 200,
        responseData: [gareJson],
      );

      final result = await dataSource.findAll();

      expect(result, hasLength(1));
      expect(result.first, isA<GareModel>());
      expect(result.first.id, 'gare-001');
      expect(result.first.code, 'GARE01');
      expect(result.first.nom, 'Gare Centrale');
      expect(result.first.ville, 'Sherbrooke');
      expect(result.first.statut, 'ACTIF');
    });

    test('findById() récupère une gare par son identifiant', () async {
      dio.httpClientAdapter = _MockHttpClientAdapter(
        statusCode: 200,
        responseData: gareJson,
      );

      final result = await dataSource.findById('gare-001');

      expect(result, isA<GareModel>());
      expect(result.id, 'gare-001');
      expect(result.code, 'GARE01');
      expect(result.nom, 'Gare Centrale');
      expect(result.latitude, 45.4000);
      expect(result.longitude, -71.9000);
    });

    test(
      'create() envoie une requête POST et retourne la gare créée',
      () async {
        dio.httpClientAdapter = _MockHttpClientAdapter(
          statusCode: 201,
          responseData: gareJson,
        );

        final gare = GareModel(
          id: 'gare-001',
          code: 'GARE01',
          nom: 'Gare Centrale',
          ville: 'Sherbrooke',
          adresse: '123 Rue Principale',
          statut: 'ACTIF',
          latitude: 45.4000,
          longitude: -71.9000,
          createdAt: DateTime(2026, 1, 1, 10),
          updatedAt: DateTime(2026, 1, 1, 10),
        );

        final result = await dataSource.create(gare);

        expect(result, isA<GareModel>());
        expect(result.id, 'gare-001');
        expect(result.code, 'GARE01');
        expect(result.nom, 'Gare Centrale');
      },
    );

    test(
      'update() envoie une requête PATCH et retourne la gare modifiée',
      () async {
        dio.httpClientAdapter = _MockHttpClientAdapter(
          statusCode: 200,
          responseData: {...gareJson, 'nom': 'Gare Centrale Modifiée'},
        );

        final gare = GareModel(
          id: 'gare-001',
          code: 'GARE01',
          nom: 'Gare Centrale Modifiée',
          ville: 'Sherbrooke',
          adresse: '123 Rue Principale',
          statut: 'ACTIF',
          latitude: 45.4000,
          longitude: -71.9000,
          createdAt: DateTime(2026, 1, 1, 10),
          updatedAt: DateTime(2026, 1, 2, 10),
        );

        final result = await dataSource.update(gare);

        expect(result, isA<GareModel>());
        expect(result.id, 'gare-001');
        expect(result.nom, 'Gare Centrale Modifiée');
      },
    );

    test('delete() accepte la réponse HTTP 204 No Content', () async {
      dio.httpClientAdapter = _MockHttpClientAdapter(
        statusCode: 204,
        responseData: null,
      );

      await expectLater(dataSource.delete('gare-001'), completes);
    });

    test(
      'findById() lève une FormatException si la réponse est vide',
      () async {
        dio.httpClientAdapter = _MockHttpClientAdapter(
          statusCode: 200,
          responseData: null,
        );

        await expectLater(
          dataSource.findById('gare-001'),
          throwsA(isA<FormatException>()),
        );
      },
    );

    test('create() lève une FormatException si la réponse est vide', () async {
      dio.httpClientAdapter = _MockHttpClientAdapter(
        statusCode: 201,
        responseData: null,
      );

      final gare = GareModel(
        id: 'gare-001',
        code: 'GARE01',
        nom: 'Gare Centrale',
        ville: 'Sherbrooke',
        adresse: '123 Rue Principale',
        statut: 'ACTIF',
        latitude: 45.4000,
        longitude: -71.9000,
        createdAt: DateTime(2026, 1, 1, 10),
        updatedAt: DateTime(2026, 1, 1, 10),
      );

      await expectLater(
        dataSource.create(gare),
        throwsA(isA<FormatException>()),
      );
    });

    test('create() utilise POST /gares avec le bon payload', () async {
      final adapter = _MockHttpClientAdapter(
        statusCode: 201,
        responseData: gareJson,
      );

      dio.httpClientAdapter = adapter;

      final gare = GareModel(
        id: 'gare-001',
        code: 'GARE01',
        nom: 'Gare Centrale',
        ville: 'Sherbrooke',
        adresse: '123 Rue Principale',
        statut: 'ACTIF',
        latitude: 45.4000,
        longitude: -71.9000,
        createdAt: DateTime(2026, 1, 1, 10),
        updatedAt: DateTime(2026, 1, 1, 10),
      );

      await dataSource.create(gare);

      expect(adapter.method, 'POST');
      expect(adapter.path, '/gares');

      expect(adapter.requestBody, {
        'id': 'gare-001',
        'code': 'GARE01',
        'nom': 'Gare Centrale',
        'ville': 'Sherbrooke',
        'adresse': '123 Rue Principale',
        'statut': 'ACTIF',
        'latitude': 45.4000,
        'longitude': -71.9000,
      });

      expect(adapter.requestBody.containsKey('createdAt'), false);

      expect(adapter.requestBody.containsKey('updatedAt'), false);
    });

    test('update() utilise PATCH /gares/:id avec le bon payload', () async {
      final adapter = _MockHttpClientAdapter(
        statusCode: 200,
        responseData: {...gareJson, 'nom': 'Gare Centrale Modifiée'},
      );

      dio.httpClientAdapter = adapter;

      final gare = GareModel(
        id: 'gare-001',
        code: 'GARE01',
        nom: 'Gare Centrale Modifiée',
        ville: 'Sherbrooke',
        adresse: '123 Rue Principale',
        statut: 'ACTIF',
        latitude: 45.4000,
        longitude: -71.9000,
        createdAt: DateTime(2026, 1, 1, 10),
        updatedAt: DateTime(2026, 1, 2, 10),
      );

      await dataSource.update(gare);

      expect(adapter.method, 'PATCH');
      expect(adapter.path, '/gares/gare-001');

      expect(adapter.requestBody, {
        'code': 'GARE01',
        'nom': 'Gare Centrale Modifiée',
        'ville': 'Sherbrooke',
        'adresse': '123 Rue Principale',
        'statut': 'ACTIF',
        'latitude': 45.4000,
        'longitude': -71.9000,
      });

      expect(adapter.requestBody.containsKey('id'), false);

      expect(adapter.requestBody.containsKey('createdAt'), false);

      expect(adapter.requestBody.containsKey('updatedAt'), false);
    });

    test('delete() utilise DELETE /gares/:id et accepte HTTP 204', () async {
      final adapter = _MockHttpClientAdapter(
        statusCode: 204,
        responseData: null,
      );

      dio.httpClientAdapter = adapter;

      await dataSource.delete('gare-001');

      expect(adapter.method, 'DELETE');
      expect(adapter.path, '/gares/gare-001');
    });

    test('update() lève une FormatException si la réponse est vide', () async {
      dio.httpClientAdapter = _MockHttpClientAdapter(
        statusCode: 200,
        responseData: null,
      );

      final gare = GareModel(
        id: 'gare-001',
        code: 'GARE01',
        nom: 'Gare Centrale',
        ville: 'Sherbrooke',
        adresse: '123 Rue Principale',
        statut: 'ACTIF',
        latitude: 45.4000,
        longitude: -71.9000,
        createdAt: DateTime(2026, 1, 1, 10),
        updatedAt: DateTime(2026, 1, 1, 10),
      );

      await expectLater(
        dataSource.update(gare),
        throwsA(isA<FormatException>()),
      );
    });
  });
}

/// Adapter HTTP minimaliste permettant de tester Dio
/// sans effectuer de véritable appel réseau.
class _MockHttpClientAdapter implements HttpClientAdapter {
  _MockHttpClientAdapter({
    required this.statusCode,
    required this.responseData,
  });

  final int statusCode;
  final dynamic responseData;

  String? method;
  String? path;
  dynamic requestBody;

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    method = options.method;
    path = options.path;
    requestBody = options.data;

    final body = responseData == null ? '' : jsonEncode(responseData);

    return ResponseBody.fromString(
      body,
      statusCode,
      headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
      },
    );
  }

  @override
  void close({bool force = false}) {}
}
