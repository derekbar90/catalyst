---
to: <%=h.changeCase.snakeCase(name)%>/middleware/perm-middleware.ts
---
import { Context, Errors, ActionHandler, ActionParams } from "moleculer";
import fetch from "node-fetch";

export type OryAccessControlPolicyAllowedInput = {
  action: string;
  context?: { [key: string]: any };
  resource: string;
  subject: string;
};

type PermissionsMiddlewareOptions = {
  prefix: string;
  ketoEndpoint: string;
  hasAccessEndpointsConfig?: {
    blob: (
      options: OryAccessControlPolicyAllowedInput
    ) => Promise<{ allowed: boolean }>;
    regex: (
      options: OryAccessControlPolicyAllowedInput
    ) => Promise<{ allowed: boolean }>;
    exact: (
      options: OryAccessControlPolicyAllowedInput
    ) => Promise<{ allowed: boolean }>;
  };
};

type PermissionConfig = {
  subject: string;
  action: string;
  flavor: string;
};

export const PermissionsMiddleware = (
  options: PermissionsMiddlewareOptions
) => ({
  // For more info on this wrapper: https://moleculer.services/docs/0.14/middlewares.html#localAction-next-action
  localAction(next: ActionHandler, action: ActionParams & { name: string }) {
    // Helper function which will call the isEntityOwner
    const isEntityOwner = async (ctx: Context): Promise<boolean> => {
      if (typeof ctx.service.isEntityOwner === "function") {
        return false;
        return ctx.service.isEntityOwner.call(this, ctx);
      } else {
        throw new Errors.MoleculerServerError(
          "You are missing the isEntityOwner action on this service",
          500,
          "ERR_ACCESS_CTRL_OWNER_HANDLER_MISSING",
          { action: action.name }
        );
      }
    };

    // If this feature enabled
    if (action.permissions) {
      const actionPermissions: PermissionConfig[] = [];

      // permFuncs will hold async permissions which
      // will be executed per call to the ACL service.
      const permFuncs: ((ctx: Context) => Promise<boolean>)[] = [];

      // Check if permissions are in an array and if not, put them in one for parsing
      const permissions: PermissionConfig[] = Array.isArray(action.permissions)
        ? action.permissions
        : [action.permissions];

      // Here we sort the permissions
      // We will also execute the $owner
      for (const permission of permissions) {
        if (typeof permission === "function") {
          return permFuncs.push(permission);
        }

        if (typeof permission === "object") {
          if (permission.subject === "$owner") {
            // Check if user is owner of the entity
            return permFuncs.push(isEntityOwner);
          }
          // Add role or permission name
          actionPermissions.push(permission);
        }
      }

      return async (
        ctx: Context<
          {},
          { roles: string[]; user: { [key: string]: any } } & ActionParams
        >
      ) => {
        const user = ctx.meta.user;
        if (user == undefined || user == null) {
          throw new Errors.MoleculerClientError(
            "You have not provided the appropriate access token for this resource.",
            401,
            "ERR_HAS_NO_ACCESS",
            { action: action.name }
          );
        }
        const roles = ctx.meta.roles;
        if (roles) {
          let res = false;

          if (actionPermissions.length > 0) {
            let allowed = false;
            for (const perm of actionPermissions) {
              const body: OryAccessControlPolicyAllowedInput = {
                action: `actions:${options.prefix}:${perm.action}`,
                subject: `subjects:${options.prefix}:${user.id}`,
                resource: `resources:${options.prefix}:${action.name}`
              };
              const ketoResponse = await fetch(
                `${options.ketoEndpoint}/engines/acp/ory/${[
                  perm.flavor
                ]}/allowed`,
                {
                  method: "post",
                  body: JSON.stringify(body),
                  headers: { "Content-Type": "application/json" }
                }
              );
              const isPermissionAllowed = await ketoResponse.json();

              if (isPermissionAllowed.allowed) {
                allowed = true;
              }
            }

            res = allowed;
          }

          if (res !== true) {
            if (permFuncs.length > 0) {
              // PromiseConstructorLike does not contain all method but the actual Promise does
              //@ts-ignore
              const results = await ctx.broker.Promise.all(
                permFuncs.map(async fn => fn.call(this, ctx))
              );
              res = results.find((r: boolean) => !!r);
            }

            if (res !== true) {
              throw new Errors.MoleculerClientError(
                "This account does not have enough permissions for this action.",
                401,
                "ERR_HAS_NO_PERMISSIONS",
                { action: action.name }
              );
            }
          }
        }

        // Call the handler
        return next(ctx);
      };
    }

    // Return original handler, because feature is disabled
    return next;
  }
});
