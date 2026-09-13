import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:fiche_chargement_app/app/app.dart'; // Ou l'entrée de votre App
import 'package:fiche_chargement_app/features/auth/domain/repositories/auth_repository.dart';
import 'package:fiche_chargement_app/features/auth/domain/entities/auth_session.dart';
import 'package:fiche_chargement_app/features/auth/presentation/providers/auth_provider.dart';

// Implémentation factice du repository pour les tests
class FakeAuthRepository implements AuthRepository {
  @override
  Future<AuthSession?> getCurrentSession() async => null;

  @override
  Future<AuthSession> login(String email, String password) async {
    throw UnimplementedError();
  }

  @override
  Future<void> logout() async {}
}

void main() {
  testWidgets('L application démarre correctement', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          // On fournit le fake repository pour éviter UnimplementedError
          authRepositoryProvider.overrideWithValue(FakeAuthRepository()),
        ],
        child: const MyApp(),
      ),
    );

    // Attendre la résolution des micro-tâches (ex: checkAuthStatus)
    await tester.pumpAndSettle();

    // Vérifier un élément présent sur l'écran d'accueil/connexion
    // Remplacez 'Connexion' ou 'Gare Routière' selon ce qui est affiché dans votre LoginPage
    expect(find.byType(TextField), findsAtLeastNWidgets(1));
  });
}
