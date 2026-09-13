// lib/features/auth/data/models/utilisateur_model.dart

import '../../domain/entities/utilisateur.dart';
import 'role_model.dart';

class UtilisateurModel extends Utilisateur {
  const UtilisateurModel({
    required super.id,
    required super.nom,
    required super.prenom,
    required super.email,
    super.gareId,
    required super.role,
  });

  factory UtilisateurModel.fromMap(Map<String, dynamic> map) {
    return UtilisateurModel(
      id: map['id'] as int,
      nom: map['nom'] as String,
      prenom: map['prenom'] as String,
      email: map['email'] as String,
      gareId: map['gare_id'] as String?,
      role: RoleModel.fromMap(
        map['role'] != null
            ? map['role'] as Map<String, dynamic>
            : {
                'id': map['role_id'],
                'code': map['role_code'] ?? 'PUBLIC',
                'libelle': '',
              },
      ),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'nom': nom,
      'prenom': prenom,
      'email': email,
      'gare_id': gareId,
      'role_id': role.id,
    };
  }
}
