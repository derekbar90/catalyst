---
to: <%=h.changeCase.snakeCase(name)%>/test/unit/<%=h.changeCase.snakeCase(name)%>.spec.ts
---

"use strict";

import { ServiceBroker, Errors } from "moleculer";
import TestService from "../../services/<%=h.changeCase.snakeCase(name)%>.service";

describe("Test '<%=h.changeCase.snakeCase(name)%>' service", () => {
	let broker = new ServiceBroker();
	broker.createService(TestService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test '<%=h.changeCase.snakeCase(name)%>.welcome' action", () => {

		it("should return with 'Welcome'", () => {
			expect(broker.call("greeter.welcome", { name: "Adam" })).resolves.toBe("Welcome, Adam");
		});

		it("should reject an ValidationError", () => {
			expect(broker.call("greeter.welcome")).rejects.toBeInstanceOf(Errors.ValidationError);
		});

	});

});