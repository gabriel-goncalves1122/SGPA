import { runFluxoCompletoTest } from "./tests/fluxo-completo.test.js";

runFluxoCompletoTest().catch((err) => {
  console.error("Erro ao executar teste:", err);
  process.exit(1);
});
