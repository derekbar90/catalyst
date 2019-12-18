"use strict";

import { ServiceBroker } from "moleculer";
import TestService from "../../services/verification_code.service";
const uuid = require("uuid/v4");

jest.mock("uuid/v4");

uuid.mockImplementation((): string | null => null);

describe("Test 'verification_code' service", () => {
  const userId = "1352061b-1668-4183-93e2-55fc63c6a0f7";
  const type = "USER_ACCOUNT";
  const code = "4cd2dfdc-e4d7-4924-af89-3020b97e27e0";
  const code2 = "6cd2dfdc-e4d7-4924-af89-3020b97e27e2";
  const badCode = "1cd2dfdc-e4d7-4924-af89-3020b97e27e1";

  describe("Test 'verification_code.getCode' action", () => {
    let broker = new ServiceBroker();
    broker.createService(TestService, {
      name: "verification_code",
      adapter: null //fallover to the memory adapter instead of postgres
    });

    beforeAll(async () => {
      await broker.start();
    });

    afterAll(async () => {
      await broker.stop();
    });

    test("should provide code back", async () => {
      uuid.mockImplementation(() => code);

      const params = { userId, type };

      await expect(
        broker.call("verification_code.getCode", params)
      ).resolves.toBe(code);
    });
  });

  describe("Test 'verification_code.verifyCode' action with 1 code request", () => {
    let broker = new ServiceBroker();
    broker.createService(TestService, {
      name: "verification_code",
      adapter: null //fallover to the memory adapter instead of postgres
    });

    beforeAll(async () => {
      await broker.start();
    });

    afterAll(async () => {
      await broker.stop();
    });

    const bcryptCode =
      "$2b$10$IW80zUoSFnebb16nm6ZN5.YAIed6puEMk7LvuQgM7VqUMncXELH0a";

    test("should provide code back", async () => {
      uuid.mockImplementation(() => code);

      const params = { userId, type };

      await expect(
        broker.call("verification_code.getCode", params)
      ).resolves.toBe(code);
    });

    test("should verify correct code", async () => {
      const params = { userId, type, code };
      await expect(
        broker.call("verification_code.verifyCode", params)
      ).resolves.toBe(true);
    });

    test("should fail verification for bad code", async () => {
      const params = {
        userId,
        type,
        code: "21428536-66ae-42e0-98e6-780473a5bc65"
      };
      await expect(
        broker.call("verification_code.verifyCode", params)
      ).resolves.toBe(false);
    });
  });
  
  describe("Test 'verification_code.verifyCode' action with 2 code requests", () => {
    let broker = new ServiceBroker();
    broker.createService(TestService, {
      name: "verification_code",
      adapter: null //fallover to the memory adapter instead of postgres
    });

    beforeAll(async () => {
      await broker.start();
    });

    afterAll(async () => {
      await broker.stop();
    });

    const bcryptCode =
      "$2b$10$IW80zUoSFnebb16nm6ZN5.YAIed6puEMk7LvuQgM7VqUMncXELH0a";

    test("should provide code back", async () => {
      uuid.mockImplementation(() => code);

      const params = { userId, type };

      await expect(
        broker.call("verification_code.getCode", params)
      ).resolves.toBe(code);
    });

    test("should provide 2nd code back", async () => {
      uuid.mockImplementation(() => code2);

      const params = { userId, type };

      await expect(
        broker.call("verification_code.getCode", params)
      ).resolves.toBe(code2);
    });

    test("should verify correct code", async () => {
      const params = { userId, type, code };
      await expect(
        broker.call("verification_code.verifyCode", params)
      ).resolves.toBe(true);
    });

    test("should pass verification for code", async () => {
      const params = {
        userId,
        type,
        code
      };
      await expect(
        broker.call("verification_code.verifyCode", params)
      ).resolves.toBe(true);
    });
  });
  
  describe("Test 'verification_code.getCode' action failure when no code is present", () => {
    let broker = new ServiceBroker();
    broker.createService(TestService, {
      name: "verification_code",
      adapter: null //fallover to the memory adapter instead of postgres
    });

    beforeAll(async () => {
      await broker.start();
    });

    afterAll(async () => {
      await broker.stop();
    });

    test("should fail when code hash is not found", async () => {
      const params = {
        userId,
        type,
        code: "21428536-66ae-42e0-98e6-780473a5bc65"
      };
      await expect(
        broker.call("verification_code.verifyCode", params)
      ).rejects.toThrow("Verification code not found for user and type");
    });
  });
});
