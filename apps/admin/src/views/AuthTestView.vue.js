import { ref } from 'vue';
import api from '../api/axios';
const ACCESS_TOKEN_KEY = 'access_token';
const loading = ref(false);
const shortTokenLoading = ref(false);
const error = ref(null);
const shortTokenMessage = ref(null);
const result = ref(null);
async function testProtectedRoute() {
    loading.value = true;
    error.value = null;
    result.value = null;
    try {
        const response = await api.get('/api/test-permissions/protected');
        result.value = response.data;
    }
    catch (err) {
        error.value =
            err instanceof Error
                ? err.message
                : 'Une erreur est survenue.';
    }
    finally {
        loading.value = false;
    }
}
async function generateShortToken() {
    shortTokenLoading.value = true;
    error.value = null;
    shortTokenMessage.value = null;
    result.value = null;
    try {
        const response = await api.get('/api/test-permissions/short-token');
        const shortToken = response.data?.accessToken;
        if (!shortToken) {
            throw new Error('Le backend n’a pas retourné de token de test.');
        }
        localStorage.setItem(ACCESS_TOKEN_KEY, shortToken);
        shortTokenMessage.value =
            'Token de test installé. Il expire dans 10 secondes.';
        result.value = {
            message: response.data?.message,
            expiresIn: response.data?.expiresIn,
        };
    }
    catch (err) {
        error.value =
            err instanceof Error
                ? err.message
                : 'Impossible de générer le token de test.';
    }
    finally {
        shortTokenLoading.value = false;
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "auth-test" },
});
/** @type {__VLS_StyleScopedClasses['auth-test']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "actions" },
});
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.testProtectedRoute) },
    disabled: (__VLS_ctx.loading),
});
(__VLS_ctx.loading
    ? 'Test en cours...'
    : 'Tester l’authentification JWT');
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.generateShortToken) },
    disabled: (__VLS_ctx.shortTokenLoading),
});
(__VLS_ctx.shortTokenLoading
    ? 'Génération en cours...'
    : 'Générer un token de test (10 s)');
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "error" },
    });
    /** @type {__VLS_StyleScopedClasses['error']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.error);
}
if (__VLS_ctx.shortTokenMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "info" },
    });
    /** @type {__VLS_StyleScopedClasses['info']} */ ;
    (__VLS_ctx.shortTokenMessage);
}
if (__VLS_ctx.result) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "success" },
    });
    /** @type {__VLS_StyleScopedClasses['success']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
    (JSON.stringify(__VLS_ctx.result, null, 2));
}
// @ts-ignore
[testProtectedRoute, loading, loading, generateShortToken, shortTokenLoading, shortTokenLoading, error, error, shortTokenMessage, shortTokenMessage, result, result,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
