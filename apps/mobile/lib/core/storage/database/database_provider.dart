import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sqflite/sqflite.dart';

import 'database_helper.dart';

abstract class DatabaseProvider {
  Future<Database> get database;
  Future<void> close();
}

final databaseProvider = Provider<Future<Database>>((ref) async {
  return DatabaseHelper.instance.database;
});
