import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../auth/auth.store';
import { getClientInfo } from '../utils/client-info';
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);
const username = ref('');
const password = ref('');
const showPassword = ref(false);
async function handleLogin() {
    if (!username.value.trim() || !password.value) {
        return;
    }
    try {
        await authStore.login(username.value.trim(), password.value);
        const redirect = route.query.redirect;
        if (typeof redirect === 'string' && redirect) {
            await router.push(redirect);
            return;
        }
        switch (authStore.role) {
            case 'ADMIN':
                await router.push({ name: 'admin-dashboard' });
                break;
            case 'AGENT':
                await router.push({ name: 'agent-dashboard' });
                break;
            case 'CONTROLEUR':
                await router.push({ name: 'controleur-dashboard' });
                break;
            case 'AUTORITE_HABILITEE':
                await router.push({ name: 'autorite-dashboard' });
                break;
            case 'RESPONSABLE_GARE':
                await router.push({
                    name: 'responsable-gare-dashboard',
                });
                break;
            default:
                await router.push({ name: 'unauthorized' });
        }
    }
    catch {
        // L'erreur est déjà gérée par authStore.error.
    }
}
function testerInformationsClient() {
    const infos = getClientInfo();
    console.table(infos);
    return infos;
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['security-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['security-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['security-main']} */ ;
/** @type {__VLS_StyleScopedClasses['security-main']} */ ;
/** @type {__VLS_StyleScopedClasses['security-item']} */ ;
/** @type {__VLS_StyleScopedClasses['security-item']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['password-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-button']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['security-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['security-main']} */ ;
/** @type {__VLS_StyleScopedClasses['login-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['login-page']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['security-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['security-main']} */ ;
/** @type {__VLS_StyleScopedClasses['login-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "login-page" },
});
/** @type {__VLS_StyleScopedClasses['login-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "login-container" },
});
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "security-panel" },
});
/** @type {__VLS_StyleScopedClasses['security-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "security-content" },
});
/** @type {__VLS_StyleScopedClasses['security-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "brand" },
});
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "brand-icon" },
});
/** @type {__VLS_StyleScopedClasses['brand-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "security-main" },
});
/** @type {__VLS_StyleScopedClasses['security-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "security-label" },
});
/** @type {__VLS_StyleScopedClasses['security-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "security-items" },
});
/** @type {__VLS_StyleScopedClasses['security-items']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "security-item" },
});
/** @type {__VLS_StyleScopedClasses['security-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "item-icon" },
});
/** @type {__VLS_StyleScopedClasses['item-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "security-item" },
});
/** @type {__VLS_StyleScopedClasses['security-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "item-icon" },
});
/** @type {__VLS_StyleScopedClasses['item-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "security-item" },
});
/** @type {__VLS_StyleScopedClasses['security-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "item-icon" },
});
/** @type {__VLS_StyleScopedClasses['item-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "security-footer" },
});
/** @type {__VLS_StyleScopedClasses['security-footer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-panel" },
});
/** @type {__VLS_StyleScopedClasses['login-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-card" },
});
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-header" },
});
/** @type {__VLS_StyleScopedClasses['login-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-icon" },
});
/** @type {__VLS_StyleScopedClasses['login-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.handleLogin) },
    ...{ class: "login-form" },
});
/** @type {__VLS_StyleScopedClasses['login-form']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-group" },
});
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "username",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "input-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "input-icon" },
});
/** @type {__VLS_StyleScopedClasses['input-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "username",
    value: (__VLS_ctx.username),
    type: "text",
    autocomplete: "username",
    placeholder: "Votre nom d'utilisateur",
    disabled: (__VLS_ctx.loading),
    required: true,
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-group" },
});
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "password",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "input-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "input-icon" },
});
/** @type {__VLS_StyleScopedClasses['input-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "password",
    type: (__VLS_ctx.showPassword ? 'text' : 'password'),
    autocomplete: "current-password",
    placeholder: "Votre mot de passe",
    disabled: (__VLS_ctx.loading),
    required: true,
});
(__VLS_ctx.password);
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.showPassword = !__VLS_ctx.showPassword);
            // @ts-ignore
            [handleLogin, username, loading, loading, showPassword, showPassword, showPassword, password,];
        } },
    type: "button",
    ...{ class: "password-toggle" },
    'aria-label': (__VLS_ctx.showPassword
        ? 'Masquer le mot de passe'
        : 'Afficher le mot de passe'),
    disabled: (__VLS_ctx.loading),
});
/** @type {__VLS_StyleScopedClasses['password-toggle']} */ ;
(__VLS_ctx.showPassword ? '🙈' : '👁️');
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "login-error" },
        role: "alert",
    });
    /** @type {__VLS_StyleScopedClasses['login-error']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "error-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['error-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.error);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    ...{ class: "login-button" },
    disabled: (__VLS_ctx.loading ||
        !__VLS_ctx.username.trim() ||
        !__VLS_ctx.password),
});
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "button-content" },
    });
    /** @type {__VLS_StyleScopedClasses['button-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "spinner" },
    });
    /** @type {__VLS_StyleScopedClasses['spinner']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "button-content" },
    });
    /** @type {__VLS_StyleScopedClasses['button-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "arrow" },
    });
    /** @type {__VLS_StyleScopedClasses['arrow']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.testerInformationsClient) },
    type: "button",
    ...{ class: "secondary-button" },
});
/** @type {__VLS_StyleScopedClasses['secondary-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-security" },
});
/** @type {__VLS_StyleScopedClasses['login-security']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lock-icon" },
});
/** @type {__VLS_StyleScopedClasses['lock-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
// @ts-ignore
[username, loading, loading, loading, showPassword, showPassword, password, error, error, testerInformationsClient,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
