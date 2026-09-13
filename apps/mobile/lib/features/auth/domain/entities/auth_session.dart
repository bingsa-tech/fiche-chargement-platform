import 'utilisateur.dart';

class AuthSession {
  final Utilisateur user;
  final String accessToken;
  final String? refreshToken;
  final String token;
  final String userId;

  const AuthSession({
    required this.user,
    required this.accessToken,
    this.refreshToken,
    required this.token,
    required this.userId,
  });
}
