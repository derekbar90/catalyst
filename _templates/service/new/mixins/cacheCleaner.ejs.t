---
to: "<%= locals.shouldAddDb ? h.changeCase.snakeCase(name) + '/mixins/' + 'cacheCleaner' + '.ts' : null %>"
---
export const ServiceDependencyCacheCleaner = (serviceName: string, depServiceNames: string[]) => {
    const events = <any>{};

    depServiceNames && depServiceNames.length > 0 && depServiceNames.forEach((name: string) => {
        events[`cache.clean.${name}`] = function () {
            if (this.broker.cacher) {
                this.logger.debug(`Clear local '${this.name}' cache`);
                this.broker.cacher.clean(`${this.name}.*`);
            }
        };
    });

    return {
        name: serviceName,
        events
    };
};