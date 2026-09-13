import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/providers/network_providers.dart';
import '../../../../core/services/secure_storage_service.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/entities/auth_session.dart';
import '../../domain/repositories/auth_repository.dart';

/// ------------------------------------------------------------
/// ÉTATS D'AUTHENTIFICATION
/// ------------------------------------------------------------

abstract class AuthState {
  const AuthState();
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class Unauthenticated extends AuthState {
  const Unauthenticated();
}

class Authenticated extends AuthState {
  final AuthSession session;

  const Authenticated(this.session);
}

class AuthError extends AuthState {
  final String message;

  const AuthError(this.message);
}

/// ------------------------------------------------------------
/// REPOSITORY D'AUTHENTIFICATION
/// ------------------------------------------------------------

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dio = ref.watch(dioProvider);
  final secureStorage = ref.watch(secureStorageServiceProvider);

  return AuthRepositoryImpl(dio: dio, secureStorage: secureStorage);
});

/// ------------------------------------------------------------
/// AUTH NOTIFIER
/// ------------------------------------------------------------

class AuthNotifier extends Notifier<AuthState> {
  late final AuthRepository _repository;

  @override
  AuthState build() {
    _repository = ref.watch(authRepositoryProvider);

    // Vérification de la session après la construction
    Future.microtask(checkAuthStatus);

    return const AuthInitial();
  }

  /// Vérifie si une session existe déjà.
  Future<void> checkAuthStatus() async {
    state = const AuthLoading();

    try {
      final session = await _repository.getCurrentSession();

      if (session != null) {
        state = Authenticated(session);
      } else {
        state = const Unauthenticated();
      }
    } catch (_) {
      // En cas de problème de lecture du stockage,
      // on considère l'utilisateur comme non authentifié.
      state = const Unauthenticated();
    }
  }

  /// Connexion.
  Future<void> login(String email, String password) async {
    state = const AuthLoading();

    try {
      final session = await _repository.login(email, password);

      state = Authenticated(session);
    } catch (e) {
      state = AuthError('Échec de connexion : ${e.toString()}');
    }
  }

  /// Déconnexion.
  Future<void> logout() async {
    try {
      await _repository.logout();
    } finally {
      state = const Unauthenticated();
    }
  }
}

/// ------------------------------------------------------------
/// PROVIDER PRINCIPAL
/// ------------------------------------------------------------

final authProvider = NotifierProvider<AuthNotifier, AuthState>(
  AuthNotifier.new,
);
