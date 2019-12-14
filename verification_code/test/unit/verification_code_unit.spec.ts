"use strict";

import { ServiceBroker, Errors } from "moleculer";
import TestService from "../../services/verification_code.service";
import { dbAdapter } from "../../database/database";
const Sequelize = require("sequelize");
const uuid = require("uuid/v4");

jest.mock("sequelize");
jest.mock("uuid/v4");

const model = {
  sync: jest.fn(() => Promise.resolve()),
  insert: jest.fn((): Promise<{}> | Promise<void> => Promise.resolve()),
  findAll: jest.fn((): Promise<{}> | Promise<void> => Promise.resolve()),
  count: jest.fn(() => Promise.resolve()),
  findOne: jest.fn(() => Promise.resolve()),
  findByPk: jest.fn(() => Promise.resolve()),
  create: jest.fn(() => Promise.resolve()),
  bulkCreate: jest.fn(() => Promise.resolve()),
  update: jest.fn(() => Promise.resolve([1, 2])),
  destroy: jest.fn(() => Promise.resolve()),
  updateById: jest.fn((): Promise<{}> | Promise<void> => Promise.resolve())
};

const db = {
  authenticate: jest.fn(() => Promise.resolve()),
  define: jest.fn(() => model),
  close: jest.fn(() => Promise.resolve())
};

Sequelize.mockImplementation(() => db);
uuid.mockImplementation((): string | null => null);

let fakeConn = Promise.resolve();
//@ts-ignore
fakeConn.connection = {
  on: jest.fn(),
  close: jest.fn()
};

describe("Test 'verification_code' service", () => {
  let broker = new ServiceBroker();
  broker.createService(TestService);

  const userId = "1352061b-1668-4183-93e2-55fc63c6a0f7";
  const type = "USER_ACCOUNT";
  const code = "4cd2dfdc-e4d7-4924-af89-3020b97e27e0";

  beforeAll(async () =>  await broker.start());
  afterAll(async () => await broker.stop());

  beforeEach(async () => {
    await Sequelize.mockClear();
    await db.authenticate.mockClear();
    await db.define.mockClear();
  });

  describe("Test 'verification_code.getCode' action", () => {
    it("should provide code back", async () => {
      model.insert.mockImplementation(() => Promise.resolve());
      uuid.mockImplementation(() => code);

      const params = { userId, type };

      await expect(broker.call("verification_code.getCode", params)).resolves.toBe(
        code
      );
    });
  });

  describe("Test 'verification_code.verifyCode' action", () => {
    const bcryptCode =
      "$2b$10$IW80zUoSFnebb16nm6ZN5.YAIed6puEMk7LvuQgM7VqUMncXELH0a";

    it("should verify correct code", async () => {
      model.updateById.mockImplementation(() => Promise.resolve());
      model.findAll.mockImplementation(() =>
        Promise.resolve([
          {
            id: "c5ae6b95-15e2-40c2-8716-56f2ca22e182",
            code: bcryptCode
          }
        ])
      );
      const params = { userId, type, code };

      await expect(broker.call("verification_code.verifyCode", params)).resolves.toBe(true);
    });

    it("should fail verification for bad code", async () => {
      model.updateById.mockImplementation(() => Promise.resolve());
      model.findAll.mockImplementation(() =>
        Promise.resolve([
          {
            id: "c5ae6b95-15e2-40c2-8716-56f2ca22e182",
            code: bcryptCode
          }
        ])
      );
      const params = {
        userId,
        type,
        code: "21428536-66ae-42e0-98e6-780473a5bc65"
      };

      await expect(broker.call("verification_code.verifyCode", params)).resolves.toBe(false);
	});
	
	it("should fail when code hash is not found", async () => {
		model.updateById.mockImplementation(() => Promise.resolve());
		model.findAll.mockImplementation(() =>
		  Promise.resolve([null])
		);
		const params = {
		  userId,
		  type,
		  code: "21428536-66ae-42e0-98e6-780473a5bc65"
		};
    await expect(broker.call("verification_code.verifyCode", params)).rejects.toThrow('Verification code not found for user and type')
	  });
  });
});
