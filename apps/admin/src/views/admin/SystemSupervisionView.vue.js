import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { getDashboardStats } from '../../api/stats.api';
const stats = ref({
    utilisateurs: 0,
    gares: 0,
    vehicules: 0,
    chauffeurs: 0,
    fiches: 0,
});
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const lastUpdated = ref(null);
const indicators = [
    { key: 'utilisateurs', label: 'Utilisateurs', icon: 'U' },
    { key: 'gares', label: 'Gares', icon: 'G' },
    { key: 'vehicules', label: 'Véhicules', icon: 'V' },
    { key: 'chauffeurs', label: 'Chauffeurs', icon: 'C' },
    { key: 'fiches', label: 'Fiches de chargement', icon: 'F' },
];
const loadSupervision = async () => {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = '';
    try {
        const result = await getDashboardStats();
        stats.value = {
            utilisateurs: result.utilisateurs ?? 0,
            gares: result.gares ?? 0,
            vehicules: result.vehicules ?? 0,
            chauffeurs: result.chauffeurs ?? 0,
            fiches: result.fiches ?? 0,
        };
        lastUpdated.value = new Date();
    }
    catch (error) {
        console.error('Erreur de supervision :', error);
        hasError.value = true;
        errorMessage.value =
            'Impossible de récupérer les statistiques depuis le serveur.';
    }
    finally {
        isLoading.value = false;
    }
};
const formattedDate = () => {
    if (!lastUpdated.value)
        return 'Aucune actualisation';
    return lastUpdated.value.toLocaleString('fr-CA', {
        dateStyle: 'long',
        timeStyle: 'medium',
    });
};
onMounted(loadSupervision);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['status-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['status-info']} */ ;
/** @type {__VLS_StyleScopedClasses['status-info']} */ ;
/** @type {__VLS_StyleScopedClasses['refresh-button']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['technical-section']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['technical-card']} */ ;
/** @type {__VLS_StyleScopedClasses['technical-row']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['status-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['technical-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "supervision-page" },
});
/** @type {__VLS_StyleScopedClasses['supervision-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "page-header" },
});
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "eyebrow" },
});
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    to: ({ name: 'admin-dashboard' }),
    ...{ class: "back-link" },
}));
const __VLS_2 = __VLS_1({
    to: ({ name: 'admin-dashboard' }),
    ...{ class: "back-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "status-panel" },
});
/** @type {__VLS_StyleScopedClasses['status-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "status-info" },
});
/** @type {__VLS_StyleScopedClasses['status-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "status-indicator" },
    ...{ class: ({
            'status-ok': !__VLS_ctx.hasError && __VLS_ctx.lastUpdated,
            'status-error': __VLS_ctx.hasError,
            'status-pending': !__VLS_ctx.lastUpdated && !__VLS_ctx.hasError,
        }) },
});
/** @type {__VLS_StyleScopedClasses['status-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['status-ok']} */ ;
/** @type {__VLS_StyleScopedClasses['status-error']} */ ;
/** @type {__VLS_StyleScopedClasses['status-pending']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.hasError
    ? 'Accès aux données indisponible'
    : __VLS_ctx.lastUpdated
        ? 'Connexion aux données réussie'
        : 'Vérification en attente');
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.errorMessage || 'Vérification de la récupération des statistiques.');
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.loadSupervision) },
    type: "button",
    ...{ class: "refresh-button" },
    disabled: (__VLS_ctx.isLoading),
});
/** @type {__VLS_StyleScopedClasses['refresh-button']} */ ;
(__VLS_ctx.isLoading ? 'Vérification...' : 'Actualiser');
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "metrics-section" },
});
/** @type {__VLS_StyleScopedClasses['metrics-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-title" },
});
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "metrics-grid" },
});
/** @type {__VLS_StyleScopedClasses['metrics-grid']} */ ;
for (const [indicator] of __VLS_vFor((__VLS_ctx.indicators))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
        key: (indicator.key),
        ...{ class: "metric-card" },
    });
    /** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "metric-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
    (indicator.icon);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "metric-value" },
    });
    /** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
    (__VLS_ctx.isLoading ? '...' : __VLS_ctx.stats[indicator.key]);
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    (indicator.label);
    // @ts-ignore
    [hasError, hasError, hasError, hasError, lastUpdated, lastUpdated, lastUpdated, errorMessage, loadSupervision, isLoading, isLoading, isLoading, indicators, stats,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "technical-section" },
});
/** @type {__VLS_StyleScopedClasses['technical-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "technical-card" },
});
/** @type {__VLS_StyleScopedClasses['technical-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "technical-row" },
});
/** @type {__VLS_StyleScopedClasses['technical-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({
    ...{ class: (__VLS_ctx.hasError ? 'text-error' : __VLS_ctx.lastUpdated ? 'text-success' : '') },
});
(__VLS_ctx.hasError
    ? 'Échec'
    : __VLS_ctx.lastUpdated
        ? 'Opérationnelle'
        : 'En attente');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "technical-row" },
});
/** @type {__VLS_StyleScopedClasses['technical-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.formattedDate());
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "technical-row" },
});
/** @type {__VLS_StyleScopedClasses['technical-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
// @ts-ignore
[hasError, hasError, lastUpdated, lastUpdated, formattedDate,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
