import request from "supertest";
import { expect } from "chai";
import app from "../index.js";

describe("GET /", function () {
  it("responds with directory contents", function (done) {
    request(app)
      .get("/?path=/")
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("responds with 404 for non-existent path", function (done) {
    request(app)
      .get("/?path=/non-existent-directory")
      .expect(404)
      .expect("Content-Type", /json/)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.have.property("error");
        done();
      });
  });
});
