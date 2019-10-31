"use strict";
/**
 * Moleculer ServiceBroker configuration file
 *
 * More info about options: https://moleculer.services/docs/0.13/broker.html#Broker-options
 *
 * Overwrite options in production:
 * ================================
 * 	You can overwrite any option with environment variables.
 * 	For example to overwrite the "logLevel", use `LOGLEVEL=warn` env var.
 * 	To overwrite a nested parameter, e.g. retryPolicy.retries, use `RETRYPOLICY_RETRIES=10` env var.
 *
 * 	To overwrite broker’s deeply nested default options, which are not presented in "moleculer.config.ts",
 * 	via environment variables, use the `MOL_` prefix and double underscore `__` for nested properties in .env file.
 * 	For example, to set the cacher prefix to `MYCACHE`, you should declare an env var as `MOL_CACHER__OPTIONS__PREFIX=MYCACHE`.
 */
const brokerConfig = {
    // Namespace of nodes to segment your nodes on the same network.
    namespace: "",
    // Unique node identifier. Must be unique in a namespace.
    nodeID: null,
    // Enable/disable logging or use custom logger. More info: https://moleculer.services/docs/0.13/logging.html
    logger: true,
    // Log level for built-in console logger. Available values: trace, debug, info, warn, error, fatal
    logLevel: "info",
    // Log formatter for built-in console logger. Available values: default, simple, short. It can be also a `Function`.
    logFormatter: "default",
    // Custom object & array printer for built-in console logger.
    logObjectPrinter: null,
    // Define transporter.
    // More info: https://moleculer.services/docs/0.13/networking.html
    transporter: "NATS",
    // Define a cacher. More info: https://moleculer.services/docs/0.13/caching.html
    cacher: "Redis",
    // Define a serializer.
    // Available values: "JSON", "Avro", "ProtoBuf", "MsgPack", "Notepack", "Thrift".
    // More info: https://moleculer.services/docs/0.13/networking.html
    serializer: "JSON",
    // Number of milliseconds to wait before reject a request with a RequestTimeout error. Disabled: 0
    requestTimeout: 10 * 1000,
    // Retry policy settings. More info: https://moleculer.services/docs/0.13/fault-tolerance.html#Retry
    retryPolicy: {
        // Enable feature
        enabled: false,
        // Count of retries
        retries: 5,
        // First delay in milliseconds.
        delay: 100,
        // Maximum delay in milliseconds.
        maxDelay: 1000,
        // Backoff factor for delay. 2 means exponential backoff.
        factor: 2,
        // A function to check failed requests.
        check: (err) => err && !!err.retryable,
    },
    // Limit of calling level. If it reaches the limit, broker will throw an MaxCallLevelError error. (Infinite loop protection)
    maxCallLevel: 100,
    // Number of seconds to send heartbeat packet to other nodes.
    heartbeatInterval: 5,
    // Number of seconds to wait before setting node to unavailable status.
    heartbeatTimeout: 15,
    // Tracking requests and waiting for running requests before shutdowning. More info: https://moleculer.services/docs/0.13/fault-tolerance.html
    tracking: {
        // Enable feature
        enabled: false,
        // Number of milliseconds to wait before shutdowning the process
        shutdownTimeout: 5000,
    },
    // Disable built-in request & emit balancer. (Transporter must support it, as well.)
    disableBalancer: false,
    // Settings of Service Registry. More info: https://moleculer.services/docs/0.13/registry.html
    registry: {
        // Define balancing strategy.
        // Available values: "RoundRobin", "Random", "CpuUsage", "Latency"
        strategy: "RoundRobin",
        // Enable local action call preferring.
        preferLocal: true,
    },
    // Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.13/fault-tolerance.html#Circuit-Breaker
    circuitBreaker: {
        // Enable feature
        enabled: false,
        // Threshold value. 0.5 means that 50% should be failed for tripping.
        threshold: 0.5,
        // Minimum request count. Below it, CB does not trip.
        minRequestCount: 20,
        // Number of seconds for time window.
        windowTime: 60,
        // Number of milliseconds to switch from open to half-open state
        halfOpenTime: 10 * 1000,
        // A function to check failed requests.
        check: (err) => err && err.code >= 500,
    },
    // Settings of bulkhead feature. More info: https://moleculer.services/docs/0.13/fault-tolerance.html#Bulkhead
    bulkhead: {
        // Enable feature.
        enabled: false,
        // Maximum concurrent executions.
        concurrency: 10,
        // Maximum size of queue
        maxQueueSize: 100,
    },
    // Enable parameters validation. More info: https://moleculer.services/docs/0.13/validating.html
    validator: true,
    // Enable metrics function. More info: https://moleculer.services/docs/0.13/metrics.html
    metrics: {
        enabled: false,
        reporter: [
            {
                type: "Console",
            },
        ],
    },
    //  Tracing support setup as of moleculer 0.14
    tracing: {
        enabled: true,
        exporter: {
            type: "Jaeger",
            options: {
                // HTTP Reporter endpoint. If set, HTTP Reporter will be used.
                endpoint: null,
                // UDP Sender host option.
                host: "jaeger",
                // UDP Sender port option.
                port: 6832,
                // Jaeger Sampler configuration.
                sampler: {
                    // Sampler type. More info: https://www.jaegertracing.io/docs/1.14/sampling/#client-sampling-configuration
                    type: "Const",
                    // Sampler specific options.
                    options: {}
                },
                // Additional options for `Jaeger.Tracer`
                tracerOptions: {},
                // Default tags. They will be added into all span tags.
                defaultTags: null
            }
        }
    },
    // Register internal services ("$node"). More info: https://moleculer.services/docs/0.13/services.html#Internal-services
    internalServices: true,
    // Register internal middlewares. More info: https://moleculer.services/docs/0.13/middlewares.html#Internal-middlewares
    internalMiddlewares: true,
    // Watch the loaded services and hot reload if they changed. You can also enable it in Moleculer Runner with `--hot` argument
    hotReload: false,
    // Register custom middlewares
    middlewares: [],
    // Called after broker created.
    created(broker) {
    },
    // Called after broker starte.
    started(broker) {
    },
    // Called after broker stopped.
    stopped(broker) {
    },
    // Register custom REPL commands.
    replCommands: null,
};
module.exports = brokerConfig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3Jvb3QvY2F0YWx5c3QvdXNlci9tb2xlY3VsZXIuY29uZmlnLnRzIiwic291cmNlcyI6WyIvcm9vdC9jYXRhbHlzdC91c2VyL21vbGVjdWxlci5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBR2I7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLFlBQVksR0FBa0I7SUFDbkMsZ0VBQWdFO0lBQ2hFLFNBQVMsRUFBRSxFQUFFO0lBQ2IseURBQXlEO0lBQ3pELE1BQU0sRUFBRSxJQUFJO0lBRVosNEdBQTRHO0lBQzVHLE1BQU0sRUFBRSxJQUFJO0lBQ1osa0dBQWtHO0lBQ2xHLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLG9IQUFvSDtJQUNwSCxZQUFZLEVBQUUsU0FBUztJQUN2Qiw2REFBNkQ7SUFDN0QsZ0JBQWdCLEVBQUUsSUFBSTtJQUV0QixzQkFBc0I7SUFDdEIsa0VBQWtFO0lBQ2xFLFdBQVcsRUFBRSxNQUFNO0lBRW5CLGdGQUFnRjtJQUNoRixNQUFNLEVBQUUsT0FBTztJQUVmLHVCQUF1QjtJQUN2QixpRkFBaUY7SUFDakYsa0VBQWtFO0lBQ2xFLFVBQVUsRUFBRSxNQUFNO0lBRWxCLGtHQUFrRztJQUNsRyxjQUFjLEVBQUUsRUFBRSxHQUFHLElBQUk7SUFFekIsb0dBQW9HO0lBQ3BHLFdBQVcsRUFBRTtRQUNaLGlCQUFpQjtRQUNqQixPQUFPLEVBQUUsS0FBSztRQUNkLG1CQUFtQjtRQUNuQixPQUFPLEVBQUUsQ0FBQztRQUNWLCtCQUErQjtRQUMvQixLQUFLLEVBQUUsR0FBRztRQUNWLGlDQUFpQztRQUNqQyxRQUFRLEVBQUUsSUFBSTtRQUNkLHlEQUF5RDtRQUN6RCxNQUFNLEVBQUUsQ0FBQztRQUNULHVDQUF1QztRQUN2QyxLQUFLLEVBQUUsQ0FBQyxHQUFtQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTO0tBQ3RFO0lBRUQsNEhBQTRIO0lBQzVILFlBQVksRUFBRSxHQUFHO0lBRWpCLDZEQUE2RDtJQUM3RCxpQkFBaUIsRUFBRSxDQUFDO0lBQ3BCLHVFQUF1RTtJQUN2RSxnQkFBZ0IsRUFBRSxFQUFFO0lBRXBCLDhJQUE4STtJQUM5SSxRQUFRLEVBQUU7UUFDVCxpQkFBaUI7UUFDakIsT0FBTyxFQUFFLEtBQUs7UUFDZCxnRUFBZ0U7UUFDaEUsZUFBZSxFQUFFLElBQUk7S0FDckI7SUFFRCxvRkFBb0Y7SUFDcEYsZUFBZSxFQUFFLEtBQUs7SUFFdEIsOEZBQThGO0lBQzlGLFFBQVEsRUFBRTtRQUNULDZCQUE2QjtRQUM3QixrRUFBa0U7UUFDbEUsUUFBUSxFQUFFLFlBQVk7UUFDdEIsdUNBQXVDO1FBQ3ZDLFdBQVcsRUFBRSxJQUFJO0tBQ2pCO0lBRUQsb0hBQW9IO0lBQ3BILGNBQWMsRUFBRTtRQUNmLGlCQUFpQjtRQUNqQixPQUFPLEVBQUUsS0FBSztRQUNkLHFFQUFxRTtRQUNyRSxTQUFTLEVBQUUsR0FBRztRQUNkLHFEQUFxRDtRQUNyRCxlQUFlLEVBQUUsRUFBRTtRQUNuQixxQ0FBcUM7UUFDckMsVUFBVSxFQUFFLEVBQUU7UUFDZCxnRUFBZ0U7UUFDaEUsWUFBWSxFQUFFLEVBQUUsR0FBRyxJQUFJO1FBQ3ZCLHVDQUF1QztRQUN2QyxLQUFLLEVBQUUsQ0FBQyxHQUFtQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHO0tBQ3RFO0lBRUUsOEdBQThHO0lBQ2pILFFBQVEsRUFBRTtRQUNULGtCQUFrQjtRQUNsQixPQUFPLEVBQUUsS0FBSztRQUNkLGlDQUFpQztRQUNqQyxXQUFXLEVBQUUsRUFBRTtRQUNmLHdCQUF3QjtRQUN4QixZQUFZLEVBQUUsR0FBRztLQUNqQjtJQUVELGdHQUFnRztJQUNoRyxTQUFTLEVBQUUsSUFBSTtJQUVmLHdGQUF3RjtJQUN4RixPQUFPLEVBQUU7UUFDUixPQUFPLEVBQUUsS0FBSztRQUNkLFFBQVEsRUFBRTtZQUNUO2dCQUNDLElBQUksRUFBRSxTQUFTO2FBQ2Y7U0FDRDtLQUNEO0lBRUQsOENBQThDO0lBQzlDLE9BQU8sRUFBRTtRQUNGLE9BQU8sRUFBRSxJQUFJO1FBQ2IsUUFBUSxFQUFFO1lBQ04sSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUU7Z0JBQ0wsOERBQThEO2dCQUM5RCxRQUFRLEVBQUUsSUFBSTtnQkFDZCwwQkFBMEI7Z0JBQzFCLElBQUksRUFBRSxRQUFRO2dCQUNkLDBCQUEwQjtnQkFDMUIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsZ0NBQWdDO2dCQUNoQyxPQUFPLEVBQUU7b0JBQ0wsMEdBQTBHO29CQUMxRyxJQUFJLEVBQUUsT0FBTztvQkFDYiw0QkFBNEI7b0JBQzVCLE9BQU8sRUFBRSxFQUFFO2lCQUNkO2dCQUNELHlDQUF5QztnQkFDekMsYUFBYSxFQUFFLEVBQUU7Z0JBQ2pCLHVEQUF1RDtnQkFDdkQsV0FBVyxFQUFFLElBQUk7YUFDcEI7U0FDSjtLQUNKO0lBRUosd0hBQXdIO0lBQ3hILGdCQUFnQixFQUFFLElBQUk7SUFDdEIsdUhBQXVIO0lBQ3ZILG1CQUFtQixFQUFFLElBQUk7SUFFekIsNkhBQTZIO0lBQzdILFNBQVMsRUFBRSxLQUFLO0lBRWhCLDhCQUE4QjtJQUM5QixXQUFXLEVBQUUsRUFBRTtJQUVmLCtCQUErQjtJQUMvQixPQUFPLENBQUMsTUFBTTtJQUVkLENBQUM7SUFFRCw4QkFBOEI7SUFDOUIsT0FBTyxDQUFDLE1BQU07SUFFZCxDQUFDO0lBRUQsK0JBQStCO0lBQy9CLE9BQU8sQ0FBQyxNQUFNO0lBRWQsQ0FBQztJQUVELGlDQUFpQztJQUNqQyxZQUFZLEVBQUUsSUFBSTtDQUNsQixDQUFDO0FBRUYsaUJBQVMsWUFBWSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5pbXBvcnQgeyBCcm9rZXJPcHRpb25zLCBFcnJvcnMgfSBmcm9tIFwibW9sZWN1bGVyXCI7XG5cbi8qKlxuICogTW9sZWN1bGVyIFNlcnZpY2VCcm9rZXIgY29uZmlndXJhdGlvbiBmaWxlXG4gKlxuICogTW9yZSBpbmZvIGFib3V0IG9wdGlvbnM6IGh0dHBzOi8vbW9sZWN1bGVyLnNlcnZpY2VzL2RvY3MvMC4xMy9icm9rZXIuaHRtbCNCcm9rZXItb3B0aW9uc1xuICpcbiAqIE92ZXJ3cml0ZSBvcHRpb25zIGluIHByb2R1Y3Rpb246XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogXHRZb3UgY2FuIG92ZXJ3cml0ZSBhbnkgb3B0aW9uIHdpdGggZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICogXHRGb3IgZXhhbXBsZSB0byBvdmVyd3JpdGUgdGhlIFwibG9nTGV2ZWxcIiwgdXNlIGBMT0dMRVZFTD13YXJuYCBlbnYgdmFyLlxuICogXHRUbyBvdmVyd3JpdGUgYSBuZXN0ZWQgcGFyYW1ldGVyLCBlLmcuIHJldHJ5UG9saWN5LnJldHJpZXMsIHVzZSBgUkVUUllQT0xJQ1lfUkVUUklFUz0xMGAgZW52IHZhci5cbiAqXG4gKiBcdFRvIG92ZXJ3cml0ZSBicm9rZXLigJlzIGRlZXBseSBuZXN0ZWQgZGVmYXVsdCBvcHRpb25zLCB3aGljaCBhcmUgbm90IHByZXNlbnRlZCBpbiBcIm1vbGVjdWxlci5jb25maWcudHNcIixcbiAqIFx0dmlhIGVudmlyb25tZW50IHZhcmlhYmxlcywgdXNlIHRoZSBgTU9MX2AgcHJlZml4IGFuZCBkb3VibGUgdW5kZXJzY29yZSBgX19gIGZvciBuZXN0ZWQgcHJvcGVydGllcyBpbiAuZW52IGZpbGUuXG4gKiBcdEZvciBleGFtcGxlLCB0byBzZXQgdGhlIGNhY2hlciBwcmVmaXggdG8gYE1ZQ0FDSEVgLCB5b3Ugc2hvdWxkIGRlY2xhcmUgYW4gZW52IHZhciBhcyBgTU9MX0NBQ0hFUl9fT1BUSU9OU19fUFJFRklYPU1ZQ0FDSEVgLlxuICovXG5jb25zdCBicm9rZXJDb25maWc6IEJyb2tlck9wdGlvbnMgPSB7XG5cdC8vIE5hbWVzcGFjZSBvZiBub2RlcyB0byBzZWdtZW50IHlvdXIgbm9kZXMgb24gdGhlIHNhbWUgbmV0d29yay5cblx0bmFtZXNwYWNlOiBcIlwiLFxuXHQvLyBVbmlxdWUgbm9kZSBpZGVudGlmaWVyLiBNdXN0IGJlIHVuaXF1ZSBpbiBhIG5hbWVzcGFjZS5cblx0bm9kZUlEOiBudWxsLFxuXG5cdC8vIEVuYWJsZS9kaXNhYmxlIGxvZ2dpbmcgb3IgdXNlIGN1c3RvbSBsb2dnZXIuIE1vcmUgaW5mbzogaHR0cHM6Ly9tb2xlY3VsZXIuc2VydmljZXMvZG9jcy8wLjEzL2xvZ2dpbmcuaHRtbFxuXHRsb2dnZXI6IHRydWUsXG5cdC8vIExvZyBsZXZlbCBmb3IgYnVpbHQtaW4gY29uc29sZSBsb2dnZXIuIEF2YWlsYWJsZSB2YWx1ZXM6IHRyYWNlLCBkZWJ1ZywgaW5mbywgd2FybiwgZXJyb3IsIGZhdGFsXG5cdGxvZ0xldmVsOiBcImluZm9cIixcblx0Ly8gTG9nIGZvcm1hdHRlciBmb3IgYnVpbHQtaW4gY29uc29sZSBsb2dnZXIuIEF2YWlsYWJsZSB2YWx1ZXM6IGRlZmF1bHQsIHNpbXBsZSwgc2hvcnQuIEl0IGNhbiBiZSBhbHNvIGEgYEZ1bmN0aW9uYC5cblx0bG9nRm9ybWF0dGVyOiBcImRlZmF1bHRcIixcblx0Ly8gQ3VzdG9tIG9iamVjdCAmIGFycmF5IHByaW50ZXIgZm9yIGJ1aWx0LWluIGNvbnNvbGUgbG9nZ2VyLlxuXHRsb2dPYmplY3RQcmludGVyOiBudWxsLFxuXG5cdC8vIERlZmluZSB0cmFuc3BvcnRlci5cblx0Ly8gTW9yZSBpbmZvOiBodHRwczovL21vbGVjdWxlci5zZXJ2aWNlcy9kb2NzLzAuMTMvbmV0d29ya2luZy5odG1sXG5cdHRyYW5zcG9ydGVyOiBcIk5BVFNcIixcblxuXHQvLyBEZWZpbmUgYSBjYWNoZXIuIE1vcmUgaW5mbzogaHR0cHM6Ly9tb2xlY3VsZXIuc2VydmljZXMvZG9jcy8wLjEzL2NhY2hpbmcuaHRtbFxuXHRjYWNoZXI6IFwiUmVkaXNcIixcblxuXHQvLyBEZWZpbmUgYSBzZXJpYWxpemVyLlxuXHQvLyBBdmFpbGFibGUgdmFsdWVzOiBcIkpTT05cIiwgXCJBdnJvXCIsIFwiUHJvdG9CdWZcIiwgXCJNc2dQYWNrXCIsIFwiTm90ZXBhY2tcIiwgXCJUaHJpZnRcIi5cblx0Ly8gTW9yZSBpbmZvOiBodHRwczovL21vbGVjdWxlci5zZXJ2aWNlcy9kb2NzLzAuMTMvbmV0d29ya2luZy5odG1sXG5cdHNlcmlhbGl6ZXI6IFwiSlNPTlwiLFxuXG5cdC8vIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgcmVqZWN0IGEgcmVxdWVzdCB3aXRoIGEgUmVxdWVzdFRpbWVvdXQgZXJyb3IuIERpc2FibGVkOiAwXG5cdHJlcXVlc3RUaW1lb3V0OiAxMCAqIDEwMDAsXG5cblx0Ly8gUmV0cnkgcG9saWN5IHNldHRpbmdzLiBNb3JlIGluZm86IGh0dHBzOi8vbW9sZWN1bGVyLnNlcnZpY2VzL2RvY3MvMC4xMy9mYXVsdC10b2xlcmFuY2UuaHRtbCNSZXRyeVxuXHRyZXRyeVBvbGljeToge1xuXHRcdC8vIEVuYWJsZSBmZWF0dXJlXG5cdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0Ly8gQ291bnQgb2YgcmV0cmllc1xuXHRcdHJldHJpZXM6IDUsXG5cdFx0Ly8gRmlyc3QgZGVsYXkgaW4gbWlsbGlzZWNvbmRzLlxuXHRcdGRlbGF5OiAxMDAsXG5cdFx0Ly8gTWF4aW11bSBkZWxheSBpbiBtaWxsaXNlY29uZHMuXG5cdFx0bWF4RGVsYXk6IDEwMDAsXG5cdFx0Ly8gQmFja29mZiBmYWN0b3IgZm9yIGRlbGF5LiAyIG1lYW5zIGV4cG9uZW50aWFsIGJhY2tvZmYuXG5cdFx0ZmFjdG9yOiAyLFxuXHRcdC8vIEEgZnVuY3Rpb24gdG8gY2hlY2sgZmFpbGVkIHJlcXVlc3RzLlxuXHRcdGNoZWNrOiAoZXJyOiBFcnJvcnMuTW9sZWN1bGVyUmV0cnlhYmxlRXJyb3IpID0+IGVyciAmJiAhIWVyci5yZXRyeWFibGUsXG5cdH0sXG5cblx0Ly8gTGltaXQgb2YgY2FsbGluZyBsZXZlbC4gSWYgaXQgcmVhY2hlcyB0aGUgbGltaXQsIGJyb2tlciB3aWxsIHRocm93IGFuIE1heENhbGxMZXZlbEVycm9yIGVycm9yLiAoSW5maW5pdGUgbG9vcCBwcm90ZWN0aW9uKVxuXHRtYXhDYWxsTGV2ZWw6IDEwMCxcblxuXHQvLyBOdW1iZXIgb2Ygc2Vjb25kcyB0byBzZW5kIGhlYXJ0YmVhdCBwYWNrZXQgdG8gb3RoZXIgbm9kZXMuXG5cdGhlYXJ0YmVhdEludGVydmFsOiA1LFxuXHQvLyBOdW1iZXIgb2Ygc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBzZXR0aW5nIG5vZGUgdG8gdW5hdmFpbGFibGUgc3RhdHVzLlxuXHRoZWFydGJlYXRUaW1lb3V0OiAxNSxcblxuXHQvLyBUcmFja2luZyByZXF1ZXN0cyBhbmQgd2FpdGluZyBmb3IgcnVubmluZyByZXF1ZXN0cyBiZWZvcmUgc2h1dGRvd25pbmcuIE1vcmUgaW5mbzogaHR0cHM6Ly9tb2xlY3VsZXIuc2VydmljZXMvZG9jcy8wLjEzL2ZhdWx0LXRvbGVyYW5jZS5odG1sXG5cdHRyYWNraW5nOiB7XG5cdFx0Ly8gRW5hYmxlIGZlYXR1cmVcblx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHQvLyBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIHNodXRkb3duaW5nIHRoZSBwcm9jZXNzXG5cdFx0c2h1dGRvd25UaW1lb3V0OiA1MDAwLFxuXHR9LFxuXG5cdC8vIERpc2FibGUgYnVpbHQtaW4gcmVxdWVzdCAmIGVtaXQgYmFsYW5jZXIuIChUcmFuc3BvcnRlciBtdXN0IHN1cHBvcnQgaXQsIGFzIHdlbGwuKVxuXHRkaXNhYmxlQmFsYW5jZXI6IGZhbHNlLFxuXG5cdC8vIFNldHRpbmdzIG9mIFNlcnZpY2UgUmVnaXN0cnkuIE1vcmUgaW5mbzogaHR0cHM6Ly9tb2xlY3VsZXIuc2VydmljZXMvZG9jcy8wLjEzL3JlZ2lzdHJ5Lmh0bWxcblx0cmVnaXN0cnk6IHtcblx0XHQvLyBEZWZpbmUgYmFsYW5jaW5nIHN0cmF0ZWd5LlxuXHRcdC8vIEF2YWlsYWJsZSB2YWx1ZXM6IFwiUm91bmRSb2JpblwiLCBcIlJhbmRvbVwiLCBcIkNwdVVzYWdlXCIsIFwiTGF0ZW5jeVwiXG5cdFx0c3RyYXRlZ3k6IFwiUm91bmRSb2JpblwiLFxuXHRcdC8vIEVuYWJsZSBsb2NhbCBhY3Rpb24gY2FsbCBwcmVmZXJyaW5nLlxuXHRcdHByZWZlckxvY2FsOiB0cnVlLFxuXHR9LFxuXG5cdC8vIFNldHRpbmdzIG9mIENpcmN1aXQgQnJlYWtlci4gTW9yZSBpbmZvOiBodHRwczovL21vbGVjdWxlci5zZXJ2aWNlcy9kb2NzLzAuMTMvZmF1bHQtdG9sZXJhbmNlLmh0bWwjQ2lyY3VpdC1CcmVha2VyXG5cdGNpcmN1aXRCcmVha2VyOiB7XG5cdFx0Ly8gRW5hYmxlIGZlYXR1cmVcblx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHQvLyBUaHJlc2hvbGQgdmFsdWUuIDAuNSBtZWFucyB0aGF0IDUwJSBzaG91bGQgYmUgZmFpbGVkIGZvciB0cmlwcGluZy5cblx0XHR0aHJlc2hvbGQ6IDAuNSxcblx0XHQvLyBNaW5pbXVtIHJlcXVlc3QgY291bnQuIEJlbG93IGl0LCBDQiBkb2VzIG5vdCB0cmlwLlxuXHRcdG1pblJlcXVlc3RDb3VudDogMjAsXG5cdFx0Ly8gTnVtYmVyIG9mIHNlY29uZHMgZm9yIHRpbWUgd2luZG93LlxuXHRcdHdpbmRvd1RpbWU6IDYwLFxuXHRcdC8vIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gc3dpdGNoIGZyb20gb3BlbiB0byBoYWxmLW9wZW4gc3RhdGVcblx0XHRoYWxmT3BlblRpbWU6IDEwICogMTAwMCxcblx0XHQvLyBBIGZ1bmN0aW9uIHRvIGNoZWNrIGZhaWxlZCByZXF1ZXN0cy5cblx0XHRjaGVjazogKGVycjogRXJyb3JzLk1vbGVjdWxlclJldHJ5YWJsZUVycm9yKSA9PiBlcnIgJiYgZXJyLmNvZGUgPj0gNTAwLFxuXHR9LFxuXG4gICAgLy8gU2V0dGluZ3Mgb2YgYnVsa2hlYWQgZmVhdHVyZS4gTW9yZSBpbmZvOiBodHRwczovL21vbGVjdWxlci5zZXJ2aWNlcy9kb2NzLzAuMTMvZmF1bHQtdG9sZXJhbmNlLmh0bWwjQnVsa2hlYWRcblx0YnVsa2hlYWQ6IHtcblx0XHQvLyBFbmFibGUgZmVhdHVyZS5cblx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHQvLyBNYXhpbXVtIGNvbmN1cnJlbnQgZXhlY3V0aW9ucy5cblx0XHRjb25jdXJyZW5jeTogMTAsXG5cdFx0Ly8gTWF4aW11bSBzaXplIG9mIHF1ZXVlXG5cdFx0bWF4UXVldWVTaXplOiAxMDAsXG5cdH0sXG5cblx0Ly8gRW5hYmxlIHBhcmFtZXRlcnMgdmFsaWRhdGlvbi4gTW9yZSBpbmZvOiBodHRwczovL21vbGVjdWxlci5zZXJ2aWNlcy9kb2NzLzAuMTMvdmFsaWRhdGluZy5odG1sXG5cdHZhbGlkYXRvcjogdHJ1ZSxcblxuXHQvLyBFbmFibGUgbWV0cmljcyBmdW5jdGlvbi4gTW9yZSBpbmZvOiBodHRwczovL21vbGVjdWxlci5zZXJ2aWNlcy9kb2NzLzAuMTMvbWV0cmljcy5odG1sXG5cdG1ldHJpY3M6IHtcblx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHRyZXBvcnRlcjogW1xuXHRcdFx0e1xuXHRcdFx0XHR0eXBlOiBcIkNvbnNvbGVcIixcblx0XHRcdH0sXG5cdFx0XSxcblx0fSxcblxuXHQvLyAgVHJhY2luZyBzdXBwb3J0IHNldHVwIGFzIG9mIG1vbGVjdWxlciAwLjE0XG5cdHRyYWNpbmc6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZXhwb3J0ZXI6IHtcbiAgICAgICAgICAgIHR5cGU6IFwiSmFlZ2VyXCIsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgLy8gSFRUUCBSZXBvcnRlciBlbmRwb2ludC4gSWYgc2V0LCBIVFRQIFJlcG9ydGVyIHdpbGwgYmUgdXNlZC5cbiAgICAgICAgICAgICAgICBlbmRwb2ludDogbnVsbCxcbiAgICAgICAgICAgICAgICAvLyBVRFAgU2VuZGVyIGhvc3Qgb3B0aW9uLlxuICAgICAgICAgICAgICAgIGhvc3Q6IFwiamFlZ2VyXCIsXG4gICAgICAgICAgICAgICAgLy8gVURQIFNlbmRlciBwb3J0IG9wdGlvbi5cbiAgICAgICAgICAgICAgICBwb3J0OiA2ODMyLFxuICAgICAgICAgICAgICAgIC8vIEphZWdlciBTYW1wbGVyIGNvbmZpZ3VyYXRpb24uXG4gICAgICAgICAgICAgICAgc2FtcGxlcjoge1xuICAgICAgICAgICAgICAgICAgICAvLyBTYW1wbGVyIHR5cGUuIE1vcmUgaW5mbzogaHR0cHM6Ly93d3cuamFlZ2VydHJhY2luZy5pby9kb2NzLzEuMTQvc2FtcGxpbmcvI2NsaWVudC1zYW1wbGluZy1jb25maWd1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiQ29uc3RcIixcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FtcGxlciBzcGVjaWZpYyBvcHRpb25zLlxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gQWRkaXRpb25hbCBvcHRpb25zIGZvciBgSmFlZ2VyLlRyYWNlcmBcbiAgICAgICAgICAgICAgICB0cmFjZXJPcHRpb25zOiB7fSxcbiAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IHRhZ3MuIFRoZXkgd2lsbCBiZSBhZGRlZCBpbnRvIGFsbCBzcGFuIHRhZ3MuXG4gICAgICAgICAgICAgICAgZGVmYXVsdFRhZ3M6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cblx0Ly8gUmVnaXN0ZXIgaW50ZXJuYWwgc2VydmljZXMgKFwiJG5vZGVcIikuIE1vcmUgaW5mbzogaHR0cHM6Ly9tb2xlY3VsZXIuc2VydmljZXMvZG9jcy8wLjEzL3NlcnZpY2VzLmh0bWwjSW50ZXJuYWwtc2VydmljZXNcblx0aW50ZXJuYWxTZXJ2aWNlczogdHJ1ZSxcblx0Ly8gUmVnaXN0ZXIgaW50ZXJuYWwgbWlkZGxld2FyZXMuIE1vcmUgaW5mbzogaHR0cHM6Ly9tb2xlY3VsZXIuc2VydmljZXMvZG9jcy8wLjEzL21pZGRsZXdhcmVzLmh0bWwjSW50ZXJuYWwtbWlkZGxld2FyZXNcblx0aW50ZXJuYWxNaWRkbGV3YXJlczogdHJ1ZSxcblxuXHQvLyBXYXRjaCB0aGUgbG9hZGVkIHNlcnZpY2VzIGFuZCBob3QgcmVsb2FkIGlmIHRoZXkgY2hhbmdlZC4gWW91IGNhbiBhbHNvIGVuYWJsZSBpdCBpbiBNb2xlY3VsZXIgUnVubmVyIHdpdGggYC0taG90YCBhcmd1bWVudFxuXHRob3RSZWxvYWQ6IGZhbHNlLFxuXG5cdC8vIFJlZ2lzdGVyIGN1c3RvbSBtaWRkbGV3YXJlc1xuXHRtaWRkbGV3YXJlczogW10sXG5cblx0Ly8gQ2FsbGVkIGFmdGVyIGJyb2tlciBjcmVhdGVkLlxuXHRjcmVhdGVkKGJyb2tlcikge1xuXG5cdH0sXG5cblx0Ly8gQ2FsbGVkIGFmdGVyIGJyb2tlciBzdGFydGUuXG5cdHN0YXJ0ZWQoYnJva2VyKSB7XG5cblx0fSxcblxuXHQvLyBDYWxsZWQgYWZ0ZXIgYnJva2VyIHN0b3BwZWQuXG5cdHN0b3BwZWQoYnJva2VyKSB7XG5cblx0fSxcblxuXHQvLyBSZWdpc3RlciBjdXN0b20gUkVQTCBjb21tYW5kcy5cblx0cmVwbENvbW1hbmRzOiBudWxsLFxufTtcblxuZXhwb3J0ID0gYnJva2VyQ29uZmlnO1xuIl19