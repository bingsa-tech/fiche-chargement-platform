// apps/admin/src/utils/client-info.ts

export interface ClientInfo {
  langue: string;
  fuseauHoraire: string;
  plateforme: string;
  navigateur: string;
  largeurEcran: number;
  hauteurEcran: number;
  largeurFenetre: number;
  hauteurFenetre: number;
  enLigne: boolean;
  userAgent: string;
}

export function getClientInfo(): ClientInfo {
  return {
    langue: navigator.language,
    fuseauHoraire:
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    plateforme: navigator.platform,
    navigateur: navigator.userAgent,
    largeurEcran: screen.width,
    hauteurEcran: screen.height,
    largeurFenetre: window.innerWidth,
    hauteurFenetre: window.innerHeight,
    enLigne: navigator.onLine,
    userAgent: navigator.userAgent,
  };
}