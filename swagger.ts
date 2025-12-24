import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "./contract/contract";
export const OpenAPIV1 = generateOpenApi(contract, {
  info: {
    title: "JEWELRY STORE API V1",
    version: "1.0.0",
    description: "",
  },
});