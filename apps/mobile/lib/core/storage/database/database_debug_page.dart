import 'package:flutter/material.dart';

import '../../../features/gares/data/dao/gare_dao.dart';
import '../../../features/gares/data/models/gare_model.dart';
import 'database_helper.dart';

class DatabaseDebugPage extends StatefulWidget {
  const DatabaseDebugPage({super.key});

  @override
  State<DatabaseDebugPage> createState() => _DatabaseDebugPageState();
}

class _DatabaseDebugPageState extends State<DatabaseDebugPage> {
  bool _loading = true;
  String? _error;

  List<String> _tables = [];
  final Map<String, List<Map<String, Object?>>> _tableData = {};
  final Map<String, bool> _expandedTables = {};

  static const String _testGareId = 'TEST-GARE-001';

  final GareDao _gareDao = GareDao();

  @override
  void initState() {
    super.initState();
    _loadDatabase();
  }

  Future<void> _loadDatabase() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final db = await DatabaseHelper.instance.database;

      final tablesResult = await db.rawQuery('''
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      ''');

      final tables = tablesResult.map((row) => row['name'] as String).toList();

      final data = <String, List<Map<String, Object?>>>{};

      for (final table in tables) {
        final rows = await db.query(table);
        data[table] = rows;
      }

      if (!mounted) return;

      setState(() {
        _tables = tables;
        _tableData
          ..clear()
          ..addAll(data);
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _loading = false;
        _error = e.toString();
      });
    }
  }

  void _toggleTable(String table) {
    setState(() {
      _expandedTables[table] = !(_expandedTables[table] ?? false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SQLite - Diagnostic'),
        actions: [
          IconButton(
            tooltip: 'Actualiser',
            onPressed: _loading ? null : _loadDatabase,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              const Text(
                'Erreur SQLite',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              SelectableText(_error!),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _loadDatabase,
                icon: const Icon(Icons.refresh),
                label: const Text('Réessayer'),
              ),
            ],
          ),
        ),
      );
    }

    if (_tables.isEmpty) {
      return const Center(
        child: Text(
          'Aucune table SQLite trouvée.',
          style: TextStyle(fontSize: 18),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadDatabase,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildDatabaseSummary(),
          const SizedBox(height: 16),
          ..._tables.map(_buildTableCard),
        ],
      ),
    );
  }

  Widget _buildDatabaseSummary() {
    final totalRows = _tableData.values.fold<int>(
      0,
      (total, rows) => total + rows.length,
    );

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Base SQLite',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text('Base : fiche_chargement.db'),
            Text('Tables : ${_tables.length}'),
            Text('Total des lignes : $totalRows'),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                ElevatedButton.icon(
                  onPressed: _insertTestGare,
                  icon: const Icon(Icons.add),
                  label: const Text('INSERT'),
                ),
                ElevatedButton.icon(
                  onPressed: _selectTestGare,
                  icon: const Icon(Icons.search),
                  label: const Text('SELECT'),
                ),
                ElevatedButton.icon(
                  onPressed: _deleteTestGare,
                  icon: const Icon(Icons.delete),
                  label: const Text('DELETE'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTableCard(String table) {
    final rows = _tableData[table] ?? [];
    final expanded = _expandedTables[table] ?? false;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ExpansionTile(
        initiallyExpanded: expanded,
        onExpansionChanged: (_) => _toggleTable(table),
        leading: const Icon(Icons.table_chart),
        title: Text(table, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text('${rows.length} ligne${rows.length > 1 ? 's' : ''}'),
        children: [
          if (rows.isEmpty)
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Aucune donnée dans cette table.',
                style: TextStyle(fontStyle: FontStyle.italic),
              ),
            )
          else
            _buildRows(rows),
        ],
      ),
    );
  }

  Widget _buildRows(List<Map<String, Object?>> rows) {
    final columns = rows.first.keys.toList();

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.all(12),
      child: DataTable(
        columns: columns
            .map(
              (column) => DataColumn(
                label: Text(
                  column,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            )
            .toList(),
        rows: rows
            .map(
              (row) => DataRow(
                cells: columns
                    .map(
                      (column) =>
                          DataCell(SelectableText(_formatValue(row[column]))),
                    )
                    .toList(),
              ),
            )
            .toList(),
      ),
    );
  }

  String _formatValue(Object? value) {
    if (value == null) {
      return 'NULL';
    }

    return value.toString();
  }

  Future<void> _insertTestGare() async {
    try {
      final now = DateTime.now();

      final gare = GareModel(
        id: _testGareId,
        code: 'TEST001',
        nom: 'Gare de Test',
        ville: 'Sherbrooke',
        adresse: 'Adresse de test',
        statut: 'ACTIF',
        createdAt: now,
        updatedAt: now,
      );

      await _gareDao.insert(gare);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('INSERT via GareDao réussi')),
      );

      await _loadDatabase();
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erreur INSERT : $e')));
    }
  }

  Future<void> _selectTestGare() async {
    try {
      final gare = await _gareDao.findById(_testGareId);

      if (!mounted) return;

      if (gare == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('SELECT : aucune gare de test trouvée')),
        );
        return;
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('SELECT via GareDao réussi : ${gare.nom}')),
      );
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erreur SELECT : $e')));
    }
  }

  Future<void> _deleteTestGare() async {
    try {
      final gare = await _gareDao.findById(_testGareId);

      if (gare == null) {
        if (!mounted) return;

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Aucune gare de test à supprimer')),
        );
        return;
      }

      await _gareDao.delete(_testGareId);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('DELETE via GareDao réussi')),
      );

      await _loadDatabase();
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erreur DELETE : $e')));
    }
  }
}
