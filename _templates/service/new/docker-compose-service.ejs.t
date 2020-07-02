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
    container_name: <%=h.changeCase.snakeCase(name)%>
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
      REDIS_HOST: ${REDIS_HOST}
      REDIS_PORT: ${REDIS_PORT}
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      KETO_ADMIN_URL: ${KETO_ADMIN_URL}
      ROOT_ORG_IDENTIFIER: ${ROOT_ORG_IDENTIFIER}
      KETO_RESOURCE_PREFIX: ${KETO_RESOURCE_PREFIX}
      KETO_ACTION_PREFIX: ${KETO_ACTION_PREFIX}
      KETO_SUBJECT_PREFIX: ${KETO_SUBJECT_PREFIX}
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
<% if(locals.shouldExposeOnPort){ -%>
    labels:
      - "traefik.enable=true"
      - "traefik.backend=<%=h.changeCase.snakeCase(name)%>"
      - "traefik.port=<%=port%>"
      - "traefik.frontend.rule=Host:${HOST_NAME}<% if(locals.shouldUseSubPath){ -%>PathPrefixStrip:/<%=path%>/<% } -%>"
<% } -%>
      
