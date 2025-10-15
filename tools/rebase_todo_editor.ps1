Param(
    [Parameter(Mandatory=$true)]
    [string]$Path
)

$map = @{
    "2f724bf" = "Repositorio e arquivos inicias adicionados"
    "2911c34" = "Melhoria na pagina de visualizar certificado"
    "2541fd6" = "Ajuste na pagina de visualizar certificado"
    "6af8304" = "Ajuste nos itens do menu no modo responsivo"
    "d6f5dfe" = "Ajustes no css do botão do menu no mobile"
    "05b65dd" = "Adicionando botão no botão de menu mobile"
    "af48afb" = "Corrigindo botão menu nas paginas de dashboard, my-courses, progress, certificates, settings"
}

$content = Get-Content -Path $Path -Raw
$lines = $content -split "`n"
$sb = New-Object System.Text.StringBuilder

foreach ($line in $lines) {
    $trim = $line.Trim()
    [void]$sb.AppendLine($line)
    if ($trim -match '^pick\s+([0-9a-f]+)\b') {
        $sha = $matches[1]
        foreach ($k in $map.Keys) {
            if ($sha.StartsWith($k)) {
                $msg = $map[$k]
                # Escapa aspas simples para shell do rebase
                $escaped = $msg.Replace("'", "''")
                # Usa aspas simples ao redor da mensagem
                [void]$sb.AppendLine("exec git commit --amend -m '$escaped'")
                break
            }
        }
    }
}

Set-Content -Path $Path -Value $sb.ToString() -NoNewline