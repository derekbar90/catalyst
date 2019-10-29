---
inject: true
to: docker-compose.yml
after: ^volumes 
skip_if: <%= h.changeCase.snakeCase(name) %>_vol
---
  <%=h.changeCase.snakeCase(name)%>_vol:
    driver: local