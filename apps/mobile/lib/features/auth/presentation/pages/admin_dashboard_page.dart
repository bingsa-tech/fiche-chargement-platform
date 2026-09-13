import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:fiche_chargement_app/app/router.dart';
import 'package:fiche_chargement_app/features/auth/domain/entities/role.dart';
import 'package:fiche_chargement_app/features/auth/presentation/providers/auth_provider.dart';
import 'package:fiche_chargement_app/features/gares/presentation/pages/gares_page.dart';

// FIXME: Le fichier référencé n'existe pas dans le projet.
// L'import doit être corrigé vers le bon écran de gestion des gares.

class AdminDashboardPage extends ConsumerWidget {
  const AdminDashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Écoute les changements d'état d'authentification.
    //
    // Authenticated → Unauthenticated
    // Retour automatique vers /login.
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
        appBar: AppBar(title: const Text('Tableau de Bord - Administrateur')),
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

              // ==================================================
              // GESTION DES GARES
              // ADMIN UNIQUEMENT
              // ==================================================
              if (user.role.type == UserRoleType.admin)
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const GaresPage()),
                    );
                  },
                  icon: const Icon(Icons.location_city_rounded),
                  label: const Text('Gestion des gares'),
                ),

              const SizedBox(height: 16),

              // ==================================================
              // DÉCONNEXION
              // ==================================================
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
