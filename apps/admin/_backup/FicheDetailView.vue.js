import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getApiErrorMessage } from '../../api/api-error';
import { getFiche } from '../../api/fiche.api';
import { createPassager } from '../../api/passagers.api';
import { getPassagersFiche, associerPassagerAFiche, } from '../../api/fiche-passager.api';
const route = useRoute();
const router = useRouter();
const fiche = ref(null);
const passagers = ref([]);
const loading = ref(true);
const saving = ref(false);
const addingPassenger = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const associationWarning = ref('');
const ficheId = computed(() => String(route.params.id ?? ''));
const nouveauPassager = reactive({
    nom: '',
    prenom: '',
    numeroCni: '',
    telephone: '',
    numeroPlace: '',
    tarif: '',
    observations: '',
});
/**
 * Si la création du passager réussit mais que son association échoue,
 * on conserve le passager pour éviter de le créer deux fois.
 */
const passagerEnAttenteAssociation = ref(null);
const dateCreation = computed(() => {
    if (!fiche.value?.dateCreation)
        return '—';
    const date = new Date(fiche.value.dateCreation);
    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleString('fr-CA');
});
const totalTarifs = computed(() => passagers.value?.reduce((total, item) => total + Number(item.tarif ?? 0), 0));
function formaterTarif(tarif) {
    if (tarif === null || tarif === undefined || tarif === '') {
        return '—';
    }
    const valeur = Number(tarif);
    if (!Number.isFinite(valeur))
        return '—';
    return valeur.toLocaleString('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}
async function chargerFiche() {
    loading.value = true;
    errorMessage.value = '';
    try {
        const id = ficheId.value;
        if (!id) {
            throw new Error('Identifiant de fiche manquant.');
        }
        const [ficheChargee, passagersCharges] = await Promise.all([
            getFiche(id),
            getPassagersFiche(id),
        ]);
        fiche.value = ficheChargee;
        passagers.value = passagersCharges;
    }
    catch (error) {
        errorMessage.value = getApiErrorMessage(error);
    }
    finally {
        loading.value = false;
    }
}
function ouvrirSaisiePassager() {
    errorMessage.value = '';
    successMessage.value = '';
    associationWarning.value = '';
    addingPassenger.value = true;
}
function reinitialiserFormulaire() {
    nouveauPassager.nom = '';
    nouveauPassager.prenom = '';
    nouveauPassager.numeroCni = '';
    nouveauPassager.telephone = '';
    nouveauPassager.numeroPlace = '';
    nouveauPassager.tarif = '';
    nouveauPassager.observations = '';
}
function annulerSaisiePassager() {
    if (saving.value)
        return;
    if (passagerEnAttenteAssociation.value) {
        associationWarning.value =
            'Le passager a déjà été créé, mais son association à cette fiche reste à effectuer. ' +
                'Réessayez l’enregistrement pour terminer l’association.';
        return;
    }
    reinitialiserFormulaire();
    addingPassenger.value = false;
    errorMessage.value = '';
    associationWarning.value = '';
}
async function enregistrerPassager() {
    if (saving.value)
        return;
    errorMessage.value = '';
    successMessage.value = '';
    associationWarning.value = '';
    const nom = nouveauPassager.nom.trim();
    const prenom = nouveauPassager.prenom.trim();
    const numeroCni = nouveauPassager.numeroCni.trim();
    const telephone = nouveauPassager.telephone.trim();
    const placeSaisie = String(nouveauPassager.numeroPlace ?? '').trim();
    const tarifSaisi = String(nouveauPassager.tarif ?? '').trim();
    const observations = nouveauPassager.observations.trim();
    // 1. Vérifier les champs obligatoires.
    if (!nom || !prenom || !numeroCni) {
        errorMessage.value =
            'Le nom, le prénom et le numéro de CNI sont obligatoires.';
        return;
    }
    if (telephone.length > 30) {
        errorMessage.value =
            'Le numéro de téléphone ne doit pas dépasser 30 caractères.';
        return;
    }
    if (observations.length > 1000) {
        errorMessage.value =
            'Les observations ne doivent pas dépasser 1 000 caractères.';
        return;
    }
    // 2. Valider le numéro de place.
    let numeroPlace;
    if (placeSaisie !== '') {
        numeroPlace = Number(placeSaisie);
        if (!Number.isInteger(numeroPlace) || numeroPlace < 1) {
            errorMessage.value =
                'Le numéro de place doit être un entier supérieur ou égal à 1.';
            return;
        }
    }
    // 3. Valider le tarif.
    let tarif;
    if (tarifSaisi !== '') {
        tarif = Number(tarifSaisi);
        if (!Number.isFinite(tarif) || tarif < 0) {
            errorMessage.value =
                'Le tarif doit être un nombre positif ou égal à zéro.';
            return;
        }
        if (Math.round(tarif * 100) !== tarif * 100) {
            errorMessage.value =
                'Le tarif ne peut pas comporter plus de deux décimales.';
            return;
        }
    }
    // 4. Vérifier l'identifiant de la fiche.
    if (!ficheId.value || ficheId.value === 'undefined') {
        errorMessage.value =
            'Identifiant de fiche manquant. Vérifie l’URL de la fiche.';
        return;
    }
    saving.value = true;
    try {
        let passager = passagerEnAttenteAssociation.value;
        if (!passager) {
            const payloadPassager = {
                nom,
                prenom,
                numeroCni,
                ...(telephone ? { telephone } : {}),
            };
            passager = await createPassager(payloadPassager);
        }
        const payloadAssociation = {
            ficheId: ficheId.value,
            passagerId: passager.id,
            ...(numeroPlace !== undefined ? { numeroPlace } : {}),
            ...(tarif !== undefined ? { tarif } : {}),
            ...(observations ? { observations } : {}),
        };
        await associerPassagerAFiche(payloadAssociation);
        passagerEnAttenteAssociation.value = null;
        reinitialiserFormulaire();
        addingPassenger.value = false;
        successMessage.value =
            'Le passager et les informations de son trajet ont été enregistrés.';
        try {
            passagers.value = await getPassagersFiche(ficheId.value);
        }
        catch {
            errorMessage.value =
                'Le passager a été enregistré, mais la liste n’a pas pu être actualisée. ' +
                    'Recharge la fiche pour vérifier les données.';
        }
    }
    catch (error) {
        console.error('>>> [DEBUG ERREUR API] :', error);
        if (passagerEnAttenteAssociation.value) {
            associationWarning.value =
                'Le passager a été créé, mais son association à la fiche a échoué. ' +
                    'Réessaie pour terminer l’association sans recréer le passager.';
        }
        errorMessage.value = getApiErrorMessage(error);
    }
    finally {
        saving.value = false;
    }
}
function imprimerPdf() {
    window.print();
}
onMounted(chargerFiche);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['warning-message']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['passenger-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['document-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-side']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-side']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-side']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-side']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-reference']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-print-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-print-informations']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-page']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-document']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-header']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-side']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-reference']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-print-informations']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['observations-field']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['document-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-page']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-document']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-header']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-side']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-side']} */ ;
/** @type {__VLS_StyleScopedClasses['institutional-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-reference']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-print-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-print-number']} */ ;
/** @type {__VLS_StyleScopedClasses['fiche-print-informations']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['document-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['document-bottom-note']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "detail-page" },
});
/** @type {__VLS_StyleScopedClasses['detail-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "actions no-print" },
});
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['no-print']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            return (__VLS_ctx.router.push({ name: 'fiches' }));
            // @ts-ignore
            [router,];
        } },
    ...{ class: "btn-secondary" },
    type: "button",
});
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
if (__VLS_ctx.fiche) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.imprimerPdf) },
        ...{ class: "btn-primary" },
        type: "button",
    });
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "/icons/logo.png",
    alt: "Logo FOPTRAC",
    ...{ class: "logo-fede" },
});
/** @type {__VLS_StyleScopedClasses['logo-fede']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "message" },
    });
    /** @type {__VLS_StyleScopedClasses['message']} */ ;
}
else if (__VLS_ctx.errorMessage && !__VLS_ctx.fiche) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "error-message no-print" },
    });
    /** @type {__VLS_StyleScopedClasses['error-message']} */ ;
    /** @type {__VLS_StyleScopedClasses['no-print']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.errorMessage);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.chargerFiche) },
        ...{ class: "btn-secondary" },
        type: "button",
    });
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
}
else if (__VLS_ctx.fiche) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)({
        ...{ class: "fiche-document" },
    });
    /** @type {__VLS_StyleScopedClasses['fiche-document']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
        ...{ class: "institutional-header" },
    });
    /** @type {__VLS_StyleScopedClasses['institutional-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "institutional-side french-side" },
    });
    /** @type {__VLS_StyleScopedClasses['institutional-side']} */ ;
    /** @type {__VLS_StyleScopedClasses['french-side']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "motto" },
    });
    /** @type {__VLS_StyleScopedClasses['motto']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "organization-name" },
    });
    /** @type {__VLS_StyleScopedClasses['organization-name']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "institutional-logo" },
    });
    /** @type {__VLS_StyleScopedClasses['institutional-logo']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "/icons/logo.png",
        alt: "Logo FOPTRAC",
        ...{ class: "logo-fede" },
    });
    /** @type {__VLS_StyleScopedClasses['logo-fede']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "institutional-side english-side" },
    });
    /** @type {__VLS_StyleScopedClasses['institutional-side']} */ ;
    /** @type {__VLS_StyleScopedClasses['english-side']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "motto" },
    });
    /** @type {__VLS_StyleScopedClasses['motto']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "organization-name" },
    });
    /** @type {__VLS_StyleScopedClasses['organization-name']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "fiche-print-heading" },
    });
    /** @type {__VLS_StyleScopedClasses['fiche-print-heading']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "fiche-print-number" },
    });
    /** @type {__VLS_StyleScopedClasses['fiche-print-number']} */ ;
    (__VLS_ctx.fiche.reference);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "fiche-print-informations" },
    });
    /** @type {__VLS_StyleScopedClasses['fiche-print-informations']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.fiche.gare?.nomGare ?? __VLS_ctx.fiche.gare?.nom ?? '—');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.fiche.destination?.nom ?? '—');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.fiche.vehicule?.immatriculation ?? '—');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    ([__VLS_ctx.fiche.chauffeur?.prenom, __VLS_ctx.fiche.chauffeur?.nom]
        .filter(Boolean)
        .join(' ') || '—');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.dateCreation);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.fiche.itineraire?.libelle ?? '—');
    if (__VLS_ctx.successMessage) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "success-message no-print" },
        });
        /** @type {__VLS_StyleScopedClasses['success-message']} */ ;
        /** @type {__VLS_StyleScopedClasses['no-print']} */ ;
        (__VLS_ctx.successMessage);
    }
    if (__VLS_ctx.errorMessage && __VLS_ctx.fiche) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "error-message no-print" },
        });
        /** @type {__VLS_StyleScopedClasses['error-message']} */ ;
        /** @type {__VLS_StyleScopedClasses['no-print']} */ ;
        (__VLS_ctx.errorMessage);
    }
    if (__VLS_ctx.associationWarning) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "warning-message no-print" },
        });
        /** @type {__VLS_StyleScopedClasses['warning-message']} */ ;
        /** @type {__VLS_StyleScopedClasses['no-print']} */ ;
        (__VLS_ctx.associationWarning);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
        ...{ class: "section passengers-section" },
    });
    /** @type {__VLS_StyleScopedClasses['section']} */ ;
    /** @type {__VLS_StyleScopedClasses['passengers-section']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "section-heading" },
    });
    /** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    if (!__VLS_ctx.addingPassenger) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.ouvrirSaisiePassager) },
            ...{ class: "btn-primary no-print" },
            type: "button",
        });
        /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['no-print']} */ ;
    }
    if (__VLS_ctx.addingPassenger) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "passenger-form no-print" },
        });
        /** @type {__VLS_StyleScopedClasses['passenger-form']} */ ;
        /** @type {__VLS_StyleScopedClasses['no-print']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
        if (__VLS_ctx.passagerEnAttenteAssociation) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "warning-message" },
            });
            /** @type {__VLS_StyleScopedClasses['warning-message']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "form-grid" },
        });
        /** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            value: (__VLS_ctx.nouveauPassager.nom),
            type: "text",
            maxlength: "100",
            autocomplete: "family-name",
            disabled: (__VLS_ctx.saving || !!__VLS_ctx.passagerEnAttenteAssociation),
            required: true,
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            value: (__VLS_ctx.nouveauPassager.prenom),
            type: "text",
            maxlength: "100",
            autocomplete: "given-name",
            disabled: (__VLS_ctx.saving || !!__VLS_ctx.passagerEnAttenteAssociation),
            required: true,
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            value: (__VLS_ctx.nouveauPassager.numeroCni),
            type: "text",
            maxlength: "100",
            disabled: (__VLS_ctx.saving || !!__VLS_ctx.passagerEnAttenteAssociation),
            required: true,
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            type: "tel",
            maxlength: "30",
            autocomplete: "tel",
            placeholder: "Numéro de téléphone",
            disabled: (__VLS_ctx.saving || !!__VLS_ctx.passagerEnAttenteAssociation),
        });
        (__VLS_ctx.nouveauPassager.telephone);
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            type: "number",
            min: "1",
            step: "1",
            placeholder: "Facultatif",
            disabled: (__VLS_ctx.saving),
        });
        (__VLS_ctx.nouveauPassager.numeroPlace);
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            type: "number",
            min: "0",
            step: "0.01",
            placeholder: "Prix du trajet",
            disabled: (__VLS_ctx.saving),
        });
        (__VLS_ctx.nouveauPassager.tarif);
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
            ...{ class: "observations-field" },
        });
        /** @type {__VLS_StyleScopedClasses['observations-field']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.textarea, __VLS_intrinsics.textarea)({
            value: (__VLS_ctx.nouveauPassager.observations),
            maxlength: "1000",
            rows: "3",
            placeholder: "Remarques éventuelles",
            disabled: (__VLS_ctx.saving),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "form-actions" },
        });
        /** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.enregistrerPassager) },
            ...{ class: "btn-primary" },
            type: "button",
            disabled: (__VLS_ctx.saving),
        });
        /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
        (__VLS_ctx.saving ? 'Enregistrement…' : 'Enregistrer le passager');
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.annulerSaisiePassager) },
            ...{ class: "btn-secondary" },
            type: "button",
            disabled: (__VLS_ctx.saving),
        });
        /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    }
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
    for (const [item, index] of __VLS_vFor((__VLS_ctx.passagers))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            key: (item.passagerId),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (index + 1);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (item.passager?.nom ?? '—');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (item.passager?.prenom ?? '—');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (item.numeroPlace ?? '—');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (item.passager?.numeroCni ?? '—');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (item.passager?.telephone || '—');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (__VLS_ctx.formaterTarif(item.tarif));
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "observations-cell" },
        });
        /** @type {__VLS_StyleScopedClasses['observations-cell']} */ ;
        (item.observations || '—');
        // @ts-ignore
        [fiche, fiche, fiche, fiche, fiche, fiche, fiche, fiche, fiche, fiche, fiche, fiche, imprimerPdf, loading, errorMessage, errorMessage, errorMessage, errorMessage, chargerFiche, dateCreation, successMessage, successMessage, associationWarning, associationWarning, addingPassenger, addingPassenger, ouvrirSaisiePassager, passagerEnAttenteAssociation, passagerEnAttenteAssociation, passagerEnAttenteAssociation, passagerEnAttenteAssociation, passagerEnAttenteAssociation, nouveauPassager, nouveauPassager, nouveauPassager, nouveauPassager, nouveauPassager, nouveauPassager, nouveauPassager, saving, saving, saving, saving, saving, saving, saving, saving, saving, saving, enregistrerPassager, annulerSaisiePassager, passagers, formaterTarif,];
    }
    if (__VLS_ctx.passagers.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            colspan: "8",
            ...{ class: "empty-row" },
        });
        /** @type {__VLS_StyleScopedClasses['empty-row']} */ ;
    }
    if (__VLS_ctx.passagers.length > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tfoot, __VLS_intrinsics.tfoot)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            colspan: "6",
            ...{ class: "total-label" },
        });
        /** @type {__VLS_StyleScopedClasses['total-label']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "total-value" },
        });
        /** @type {__VLS_StyleScopedClasses['total-value']} */ ;
        (__VLS_ctx.formaterTarif(__VLS_ctx.totalTarifs));
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "passager-count" },
    });
    /** @type {__VLS_StyleScopedClasses['passager-count']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.passagers.length);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "passager-count" },
    });
    /** @type {__VLS_StyleScopedClasses['passager-count']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formaterTarif(__VLS_ctx.totalTarifs));
    __VLS_asFunctionalElement1(__VLS_intrinsics.footer, __VLS_intrinsics.footer)({
        ...{ class: "document-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['document-footer']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "signature-line" },
    });
    /** @type {__VLS_StyleScopedClasses['signature-line']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "signature-name" },
    });
    /** @type {__VLS_StyleScopedClasses['signature-name']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "signature-line" },
    });
    /** @type {__VLS_StyleScopedClasses['signature-line']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "signature-name" },
    });
    /** @type {__VLS_StyleScopedClasses['signature-name']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "document-bottom-note" },
    });
    /** @type {__VLS_StyleScopedClasses['document-bottom-note']} */ ;
}
// @ts-ignore
[passagers, passagers, passagers, formaterTarif, formaterTarif, totalTarifs, totalTarifs,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
