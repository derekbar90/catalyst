---
to: <%=h.changeCase.snakeCase(name)%>/test/unit/<%=h.changeCase.snakeCase(name)%>.spec.ts
---
"use strict";
import { ServiceBroker, Errors, ActionHandler } from "moleculer";
import Test<%=h.changeCase.pascalCase(name)%>Service from "../../services/<%=h.changeCase.snakeCase(name)%>.service";
import brokerConfig from '../../moleculer.config';

jest.mock("@thesatoshicompany/moleculer-keto", () => {
  // Works and lets you check for constructor calls:
  return {
    KetoMiddeware: jest.fn().mockImplementation(({}) => ({
      localAction(next: ActionHandler) {
        return next;
      },
    })),
    IsOwnerMixin: jest.fn().mockImplementation(({}) => ({})),
    ManageKetoPermissionsMiddleware: jest.fn().mockImplementation(({}) => ({
      localAction(next: ActionHandler) {
        return next;
      },
    })),
  };
});

describe("Test '<%=h.changeCase.pascalCase(name)%>' service", () => {
	let broker = new ServiceBroker({
		...brokerConfig,
		tracing: false,
		metrics: false,
		logger: false,
		cacher: null,
		transporter: null
	});
	broker.createService(Test<%=h.changeCase.pascalCase(name)%>Service, {
		name: '<%=h.changeCase.snakeCase(name)%>',
		adapter: null
	});

	beforeAll(async () => await broker.start());
	afterAll(async () => await broker.stop());

	describe("Test '<%=h.changeCase.snakeCase(name)%>.welcome' action", () => {
		// For async tests you should always put the number of assertions that will be taking place. 
		// That way all call backs are tested
		// More info: https://jestjs.io/docs/en/expect#expectassertionsnumber
		expect.assertions(1);
		
		it("should return with 'Welcome'", async () => {
			await expect(broker.call("v1.<%=h.changeCase.snakeCase(name)%>.welcome", { name: "Adam" })).resolves.toBe("Welcome, Adam!");
		});

		it("should reject an ValidationError", async () => {
			await expect(broker.call("v1.<%=h.changeCase.snakeCase(name)%>.welcome")).rejects.toBeInstanceOf(Errors.ValidationError);
		});
	});

});