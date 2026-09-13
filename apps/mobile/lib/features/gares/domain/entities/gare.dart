class Gare {
  const Gare({
    required this.id,
    required this.code,
    required this.nom,
    required this.ville,
    this.adresse,
    required this.statut,
    required this.createdAt,
    required this.updatedAt,
  });

  final String id;
  final String code;
  final String nom;
  final String ville;
  final String? adresse;
  final String statut;
  final DateTime createdAt;
  final DateTime updatedAt;
}
