import { computed, onMounted, reactive, ref, } from 'vue';
import { useRoute, useRouter, } from 'vue-router';
import { createProprietaire, getProprietaire, updateProprietaire, } from '../../api/proprietaires.api';
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');
const isEditMode = computed(() => Boolean(route.params.id));
const pageTitle = computed(() => isEditMode.value
    ? 'Modifier le propriétaire'
    : 'Nouveau propriétaire');
const form = reactive({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    numeroPieceIdentite: '',
    typePieceIdentite: '',
    statut: 'ACTIF',
});
const statutOptions = [
    'ACTIF',
    'INACTIF',
];
/**
 * Charge le propriétaire
 * en mode modification.
 */
async function loadProprietaire() {
    if (!isEditMode.value) {
        return;
    }
    const id = String(route.params.id);
    loading.value = true;
    errorMessage.value = '';
    try {
        const proprietaire = await getProprietaire(id);
        form.nom =
            proprietaire.nom;
        form.prenom =
            proprietaire.prenom;
        form.telephone =
            proprietaire.telephone ??
                '';
        form.adresse =
            proprietaire.adresse ??
                '';
        form.numeroPieceIdentite =
            proprietaire.numeroPieceIdentite ??
                '';
        form.typePieceIdentite =
            proprietaire.typePieceIdentite ??
                '';
        form.statut =
            proprietaire.statut;
    }
    catch (error) {
        console.error('Erreur lors du chargement du propriétaire :', error);
        errorMessage.value =
            error?.response?.data?.message ??
                'Impossible de charger ce propriétaire.';
    }
    finally {
        loading.value = false;
    }
}
/**
 * Retour vers la liste.
 */
function cancel() {
    router.push({
        name: 'proprietaires',
    });
}
/**
 * Validation frontend minimale.
 */
function validateForm() {
    if (!form.nom.trim()) {
        return 'Le nom est obligatoire.';
    }
    if (!form.prenom.trim()) {
        return 'Le prénom est obligatoire.';
    }
    if (!form.statut) {
        return 'Le statut est obligatoire.';
    }
    return null;
}
/**
 * Enregistrement.
 */
async function submit() {
    errorMessage.value = '';
    const validationError = validateForm();
    if (validationError) {
        errorMessage.value =
            validationError;
        return;
    }
    saving.value = true;
    try {
        if (isEditMode.value) {
            const payload = {
                nom: form.nom.trim(),
                prenom: form.prenom.trim(),
                telephone: form.telephone?.trim() ||
                    undefined,
                adresse: form.adresse?.trim() ||
                    undefined,
                numeroPieceIdentite: form.numeroPieceIdentite?.trim() ||
                    undefined,
                typePieceIdentite: form.typePieceIdentite?.trim() ||
                    undefined,
                statut: form.statut,
            };
            await updateProprietaire(String(route.params.id), payload);
        }
        else {
            const payload = {
                nom: form.nom.trim(),
                prenom: form.prenom.trim(),
                telephone: form.telephone?.trim() ||
                    undefined,
                adresse: form.adresse?.trim() ||
                    undefined,
                numeroPieceIdentite: form.numeroPieceIdentite?.trim() ||
                    undefined,
                typePieceIdentite: form.typePieceIdentite?.trim() ||
                    undefined,
                statut: form.statut,
            };
            await createProprietaire(payload);
        }
        router.push({
            name: 'proprietaires',
        });
    }
    catch (error) {
        console.error('Erreur lors de l’enregistrement du propriétaire :', error);
        const message = error?.response?.data?.message;
        if (Array.isArray(message)) {
            errorMessage.value =
                message.join(' ');
        }
        else {
            errorMessage.value =
                message ??
                    "Impossible d'enregistrer le propriétaire.";
        }
    }
    finally {
        saving.value = false;
    }
}
onMounted(() => {
    loadProprietaire();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['full-width']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
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
(__VLS_ctx.pageTitle);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "subtitle" },
});
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
(__VLS_ctx.isEditMode
    ? 'Modification des informations du propriétaire.'
    : 'Enregistrement d’un nouveau propriétaire.');
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "loading" },
    });
    /** @type {__VLS_StyleScopedClasses['loading']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (__VLS_ctx.submit) },
        ...{ class: "form-card" },
    });
    /** @type {__VLS_StyleScopedClasses['form-card']} */ ;
    if (__VLS_ctx.errorMessage) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "alert alert-error" },
        });
        /** @type {__VLS_StyleScopedClasses['alert']} */ ;
        /** @type {__VLS_StyleScopedClasses['alert-error']} */ ;
        (__VLS_ctx.errorMessage);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-grid" },
    });
    /** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "nom",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "nom",
        value: (__VLS_ctx.form.nom),
        type: "text",
        maxlength: "100",
        placeholder: "Ex. Kameni",
        required: true,
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "prenom",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "prenom",
        value: (__VLS_ctx.form.prenom),
        type: "text",
        maxlength: "100",
        placeholder: "Ex. Jean",
        required: true,
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "telephone",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "telephone",
        type: "tel",
        maxlength: "30",
        placeholder: "Ex. 699123456",
    });
    (__VLS_ctx.form.telephone);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "statut",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
        id: "statut",
        value: (__VLS_ctx.form.statut),
        required: true,
    });
    for (const [statut] of __VLS_vFor((__VLS_ctx.statutOptions))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: (statut),
            value: (statut),
        });
        (statut);
        // @ts-ignore
        [pageTitle, isEditMode, loading, submit, errorMessage, errorMessage, form, form, form, form, statutOptions,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "typePieceIdentite",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "typePieceIdentite",
        value: (__VLS_ctx.form.typePieceIdentite),
        type: "text",
        maxlength: "50",
        placeholder: "Ex. CNI",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "numeroPieceIdentite",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "numeroPieceIdentite",
        value: (__VLS_ctx.form.numeroPieceIdentite),
        type: "text",
        maxlength: "100",
        placeholder: "Ex. 123456789",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group full-width" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    /** @type {__VLS_StyleScopedClasses['full-width']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "adresse",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.textarea)({
        id: "adresse",
        value: (__VLS_ctx.form.adresse),
        rows: "3",
        placeholder: "Adresse complète",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-actions" },
    });
    /** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.cancel) },
        type: "button",
        ...{ class: "btn btn-secondary" },
        disabled: (__VLS_ctx.saving),
    });
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        type: "submit",
        ...{ class: "btn btn-primary" },
        disabled: (__VLS_ctx.saving),
    });
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    (__VLS_ctx.saving
        ? 'Enregistrement...'
        : __VLS_ctx.isEditMode
            ? 'Enregistrer les modifications'
            : 'Créer le propriétaire');
}
// @ts-ignore
[isEditMode, form, form, form, cancel, saving, saving, saving,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
