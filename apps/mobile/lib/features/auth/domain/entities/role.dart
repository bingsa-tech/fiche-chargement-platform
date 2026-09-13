enum UserRoleType { admin, agent, controleur, autorite, public }

class Role {
  final int id;
  final String code; // 'ADMIN', 'AGENT', 'CONTROLEUR', 'AUTORITE', 'AUTORITE_HABILITEE', 'PUBLIC'
  final String libelle;

  const Role({required this.id, required this.code, required this.libelle});

  UserRoleType get type {
    switch (code.toUpperCase()) {
      case 'ADMIN':
        return UserRoleType.admin;
      case 'AGENT':
        return UserRoleType.agent;
      case 'CONTROLEUR':
        return UserRoleType.controleur;
      case 'AUTORITE':
      case 'AUTORITE_HABILITEE':
        return UserRoleType.autorite;
      default:
        return UserRoleType.public;
    }
  }
}
