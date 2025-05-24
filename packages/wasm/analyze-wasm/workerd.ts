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

import componentCoreWasm from "./wasm/snipkit_analyze_js_req.component.core.wasm";
import componentCore2Wasm from "./wasm/snipkit_analyze_js_req.component.core2.wasm";
import componentCore3Wasm from "./wasm/snipkit_analyze_js_req.component.core3.wasm";

type DetectSensitiveInfoFunction =
  typeof SnipkitJsReqSensitiveInformationIdentifier.detect;

async function moduleFromPath(path: string): Promise<WebAssembly.Module> {
  if (path === "snipkit_analyze_js_req.component.core.wasm") {
    return componentCoreWasm;
  }
  if (path === "snipkit_analyze_js_req.component.core2.wasm") {
    return componentCore2Wasm;
  }
  if (path === "snipkit_analyze_js_req.component.core3.wasm") {
    return componentCore3Wasm;
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
