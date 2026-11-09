import AppLoading from './AppLoading.vue';
const __VLS_props = withDefaults(defineProps(), {
    message: 'Chargement en cours...',
});
const __VLS_defaults = {
    message: 'Chargement en cours...',
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['loading-fade-enter-active']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-fade-leave-active']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "loading-fade",
}));
const __VLS_2 = __VLS_1({
    name: "loading-fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.visible) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "loading-overlay" },
        role: "status",
        'aria-live': "polite",
    });
    /** @type {__VLS_StyleScopedClasses['loading-overlay']} */ ;
    const __VLS_6 = AppLoading;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        message: (__VLS_ctx.message),
    }));
    const __VLS_8 = __VLS_7({
        message: (__VLS_ctx.message),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
}
// @ts-ignore
[visible, message,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
export default {};
