import { instantiate } from "./wasm/snipkit_analyze_bindings_redact.component.js";
import type {
  ImportObject,
  RedactedSensitiveInfoEntity,
  RedactSensitiveInfoConfig,
  SensitiveInfoEntity,
} from "./wasm/snipkit_analyze_bindings_redact.component.js";
import type { SnipkitRedactCustomRedact } from "./wasm/interfaces/snipkit-redact-custom-redact.js";

import componentCoreWasm from "./wasm/snipkit_analyze_bindings_redact.component.core.wasm?module";
import componentCore2Wasm from "./wasm/snipkit_analyze_bindings_redact.component.core2.wasm?module";
import componentCore3Wasm from "./wasm/snipkit_analyze_bindings_redact.component.core3.wasm?module";

async function moduleFromPath(path: string): Promise<WebAssembly.Module> {
  if (path === "snipkit_analyze_bindings_redact.component.core.wasm") {
    return componentCoreWasm;
  }
  if (path === "snipkit_analyze_bindings_redact.component.core2.wasm") {
    return componentCore2Wasm;
  }
  if (path === "snipkit_analyze_bindings_redact.component.core3.wasm") {
    return componentCore3Wasm;
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
