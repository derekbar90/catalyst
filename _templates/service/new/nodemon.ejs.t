---
to: <%=h.changeCase.snakeCase(name)%>/nodemon.json
---

{
  "restartable": false,
  "ignore": [
    ".git",
    "node_modules/**/node_modules",
    "package.json",
    "./**/*.spec.ts"
  ],
  "verbose": false,
  "watch": ["./"],
  "ext": "ts",
  "execMap": {
    "ts": "npm run build"
  }
}