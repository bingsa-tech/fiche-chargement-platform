import 'package:dio/dio.dart';

import '../services/secure_storage_service.dart';

class AuthInterceptor extends Interceptor {
  final SecureStorageService secureStorage;

  AuthInterceptor({required this.secureStorage});

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await secureStorage.getAccessToken();

    // Le login ne possède pas encore de JWT.
    // On ajoute le token uniquement lorsqu'il existe.
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Pour l'instant, on laisse le repository/notifier
      // gérer l'état d'authentification.
      //
      // Le refresh token pourra être ajouté ici plus tard.
    }

    handler.next(err);
  }
}
