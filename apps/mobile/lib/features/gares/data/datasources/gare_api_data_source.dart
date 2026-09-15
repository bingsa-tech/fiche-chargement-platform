import 'package:dio/dio.dart';

import '../models/gare_model.dart';

class GareApiDataSource {
  GareApiDataSource({required this._dio});

  final Dio _dio;

  /// Récupère toutes les gares depuis l'API NestJS.
  Future<List<GareModel>> findAll() async {
    final response = await _dio.get<List<dynamic>>('/gares');

    final data = response.data ?? [];

    return data
        .map(
          (json) => GareModel.fromJson(Map<String, dynamic>.from(json as Map)),
        )
        .toList();
  }

  /// Récupère une gare par son identifiant.
  Future<GareModel> findById(String id) async {
    final response = await _dio.get<Map<String, dynamic>>('/gares/$id');

    final data = response.data;

    if (data == null) {
      throw const FormatException(
        'La réponse de l API ne contient aucune donnée.',
      );
    }

    return GareModel.fromJson(data);
  }

  /// Crée une nouvelle gare.
  Future<GareModel> create(GareModel gare) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/gares',
      data: _toCreatePayload(gare),
    );

    final data = response.data;

    if (data == null) {
      throw const FormatException(
        'La réponse de création ne contient aucune donnée.',
      );
    }

    return GareModel.fromJson(data);
  }

  /// Modifie une gare existante.
  Future<GareModel> update(GareModel gare) async {
    final response = await _dio.patch<Map<String, dynamic>>(
      '/gares/${gare.id}',
      data: _toUpdatePayload(gare),
    );

    final data = response.data;

    if (data == null) {
      throw const FormatException(
        'La réponse de modification ne contient aucune donnée.',
      );
    }

    return GareModel.fromJson(data);
  }

  /// Supprime une gare.
  ///
  /// Le backend retourne HTTP 204 No Content.
  Future<void> delete(String id) async {
    await _dio.delete<void>('/gares/$id');
  }

  /// Payload envoyé à POST /gares.
  ///
  /// L'id, createdAt et updatedAt sont générés/gérés par le backend.
  Map<String, dynamic> _toCreatePayload(GareModel gare) {
    return {
      'code': gare.code,
      'nom': gare.nom,
      'ville': gare.ville,
      'adresse': gare.adresse,
      'statut': gare.statut,
      'latitude': gare.latitude,
      'longitude': gare.longitude,
    };
  }

  /// Payload envoyé à PATCH /gares/:id.
  ///
  /// On ne transmet pas les champs techniques gérés par PostgreSQL.
  Map<String, dynamic> _toUpdatePayload(GareModel gare) {
    return {
      'code': gare.code,
      'nom': gare.nom,
      'ville': gare.ville,
      'adresse': gare.adresse,
      'statut': gare.statut,
      'latitude': gare.latitude,
      'longitude': gare.longitude,
    };
  }
}
