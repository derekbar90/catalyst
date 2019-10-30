---
inject: true
to: docker-compose.yml
after: services
skip_if: <%= h.changeCase.snakeCase(name) -%>[^_]
---

  # service container
  <%=h.changeCase.snakeCase(name)%>:
    build:
      context: ./<%=h.changeCase.snakeCase(name)%>
    image: atom
    env_file: docker-compose.env
    networks:
      - atom
    volumes:
      - <%=h.changeCase.snakeCase(name)%>_vol:/app/node_modules
      - ./<%=h.changeCase.snakeCase(name)%>:/app/:delegated #delegates speeds up mac os volumes
    command:
      - ./wait-for-it.sh
      - postgresd:5432
      - --
      - make
      - start-service
    environment:
      SERVICES: <%=h.changeCase.snakeCase(name) %>
<% if(locals.shouldExposeOnPort){ -%>
      PORT: <%=port%>
<% } -%>
<% if(locals.shouldAddDb){ -%>
      DB_NAME: <%=h.changeCase.snakeCase(name)%>
<% } -%>
    links:
      - nats
      - redis
    depends_on:
      - nats
      - redis
      - postgresd
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.backend=<%=h.changeCase.snakeCase(name)%>"
<% if(locals.shouldExposeOnPort){ -%>
      - "traefik.port=<%=port%>"
<% } -%>
      - "traefik.frontend.rule=Host:${HOST_NAME}<% if(locals.shouldUseSubPath){ -%>PathPrefixStrip:/<%=path%>/<% } -%>"
