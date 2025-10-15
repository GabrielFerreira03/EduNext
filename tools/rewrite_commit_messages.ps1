Param()

# Lê a mensagem original do commit a partir do STDIN
$original = [Console]::In.ReadToEnd()

# Commit atual (SHA completa) disponível em $env:GIT_COMMIT
$commit = $env:GIT_COMMIT

# Mapeamento dos commits (prefixos) para novas mensagens
$map = @{
    "2f724bf" = "Repositorio e arquivos inicias adicionados"
    "2911c34" = "Melhoria na pagina de visualizar certificado"
    "2541fd6" = "Ajuste na pagina de visualizar certificado"
    "6af8304" = "Ajuste nos itens do menu no modo responsivo"
    "d6f5dfe" = "Ajustes no css do botão do menu no mobile"
    "05b65dd" = "Adicionando botão no botão de menu mobile"
    "af48afb" = "Corrigindo botão menu nas paginas de dashboard, my-courses, progress, certificates, settings"
}

$new = $null
foreach ($k in $map.Keys) {
    if ($commit.StartsWith($k)) {
        $new = $map[$k]
        break
    }
}

if ($null -ne $new) {
    [Console]::Out.Write($new)
} else {
    [Console]::Out.Write($original)
}