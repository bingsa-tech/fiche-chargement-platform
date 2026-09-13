import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final secureStorageServiceProvider = Provider<SecureStorageService>((ref) {
  return SecureStorageService(const FlutterSecureStorage());
});

class SecureStorageService {
  final FlutterSecureStorage _storage;

  // =========================
  // Clés d'authentification
  // =========================

  static const String _keyAccessToken = 'access_token';
  static const String _keyRefreshToken = 'refresh_token';
  static const String _keyUserId = 'user_id';

  // =========================
  // Informations utilisateur
  // =========================

  static const String _keyUsername = 'username';
  static const String _keyNom = 'user_nom';
  static const String _keyPrenom = 'user_prenom';
  static const String _keyEmail = 'user_email';
  static const String _keyRoleId = 'user_role_id';
  static const String _keyRoleCode = 'user_role_code';
  static const String _keyRoleLibelle = 'user_role_libelle';
  static const String _keyGareId = 'user_gare_id';

  const SecureStorageService(this._storage);

  // =========================
  // Access Token
  // =========================

  Future<void> saveAccessToken(String token) async {
    await _storage.write(key: _keyAccessToken, value: token);
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: _keyAccessToken);
  }

  Future<void> deleteAccessToken() async {
    await _storage.delete(key: _keyAccessToken);
  }

  // =========================
  // Refresh Token
  // =========================

  Future<void> saveRefreshToken(String token) async {
    await _storage.write(key: _keyRefreshToken, value: token);
  }

  Future<String?> getRefreshToken() async {
    return await _storage.read(key: _keyRefreshToken);
  }

  Future<void> deleteRefreshToken() async {
    await _storage.delete(key: _keyRefreshToken);
  }

  // =========================
  // User ID
  // =========================

  Future<void> saveUserId(String userId) async {
    await _storage.write(key: _keyUserId, value: userId);
  }

  Future<String?> getUserId() async {
    return await _storage.read(key: _keyUserId);
  }

  // =========================
  // Username
  // =========================

  Future<void> saveUsername(String username) async {
    await _storage.write(key: _keyUsername, value: username);
  }

  Future<String?> getUsername() async {
    return await _storage.read(key: _keyUsername);
  }

  // =========================
  // Nom
  // =========================

  Future<void> saveUserNom(String nom) async {
    await _storage.write(key: _keyNom, value: nom);
  }

  Future<String?> getUserNom() async {
    return await _storage.read(key: _keyNom);
  }

  // =========================
  // Prénom
  // =========================

  Future<void> saveUserPrenom(String prenom) async {
    await _storage.write(key: _keyPrenom, value: prenom);
  }

  Future<String?> getUserPrenom() async {
    return await _storage.read(key: _keyPrenom);
  }

  // =========================
  // Email
  // =========================

  Future<void> saveUserEmail(String email) async {
    await _storage.write(key: _keyEmail, value: email);
  }

  Future<String?> getUserEmail() async {
    return await _storage.read(key: _keyEmail);
  }

  // =========================
  // Role ID
  // =========================

  Future<void> saveRoleId(String roleId) async {
    await _storage.write(key: _keyRoleId, value: roleId);
  }

  Future<String?> getRoleId() async {
    return await _storage.read(key: _keyRoleId);
  }

  // =========================
  // Role Code
  // =========================

  Future<void> saveRoleCode(String roleCode) async {
    await _storage.write(key: _keyRoleCode, value: roleCode);
  }

  Future<String?> getRoleCode() async {
    return await _storage.read(key: _keyRoleCode);
  }

  // =========================
  // Role Libellé
  // =========================

  Future<void> saveRoleLibelle(String roleLibelle) async {
    await _storage.write(key: _keyRoleLibelle, value: roleLibelle);
  }

  Future<String?> getRoleLibelle() async {
    return await _storage.read(key: _keyRoleLibelle);
  }

  // =========================
  // Gare ID
  // =========================

  Future<void> saveGareId(String? gareId) async {
    if (gareId == null || gareId.isEmpty) {
      await _storage.delete(key: _keyGareId);
      return;
    }

    await _storage.write(key: _keyGareId, value: gareId);
  }

  Future<String?> getGareId() async {
    return await _storage.read(key: _keyGareId);
  }

  // =========================
  // Méthodes génériques
  // =========================

  Future<void> write(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  Future<String?> read(String key) async {
    return await _storage.read(key: key);
  }

  Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }

  // =========================
  // Nettoyage complet
  // =========================

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
