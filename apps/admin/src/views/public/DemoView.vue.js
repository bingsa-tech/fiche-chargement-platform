import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const activeSection = ref('overview');
const demoData = {
    gares: 12,
    vehicules: 48,
    chauffeurs: 36,
    fiches: 125,
};
const recentOperations = [
    {
        id: 'FC-2026-001',
        gare: 'Gare Centrale',
        chauffeur: 'Jean Dupont',
        vehicule: 'ABC-123',
        statut: 'Validée',
    },
    {
        id: 'FC-2026-002',
        gare: 'Gare du Nord',
        chauffeur: 'Marc Martin',
        vehicule: 'DEF-456',
        statut: 'En attente',
    },
    {
        id: 'FC-2026-003',
        gare: 'Gare Centrale',
        chauffeur: 'Paul Bernard',
        vehicule: 'GHI-789',
        statut: 'Validée',
    },
    {
        id: 'FC-2026-004',
        gare: 'Gare du Sud',
        chauffeur: 'David Laurent',
        vehicule: 'JKL-012',
        statut: 'À vérifier',
    },
];
const menuItems = [
    { id: 'overview', label: 'Vue générale', icon: '▦' },
    { id: 'gares', label: 'Gares', icon: '⌂' },
    { id: 'vehicules', label: 'Véhicules', icon: '▣' },
    { id: 'chauffeurs', label: 'Chauffeurs', icon: '♙' },
    { id: 'fiches', label: 'Fiches de chargement', icon: '▤' },
    { id: 'alertes', label: 'Alertes', icon: '◷' },
];
function goToLogin() {
    router.push({ name: 'login' });
}
function goToHome() {
    router.push({ name: 'landing' });
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['demo-brand']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-brand']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-brand']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-brand']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-user']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-user']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-user']} */ ;
/** @type {__VLS_StyleScopedClasses['content-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['content-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['section-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['section-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-header']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['data-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['demo-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "demo-page" },
});
/** @type {__VLS_StyleScopedClasses['demo-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "demo-header" },
});
/** @type {__VLS_StyleScopedClasses['demo-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-brand" },
});
/** @type {__VLS_StyleScopedClasses['demo-brand']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "../../assets/logo.png",
    alt: "Logo",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-header-actions" },
});
/** @type {__VLS_StyleScopedClasses['demo-header-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "demo-mode" },
});
/** @type {__VLS_StyleScopedClasses['demo-mode']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.goToLogin) },
    ...{ class: "login-button" },
});
/** @type {__VLS_StyleScopedClasses['login-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-banner" },
});
/** @type {__VLS_StyleScopedClasses['demo-banner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-layout" },
});
/** @type {__VLS_StyleScopedClasses['demo-layout']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)({
    ...{ class: "demo-sidebar" },
});
/** @type {__VLS_StyleScopedClasses['demo-sidebar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar-heading" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-heading']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.menuItems))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                return (__VLS_ctx.activeSection = item.id);
                // @ts-ignore
                [goToLogin, menuItems, activeSection,];
            } },
        key: (item.id),
        ...{ class: "menu-item" },
        ...{ class: ({ active: __VLS_ctx.activeSection === item.id }) },
    });
    /** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "menu-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['menu-icon']} */ ;
    (item.icon);
    (item.label);
    // @ts-ignore
    [activeSection,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar-bottom" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-bottom']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "demo-user" },
});
/** @type {__VLS_StyleScopedClasses['demo-user']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-avatar" },
});
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.goToHome) },
    ...{ class: "back-button" },
});
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "demo-content" },
});
/** @type {__VLS_StyleScopedClasses['demo-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content-heading" },
});
/** @type {__VLS_StyleScopedClasses['content-heading']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "eyebrow" },
});
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
(__VLS_ctx.menuItems.find(item => item.id === __VLS_ctx.activeSection)?.label
    ?? 'Vue générale');
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "readonly-badge" },
});
/** @type {__VLS_StyleScopedClasses['readonly-badge']} */ ;
if (__VLS_ctx.activeSection === 'overview') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "stats-grid" },
    });
    /** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
        ...{ class: "stat-card" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "stat-icon blue" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['blue']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.demoData.gares);
    __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
        ...{ class: "stat-card" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "stat-icon purple" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['purple']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.demoData.vehicules);
    __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
        ...{ class: "stat-card" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "stat-icon green" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['green']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.demoData.chauffeurs);
    __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
        ...{ class: "stat-card" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "stat-icon orange" },
    });
    /** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['orange']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.demoData.fiches);
    __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
        ...{ class: "data-panel" },
    });
    /** @type {__VLS_StyleScopedClasses['data-panel']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "panel-heading" },
    });
    /** @type {__VLS_StyleScopedClasses['panel-heading']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "sample-label" },
    });
    /** @type {__VLS_StyleScopedClasses['sample-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "table-wrapper" },
    });
    /** @type {__VLS_StyleScopedClasses['table-wrapper']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.table, __VLS_intrinsics.table)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
    for (const [operation] of __VLS_vFor((__VLS_ctx.recentOperations))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            key: (operation.id),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "reference" },
        });
        /** @type {__VLS_StyleScopedClasses['reference']} */ ;
        (operation.id);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (operation.gare);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (operation.chauffeur);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (operation.vehicule);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "status" },
            ...{ class: ({
                    validated: operation.statut === 'Validée',
                    pending: operation.statut === 'En attente',
                    warning: operation.statut === 'À vérifier',
                }) },
        });
        /** @type {__VLS_StyleScopedClasses['status']} */ ;
        /** @type {__VLS_StyleScopedClasses['validated']} */ ;
        /** @type {__VLS_StyleScopedClasses['pending']} */ ;
        /** @type {__VLS_StyleScopedClasses['warning']} */ ;
        (operation.statut);
        // @ts-ignore
        [menuItems, activeSection, activeSection, goToHome, demoData, demoData, demoData, demoData, recentOperations,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
        ...{ class: "data-panel section-placeholder" },
    });
    /** @type {__VLS_StyleScopedClasses['data-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['section-placeholder']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "placeholder-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['placeholder-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    (__VLS_ctx.menuItems.find(item => item.id === __VLS_ctx.activeSection)?.label);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "readonly-badge" },
    });
    /** @type {__VLS_StyleScopedClasses['readonly-badge']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
    ...{ class: "demo-footer" },
});
/** @type {__VLS_StyleScopedClasses['demo-footer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
// @ts-ignore
[menuItems, activeSection,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
