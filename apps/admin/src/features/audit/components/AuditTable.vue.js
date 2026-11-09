const __VLS_props = defineProps();
const emit = defineEmits();
function formatDate(value) {
    return new Intl.DateTimeFormat('fr-CA', {
        dateStyle: 'short',
        timeStyle: 'medium',
    }).format(new Date(value));
}
function actionLabel(action) {
    const labels = {
        CREATE: 'Création',
        UPDATE: 'Modification',
        DELETE: 'Suppression',
    };
    return labels[action.toUpperCase()] ?? action;
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['table-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['table-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['action-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['action-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['action-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "audit-table-card" },
});
/** @type {__VLS_StyleScopedClasses['audit-table-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "table-heading" },
});
/** @type {__VLS_StyleScopedClasses['table-heading']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "table-state" },
    });
    /** @type {__VLS_StyleScopedClasses['table-state']} */ ;
}
else if (__VLS_ctx.logs.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "table-state" },
    });
    /** @type {__VLS_StyleScopedClasses['table-state']} */ ;
}
else {
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
    for (const [log] of __VLS_vFor((__VLS_ctx.logs))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            key: (log.id),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "date-cell" },
        });
        /** @type {__VLS_StyleScopedClasses['date-cell']} */ ;
        (__VLS_ctx.formatDate(log.dateHeure));
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (log.utilisateurId ?? 'Inconnu');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "action-badge" },
            ...{ class: (log.action.toLowerCase()) },
        });
        /** @type {__VLS_StyleScopedClasses['action-badge']} */ ;
        (__VLS_ctx.actionLabel(log.action));
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (log.entite);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({
            ...{ class: "id-cell" },
        });
        /** @type {__VLS_StyleScopedClasses['id-cell']} */ ;
        (log.entiteId);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (log.appareilId ?? 'Non renseigné');
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        throw 0;
                    if (!!(__VLS_ctx.logs.length === 0))
                        throw 0;
                    return (__VLS_ctx.emit('details', log));
                    // @ts-ignore
                    [loading, logs, logs, formatDate, actionLabel, emit,];
                } },
            type: "button",
            ...{ class: "details-button" },
        });
        /** @type {__VLS_StyleScopedClasses['details-button']} */ ;
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
