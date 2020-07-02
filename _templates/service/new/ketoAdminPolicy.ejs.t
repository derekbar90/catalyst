---
to: configurator/config/keto/policies/policy-by-role-admin-for-<%=h.changeCase.snakeCase(name)%>.json
---
[
  {
    "id": "${KETO_RESOURCE_PREFIX}policy:<%=h.changeCase.snakeCase(name)%>:role:admin",
    "description": "This policy provides access control for the <%=h.changeCase.snakeCase(name)%> service",
    "subjects": ["${KETO_SUBJECT_PREFIX}admin"],
    "effect": "allow",
    "actions": [
      "${KETO_ACTION_PREFIX}create",
      "${KETO_ACTION_PREFIX}read",
      "${KETO_ACTION_PREFIX}update",
      "${KETO_ACTION_PREFIX}delete"
    ],
    "resources": ["${KETO_RESOURCE_PREFIX}<%=h.changeCase.snakeCase(name)%>"]
  }
]
