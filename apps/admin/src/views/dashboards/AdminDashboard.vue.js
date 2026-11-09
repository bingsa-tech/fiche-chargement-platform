import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { getDashboardStats } from '../../api/stats.api';
//const authStore = useAuthStore();
/**
 * Informations utilisateur dynamiques (utilisÃ©es dans le template)
 */
/* const userFullName = computed(() => {
  const user = authStore.user;
  if (!user) return 'Utilisateur';
  return `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
});

const userRole = computed(() => authStore.role ?? 'ROLE_INCONNU');
const userEmail = computed(() => authStore.user?.email ?? 'Non renseignÃ©');
const userGare = computed(() => authStore.user?.gareId ?? 'Non affectÃ©e');
 */
// Variables rÃ©actives pour les statistiques
const totalUtilisateurs = ref(0);
const totalGares = ref(0);
const totalVehicules = ref(0);
const totalChauffeurs = ref(0);
const totalFiches = ref(0);
const isLoading = ref(true);
const fetchDashboardStats = async () => {
    try {
        isLoading.value = true;
        const stats = await getDashboardStats();
        totalUtilisateurs.value = stats.utilisateurs ?? 0;
        totalGares.value = stats.gares ?? 0;
        totalVehicules.value = stats.vehicules ?? 0;
        totalChauffeurs.value = stats.chauffeurs ?? 0;
        totalFiches.value = stats.fiches ?? 0;
    }
    catch (error) {
        console.error("Erreur lors du chargement des statistiques du dashboard", error);
    }
    finally {
        isLoading.value = false;
    }
};
onMounted(() => {
    fetchDashboardStats();
});
const statistics = computed(() => [
    {
        label: 'Utilisateurs',
        description: 'Comptes de la plateforme',
        value: totalUtilisateurs.value,
        icon: 'U',
        color: 'blue',
    },
    {
        label: 'Gares',
        description: 'Points de gestion',
        value: totalGares.value,
        icon: 'G',
        color: 'green',
    },
    {
        label: 'Véhicules',
        description: 'Parc automobile',
        value: totalVehicules.value,
        icon: 'V',
        color: 'orange',
    },
    {
        label: 'Chauffeurs',
        description: 'Personnel de conduite',
        value: totalChauffeurs.value,
        icon: 'C',
        color: 'purple',
    },
    {
        label: 'Fiches',
        description: 'Documents de gestion',
        value: totalFiches.value,
        icon: 'F',
        color: 'red',
    },
]);
const modules = [
    {
        title: 'Gestion des utilisateurs',
        description: 'Comptes, rôles et accès à la plateforme.',
        status: 'connecter à l’API',
        icon: 'GU',
        route: { name: 'utilisateurs' },
    },
    {
        title: 'Gestion des gares',
        description: 'Organisation et administration des gares.',
        status: 'connecter à l’API',
        icon: 'GG',
        route: { name: 'gares' },
    },
    {
        title: 'Supervision du système',
        description: 'Suivi du fonctionnement de la plateforme.',
        status: 'connecter à l’API',
        icon: 'SFP',
        route: { name: 'admin-supervision' },
    },
    {
        title: 'Journal d’audit',
        description: 'Consultation des opérations et événements.',
        status: 'connecter à l’API',
        icon: 'COE',
        route: { name: 'audit' },
    },
    {
        title: 'Gestion des véhicules',
        description: 'Administration du parc automobile.',
        status: 'connecter à l’API',
        icon: 'GV',
        route: { name: 'vehicules' },
    },
    {
        title: 'Gestion des chauffeurs',
        description: 'Administration du personnel de conduite.',
        status: 'connecter à l’API',
        icon: 'GC',
        route: { name: 'chauffeurs' },
    },
    {
        title: 'Gestion des fiches de chargement',
        description: 'Administration des documents de gestion.',
        status: 'connecter à l’API',
        icon: 'GFC',
        route: { name: 'fiches' },
    },
    {
        title: 'Gestion des propriétaires de véhicules',
        description: 'Création et consultation',
        status: 'connecter à l’API',
        icon: 'GP',
        route: { name: 'proprietaires' },
    },
    {
        title: 'Gestion des documents chauffeurs',
        description: 'Création et consultation',
        status: 'connecter à l’API',
        icon: 'GDC',
        route: { name: 'documents-chauffeurs' },
    },
    {
        title: 'Gestion des documents véhicules',
        description: 'Création et consultation',
        status: 'connecter à l’API',
        icon: 'GDV',
        route: { name: 'documents-vehicules' },
    },
    {
        title: 'Gestion des passagers',
        description: 'Création et consultation',
        status: 'connecter à l’API',
        icon: 'GTF',
        route: { name: 'passagers' },
    },
    {
        title: 'Gestion de user online',
        description: 'Création et consultation',
        status: 'connecter à l’API',
        icon: 'UONline',
        route: { name: 'presence-online' },
    }
];
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['welcome-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['account-item']} */ ;
/** @type {__VLS_StyleScopedClasses['account-item']} */ ;
/** @type {__VLS_StyleScopedClasses['account-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['module-card']} */ ;
/** @type {__VLS_StyleScopedClasses['module-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['module-content']} */ ;
/** @type {__VLS_StyleScopedClasses['module-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "dashboard" },
});
/** @type {__VLS_StyleScopedClasses['dashboard']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "statistics-section" },
    'aria-labelledby': "statistics-title",
});
/** @type {__VLS_StyleScopedClasses['statistics-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-heading" },
});
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "data-badge" },
});
/** @type {__VLS_StyleScopedClasses['data-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "statistics-grid" },
});
/** @type {__VLS_StyleScopedClasses['statistics-grid']} */ ;
for (const [stat] of __VLS_vFor((__VLS_ctx.statistics))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
        key: (stat.label),
        ...{ class: "stat-card" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "stat-top" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-top']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "stat-icon" },
        ...{ class: (`icon-${stat.color}`) },
    });
    /** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
    (stat.icon);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "stat-value-badge" },
        'aria-hidden': "true",
    });
    /** @type {__VLS_StyleScopedClasses['stat-value-badge']} */ ;
    (__VLS_ctx.isLoading ? '...' : stat.value);
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    (stat.label);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (stat.description);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "stat-placeholder" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-placeholder']} */ ;
    (__VLS_ctx.isLoading ? 'Chargement...' : 'Synchronisé avec la BD');
    // @ts-ignore
    [statistics, isLoading, isLoading,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "modules-section" },
    'aria-labelledby': "modules-title",
});
/** @type {__VLS_StyleScopedClasses['modules-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "section-heading" },
});
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    id: "modules-title",
    ...{ class: "data-badge" },
});
/** @type {__VLS_StyleScopedClasses['data-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "modules-grid" },
});
/** @type {__VLS_StyleScopedClasses['modules-grid']} */ ;
for (const [module] of __VLS_vFor((__VLS_ctx.modules))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.template)({
        key: (module.title),
    });
    if (module.route) {
        let __VLS_0;
        /** @ts-ignore @type { | typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
        RouterLink;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            to: (module.route),
            ...{ class: "module-card" },
        }));
        const __VLS_2 = __VLS_1({
            to: (module.route),
            ...{ class: "module-card" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        /** @type {__VLS_StyleScopedClasses['module-card']} */ ;
        const { default: __VLS_5 } = __VLS_3.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "module-icon" },
        });
        /** @type {__VLS_StyleScopedClasses['module-icon']} */ ;
        (module.icon);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "module-content" },
        });
        /** @type {__VLS_StyleScopedClasses['module-content']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
        (module.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        (module.description);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "module-status" },
        });
        /** @type {__VLS_StyleScopedClasses['module-status']} */ ;
        (module.status);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "module-arrow" },
            'aria-hidden': "true",
        });
        /** @type {__VLS_StyleScopedClasses['module-arrow']} */ ;
        // @ts-ignore
        [modules,];
        var __VLS_3;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "module-card module-disabled" },
            'aria-disabled': "true",
        });
        /** @type {__VLS_StyleScopedClasses['module-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['module-disabled']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "module-icon" },
        });
        /** @type {__VLS_StyleScopedClasses['module-icon']} */ ;
        (module.icon);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "module-content" },
        });
        /** @type {__VLS_StyleScopedClasses['module-content']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
        (module.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        (module.description);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "module-status" },
        });
        /** @type {__VLS_StyleScopedClasses['module-status']} */ ;
        (module.status);
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "dashboard-note" },
});
/** @type {__VLS_StyleScopedClasses['dashboard-note']} */ ;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
