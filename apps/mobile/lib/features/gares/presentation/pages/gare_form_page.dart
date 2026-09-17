import 'package:flutter/material.dart';

import '../../domain/entities/gare.dart';

import 'package:uuid/uuid.dart';

class GareFormPage extends StatefulWidget {
  const GareFormPage({super.key});

  @override
  State<GareFormPage> createState() => _GareFormPageState();
}

class _GareFormPageState extends State<GareFormPage> {
  static const Uuid _uuid = Uuid();
  final _formKey = GlobalKey<FormState>();

  final _codeController = TextEditingController();
  final _nomController = TextEditingController();
  final _villeController = TextEditingController();
  final _adresseController = TextEditingController();

  String _statut = 'ACTIF';

  @override
  void dispose() {
    _codeController.dispose();
    _nomController.dispose();
    _villeController.dispose();
    _adresseController.dispose();

    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final now = DateTime.now();

    final gare = Gare(
      id: _uuid.v4(),
      code: _codeController.text.trim(),
      nom: _nomController.text.trim(),
      ville: _villeController.text.trim(),
      adresse: _adresseController.text.trim().isEmpty
          ? null
          : _adresseController.text.trim(),
      statut: _statut,
      createdAt: now,
      updatedAt: now,
    );

    Navigator.of(context).pop(gare);
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return AlertDialog(
      titlePadding: const EdgeInsets.fromLTRB(24, 24, 24, 8),
      contentPadding: const EdgeInsets.fromLTRB(24, 8, 24, 8),
      actionsPadding: const EdgeInsets.fromLTRB(24, 8, 24, 20),
      title: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              Icons.location_city_rounded,
              color: colorScheme.onPrimaryContainer,
            ),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'Nouvelle gare',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _codeController,
                decoration: const InputDecoration(
                  labelText: 'Code de la gare',
                  hintText: 'Ex. G001',
                  prefixIcon: Icon(Icons.tag_rounded),
                ),
                textCapitalization: TextCapitalization.characters,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Le code est obligatoire';
                  }

                  return null;
                },
              ),
              const SizedBox(height: 14),
              TextFormField(
                controller: _nomController,
                decoration: const InputDecoration(
                  labelText: 'Nom de la gare',
                  hintText: 'Ex. Gare d\'Eseka',
                  prefixIcon: Icon(Icons.location_city_rounded),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Le nom est obligatoire';
                  }

                  return null;
                },
              ),
              const SizedBox(height: 14),
              TextFormField(
                controller: _villeController,
                decoration: const InputDecoration(
                  labelText: 'Ville',
                  hintText: 'Ex. Eseka',
                  prefixIcon: Icon(Icons.location_on_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'La ville est obligatoire';
                  }

                  return null;
                },
              ),
              const SizedBox(height: 14),
              TextFormField(
                controller: _adresseController,
                decoration: const InputDecoration(
                  labelText: 'Adresse',
                  hintText: 'Adresse complète',
                  prefixIcon: Icon(Icons.home_outlined),
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 14),
              DropdownButtonFormField<String>(
                initialValue: _statut,
                decoration: const InputDecoration(
                  labelText: 'Statut',
                  prefixIcon: Icon(Icons.toggle_on_outlined),
                ),
                items: const [
                  DropdownMenuItem(value: 'ACTIF', child: Text('Actif')),
                  DropdownMenuItem(value: 'INACTIF', child: Text('Inactif')),
                ],
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _statut = value;
                    });
                  }
                },
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: const Text('Annuler'),
        ),
        FilledButton.icon(
          onPressed: _submit,
          icon: const Icon(Icons.check_rounded),
          label: const Text('Créer la gare'),
        ),
      ],
    );
  }
}
