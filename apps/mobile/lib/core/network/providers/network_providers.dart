import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../auth_interceptor.dart';
import '../dio_client.dart';
import '../../services/secure_storage_service.dart';

final authInterceptorProvider = Provider<AuthInterceptor>((ref) {
  final secureStorage = ref.watch(secureStorageServiceProvider);

  return AuthInterceptor(secureStorage: secureStorage);
});

final dioClientProvider = Provider<DioClient>((ref) {
  final authInterceptor = ref.watch(authInterceptorProvider);

  return DioClient(authInterceptor: authInterceptor);
});

final dioProvider = Provider((ref) {
  return ref.watch(dioClientProvider).dio;
});
