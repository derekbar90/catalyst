---
to: configurator/config/keto/policies/policy-by-role-user-for-<%=h.changeCase.snakeCase(name)%>.json
---
[
  {
    "id": "${KETO_RESOURCE_PREFIX}policy:<%=h.changeCase.snakeCase(name)%>:role:user",
    "description": "This policy provides access control for the <%=h.changeCase.snakeCase(name)%> service",
    "subjects": ["${KETO_SUBJECT_PREFIX}user"],
    "effect": "allow",
    "actions": [
      "${KETO_ACTION_PREFIX}create",
      "${KETO_ACTION_PREFIX}read"
    ],
    "resources": ["${KETO_RESOURCE_PREFIX}<%=h.changeCase.snakeCase(name)%>"]
  }
]
