import Resolver from "@forge/resolver";

const resolver = new Resolver();

resolver.define("getText", () => "Hello world ebre");

export const handler = resolver.getDefinitions();
