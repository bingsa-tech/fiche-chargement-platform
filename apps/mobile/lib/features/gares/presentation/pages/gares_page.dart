import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/entities/gare.dart';
import '../providers/gare_provider.dart';
import '../widgets/gare_card.dart';
import 'gare_form_page.dart';

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

  @override
  void dispose() {
    _searchController
      ..removeListener(_onSearchChanged)
      ..dispose();

    super.dispose();
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text.trim().toLowerCase();
    });
  }

  Future<void> _createGare() async {
    final gare = await Navigator.of(context)
        .push<Gare>(MaterialPageRoute(builder: (_) => const GareFormPage()));

    if (!mounted || gare == null) {
      return;
    }

    await ref.read(garesProvider.notifier).ajouterGare(gare);

    if (!mounted) {
      return;
    }

    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Gare ajoutée avec succès.')));
  }

  Future<void> _confirmDelete(Gare gare) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Supprimer la gare'),
          content: Text(
            'Voulez-vous vraiment supprimer la gare « ${gare.nom} » ?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Annuler'),
            ),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Supprimer'),
            ),
          ],
        );
      },
    );

    if (!mounted || confirmed != true) {
      return;
    }

    await ref.read(garesProvider.notifier).supprimerGare(gare.id);

    if (!mounted) {
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Gare supprimée avec succès.')),
    );
  }

  List<Gare> _filterGares(List<Gare> gares) {
    return gares.where((gare) {
      final matchesSearch =
          gare.nom.toLowerCase().contains(_searchQuery) ||
          gare.code.toLowerCase().contains(_searchQuery) ||
          gare.ville.toLowerCase().contains(_searchQuery);

      final matchesStatus = switch (_selectedFilter) {
        'ACTIF' => gare.statut == 'ACTIF',
        'INACTIF' => gare.statut == 'INACTIF',
        _ => true,
      };

      return matchesSearch && matchesStatus;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final garesAsync = ref.watch(garesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestion des gares'),
        actions: [
          IconButton(
            tooltip: 'Actualiser',
            onPressed: () {
              ref.read(garesProvider.notifier).actualiser();
            },
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _createGare,
        icon: const Icon(Icons.add),
        label: const Text('Nouvelle gare'),
      ),
      body: garesAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) {
          return _ErrorView(
            message: error.toString(),
            onRetry: () {
              ref.invalidate(garesProvider);
            },
          );
        },
        data: (gares) {
          final filteredGares = _filterGares(gares);

          final total = gares.length;
          final actifs = gares.where((gare) => gare.statut == 'ACTIF').length;
          final inactifs = gares
              .where((gare) => gare.statut == 'INACTIF')
              .length;

          return RefreshIndicator(
            onRefresh: () {
              return ref.read(garesProvider.notifier).actualiser();
            },
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(20),
              children: [
                _PageHeader(total: total, actifs: actifs, inactifs: inactifs),
                const SizedBox(height: 20),
                _SearchAndFilter(
                  controller: _searchController,
                  selectedFilter: _selectedFilter,
                  onFilterChanged: (filter) {
                    setState(() {
                      _selectedFilter = filter;
                    });
                  },
                ),
                const SizedBox(height: 20),
                if (filteredGares.isEmpty)
                  _EmptySearchView(
                    hasGares: gares.isNotEmpty,
                    searchQuery: _searchQuery,
                  )
                else
                  ...filteredGares.map(
                    (gare) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: GareCard(
                        gare: gare,
                        onDelete: () => _confirmDelete(gare),
                      ),
                    ),
                  ),
                const SizedBox(height: 80),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _PageHeader extends StatelessWidget {
  const _PageHeader({
    required this.total,
    required this.actifs,
    required this.inactifs,
  });

  final int total;
  final int actifs;
  final int inactifs;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Gares',
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 6),
        Text(
          'Gérez les gares disponibles dans le système.',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 20),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: _SummaryItem(
                    label: 'Total',
                    value: total.toString(),
                    icon: Icons.location_on_outlined,
                  ),
                ),
                const _SummaryDivider(),
                Expanded(
                  child: _SummaryItem(
                    label: 'Actives',
                    value: actifs.toString(),
                    icon: Icons.check_circle_outline,
                  ),
                ),
                const _SummaryDivider(),
                Expanded(
                  child: _SummaryItem(
                    label: 'Inactives',
                    value: inactifs.toString(),
                    icon: Icons.cancel_outlined,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _SummaryItem extends StatelessWidget {
  const _SummaryItem({
    required this.label,
    required this.value,
    required this.icon,
  });

  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, size: 26),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}

class _SummaryDivider extends StatelessWidget {
  const _SummaryDivider();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 50,
      child: VerticalDivider(color: Theme.of(context).dividerColor),
    );
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
    return Column(
      children: [
        TextField(
          controller: controller,
          decoration: InputDecoration(
            hintText: 'Rechercher une gare...',
            prefixIcon: const Icon(Icons.search),
            suffixIcon: controller.text.isNotEmpty
                ? IconButton(
                    tooltip: 'Effacer',
                    onPressed: controller.clear,
                    icon: const Icon(Icons.clear),
                  )
                : null,
            border: const OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _FilterChip(
              label: 'TOUS',
              selected: selectedFilter == 'TOUS',
              onSelected: () => onFilterChanged('TOUS'),
            ),
            const SizedBox(width: 8),
            _FilterChip(
              label: 'ACTIF',
              selected: selectedFilter == 'ACTIF',
              onSelected: () => onFilterChanged('ACTIF'),
            ),
            const SizedBox(width: 8),
            _FilterChip(
              label: 'INACTIF',
              selected: selectedFilter == 'INACTIF',
              onSelected: () => onFilterChanged('INACTIF'),
            ),
          ],
        ),
      ],
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onSelected,
  });

  final String label;
  final bool selected;
  final VoidCallback onSelected;

  @override
  Widget build(BuildContext context) {
    return FilterChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => onSelected(),
    );
  }
}

class _EmptySearchView extends StatelessWidget {
  const _EmptySearchView({required this.hasGares, required this.searchQuery});

  final bool hasGares;
  final String searchQuery;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 60),
      child: Column(
        children: [
          Icon(
            hasGares ? Icons.search_off : Icons.location_city_outlined,
            size: 64,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
          const SizedBox(height: 16),
          Text(
            hasGares ? 'Aucune gare trouvée' : 'Aucune gare enregistrée',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Text(
            hasGares
                ? 'Aucun résultat pour « $searchQuery ».'
                : 'Commencez par ajouter une nouvelle gare.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 56),
            const SizedBox(height: 16),
            const Text(
              'Impossible de charger les gares',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }
}
