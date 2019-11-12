
"use strict";

import { ServiceBroker, Errors } from "moleculer";
import TestService from "../../services/email.service";

describe("Test 'email' service", () => {
	let broker = new ServiceBroker();
	broker.createService(TestService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'email.welcome' action", () => {

		it("should return with 'Welcome'", () => {
			expect(broker.call("greeter.welcome", { name: "Adam" })).resolves.toBe("Welcome, Adam");
		});

		it("should reject an ValidationError", () => {
			expect(broker.call("greeter.welcome")).rejects.toBeInstanceOf(Errors.ValidationError);
		});

	});

});