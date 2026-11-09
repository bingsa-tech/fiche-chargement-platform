import { computed, onMounted, ref, } from 'vue';
import { useRouter } from 'vue-router';
import { getUtilisateurs } from '../../api/utilisateurs.api';
import { useAuthStore } from '../../auth/auth.store';
const router = useRouter();
const authStore = useAuthStore();
/* =====================================================
 * STATE
 * ===================================================== */
const utilisateurs = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const search = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
/* =====================================================
 * PERMISSIONS UI
 * ===================================================== */
const canCreate = computed(() => {
    return (authStore.role === 'ADMIN' ||
        authStore.role === 'RESPONSABLE_GARE');
});
/* =====================================================
 * ROLES DISPONIBLES
 * ===================================================== */
const roles = computed(() => {
    const uniqueRoles = new Set();
    utilisateurs.value.forEach((utilisateur) => {
        const roleCode = utilisateur.role?.code;
        if (roleCode) {
            uniqueRoles.add(roleCode);
        }
    });
    return Array.from(uniqueRoles).sort();
});
/* =====================================================
 * FILTER
 * ===================================================== */
const filteredUtilisateurs = computed(() => {
    const normalizedSearch = search.value
        .trim()
        .toLowerCase();
    return utilisateurs.value.filter((utilisateur) => {
        const matchesSearch = !normalizedSearch ||
            utilisateur.username
                .toLowerCase()
                .includes(normalizedSearch) ||
            utilisateur.email
                .toLowerCase()
                .includes(normalizedSearch) ||
            utilisateur.nom
                .toLowerCase()
                .includes(normalizedSearch) ||
            utilisateur.prenom
                .toLowerCase()
                .includes(normalizedSearch);
        const matchesRole = !roleFilter.value ||
            utilisateur.role?.code === roleFilter.value;
        let matchesStatus = true;
        if (statusFilter.value === 'active') {
            matchesStatus =
                utilisateur.actif &&
                    !utilisateur.bloque;
        }
        if (statusFilter.value === 'inactive') {
            matchesStatus =
                !utilisateur.actif;
        }
        if (statusFilter.value === 'blocked') {
            matchesStatus =
                utilisateur.bloque;
        }
        return (matchesSearch &&
            matchesRole &&
            matchesStatus);
    });
});
/* =====================================================
 * LOAD
 * ===================================================== */
async function loadUtilisateurs() {
    loading.value = true;
    errorMessage.value = '';
    try {
        utilisateurs.value =
            await getUtilisateurs();
    }
    catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
        errorMessage.value =
            extractApiError(error, 'Impossible de charger les utilisateurs.');
    }
    finally {
        loading.value = false;
    }
}
/* =====================================================
 * NAVIGATION
 * ===================================================== */
function goToCreate() {
    router.push({
        name: 'utilisateur-create',
    });
}
function editUtilisateur(id) {
    router.push({
        name: 'utilisateur-edit',
        params: {
            id,
        },
    });
}
/* =====================================================
 * FILTER RESET
 * ===================================================== */
function resetFilters() {
    search.value = '';
    roleFilter.value = '';
    statusFilter.value = '';
}
/* =====================================================
 * DATE
 * ===================================================== */
function formatDate(value) {
    if (!value) {
        return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
    }).format(date);
}
/* =====================================================
 * API ERROR
 * ===================================================== */
function extractApiError(error, fallback) {
    const err = error;
    const responseMessage = err?.response?.data?.message;
    if (Array.isArray(responseMessage)) {
        return responseMessage.join(' ');
    }
    if (typeof responseMessage === 'string') {
        return responseMessage;
    }
    return fallback;
}
/* =====================================================
 * INIT
 * ===================================================== */
