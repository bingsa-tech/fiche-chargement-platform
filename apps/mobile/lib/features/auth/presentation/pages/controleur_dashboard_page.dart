import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:fiche_chargement_app/app/router.dart';
import 'package:fiche_chargement_app/features/auth/presentation/providers/auth_provider.dart';

class ControleurDashboardPage extends ConsumerWidget {
  const ControleurDashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Écoute les changements d'état d'authentification.
    //
    // Lorsque logout() est exécuté :
    // Authenticated → Unauthenticated
    //
    // On redirige automatiquement vers /login.
    ref.listen<AuthState>(authProvider, (previous, next) {
      if (next is Unauthenticated && context.mounted) {
        Navigator.of(context)
            .pushNamedAndRemoveUntil(AppRoutes.login, (route) => false);
      }
    });

    final authState = ref.watch(authProvider);

    if (authState is Authenticated) {
      final session = authState.session;
      final user = session.user;

      return Scaffold(
        appBar: AppBar(title: const Text('Tableau de Bord - Contrôleur')),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bienvenue ${user.prenom} ${user.nom}',
                style: Theme.of(context).textTheme.headlineSmall,
              ),

              const SizedBox(height: 24),

              Text('Nom : ${user.nom}'),
              Text('Prénom : ${user.prenom}'),
              Text('Email : ${user.email}'),

              const SizedBox(height: 16),

              Text(
                'Rôle : ${user.role.code}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),

              const SizedBox(height: 16),

              Text('Gare : ${user.gareId ?? 'Non affectée'}'),

              const SizedBox(height: 32),

              ElevatedButton.icon(
                onPressed: () async {
                  await ref.read(authProvider.notifier).logout();
                },
                icon: const Icon(Icons.logout),
                label: const Text('Déconnexion'),
              ),
            ],
          ),
        ),
      );
    }

    // Pendant la vérification ou la transition d'état.
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}
