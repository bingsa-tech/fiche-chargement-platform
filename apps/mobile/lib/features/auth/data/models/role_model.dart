import '../../domain/entities/role.dart';

class RoleModel extends Role {
  const RoleModel({
    required super.id,
    required super.code,
    required super.libelle,
  });

  factory RoleModel.fromMap(Map<String, dynamic> map) {
    return RoleModel(
      id: map['id'] as int,
      code: map['code'] as String? ?? 'PUBLIC',
      libelle: map['libelle'] as String? ?? '',
    );
  }

  factory RoleModel.fromJson(Map<String, dynamic> json) {
    return RoleModel(
      id: json['id'] as int,
      code: json['code'] as String? ?? 'PUBLIC',
      libelle: json['libelle'] as String? ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {'id': id, 'code': code, 'libelle': libelle};
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'code': code, 'libelle': libelle};
  }
}
