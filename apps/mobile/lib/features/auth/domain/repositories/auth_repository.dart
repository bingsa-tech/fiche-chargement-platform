import '../entities/auth_session.dart';

abstract class AuthRepository {
  Future<AuthSession?> getCurrentSession();
  Future<AuthSession> login(String email, String password);
  Future<void> logout();
}
