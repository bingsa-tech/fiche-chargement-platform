import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../auth/auth.store';
const router = useRouter();
const authStore = useAuthStore();
function redirectByRole() {
    switch (authStore.role) {
        case 'ADMIN':
            router.replace({ name: 'admin-dashboard' });
            break;
        case 'AGENT':
            router.replace({ name: 'agent-dashboard' });
            break;
        case 'CONTROLEUR':
            router.replace({ name: 'controleur-dashboard' });
            break;
        case 'AUTORITE_HABILITEE':
            router.replace({ name: 'autorite-dashboard' });
            break;
        default:
            router.replace({ name: 'unauthorized' });
            break;
    }
}
onMounted(() => {
    if (!authStore.isAuthenticated) {
        router.replace({ name: 'login' });
        return;
    }
    redirectByRole();
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "role-hub" },
});
/** @type {__VLS_StyleScopedClasses['role-hub']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "role-hub-card" },
});
/** @type {__VLS_StyleScopedClasses['role-hub-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "loader" },
});
/** @type {__VLS_StyleScopedClasses['loader']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
