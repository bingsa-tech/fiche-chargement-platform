import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/entities/utilisateur.dart';
import 'auth_provider.dart';

final currentUserProvider = Provider<Utilisateur?>((ref) {
  final authState = ref.watch(authProvider);
  if (authState is Authenticated) {
    return authState.session.user;
  }
  return null;
});
