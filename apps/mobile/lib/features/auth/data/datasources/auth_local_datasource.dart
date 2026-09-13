import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../models/utilisateur_model.dart';
import '../daos/utilisateur_dao.dart';

class AuthLocalDatasource {
  final FlutterSecureStorage _storage;
  final UtilisateurDao _utilisateurDao;

  AuthLocalDatasource(this._storage, this._utilisateurDao);

  Future<void> saveToken(String token) async =>
      await _storage.write(key: 'jwt_token', value: token);

  Future<String?> getToken() async => await _storage.read(key: 'jwt_token');

  Future<void> clearSession() async {
    await _storage.delete(key: 'jwt_token');
    await _utilisateurDao.clearCache();
  }

  Future<void> saveUserLocally(UtilisateurModel user) async =>
      await _utilisateurDao.insertOrUpdate(user);

  Future<UtilisateurModel?> getCachedUser() async =>
      await _utilisateurDao.getSavedUser();
}
