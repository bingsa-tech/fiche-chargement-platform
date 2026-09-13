import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/entities/gare.dart';
import '../providers/gare_provider.dart';
import '../widgets/gare_card.dart';

class GaresPage extends ConsumerStatefulWidget {
  const GaresPage({super.key});

  @override
  ConsumerState<GaresPage> createState() => _GaresPageState();
}

class _GaresPageState extends ConsumerState<GaresPage> {
  final TextEditingController _searchController = TextEditingController();

  String _searchQuery = '';
  String _selectedFilter = 'TOUS';

  @override
  void initState() {
    super.initState();

    _searchController.addListener(_onSearchChanged);
  }

  void _onSearchChanged() {
    if (!mounted) {
      return;
    }

    setState(() {
      _searchQuery = _searchController.text.trim().toLowerCase();
    });
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();

    super.dispose();
  }

  List<Gare> _filterGares(List<Gare> gares) {
    return gares.where((gare) {
      final matchesSearch =
          _searchQuery.isEmpty ||
          gare.nom.toLowerCase().contains(_searchQuery) ||
          gare.code.toLowerCase().contains(_searchQuery) ||
          gare.ville.toLowerCase().contains(_searchQuery);

      final matchesStatus = switch (_selectedFilter) {
        'ACTIF' => gare.statut.toUpperCase() == 'ACTIF',
        'INACTIF' => gare.statut.toUpperCase() == 'INACTIF',
        _ => true,
      };

      return matchesSearch && matchesStatus;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final garesAsync = ref.watch(garesProvider);

    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: AppBar(
        elevation: 0,
        scrolledUnderElevation: 1,
        backgroundColor: colorScheme.surface,
        surfaceTintColor: colorScheme.primary,
        titleSpacing: 20,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Gares', style: TextStyle(fontWeight: FontWeight.w700)),
            Text(
              'Gestion des gares routières',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w400),
            ),
          ],
        ),
        actions: [
          IconButton.filledTonal(
            onPressed: () {
              ref.read(garesProvider.notifier).actualiser();
            },
            tooltip: 'Actualiser',
            icon: const Icon(Icons.refresh_rounded),
          ),
          const SizedBox(width: 12),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _createGare(context),
        icon: const Icon(Icons.add_rounded),
        label: const Text(
          'Nouvelle gare',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
      body: garesAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => _ErrorView(
          error: error,
          onRetry: () {
            ref.read(garesProvider.notifier).actualiser();
          },
        ),
        data: (gares) {
          final activeCount = gares
              .where((gare) => gare.statut.toUpperCase() == 'ACTIF')
              .length;

          final inactiveCount = gares.length - activeCount;

          final filteredGares = _filterGares(gares);

          return RefreshIndicator(
            onRefresh: () {
              return ref.read(garesProvider.notifier).actualiser();
            },
            child: CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                SliverToBoxAdapter(
                  child: _PageHeader(
                    total: gares.length,
                    active: activeCount,
                    inactive: inactiveCount,
                  ),
                ),
                SliverToBoxAdapter(
                  child: _SearchAndFilter(
                    controller: _searchController,
                    selectedFilter: _selectedFilter,
                    onFilterChanged: (filter) {
                      setState(() {
                        _selectedFilter = filter;
                      });
                    },
                  ),
                ),
                if (filteredGares.isEmpty)
                  SliverFillRemaining(
                    hasScrollBody: false,
                    child: _EmptySearchView(
                      hasGares: gares.isNotEmpty,
                      searchQuery: _searchQuery,
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 110),
                    sliver: SliverList.separated(
                      itemCount: filteredGares.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final gare = filteredGares[index];

                        return GareCard(
                          gare: gare,
                          onDelete: () {
                            _confirmDelete(context, gare);
                          },
                        );
                      },
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Future<void> _createGare(BuildContext context) async {
    final gare = await showDialog<Gare>(
      context: context,
      barrierDismissible: false,
      builder: (_) => const _CreateGareDialog(),
    );

    if (gare == null) {
      return;
    }

    await ref.read(garesProvider.notifier).ajouterGare(gare);

    if (!context.mounted) {
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        behavior: SnackBarBehavior.floating,
        content: Text('Gare créée avec succès'),
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context, Gare gare) async {
    final colorScheme = Theme.of(context).colorScheme;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          icon: Icon(
            Icons.delete_outline_rounded,
            color: colorScheme.error,
            size: 32,
          ),
          title: const Text('Supprimer cette gare ?'),
          content: Text(
            'La gare « ${gare.nom} » sera supprimée '
            'de la base locale.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(dialogContext).pop(false);
              },
              child: const Text('Annuler'),
            ),
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: colorScheme.error,
                foregroundColor: colorScheme.onError,
              ),
              onPressed: () {
                Navigator.of(dialogContext).pop(true);
              },
              child: const Text('Supprimer'),
            ),
          ],
        );
      },
    );

    if (confirmed != true) {
      return;
    }

    await ref.read(garesProvider.notifier).supprimerGare(gare.id);

    if (!context.mounted) {
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        behavior: SnackBarBehavior.floating,
        content: Text('Gare supprimée'),
      ),
    );
  }
}

class _PageHeader extends StatelessWidget {
  const _PageHeader({
    required this.total,
    required this.active,
    required this.inactive,
  });

