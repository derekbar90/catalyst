---
to: <%=h.changeCase.snakeCase(name)%>/tsconfig.json
---

{
  "compilerOptions": {
    "esModuleInterop": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "pretty": true,
    "types": [
      "jest",
      "node"
    ],
    "sourceMap": true,
    "target": "es6",
    "baseUrl": "./"
  },
  "exclude": [
    "node_modules",
    "test"
  ]
}