import { computed, onUnmounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '../auth/auth.store';
import HeaderView from '../components/HeaderView.vue';
import FooterView from '../components/FooterView.vue';
import { presenceApi } from '../api/presence.api';
const router = useRouter();
const authStore = useAuthStore();
const sidebarOpen = ref(false);
// ============================================================
// PRÉSENCE EN LIGNE — HEARTBEAT
// ============================================================
const HEARTBEAT_INTERVAL = 30_000;
let heartbeatTimer = null;
let heartbeatInProgress = false;
async function sendHeartbeat() {
    if (!authStore.isAuthenticated || heartbeatInProgress) {
        return;
    }
    heartbeatInProgress = true;
    try {
        const response = await presenceApi.heartbeat();
        console.debug('[PRESENCE] Heartbeat confirmé :', response.lastSeenAt);
    }
    catch (error) {
        console.error('[PRESENCE] Échec du heartbeat :', error);
    }
    finally {
        heartbeatInProgress = false;
    }
}
function startHeartbeat() {
    if (heartbeatTimer !== null) {
        return;
    }
    void sendHeartbeat();
    heartbeatTimer = setInterval(() => {
        void sendHeartbeat();
    }, HEARTBEAT_INTERVAL);
}
function stopHeartbeat() {
    if (heartbeatTimer !== null) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }
}
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
    stopHeartbeat();
    if (isAuthenticated) {
        startHeartbeat();
    }
}, { immediate: true });
onUnmounted(() => {
    stopHeartbeat();
});
// ============================================================
// INFORMATIONS UTILISATEUR
// ============================================================
const userFullName = computed(() => {
    const user = authStore.user;
    if (!user) {
        return 'Utilisateur';
    }
    return `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
});
const userRole = computed(() => authStore.role ?? 'ROLE_INCONNU');
const userEmail = computed(() => authStore.user?.email ?? '');
const userGare = computed(() => authStore.user?.gareId ?? 'Non affectée');
const canManageUsers = computed(() => authStore.role === 'ADMIN' ||
    authStore.role === 'RESPONSABLE_GARE');
const canViewAudit = computed(() => authStore.role === 'ADMIN' ||
    authStore.role === 'RESPONSABLE_GARE');
const canViewPresenceOnline = computed(() => authStore.role === 'ADMIN' ||
    authStore.role === 'AUTORITE_HABILITEE');
function closeSidebar() {
    sidebarOpen.value = false;
}
function navigateTo(routeName) {
    closeSidebar();
    void router.push({ name: routeName });
}
async function logout() {
    closeSidebar();
    try {
        await authStore.logout();
    }
    catch (error) {
        console.error('Erreur lors de la déconnexion', error);
    }
    finally {
        await router.push({ name: 'home' });
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['brand-text']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-text']} */ ;
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-button']} */ ;
/** @type {__VLS_StyleScopedClasses['content-user-context']} */ ;
/** @type {__VLS_StyleScopedClasses['content-user-context']} */ ;
/** @type {__VLS_StyleScopedClasses['content-user-context']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['close-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['main-area']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-button']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['content-user-context']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "admin-layout" },
});
/** @type {__VLS_StyleScopedClasses['admin-layout']} */ ;
if (__VLS_ctx.sidebarOpen) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.closeSidebar) },
        ...{ class: "sidebar-overlay" },
    });
    /** @type {__VLS_StyleScopedClasses['sidebar-overlay']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "sidebar" },
    ...{ class: ({ 'sidebar-open': __VLS_ctx.sidebarOpen }) },
});
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-open']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar-header" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "brand" },
});
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "brand-logo" },
});
/** @type {__VLS_StyleScopedClasses['brand-logo']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "brand-text" },
});
/** @type {__VLS_StyleScopedClasses['brand-text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.closeSidebar) },
    type: "button",
    ...{ class: "close-sidebar" },
    'aria-label': "Fermer le menu",
});
/** @type {__VLS_StyleScopedClasses['close-sidebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)({
    ...{ class: "navigation" },
});
/** @type {__VLS_StyleScopedClasses['navigation']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "navigation-section" },
});
/** @type {__VLS_StyleScopedClasses['navigation-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-title" },
});
/** @type {__VLS_StyleScopedClasses['navigation-title']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    to: ({ name: 'role-hub' }),
    ...{ class: "navigation-item" },
    activeClass: "active",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    to: ({ name: 'role-hub' }),
    ...{ class: "navigation-item" },
    activeClass: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.closeSidebar),
};
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
const { default: __VLS_7 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
// @ts-ignore
[sidebarOpen, sidebarOpen, closeSidebar, closeSidebar, closeSidebar,];
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "navigation-section" },
});
/** @type {__VLS_StyleScopedClasses['navigation-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-title" },
});
/** @type {__VLS_StyleScopedClasses['navigation-title']} */ ;
if (__VLS_ctx.canManageUsers) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.canManageUsers))
                    throw 0;
                return (__VLS_ctx.navigateTo('utilisateurs'));
                // @ts-ignore
                [canManageUsers, navigateTo,];
            } },
        type: "button",
        ...{ class: "navigation-item" },
    });
    /** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "navigation-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.navigateTo('gares'));
            // @ts-ignore
            [navigateTo,];
        } },
    type: "button",
    ...{ class: "navigation-item" },
});
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.navigateTo('proprietaires'));
            // @ts-ignore
            [navigateTo,];
        } },
    type: "button",
    ...{ class: "navigation-item" },
});
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.navigateTo('vehicules'));
            // @ts-ignore
            [navigateTo,];
        } },
    type: "button",
    ...{ class: "navigation-item" },
});
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.navigateTo('chauffeurs'));
            // @ts-ignore
            [navigateTo,];
        } },
    type: "button",
    ...{ class: "navigation-item" },
});
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.navigateTo('documents-vehicules'));
            // @ts-ignore
            [navigateTo,];
        } },
    type: "button",
    ...{ class: "navigation-item" },
});
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.navigateTo('documents-chauffeurs'));
            // @ts-ignore
            [navigateTo,];
        } },
    type: "button",
    ...{ class: "navigation-item" },
});
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.navigateTo('fiches'));
            // @ts-ignore
            [navigateTo,];
        } },
    type: "button",
    ...{ class: "navigation-item" },
});
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.navigateTo('passagers'));
            // @ts-ignore
            [navigateTo,];
        } },
    type: "button",
    ...{ class: "navigation-item" },
    title: "Module prochainement disponible",
});
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "navigation-section" },
});
/** @type {__VLS_StyleScopedClasses['navigation-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-title" },
});
/** @type {__VLS_StyleScopedClasses['navigation-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.navigateTo('alertes'));
            // @ts-ignore
            [navigateTo,];
        } },
    type: "button",
    ...{ class: "navigation-item" },
});
/** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "navigation-icon" },
});
/** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
if (__VLS_ctx.canViewAudit) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.canViewAudit))
                    throw 0;
                return (__VLS_ctx.navigateTo('audit'));
                // @ts-ignore
                [navigateTo, canViewAudit,];
            } },
        type: "button",
        ...{ class: "navigation-item" },
    });
    /** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "navigation-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
if (__VLS_ctx.canViewPresenceOnline) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.canViewPresenceOnline))
                    throw 0;
                return (__VLS_ctx.navigateTo('presence-online'));
                // @ts-ignore
                [navigateTo, canViewPresenceOnline,];
            } },
        type: "button",
        ...{ class: "navigation-item" },
    });
    /** @type {__VLS_StyleScopedClasses['navigation-item']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "navigation-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['navigation-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar-footer" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-footer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.logout) },
    type: "button",
    ...{ class: "logout-button" },
});
/** @type {__VLS_StyleScopedClasses['logout-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "main-area" },
});
/** @type {__VLS_StyleScopedClasses['main-area']} */ ;
const __VLS_8 = HeaderView;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    subtitle: "Administration",
}));
const __VLS_10 = __VLS_9({
    subtitle: "Administration",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "topbar" },
});
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.sidebarOpen = true);
            // @ts-ignore
            [sidebarOpen, logout,];
        } },
    type: "button",
    ...{ class: "menu-button" },
    'aria-label': "Ouvrir le menu",
    'aria-expanded': (__VLS_ctx.sidebarOpen),
});
/** @type {__VLS_StyleScopedClasses['menu-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "content" },
});
/** @type {__VLS_StyleScopedClasses['content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "content-user-context" },
    'aria-label': "Informations du compte connecté",
});
/** @type {__VLS_StyleScopedClasses['content-user-context']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "context-label" },
});
/** @type {__VLS_StyleScopedClasses['context-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.userFullName);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "context-label" },
});
/** @type {__VLS_StyleScopedClasses['context-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.userEmail || 'Non renseigné');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "context-label" },
});
/** @type {__VLS_StyleScopedClasses['context-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.userGare);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "context-label" },
});
/** @type {__VLS_StyleScopedClasses['context-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.userRole);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-content" },
});
/** @type {__VLS_StyleScopedClasses['page-content']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.RouterView} */
RouterView;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const __VLS_18 = FooterView;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
// @ts-ignore
[sidebarOpen, userFullName, userEmail, userGare, userRole,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
