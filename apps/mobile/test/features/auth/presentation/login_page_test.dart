import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:fiche_chargement_app/features/auth/domain/entities/auth_session.dart';
import 'package:fiche_chargement_app/features/auth/domain/entities/role.dart';
import 'package:fiche_chargement_app/features/auth/domain/entities/utilisateur.dart';
import 'package:fiche_chargement_app/features/auth/domain/repositories/auth_repository.dart';
import 'package:fiche_chargement_app/features/auth/presentation/pages/login_page.dart';
import 'package:fiche_chargement_app/features/auth/presentation/providers/auth_provider.dart';
import 'package:fiche_chargement_app/app/router.dart';

class MockAuthRepository implements AuthRepository {
  bool loginCalled = false;
  String? capturedEmail;
  String? capturedPassword;

  @override
  Future<AuthSession?> getCurrentSession() async {
    return null;
  }

  @override
  Future<AuthSession> login(String email, String password) async {
    loginCalled = true;
    capturedEmail = email;
    capturedPassword = password;

    return AuthSession(
      token: 'fake_token',
      accessToken: 'fake_access_token',
      userId: '123',
      user: Utilisateur(
        id: 123,
        nom: 'Test',
        prenom: 'User',
        email: 'test@example.com',
        gareId: null,
        role: const Role(id: 1, code: 'ADMIN', libelle: 'Administrateur'),
      ),
    );
  }

  @override
  Future<void> logout() async {}
}

void main() {
  testWidgets('Saisie des champs et déclenchement de la connexion', (
    WidgetTester tester,
  ) async {
    final mockAuthRepository = MockAuthRepository();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          authRepositoryProvider.overrideWithValue(mockAuthRepository),
        ],
        child: MaterialApp(
          home: const LoginPage(),
          routes: {
            AppRoutes.dashboardAdmin: (_) =>
                const Scaffold(body: Text('Dashboard Admin')),
          },
        ),
      ),
    );

    // ---------------------------------------------------------------
    // 0. Attendre la fin de la vérification initiale de session
    // ---------------------------------------------------------------

    await tester.pumpAndSettle();

    // ---------------------------------------------------------------
    // 1. Saisie de l'adresse email
    // ---------------------------------------------------------------

    final emailField = find.byType(TextFormField).at(0);

    await tester.enterText(emailField, 'test@example.com');

    // ---------------------------------------------------------------
    // 2. Saisie du mot de passe
    // ---------------------------------------------------------------

    final passwordField = find.byType(TextFormField).at(1);

    await tester.enterText(passwordField, 'Password123!');

    await tester.pump();

    // ---------------------------------------------------------------
    // 3. Clic sur le bouton de connexion
    // ---------------------------------------------------------------

    final loginButton = find.byType(ElevatedButton);

    expect(loginButton, findsOneWidget);

    await tester.tap(loginButton);

    // Laisser le Future login() et le listener Riverpod s'exécuter.
    await tester.pumpAndSettle();

    // ---------------------------------------------------------------
    // 4. Vérifications
    // ---------------------------------------------------------------

    expect(mockAuthRepository.loginCalled, isTrue);

    expect(mockAuthRepository.capturedEmail, equals('test@example.com'));

    expect(mockAuthRepository.capturedPassword, equals('Password123!'));
  });
}
