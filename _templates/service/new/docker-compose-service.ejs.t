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
    image: catalyst_<%=h.changeCase.snakeCase(name)%>
    env_file: docker-compose.env
    networks:
      - catalyst-backend
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
      NODE_INSPECT_PORT: <%=locals.nodeDebugPort%>
      TRACING_ENABLED: 'true'
<% if(locals.shouldExposeOnPort){ -%>
      PORT: <%=port%>
<% } -%>
<% if(locals.shouldAddDb){ -%>
      DB_NAME: <%=h.changeCase.snakeCase(name)%>
      POSTGRES_HOST: ${POSTGRES_HOST}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PORT: ${POSTGRES_PORT}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
<% } -%>
    links:
      - nats
      - redis
    ports:
      - "<%=locals.nodeDebugPort%>:<%=locals.nodeDebugPort%>"
    depends_on:
      - api
      - nats
      - redis
      - postgresd
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.backend=<%=h.changeCase.snakeCase(name)%>"
<% if(locals.shouldExposeOnPort){ -%>
      - "traefik.port=<%=port%>"
      - "traefik.frontend.rule=Host:${HOST_NAME}<% if(locals.shouldUseSubPath){ -%>PathPrefixStrip:/<%=path%>/<% } -%>"
<% } -%>
      
