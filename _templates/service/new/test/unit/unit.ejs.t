---
to: <%=h.changeCase.snakeCase(name)%>/test/unit/<%=h.changeCase.snakeCase(name)%>.spec.ts
---
"use strict";

import { ServiceBroker, Errors } from "moleculer";
import Test<%=h.changeCase.pascalCase(name)%>Service from "../../services/<%=h.changeCase.snakeCase(name)%>.service";
import brokerConfig from '../../moleculer.config';
import { MissingUserContextError, InsufficientPermissionsError } from "../../middleware/perm-middleware";

import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());
const mockedFetch = <jest.Mock<typeof fetch>><unknown>fetch;

describe("Test '<%=h.changeCase.pascalCase(name)%>' service", () => {
	let broker = new ServiceBroker({
		...brokerConfig,
		tracing: false,
		metrics: false,
		logger: false,
		cacher: null,
		transporter: null
	});
	broker.createService(Test<%=h.changeCase.pascalCase(name)%>Service);

	beforeAll(async () => await broker.start());
	afterAll(async () => await broker.stop());

	describe("Test '<%=h.changeCase.snakeCase(name)%>.welcome' action", () => {
		// For async tests you should always put the number of assertions that will be taking place. 
		// That way all call backs are tested
		// More info: https://jestjs.io/docs/en/expect#expectassertionsnumber
		expect.assertions(1);
		
		it("should return with 'Welcome'", async () => {
			await expect(broker.call("<%=h.changeCase.snakeCase(name)%>.welcome", { name: "Adam" })).resolves.toBe("Welcome, Adam!");
		});

		it("should reject an ValidationError", async () => {
			await expect(broker.call("<%=h.changeCase.snakeCase(name)%>.welcome")).rejects.toBeInstanceOf(Errors.ValidationError);
		});
	});
	
	describe("Test '<%=h.changeCase.snakeCase(name)%>.welcomePermissioned' action", () => {
		it("should reject for MissingUserContextError", async () => {
			expect.assertions(1);
			await expect(broker.call("<%=h.changeCase.snakeCase(name)%>.welcomePermissioned", { name: "Adam" })).rejects.toBeInstanceOf(MissingUserContextError);
		});

		it("should reject for InsufficientPermissionsError is access is false", async () => {		
			mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({ allowed: false })));
			expect.assertions(1);
			await expect(broker.call("<%=h.changeCase.snakeCase(name)%>.welcomePermissioned", { name: "Adam" }, {
				meta: {
					user: '',
					roles: ['user']
				}
			})).rejects.toBeInstanceOf(InsufficientPermissionsError);
		});

		it("should return 'Welcome, Adam!'", async () => {		
			mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({ allowed: true })));
			expect.assertions(1);
			await expect(broker.call("<%=h.changeCase.snakeCase(name)%>.welcomePermissioned", { name: "Adam" }, {
				meta: {
					user: '',
					roles: ['user']
				}
			})).resolves.toBe("Welcome, Adam!");
		});

		it("should reject an ValidationError", async () => {
			mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({ allowed: true })));
			expect.assertions(1);
			await expect(broker.call("<%=h.changeCase.snakeCase(name)%>.welcomePermissioned")).rejects.toBeInstanceOf(Errors.ValidationError);
		});
	});

});