import type { SerializedStyles } from "@emotion/utils";
import { serializeStyles } from "@emotion/serialize";

function css(...args: Array<any>): SerializedStyles {
  return serializeStyles(args);
}

export default css;
