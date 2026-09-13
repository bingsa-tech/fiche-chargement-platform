import 'role.dart';

class Utilisateur {
  final int id; // INTEGER dans votre schema SQL
  final String nom;
  final String prenom;
  final String email;
  final String? gareId; // UUID de la gare liée
  final Role role;

  const Utilisateur({
    required this.id,
    required this.nom,
    required this.prenom,
    required this.email,
    this.gareId,
    required this.role,
  });
}
