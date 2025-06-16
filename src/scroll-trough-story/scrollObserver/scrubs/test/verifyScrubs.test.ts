import {
  composedByTwoWords,
  compsedByCorrectWords,
  verifyScrub,
  verifyScrubs,
} from "../verifyScrubs";
import { describe, expect, it } from "vitest";

describe("verifyScrubs functions", () => {
  it("should return false if scrub doesn't recieve two words", () => {
    expect(composedByTwoWords("toptop")).toBe(false);
    expect(composedByTwoWords("")).toBe(false);
  });

  it("should return true if scrub is composed by two words", () => {
    expect(composedByTwoWords("top bottom")).toBe(true);
  });

  it("should return false if scrub is composed by unauthorized words", () => {
    expect(compsedByCorrectWords("hello bottom")).toBe(false);
    expect(compsedByCorrectWords("hello world")).toBe(false);
  });

  it("should return true if scrub is composed by unauthorized words", () => {
    expect(compsedByCorrectWords("top top")).toBe(true);
    expect(compsedByCorrectWords("top bottom")).toBe(true);
    expect(compsedByCorrectWords("bottom bottom")).toBe(true);
  });

  it("should return false if scrub is not composed by two words", () => {
    expect(verifyScrub("HelloWorld")).toBe(false);
    expect(verifyScrub("")).toBe(false);
  });

  it("should return false if scrub is not composed by two words, but not the right ones", () => {
    expect(verifyScrub("Hello World")).toBe(false);
    expect(verifyScrub("Top Bttom")).toBe(false);
  });

  it("should return false if scrub is not composed by authorized words", () => {
    expect(verifyScrub("hello World")).toBe(false);
    expect(verifyScrub("")).toBe(false);
  });

  it("should return true if scrub is composed by authorized words & two words", () => {
    expect(verifyScrub("Top bottom")).toBe(true);
    expect(verifyScrub("bottom bottom")).toBe(true);
  });

  it("should return false if both scrubs are false", () => {
    expect(verifyScrubs("hello world", "Hello World")).toBe(false);
    expect(verifyScrubs("top tOp", "bttm bottom")).toBe(false);
  });

  it("should return true if both scrubs are false", () => {
    expect(verifyScrubs("top top", "Bottom Bottom")).toBe(true);
  });
});
