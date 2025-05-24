import { instantiate } from "./wasm/snipkit_analyze_js_req.component.js";
import type {
  ImportObject,
  BotConfig,
  DetectedSensitiveInfoEntity,
  SensitiveInfoEntity,
  EmailValidationResult,
  BotResult,
  SensitiveInfoResult,
  EmailValidationConfig,
  SensitiveInfoEntities,
} from "./wasm/snipkit_analyze_js_req.component.js";
import type { SnipkitJsReqSensitiveInformationIdentifier } from "./wasm/interfaces/snipkit-js-req-sensitive-information-identifier.js";

import { wasm as componentCoreWasm } from "./wasm/snipkit_analyze_js_req.component.core.wasm?js";
import { wasm as componentCore2Wasm } from "./wasm/snipkit_analyze_js_req.component.core2.wasm?js";
import { wasm as componentCore3Wasm } from "./wasm/snipkit_analyze_js_req.component.core3.wasm?js";

type DetectSensitiveInfoFunction =
  typeof SnipkitJsReqSensitiveInformationIdentifier.detect;

const componentCoreWasmPromise = componentCoreWasm();
const componentCore2WasmPromise = componentCore2Wasm();
const componentCore3WasmPromise = componentCore3Wasm();

async function moduleFromPath(path: string): Promise<WebAssembly.Module> {
  if (path === "snipkit_analyze_js_req.component.core.wasm") {
    return componentCoreWasmPromise;
  }
  if (path === "snipkit_analyze_js_req.component.core2.wasm") {
    return componentCore2WasmPromise;
  }
  if (path === "snipkit_analyze_js_req.component.core3.wasm") {
    return componentCore3WasmPromise;
  }

  throw new Error(`Unknown path: ${path}`);
}

export async function initializeWasm(coreImports: ImportObject) {
  try {
    // Await the instantiation to catch the failure
    return instantiate(moduleFromPath, coreImports);
  } catch {
    return undefined;
  }
}

export {
  type BotConfig,
  type DetectedSensitiveInfoEntity,
  type SensitiveInfoEntity,
  type EmailValidationConfig,
  type EmailValidationResult,
  type BotResult,
  type SensitiveInfoResult,
  type SensitiveInfoEntities,
  type DetectSensitiveInfoFunction,
  type ImportObject,
};
