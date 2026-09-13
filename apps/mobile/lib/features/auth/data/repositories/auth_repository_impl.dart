import 'package:dio/dio.dart';
import 'package:fiche_chargement_app/core/services/secure_storage_service.dart';
import 'package:fiche_chargement_app/features/auth/domain/entities/auth_session.dart';
import 'package:fiche_chargement_app/features/auth/domain/entities/role.dart';
import 'package:fiche_chargement_app/features/auth/domain/entities/utilisateur.dart';
import 'package:fiche_chargement_app/features/auth/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final Dio dio;
  final SecureStorageService secureStorage;

  AuthRepositoryImpl({required this.dio, required this.secureStorage});

  @override
  Future<AuthSession?> getCurrentSession() async {
    final token = await secureStorage.getAccessToken();
    final userId = await secureStorage.getUserId();

    if (token == null || token.isEmpty || userId == null || userId.isEmpty) {
      return null;
    }

    // Lecture des informations utilisateur sauvegardées.
    final nom = await secureStorage.getUserNom();
    final prenom = await secureStorage.getUserPrenom();
    final email = await secureStorage.getUserEmail();
    final roleId = await secureStorage.getRoleId();
    final roleCode = await secureStorage.getRoleCode();
    final roleLibelle = await secureStorage.getRoleLibelle();
    final gareId = await secureStorage.getGareId();

    // Sans rôle sauvegardé, la session ne peut pas
    // être restaurée correctement.
    if (roleCode == null || roleCode.isEmpty) {
      return null;
    }

    final utilisateur = Utilisateur(
      id: int.tryParse(userId) ?? 0,
      nom: nom ?? '',
      prenom: prenom ?? '',
      email: email ?? '',
      gareId: gareId,
      role: Role(
        id: int.tryParse(roleId ?? '') ?? 0,
        code: roleCode,
        libelle: roleLibelle ?? _roleLibelle(roleCode),
      ),
    );

    return AuthSession(
      token: token,
      accessToken: token,
      userId: userId,
      user: utilisateur,
    );
  }

  @override
  Future<AuthSession> login(String username, String password) async {
    try {
      final response = await dio.post(
        '/api/auth/login',
        data: {'username': username, 'password': password},
      );

      final data = response.data as Map<String, dynamic>;

      final accessToken = data['accessToken'] as String?;

      if (accessToken == null || accessToken.isEmpty) {
        throw Exception('Le serveur n’a pas retourné de token JWT.');
      }

      final userData = data['user'] as Map<String, dynamic>;

      final roleCode = (userData['role'] as String?)?.toUpperCase() ?? 'PUBLIC';

      final roleLibelle = _roleLibelle(roleCode);

      final utilisateur = Utilisateur(
        id: (userData['id'] as num).toInt(),
        nom: userData['nom'] as String? ?? '',
        prenom: userData['prenom'] as String? ?? '',
        email: userData['email'] as String? ?? '',
        gareId: userData['gareId'] as String?,
        role: Role(id: 0, code: roleCode, libelle: roleLibelle),
      );

      final session = AuthSession(
        token: accessToken,
        accessToken: accessToken,
        userId: utilisateur.id.toString(),
        user: utilisateur,
      );

      // =========================
      // Sauvegarde de la session
      // =========================

      await secureStorage.saveAccessToken(accessToken);

      await secureStorage.saveUserId(utilisateur.id.toString());

      // Username.
      final returnedUsername = userData['username'] as String? ?? username;

      await secureStorage.saveUsername(returnedUsername);

      // Informations personnelles.
      await secureStorage.saveUserNom(utilisateur.nom);

      await secureStorage.saveUserPrenom(utilisateur.prenom);

      await secureStorage.saveUserEmail(utilisateur.email);

      // Informations du rôle.
      await secureStorage.saveRoleId(utilisateur.role.id.toString());

      await secureStorage.saveRoleCode(utilisateur.role.code);

      await secureStorage.saveRoleLibelle(utilisateur.role.libelle);

      // Gare.
      await secureStorage.saveGareId(utilisateur.gareId);

      return session;
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw Exception('Nom d’utilisateur ou mot de passe incorrect.');
      }

      if (e.response?.statusCode == 400) {
        throw Exception('Données de connexion invalides.');
      }

      throw Exception('Impossible de contacter le serveur : ${e.message}');
    }
  }

  @override
  Future<void> logout() async {
    await secureStorage.clearAll();
  }

  String _roleLibelle(String roleCode) {
    switch (roleCode.toUpperCase()) {
      case 'ADMIN':
        return 'Administrateur';

      case 'AGENT':
        return 'Agent';

      case 'CONTROLEUR':
        return 'Contrôleur';

      case 'AUTORITE':
      case 'AUTORITE_HABILITEE':
        return 'Autorité habilitée';

      case 'RESPONSABLE_GARE':
        return 'Responsable de gare';

      default:
        return 'Utilisateur public';
    }
  }
}
