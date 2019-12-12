---
inject: true
to: prometheus/prometheus.yml
after: ^scrape_configs
skip_if: <%=h.changeCase.paramCase(name)%>-service
---
  - job_name: '<%=h.changeCase.paramCase(name)%>-service'

    # Override the global default and scrape targets from this job every 5 seconds.
    scrape_interval: 5s

    dns_sd_configs:
    - names:
      - 'tasks.<%=h.changeCase.paramCase(name)%>-service'
      type: 'A'
      port: 3030
    
    static_configs:
       - targets: ['<%=h.changeCase.snakeCase(name)%>:3030']