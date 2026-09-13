import 'package:dio/dio.dart';

import 'auth_interceptor.dart';

class DioClient {
  static const String baseUrl = 'http://10.0.2.2:8085';

  final Dio dio;

  DioClient({required AuthInterceptor authInterceptor})
    : dio = Dio(
        BaseOptions(
          baseUrl: baseUrl,
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10),
          sendTimeout: const Duration(seconds: 10),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        ),
      ) {
    dio.interceptors.add(authInterceptor);
  }
}
