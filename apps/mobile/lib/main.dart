import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/app.dart';

//import 'core/storage/database/database_initializer_web.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  //initDatabasePlatform();

  runApp(const ProviderScope(child: MyApp()));
}
