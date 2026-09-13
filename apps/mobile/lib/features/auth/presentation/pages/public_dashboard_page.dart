import 'package:flutter/material.dart';

class PublicDashboardPage extends StatelessWidget {
  const PublicDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tableau de Bord - Public')),
      body: const Center(child: Text('Bienvenue Public')),
    );
  }
}
