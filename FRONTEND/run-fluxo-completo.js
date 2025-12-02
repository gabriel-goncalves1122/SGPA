import { runFluxoCompletoTest } from "./tests/tests/fluxo-completo.test.js";

async function main() {
  console.log("\n🚀 INICIANDO TESTE DE FLUXO COMPLETO DA APLICAÇÃO\n");

  try {
    const resultado = await runFluxoCompletoTest();

    console.log("\n╔════════════════════════════════════════════════════════╗");
    console.log("║                RESULTADO FINAL                         ║");
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(
      `║ ✅ Passados:  ${resultado.passed}/6                                        ║`
    );
    console.log(
      `║ ❌ Falhados:  ${resultado.failed}/6                                        ║`
    );
    console.log(
      `║ 🎯 Sucesso:   ${((resultado.passed / 6) * 100).toFixed(
        2
      )}%                                    ║`
    );
    console.log("╚════════════════════════════════════════════════════════╝\n");

    process.exit(resultado.failed > 0 ? 1 : 0);
  } catch (e) {
    console.error("\n❌ Erro ao executar teste:", e);
    process.exit(1);
  }
}

main();
