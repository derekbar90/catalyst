"use strict";

import TestService from "../../services/api.service";

describe("Test 'api' service", () => {	
	const service = TestService;
	
	// Change broker settings if we are running the service and having the tests run as well
	service.settings.port = 3010;

	describe("Test 'api.renderPage' method", () => {

		it("should return consent page", async () => {
			const params = {
				client: {
					logo_uri: 'http://google.com'
				},
				requested_scope: ['offline']
			};
			const renderPage = service.methods.renderPage('consent', params)
			expect(renderPage).toMatch(/html/);
		});

		it("should return error page", async () => {
			const params = {
				error: {
					status: 'bad',
					stack: 'worse'
				}
			};
			const renderPage = service.methods.renderPage('error', params)
			expect(renderPage).toMatch(/html/);
		});

		it("should return index page", async () => {
			const params = {};
			const renderPage = service.methods.renderPage('index', params)
			expect(renderPage).toMatch(/html/);
		});

		it("should return layout page", async () => {
			const params = {};
			const renderPage = service.methods.renderPage('layout', params)
			expect(renderPage).toMatch(/html/);
		});
		
		it("should return login page", async () => {
			const params = {};
			const renderPage = service.methods.renderPage('login', params)
			expect(renderPage).toMatch(/html/);
		});
		
		it("should return logout page", async () => {
			const params = {};
			const renderPage = service.methods.renderPage('logout', params)
			expect(renderPage).toMatch(/html/);
		});

	});

});

