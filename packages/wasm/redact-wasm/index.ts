import { instantiate } from "./wasm/snipkit_analyze_bindings_redact.component.js";
import type {
  ImportObject,
  RedactedSensitiveInfoEntity,
  RedactSensitiveInfoConfig,
  SensitiveInfoEntity,
} from "./wasm/snipkit_analyze_bindings_redact.component.js";
import type { SnipkitRedactCustomRedact } from "./wasm/interfaces/snipkit-redact-custom-redact.js";

import { wasm as componentCoreWasm } from "./wasm/snipkit_analyze_bindings_redact.component.core.wasm?js";
import { wasm as componentCore2Wasm } from "./wasm/snipkit_analyze_bindings_redact.component.core2.wasm?js";
import { wasm as componentCore3Wasm } from "./wasm/snipkit_analyze_bindings_redact.component.core3.wasm?js";

const componentCoreWasmPromise = componentCoreWasm();
const componentCore2WasmPromise = componentCore2Wasm();
const componentCore3WasmPromise = componentCore3Wasm();

async function moduleFromPath(path: string): Promise<WebAssembly.Module> {
  if (path === "snipkit_analyze_bindings_redact.component.core.wasm") {
    return componentCoreWasmPromise;
  }
  if (path === "snipkit_analyze_bindings_redact.component.core2.wasm") {
    return componentCore2WasmPromise;
  }
  if (path === "snipkit_analyze_bindings_redact.component.core3.wasm") {
    return componentCore3WasmPromise;
  }

  throw new Error(`Unknown path: ${path}`);
}

export async function initializeWasm(
  detect: CustomDetect,
  replace: CustomRedact,
) {
  const coreImports: ImportObject = {
    'snipkit:redact/custom-redact': {
      detectSensitiveInfo: detect,
      redactSensitiveInfo: replace,
    },
  };

  try {
    // Await the instantiation to catch the failure
    return await instantiate(moduleFromPath, coreImports);
  } catch {
    console.debug("WebAssembly is not supported in this runtime");
  }
}

type CustomDetect = typeof SnipkitRedactCustomRedact.detectSensitiveInfo;
type CustomRedact = typeof SnipkitRedactCustomRedact.redactSensitiveInfo;

export {
  type CustomDetect,
  type CustomRedact,
  type RedactedSensitiveInfoEntity,
  type RedactSensitiveInfoConfig,
  type SensitiveInfoEntity,
};
