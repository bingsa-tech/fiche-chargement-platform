$envFile = ".env"

if (Test-Path $envFile) {
    $line = Get-Content $envFile |
        Where-Object { $_ -match '^\s*(DATABASE_URL|TYPEORM_URL)\s*=' } |
        Select-Object -First 1

    if ($line -match '=\s*["'']?(postgres(?:ql)?://[^"'']+)') {
        try {
            $uri = [System.Uri]$Matches[1]
            Write-Output "Hôte : $($uri.Host)"
            Write-Output "Base : $($uri.AbsolutePath.TrimStart('/'))"
        } catch {
            Write-Output "URL détectée, mais impossible d'en extraire les informations."
        }
    } else {
        Write-Output "Aucune URL PostgreSQL reconnue dans .env."
    }
} else {
    Write-Output "Fichier .env introuvable dans ce dossier."
}