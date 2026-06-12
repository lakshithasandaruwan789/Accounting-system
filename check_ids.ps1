$content = Get-Content -Path 'c:/Users/Ozone Computers/Desktop/account 1/BudgetLeadSystem/index.html' -Raw
$jsStart = $content.IndexOf('<script>')
if ($jsStart -lt 0) { exit 1 }

$htmlCode = $content.Substring(0, $jsStart)
$jsCode = $content.Substring($jsStart)

# Extract all IDs from JS getElementById
$regex = [regex]"getElementById\(['`"”]+([^'`"”]+)['`"”]+\)"
$matches = $regex.Matches($jsCode)

$missing = @()
foreach ($match in $matches) {
    $id = $match.Groups[1].Value
    # Check if ID exists in HTML code block
    $idRegex = "id=['`"”]$id['`"”]"
    if ($htmlCode -notmatch $idRegex) {
        $missing += $id
    }
}

Write-Host "Missing IDs:"
$missing | Select-Object -Unique
