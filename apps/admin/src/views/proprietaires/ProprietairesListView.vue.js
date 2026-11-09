import { computed, onMounted, ref, } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../auth/auth.store';
import { deleteProprietaire, getProprietaires, } from '../../api/proprietaires.api';
const router = useRouter();
const authStore = useAuthStore();
const proprietaires = ref([]);
const loading = ref(false);
const deleting = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const userRole = computed(() => authStore.user?.role ?? null);
/**
 * Droits frontend.
 *
 * La sécurité réelle reste côté backend.
 */
const canCreate = computed(() => userRole.value === 'ADMIN');
const canEdit = computed(() => userRole.value === 'ADMIN' ||
    userRole.value === 'RESPONSABLE_GARE');
const canDelete = computed(() => userRole.value === 'ADMIN');
/**
 * Chargement des propriétaires.
 */
async function loadProprietaires() {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    try {
        proprietaires.value =
            await getProprietaires();
    }
    catch (error) {
        console.error('Erreur lors du chargement des propriétaires :', error);
        errorMessage.value =
            error?.response?.data?.message ??
                'Impossible de charger les propriétaires.';
    }
    finally {
        loading.value = false;
    }
}
/**
 * Création.
 */
function createProprietaire() {
    router.push({
        name: 'proprietaire-create',
    });
}
/**
 * Modification.
 */
function editProprietaire(id) {
    router.push({
        name: 'proprietaire-edit',
        params: { id },
    });
}
/**
 * Suppression.
 */
async function removeProprietaire(proprietaire) {
    const fullName = `${proprietaire.prenom} ${proprietaire.nom}`;
    const confirmed = window.confirm(`Voulez-vous vraiment supprimer le propriétaire "${fullName}" ?`);
    if (!confirmed) {
        return;
    }
    deleting.value =
        proprietaire.id;
    errorMessage.value = '';
    successMessage.value = '';
    try {
        await deleteProprietaire(proprietaire.id);
        proprietaires.value =
            proprietaires.value.filter((item) => item.id !== proprietaire.id);
        successMessage.value =
            'Le propriétaire a été supprimé avec succès.';
    }
    catch (error) {
        console.error('Erreur lors de la suppression du propriétaire :', error);
        errorMessage.value =
            error?.response?.data?.message ??
                'Impossible de supprimer ce propriétaire.';
    }
    finally {
        deleting.value = null;
    }
}
/**
 * Date d'affichage.
 */
function formatDate(value) {
    if (!value) {
        return '-';
    }
    return new Date(value).toLocaleDateString('fr-CA');
}
onMounted(() => {
    loadProprietaires();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "page" },
});
/** @type {__VLS_StyleScopedClasses['page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-header" },
});
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "subtitle" },
});
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
if (__VLS_ctx.canCreate) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.createProprietaire) },
        type: "button",
        ...{ class: "btn btn-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
if (__VLS_ctx.successMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "alert alert-success" },
    });
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['alert-success']} */ ;
    (__VLS_ctx.successMessage);
}
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "alert alert-error" },
    });
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['alert-error']} */ ;
    (__VLS_ctx.errorMessage);
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "loading" },
    });
    /** @type {__VLS_StyleScopedClasses['loading']} */ ;
}
else if (__VLS_ctx.proprietaires.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "table-container" },
    });
    /** @type {__VLS_StyleScopedClasses['table-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.table, __VLS_intrinsics.table)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    if (__VLS_ctx.canEdit || __VLS_ctx.canDelete) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({
            ...{ class: "actions-column" },
        });
        /** @type {__VLS_StyleScopedClasses['actions-column']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
    for (const [proprietaire] of __VLS_vFor((__VLS_ctx.proprietaires))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            key: (proprietaire.id),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (proprietaire.prenom);
        (proprietaire.nom);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (proprietaire.telephone ||
            '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (proprietaire.typePieceIdentite ||
            '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (proprietaire.numeroPieceIdentite ||
            '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "status" },
            ...{ class: ({
                    'status-active': proprietaire.statut ===
                        'ACTIF',
                    'status-inactive': proprietaire.statut !==
                        'ACTIF',
                }) },
        });
        /** @type {__VLS_StyleScopedClasses['status']} */ ;
        /** @type {__VLS_StyleScopedClasses['status-active']} */ ;
        /** @type {__VLS_StyleScopedClasses['status-inactive']} */ ;
        (proprietaire.statut);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (proprietaire.vehicules?.length ??
            0);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (__VLS_ctx.formatDate(proprietaire.createdAt));
        if (__VLS_ctx.canEdit || __VLS_ctx.canDelete) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
                ...{ class: "actions" },
            });
            /** @type {__VLS_StyleScopedClasses['actions']} */ ;
            if (__VLS_ctx.canEdit) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.loading))
                                throw 0;
                            if (!(__VLS_ctx.proprietaires.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.canEdit || __VLS_ctx.canDelete))
                                throw 0;
                            if (!(__VLS_ctx.canEdit))
                                throw 0;
                            return (__VLS_ctx.editProprietaire(proprietaire.id));
                            // @ts-ignore
                            [canCreate, createProprietaire, successMessage, successMessage, errorMessage, errorMessage, loading, proprietaires, proprietaires, canEdit, canEdit, canEdit, canDelete, canDelete, formatDate, editProprietaire,];
                        } },
                    type: "button",
                    ...{ class: "btn btn-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['btn']} */ ;
                /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
            }
            if (__VLS_ctx.canDelete) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.loading))
                                throw 0;
                            if (!(__VLS_ctx.proprietaires.length > 0))
                                throw 0;
                            if (!(__VLS_ctx.canEdit || __VLS_ctx.canDelete))
                                throw 0;
                            if (!(__VLS_ctx.canDelete))
                                throw 0;
                            return (__VLS_ctx.removeProprietaire(proprietaire));
                            // @ts-ignore
                            [canDelete, removeProprietaire,];
                        } },
                    type: "button",
                    ...{ class: "btn btn-danger" },
                    disabled: (__VLS_ctx.deleting ===
                        proprietaire.id),
                });
                /** @type {__VLS_StyleScopedClasses['btn']} */ ;
                /** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
                (__VLS_ctx.deleting ===
                    proprietaire.id
                    ? 'Suppression...'
                    : 'Supprimer');
            }
        }
        // @ts-ignore
        [deleting, deleting,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "empty-state" },
    });
    /** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    if (__VLS_ctx.canCreate) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.createProprietaire) },
            type: "button",
            ...{ class: "btn btn-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    }
}
// @ts-ignore
[canCreate, createProprietaire,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
