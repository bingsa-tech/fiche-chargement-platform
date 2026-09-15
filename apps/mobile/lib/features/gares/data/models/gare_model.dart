import '../../domain/entities/gare.dart';

class GareModel extends Gare {
  const GareModel({
    required super.id,
    required super.code,
    required super.nom,
    required super.ville,
    super.adresse,
    required super.statut,
    super.latitude,
    super.longitude,
    required super.createdAt,
    required super.updatedAt,
  });

  /// Mapping SQLite → modèle.
  factory GareModel.fromMap(Map<String, dynamic> map) {
    return GareModel(
      id: map['id'] as String,
      code: map['code'] as String,
      nom: map['nom'] as String,
      ville: map['ville'] as String,
      adresse: map['adresse'] as String?,
      statut: map['statut'] as String,
      latitude: (map['latitude'] as num?)?.toDouble(),
      longitude: (map['longitude'] as num?)?.toDouble(),
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  /// Modèle → SQLite.
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'code': code,
      'nom': nom,
      'ville': ville,
      'adresse': adresse,
      'statut': statut,
      'latitude': latitude,
      'longitude': longitude,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  /// Mapping JSON NestJS → modèle.
  factory GareModel.fromJson(Map<String, dynamic> json) {
    return GareModel(
      id: json['id'] as String,
      code: json['code'] as String,
      nom: json['nom'] as String,
      ville: json['ville'] as String,
      adresse: json['adresse'] as String?,
      statut: json['statut'] as String,
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  /// Modèle → JSON envoyé à l'API NestJS.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'nom': nom,
      'ville': ville,
      'adresse': adresse,
      'statut': statut,
      'latitude': latitude,
      'longitude': longitude,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  /// Entity → modèle.
  factory GareModel.fromEntity(Gare gare) {
    return GareModel(
      id: gare.id,
      code: gare.code,
      nom: gare.nom,
      ville: gare.ville,
      adresse: gare.adresse,
      statut: gare.statut,
      latitude: gare.latitude,
      longitude: gare.longitude,
      createdAt: gare.createdAt,
      updatedAt: gare.updatedAt,
    );
  }
}
