# Script de instalação rápida dos testes
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                        ║" -ForegroundColor Cyan
Write-Host "║   🧪 INSTALANDO TESTES AUTOMATIZADOS - SGPA 🧪       ║" -ForegroundColor Cyan
Write-Host "║                                                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório de testes
Set-Location -Path "c:\SDE06\SGPA\FRONTEND\tests"

Write-Host "📦 Instalando dependências do Selenium..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ Instalação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure o usuário de teste no Firebase:" -ForegroundColor White
Write-Host "   Email: teste@selenium.com" -ForegroundColor Gray
Write-Host "   Senha: teste123456" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Certifique-se de que o backend está rodando:" -ForegroundColor White
Write-Host "   cd c:\SDE06\SGPA\BACKEND" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Certifique-se de que o frontend está rodando:" -ForegroundColor White
Write-Host "   cd c:\SDE06\SGPA\FRONTEND" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Execute os testes:" -ForegroundColor White
Write-Host "   npm test                  # Todos os testes" -ForegroundColor Gray
Write-Host "   npm run test:login        # Apenas login" -ForegroundColor Gray
Write-Host "   npm run test:dashboard    # Apenas dashboard" -ForegroundColor Gray
Write-Host "   npm run test:alunos       # Apenas alunos" -ForegroundColor Gray
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Leia o README.md para mais informações!" -ForegroundColor Cyan
Write-Host ""
