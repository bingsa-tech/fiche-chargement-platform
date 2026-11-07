<script setup lang="ts">
import logo from '../../assets/logo.png';

defineProps<{
  size?: number;
}>();
</script>

<template>
  <img
    :src="logo"
    alt="Logo Fiche de Chargement"
    :style="{
      width: `${size ?? 64}px`,
      height: 'auto',
      objectFit: 'contain'
    }"
  />
</template>