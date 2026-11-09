import { reactive } from 'vue';
const emit = defineEmits();
const filters = reactive({
    search: '',
    utilisateurId: undefined,
    action: '',
    entite: '',
    dateDebut: '',
    dateFin: '',
});
function applyFilters() {
    const result = {};
    if (filters.search?.trim()) {
        result.search = filters.search.trim();
    }
    if (filters.utilisateurId) {
        result.utilisateurId = filters.utilisateurId;
    }
    if (filters.action) {
        result.action = filters.action;
    }
    if (filters.entite) {
        result.entite = filters.entite;
    }
    if (filters.dateDebut) {
        result.dateDebut = new Date(filters.dateDebut).toISOString();
    }
    if (filters.dateFin) {
        const end = new Date(filters.dateFin);
        end.setHours(23, 59, 59, 999);
        result.dateFin = end.toISOString();
    }
    emit('filter', result);
}
function resetFilters() {
    filters.search = '';
    filters.utilisateurId = undefined;
    filters.action = '';
    filters.entite = '';
    filters.dateDebut = '';
    filters.dateFin = '';
    emit('reset');
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
/** @type {__VLS_StyleScopedClasses['filters-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['filters-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['filters-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['filters-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "audit-filters" },
});
/** @type {__VLS_StyleScopedClasses['audit-filters']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "filters-heading" },
});
/** @type {__VLS_StyleScopedClasses['filters-heading']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.applyFilters) },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "filters-grid" },
});
/** @type {__VLS_StyleScopedClasses['filters-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field search-field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['search-field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "audit-search",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "audit-search",
    type: "search",
    placeholder: "Rechercher une action ou une entité...",
});
(__VLS_ctx.filters.search);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "audit-user",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "audit-user",
    type: "number",
    min: "1",
    placeholder: "Ex. 3",
});
(__VLS_ctx.filters.utilisateurId);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "audit-action",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    id: "audit-action",
    value: (__VLS_ctx.filters.action),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "CREATE",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "UPDATE",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "DELETE",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "audit-entity",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "audit-entity",
    value: (__VLS_ctx.filters.entite),
    type: "text",
    placeholder: "Ex. VEHICULE",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "audit-start",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "audit-start",
    type: "date",
});
(__VLS_ctx.filters.dateDebut);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "audit-end",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "audit-end",
    type: "date",
});
(__VLS_ctx.filters.dateFin);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "filter-actions" },
});
/** @type {__VLS_StyleScopedClasses['filter-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    ...{ class: "apply-button" },
});
/** @type {__VLS_StyleScopedClasses['apply-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.resetFilters) },
    type: "button",
    ...{ class: "reset-button" },
});
/** @type {__VLS_StyleScopedClasses['reset-button']} */ ;
// @ts-ignore
[applyFilters, filters, filters, filters, filters, filters, filters, resetFilters,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