  final int total;
  final int active;
  final int inactive;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
      child: Card(
        elevation: 0,
        color: colorScheme.primaryContainer,
        clipBehavior: Clip.antiAlias,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 46,
                    height: 46,
                    decoration: BoxDecoration(
                      color: colorScheme.primary,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Icon(
                      Icons.location_city_rounded,
                      color: colorScheme.onPrimary,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Vue d’ensemble',
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                            color: colorScheme.onPrimaryContainer,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          'État actuel des gares enregistrées',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: colorScheme.onPrimaryContainer,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 22),
              Row(
                children: [
                  Expanded(
                    child: _SummaryItem(
                      icon: Icons.location_city_rounded,
                      value: total.toString(),
                      label: 'Total',
                    ),
                  ),
                  _SummaryDivider(
                    color: colorScheme.onPrimaryContainer.withValues(
                      alpha: 0.2,
                    ),
                  ),
                  Expanded(
                    child: _SummaryItem(
                      icon: Icons.check_circle_outline_rounded,
                      value: active.toString(),
                      label: 'Actives',
                    ),
                  ),
                  _SummaryDivider(
                    color: colorScheme.onPrimaryContainer.withValues(
                      alpha: 0.2,
                    ),
                  ),
                  Expanded(
                    child: _SummaryItem(
                      icon: Icons.pause_circle_outline_rounded,
                      value: inactive.toString(),
                      label: 'Inactives',
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  const _SummaryItem({
    required this.icon,
    required this.value,
    required this.label,
  });

  final IconData icon;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      children: [
        Icon(icon, size: 20, color: colorScheme.onPrimaryContainer),
        const SizedBox(height: 6),
        Text(
          value,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.w800,
            color: colorScheme.onPrimaryContainer,
          ),
        ),
        Text(
          label,
          style: Theme.of(context).textTheme.labelMedium
              ?.copyWith(color: colorScheme.onPrimaryContainer),
        ),
      ],
    );
  }
}

class _SummaryDivider extends StatelessWidget {
  const _SummaryDivider({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(width: 1, height: 48, color: color);
  }
}

class _SearchAndFilter extends StatelessWidget {
  const _SearchAndFilter({
    required this.controller,
    required this.selectedFilter,
    required this.onFilterChanged,
  });

  final TextEditingController controller;
  final String selectedFilter;
  final ValueChanged<String> onFilterChanged;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
      child: Column(
        children: [
          TextField(
            controller: controller,
            decoration: InputDecoration(
              hintText: 'Rechercher une gare...',
              prefixIcon: const Icon(Icons.search_rounded),
              suffixIcon: controller.text.isNotEmpty
                  ? IconButton(
                      onPressed: controller.clear,
                      icon: const Icon(Icons.clear_rounded),
                    )
                  : null,
              filled: true,
              fillColor: colorScheme.surfaceContainerHighest.withValues(
                alpha: 0.55,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide(color: colorScheme.primary, width: 1.5),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.centerLeft,
            child: Wrap(
              spacing: 8,
              children: [
                _FilterChip(
                  label: 'Toutes',
                  icon: Icons.apps_rounded,
                  selected: selectedFilter == 'TOUS',
                  onSelected: () {
                    onFilterChanged('TOUS');
                  },
                ),
                _FilterChip(
                  label: 'Actives',
                  icon: Icons.check_circle_outline_rounded,
                  selected: selectedFilter == 'ACTIF',
                  onSelected: () {
                    onFilterChanged('ACTIF');
                  },
                ),
                _FilterChip(
                  label: 'Inactives',
                  icon: Icons.pause_circle_outline_rounded,
                  selected: selectedFilter == 'INACTIF',
                  onSelected: () {
                    onFilterChanged('INACTIF');
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.icon,
    required this.selected,
    required this.onSelected,
  });

  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onSelected;

  @override
  Widget build(BuildContext context) {
    return FilterChip(
      selected: selected,
      onSelected: (_) => onSelected(),
      avatar: Icon(icon, size: 17),
      label: Text(label),
      showCheckmark: false,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 7),
    );
  }
}

class _CreateGareDialog extends StatefulWidget {
  const _CreateGareDialog();

  @override
  State<_CreateGareDialog> createState() => _CreateGareDialogState();
}

class _CreateGareDialogState extends State<_CreateGareDialog> {
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
      id: DateTime.now().microsecondsSinceEpoch.toString(),
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

class _EmptySearchView extends StatelessWidget {
  const _EmptySearchView({required this.hasGares, required this.searchQuery});

  final bool hasGares;
  final String searchQuery;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    final title = hasGares ? 'Aucun résultat' : 'Aucune gare disponible';

    final message = hasGares
        ? 'Aucune gare ne correspond à '
              '« $searchQuery ».'
        : 'Ajoutez votre première gare avec '
              'le bouton « Nouvelle gare ».';

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: colorScheme.primaryContainer,
                shape: BoxShape.circle,
              ),
              child: Icon(
                hasGares
                    ? Icons.search_off_rounded
                    : Icons.location_city_outlined,
                size: 38,
                color: colorScheme.primary,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge
                  ?.copyWith(fontWeight: FontWeight.w700),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyMedium
                  ?.copyWith(color: colorScheme.onSurfaceVariant),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.error, required this.onRetry});

  final Object error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.error_outline_rounded,
              size: 56,
              color: colorScheme.error,
            ),
            const SizedBox(height: 16),
            const Text(
              'Impossible de charger les gares',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(error.toString(), textAlign: TextAlign.center),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }
}
