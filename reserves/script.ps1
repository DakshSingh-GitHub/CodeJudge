if (-not (Test-Path -Path "./judge-backend-fastapi" -PathType Container)) {
    Write-Host "Directory ./judge-backend-fastapi not found. Expanding archive..."
    Expand-Archive -Path "judge-backend-fastapi.zip" -DestinationPath "./judge-backend-fastapi"
}
cd judge-backend-fastapi/judge-backend
python app.py