onMounted(() => {
    loadUtilisateurs();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-small']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['user-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['role-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['filters-card']} */ ;
/** @type {__VLS_StyleScopedClasses['actions-column']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-container" },
});
/** @type {__VLS_StyleScopedClasses['page-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-header" },
});
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "page-description" },
});
/** @type {__VLS_StyleScopedClasses['page-description']} */ ;
if (__VLS_ctx.canCreate) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.goToCreate) },
        type: "button",
        ...{ class: "btn-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "alert alert-error" },
    });
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['alert-error']} */ ;
    (__VLS_ctx.errorMessage);
}
if (__VLS_ctx.successMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "alert alert-success" },
    });
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['alert-success']} */ ;
    (__VLS_ctx.successMessage);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "filters-card" },
});
/** @type {__VLS_StyleScopedClasses['filters-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "filter-group" },
});
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "search",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "search",
    value: (__VLS_ctx.search),
    type: "text",
    placeholder: "Nom, prénom, username ou email...",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "filter-group" },
});
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "role-filter",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    id: "role-filter",
    value: (__VLS_ctx.roleFilter),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
for (const [role] of __VLS_vFor((__VLS_ctx.roles))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (role),
        value: (role),
    });
    (role);
    // @ts-ignore
    [canCreate, goToCreate, errorMessage, errorMessage, successMessage, successMessage, search, roleFilter, roles,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "filter-group" },
});
/** @type {__VLS_StyleScopedClasses['filter-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "status-filter",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    id: "status-filter",
    value: (__VLS_ctx.statusFilter),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "active",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "inactive",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "blocked",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.resetFilters) },
    type: "button",
    ...{ class: "btn-secondary" },
});
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "loading-state" },
    });
    /** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
}
else if (__VLS_ctx.filteredUtilisateurs.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "empty-state" },
    });
    /** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    if (__VLS_ctx.canCreate) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.goToCreate) },
            type: "button",
            ...{ class: "btn-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
        ...{ class: "table-card" },
    });
    /** @type {__VLS_StyleScopedClasses['table-card']} */ ;
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({
        ...{ class: "actions-column" },
    });
    /** @type {__VLS_StyleScopedClasses['actions-column']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
    for (const [utilisateur] of __VLS_vFor((__VLS_ctx.filteredUtilisateurs))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            key: (utilisateur.id),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "user-cell" },
        });
        /** @type {__VLS_StyleScopedClasses['user-cell']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (utilisateur.prenom);
        (utilisateur.nom);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (utilisateur.username);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (utilisateur.email);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "role-badge" },
        });
        /** @type {__VLS_StyleScopedClasses['role-badge']} */ ;
        (utilisateur.role?.libelle ?? utilisateur.role?.code ?? '—');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        if (utilisateur.gare) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (utilisateur.gare.code);
            (utilisateur.gare.nom);
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "status-list" },
        });
        /** @type {__VLS_StyleScopedClasses['status-list']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "status-badge" },
            ...{ class: (utilisateur.actif ? 'status-active' : 'status-inactive') },
        });
        /** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
        (utilisateur.actif ? 'Actif' : 'Inactif');
        if (utilisateur.bloque) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "status-badge status-blocked" },
            });
            /** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
            /** @type {__VLS_StyleScopedClasses['status-blocked']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (__VLS_ctx.formatDate(utilisateur.createdAt));
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "actions-column" },
        });
        /** @type {__VLS_StyleScopedClasses['actions-column']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "actions" },
        });
        /** @type {__VLS_StyleScopedClasses['actions']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        throw 0;
                    if (!!(__VLS_ctx.filteredUtilisateurs.length === 0))
                        throw 0;
                    return (__VLS_ctx.editUtilisateur(utilisateur.id));
                    // @ts-ignore
                    [canCreate, goToCreate, statusFilter, resetFilters, loading, filteredUtilisateurs, filteredUtilisateurs, formatDate, editUtilisateur,];
                } },
            type: "button",
            ...{ class: "btn-small btn-edit" },
        });
        /** @type {__VLS_StyleScopedClasses['btn-small']} */ ;
        /** @type {__VLS_StyleScopedClasses['btn-edit']} */ ;
        // @ts-ignore
        [];
    }
}
if (!__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "results-summary" },
    });
    /** @type {__VLS_StyleScopedClasses['results-summary']} */ ;
    (__VLS_ctx.filteredUtilisateurs.length);
    (__VLS_ctx.utilisateurs.length);
}
// @ts-ignore
[loading, filteredUtilisateurs, utilisateurs,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
