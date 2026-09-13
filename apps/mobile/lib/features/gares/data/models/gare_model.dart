import '../../domain/entities/gare.dart';

class GareModel extends Gare {
  const GareModel({
    required super.id,
    required super.code,
    required super.nom,
    required super.ville,
    super.adresse,
    required super.statut,
    required super.createdAt,
    required super.updatedAt,
  });

  factory GareModel.fromMap(Map<String, dynamic> map) {
    return GareModel(
      id: map['id'] as String,
      code: map['code'] as String,
      nom: map['nom'] as String,
      ville: map['ville'] as String,
      adresse: map['adresse'] as String?,
      statut: map['statut'] as String,
      createdAt: DateTime.parse(map['created_at'] as String),
      updatedAt: DateTime.parse(map['updated_at'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'code': code,
      'nom': nom,
      'ville': ville,
      'adresse': adresse,
      'statut': statut,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  factory GareModel.fromEntity(Gare gare) {
    return GareModel(
      id: gare.id,
      code: gare.code,
      nom: gare.nom,
      ville: gare.ville,
      adresse: gare.adresse,
      statut: gare.statut,
      createdAt: gare.createdAt,
      updatedAt: gare.updatedAt,
    );
  }
}
