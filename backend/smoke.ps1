$ErrorActionPreference = 'Stop'
$base = 'http://127.0.0.1:8000/api'

$regBody = @{ username = 'alice2'; email = 'alice2@example.com'; password = 'password123' } | ConvertTo-Json
$reg = Invoke-RestMethod -Method Post -Uri "$base/auth/register/" -ContentType 'application/json' -Body $regBody

$tokBody = @{ username = 'alice2'; password = 'password123' } | ConvertTo-Json
$tok = Invoke-RestMethod -Method Post -Uri "$base/auth/token/" -ContentType 'application/json' -Body $tokBody

$headers = @{ Authorization = "Bearer $($tok.access)" }

$taskBody = @{ title = 'Test Task'; description = 'From smoke'; priority = 'high'; status = 'pending' } | ConvertTo-Json
$t = Invoke-RestMethod -Method Post -Uri "$base/tasks/" -ContentType 'application/json' -Headers $headers -Body $taskBody

Write-Host "OK token:$($tok.access.Substring(0,16))... task_id:$($t.id)"