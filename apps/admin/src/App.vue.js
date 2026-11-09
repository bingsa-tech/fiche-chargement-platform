import { RouterView } from 'vue-router';
import LoadingOverlay from './components/loading/LoadingOverlay.vue';
import { useLoadingStore } from './stores/loading.store';
const loadingStore = useLoadingStore();
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "app-root" },
});
/** @type {__VLS_StyleScopedClasses['app-root']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.RouterView | typeof __VLS_components.RouterView} */
RouterView;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
{
    const { default: __VLS_5 } = __VLS_3.slots;
    const [{ Component, route }] = __VLS_vSlot(__VLS_5);
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
    Transition;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        name: "page-fade",
        mode: "out-in",
    }));
    const __VLS_8 = __VLS_7({
        name: "page-fade",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const { default: __VLS_11 } = __VLS_9.slots;
    const __VLS_12 = (Component);
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        key: (route.fullPath),
    }));
    const __VLS_14 = __VLS_13({
        key: (route.fullPath),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    var __VLS_9;
    __VLS_3.slots['' /* empty slot name completion */];
}
var __VLS_3;
const __VLS_17 = LoadingOverlay;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    visible: (__VLS_ctx.loadingStore.isLoading),
    message: (__VLS_ctx.loadingStore.message),
}));
const __VLS_19 = __VLS_18({
    visible: (__VLS_ctx.loadingStore.isLoading),
    message: (__VLS_ctx.loadingStore.message),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
// @ts-ignore
[loadingStore, loadingStore,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
