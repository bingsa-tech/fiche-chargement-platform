
<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
    fullscreen?: boolean;
  }>(),
  {
    message: 'Chargement en cours...',
    fullscreen: false,
  },
);
</script>

<template>
  <div
    class="app-loading"
    :class="{ 'app-loading--fullscreen': fullscreen }"
    role="status"
    aria-live="polite"
  >
    <div class="loading-content">
      <div class="logo-container">
        <div class="logo-ring"></div>
        <div class="logo-ring logo-ring--inner"></div>

        <img
          src="../../assets/logo.png"
          alt="Logo Fiche Chargement"
          class="loading-logo"
        />
      </div>

      <div class="loading-title">
        FICHE CHARGEMENT
      </div>

      <div class="loading-message">
        {{ message }}
      </div>

      <div class="loading-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="loading-caption">
        Veuillez patienter...
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 180px;
  background: transparent;
}

.app-loading--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  min-height: 100vh;
  background:
    radial-gradient(
      circle at center,
      #142b4c 0%,
      #0b1830 65%,
      #071225 100%
    );
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
  animation: content-appear 0.5s ease both;
}

.logo-container {
  position: relative;
  width: 110px;
  height: 110px;
  display: grid;
  place-items: center;
  margin-bottom: 26px;
}

.logo-ring {
  position: absolute;
  inset: 0;
  border: 2px solid #ffffff18;
  border-top-color: #3987ff;
  border-right-color: #3987ff;
  border-radius: 50%;
  animation: rotate 2s linear infinite;
}

.logo-ring--inner {
  inset: 9px;
  border: 1px solid #3987ff35;
  border-bottom-color: #69a6ff;
  border-radius: 50%;
  animation: rotate-reverse 3s linear infinite;
}

.loading-logo {
  width: 65px;
  height: 65px;
  object-fit: contain;
  animation: pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 12px #3987ff50);
}

.loading-title {
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 2.5px;
}

.loading-message {
  margin-top: 14px;
  color: #d1e0f5;
  font-size: 14px;
  font-weight: 500;
}

.loading-indicator {
  display: flex;
  gap: 8px;
  margin-top: 27px;
}

.loading-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3987ff;
  box-shadow: 0 0 10px #3987ff80;
  animation: bounce 1.2s infinite ease-in-out;
}

.loading-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.loading-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

.loading-caption {
  margin-top: 20px;
  color: #8298b7;
  font-size: 11px;
  letter-spacing: 0.5px;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate-reverse {
  to {
    transform: rotate(-360deg);
  }
}

@keyframes pulse {
  50% {
    transform: scale(0.92);
    opacity: 0.8;
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes content-appear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-ring,
  .loading-logo,
  .loading-indicator span,
  .loading-content {
    animation: none;
  }
}
</style>
