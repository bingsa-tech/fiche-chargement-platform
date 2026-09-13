import 'package:flutter/material.dart';

import 'package:fiche_chargement_app/core/storage/database/database_debug_page.dart';
import 'package:fiche_chargement_app/features/gares/presentation/pages/gares_page.dart';

// Auth
import 'package:fiche_chargement_app/features/auth/presentation/pages/login_page.dart';
import 'package:fiche_chargement_app/features/auth/presentation/pages/admin_dashboard_page.dart';
import 'package:fiche_chargement_app/features/auth/presentation/pages/agent_dashboard_page.dart';
import 'package:fiche_chargement_app/features/auth/presentation/pages/controleur_dashboard_page.dart';
import 'package:fiche_chargement_app/features/auth/presentation/pages/autorite_dashboard_page.dart';
import 'package:fiche_chargement_app/features/auth/presentation/pages/public_dashboard_page.dart';

class AppRoutes {
  static const String initial = '/';
  static const String login = '/login';

  // Dashboards selon le rôle
  static const String dashboardAdmin = '/dashboard/admin';
  static const String dashboardAgent = '/dashboard/agent';
  static const String dashboardControleur = '/dashboard/controleur';
  static const String dashboardAutorite = '/dashboard/autorite';
  static const String dashboardPublic = '/dashboard/public';

  // Modules
  static const String gares = '/gares';

  // Gestion des gares par l'administrateur
  static const String adminGares = '/dashboard/admin/gares';

  // SQLite Debug
  static const String databaseDebug = '/database-debug';
}

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      // ----------------------------------------------------------
      // INITIAL / LOGIN
      // ----------------------------------------------------------
      case AppRoutes.initial:
      case AppRoutes.login:
        return MaterialPageRoute(builder: (_) => const LoginPage());

      // ----------------------------------------------------------
      // DASHBOARD ADMIN
      // ----------------------------------------------------------
      case AppRoutes.dashboardAdmin:
        return MaterialPageRoute(builder: (_) => const AdminDashboardPage());

      // ----------------------------------------------------------
      // GESTION DES GARES - ADMIN
      // ----------------------------------------------------------
      case AppRoutes.adminGares:
        return MaterialPageRoute(builder: (_) => const GaresPage());

      // ----------------------------------------------------------
      // DASHBOARD AGENT
      // ----------------------------------------------------------
      case AppRoutes.dashboardAgent:
        return MaterialPageRoute(builder: (_) => const AgentDashboardPage());

      // ----------------------------------------------------------
      // DASHBOARD CONTROLEUR
      // ----------------------------------------------------------
      case AppRoutes.dashboardControleur:
        return MaterialPageRoute(
          builder: (_) => const ControleurDashboardPage(),
        );

      // ----------------------------------------------------------
      // DASHBOARD AUTORITE
      // ----------------------------------------------------------
      case AppRoutes.dashboardAutorite:
        return MaterialPageRoute(builder: (_) => const AutoriteDashboardPage());

      // ----------------------------------------------------------
      // DASHBOARD PUBLIC
      // ----------------------------------------------------------
      case AppRoutes.dashboardPublic:
        return MaterialPageRoute(builder: (_) => const PublicDashboardPage());

      // ----------------------------------------------------------
      // GARES
      // ----------------------------------------------------------
      case AppRoutes.gares:
        return MaterialPageRoute(builder: (_) => const GaresPage());

      // ----------------------------------------------------------
      // SQLITE DEBUG
      // ----------------------------------------------------------
      case AppRoutes.databaseDebug:
        return MaterialPageRoute(builder: (_) => const DatabaseDebugPage());

      // ----------------------------------------------------------
      // ROUTE INCONNUE
      // ----------------------------------------------------------
      default:
        return MaterialPageRoute(builder: (_) => const _NotFoundPage());
    }
  }
}

class _NotFoundPage extends StatelessWidget {
  const _NotFoundPage();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Page introuvable', style: TextStyle(fontSize: 22)),
      ),
    );
  }
}
