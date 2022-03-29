const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: responds with an array of all topics", async () => {
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

describe("GET /api/articles/:article_id", () => {
  test("200: responds with a single article when given a single article_id", async () => {
    const article_id = 1;
    const res = await request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200);
    expect(res.body.article).toEqual({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
    });
    expect(res.body.article).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
    });
  });
  test("404: shows correct error status code and message when given an invalid article_id", async () => {
    const res = await request(app).get("/api/articles/9999").expect(404);
    expect(res.body.message).toBe("Invalid article ID");
  });
  test("400: shows correct error status code and message when given an invalid article_id data type", async () => {
    const res = await request(app)
      .get("/api/articles/invalid_data_type")
      .expect(400);
    expect(res.body.message).toBe("Bad request");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with a the correct incremented votes key", async () => {
    const article_id = 1;
    const res = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: 1 })
      .expect(200);
    expect(res.body.article).toEqual({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 101,
    });
    expect(res.body.article).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
    });
  });
  test("200: responds with a the correct decremented votes key", async () => {
    const article_id = 1;
    const res = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: -1 })
      .expect(200);
    expect(res.body.article).toEqual({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 99,
    });
    expect(res.body.article).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
    });
  });
  test("404: shows correct error status code and message when given an invalid article_id", async () => {
    const article_id = 999;
    const res = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: 1 })
      .expect(404);
    expect(res.body.message).toBe("Invalid article ID");
  });
  test("400: shows correct error status code and message when given an invalid article_id data type", async () => {
    const article_id = "invalid data type";
    const res = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: 1 })
      .expect(400);
    expect(res.body.message).toBe("Bad request");
  });
  test("400: shows correct error status code and message when given an invalid '.send' data type", async () => {
    const article_id = 1;
    const res = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: "invalid data type" })
      .expect(400);
    expect(res.body.message).toBe("Bad request");
  });
});
