const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe.only("/api/treasures", () => {
  test("200: responds with an empty ", async () => {
    const res = await request(app).get("/api/topics").expect(200);
    expect(res.body.topics).toBeInstanceOf(Array);
    expect(res.body.topics.length).toBe(3);
    res.body.topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
  test("404: returns error when given invalid path", async () => {
    const res = await request(app).get("/api/invalid_path").expect(404);
    expect(res.body.message).toBe("Route not found");
  });
});
