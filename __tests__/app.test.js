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
      comment_count: 11,
    });
    expect(res.body.article).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      comment_count: expect.any(Number),
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

describe("GET /api/users", () => {
  test("200: responds with an array of all users", async () => {
    const res = await request(app).get("/api/users").expect(200);
    expect(res.body.users).toBeInstanceOf(Array);
    expect(res.body.users.length).toBe(4);
    res.body.users.forEach((topic) => {
      expect(topic).toMatchObject({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
  });
  test("404: returns error when given invalid path", async () => {
    const res = await request(app).get("/api/invalid_path").expect(404);
    expect(res.body.message).toBe("Route not found");
  });
});

describe("GET /api/articles/:article_id (plus comment_count)", () => {
  test("200: responds with an article with the correct additional key of comment_count", async () => {
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
      comment_count: 11,
    });
    expect(res.body.article).toMatchObject({
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      body: expect.any(String),
      topic: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      comment_count: expect.any(Number),
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of the article_id's comments", async () => {
    const article_id = 1;
    const res = await request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200);
    res.body.comments.forEach((comment) => {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
      });
    });
  });
  test("404: shows correct error status code and message when given valid 'id type' that does not exist in database", async () => {
    const res = await request(app)
      .get("/api/articles/9999/comments")
      .expect(404);
    expect(res.body.message).toBe("Article ID's comments not found");
  });
  test("400: shows correct error status code and message when given an invalid article_id data type", async () => {
    const res = await request(app)
      .get("/api/articles/invalid_data_type/comments")
      .expect(400);
    expect(res.body.message).toBe("Bad request");
  });
  test("404: responds with correct error message when article_id has no comments", async () => {
    const res = await request(app).get("/api/articles/2/comments").expect(404);
    expect(res.body.message).toBe("Article ID's comments not found");
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of all articles (including comment_count)", async () => {
    const res = await request(app).get("/api/articles").expect(200);
    expect(res.body.articles).toBeInstanceOf(Array);
    expect(res.body.articles.length).toBe(12);
    res.body.articles.forEach((article) => {
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        author: expect.any(String),
        title: expect.any(String),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      });
    });
  });
  test("404: returns error when given invalid path", async () => {
    const res = await request(app).get("/api/invalid_path").expect(404);
    expect(res.body.message).toBe("Route not found");
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  const newComment = {
    username: "rogersop",
    body: "A very nice and lovely comment!",
  };

  test("status:201, responds with park newly added to the database", async () => {
    const article_id = 1;
    const { body } = await request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201);
    expect(body.comment).toEqual({
      comment_id: 19,
      article_id: 1,
      author: "rogersop",
      body: "A very nice and lovely comment!",
      votes: 0,
      created_at: expect.any(String),
    });
  });
  test("404: shows correct error status code and message when given valid 'id type' that does not exist in database", async () => {
    const article_id = 9999;
    const { body } = await request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404);
    expect(body.message).toBe("Article ID's comments not found");
  });
  test("400: shows correct error status code and message when given an invalid article_id data type", async () => {
    const { body } = await request(app)
      .post("/api/articles/invalid_data_type/comments")
      .send(newComment)
      .expect(400);
    expect(body.message).toBe("Bad request");
  });
  test("400: responds with correct error message when article_id has no comments", async () => {
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send({
        invalid_key: "rogersop",
        body: "A very nice and lovely comment!",
      })
      .expect(400);
    expect(body.message).toBe("Bad request - invalid key name");
  });
  test("400: responds with correct error message when username is not in databases", async () => {
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "IsaakJG",
        body: "A very nice and lovely comment!",
      })
      .expect(400);
    expect(body.message).toBe("Bad request - username does not exist");
  });
});
