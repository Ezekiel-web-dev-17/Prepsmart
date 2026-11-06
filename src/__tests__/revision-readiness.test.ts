import { describe, it } from "node:test";
import assert from "node:assert";
import { generateCalculationVariant } from "../lib/revision-generator";

describe("Duolingo-Style Revision & Isomorphic Calculation Variants", () => {
  it("generates isomorphic calculation variants for Logarithms questions", () => {
    const baseLogQuestion = {
      id: "q-log-1",
      subject: "Mathematics",
      topic: "Indices and Logarithms",
      concept: "Logarithmic base powers",
      text: "Evaluate without mathematical tables: $\\log_2 32 + \\log_3 81 - \\log_5 125$.",
      options: [
        { id: "A", text: "4" },
        { id: "B", text: "6" },
        { id: "C", text: "8" },
        { id: "D", text: "10" },
      ],
      correctOption: "B",
      explanation: "Using standard logarithmic base powers.",
      mnemonic: "BASE POWER RULE",
    };

    const variant1 = generateCalculationVariant(baseLogQuestion, 1);
    assert.strictEqual(variant1.isVariant, true);
    assert.strictEqual(variant1.variantIndex, 1);
    assert.ok(variant1.text.includes("\\log_2 64"), "Expected variant calculation numbers");
    assert.strictEqual(variant1.correctOption, "B");
    assert.ok(variant1.explanation.includes("7"), "Expected recalculated explanation");

    const variant2 = generateCalculationVariant(baseLogQuestion, 2);
    assert.strictEqual(variant2.isVariant, true);
    assert.strictEqual(variant2.variantIndex, 2);
    assert.ok(variant2.text.includes("\\log_{10} 20"), "Expected variant 2 calculation numbers");
    assert.strictEqual(variant2.correctOption, "A");
  });

  it("generates isomorphic calculation variants for Kinematics/Projectiles questions", () => {
    const baseKinematics = {
      id: "q-phys-1",
      subject: "Physics",
      topic: "Kinematics and Projectiles",
      concept: "Equations of motion",
      text: "A projectile is launched with an initial velocity of 30 m/s...",
      options: [
        { id: "A", text: "10 m" },
        { id: "B", text: "20 m" },
      ],
      correctOption: "A",
      explanation: "H = u² sin²θ / 2g",
    };

    const variant1 = generateCalculationVariant(baseKinematics, 1);
    assert.strictEqual(variant1.isVariant, true);
    assert.ok(variant1.text.includes("40\\text{ m/s}"));
    assert.ok(variant1.diagramSvg?.includes("<svg"), "Expected embedded vector SVG diagram");

    const variant2 = generateCalculationVariant(baseKinematics, 2);
    assert.strictEqual(variant2.isVariant, true);
    assert.strictEqual(variant2.correctOption, "B");
    assert.ok(variant2.mnemonic?.includes("FORTY-FIVE"));
  });

  it("generates isomorphic calculation variants for Economics Demand & Supply equilibrium", () => {
    const baseEcon = {
      id: "q-econ-1",
      subject: "Economics",
      topic: "Demand and Supply",
      concept: "Market equilibrium",
      text: "Given demand and supply functions...",
      options: [{ id: "A", text: "₦8" }],
      correctOption: "A",
      explanation: "Qd = Qs",
    };

    const variant1 = generateCalculationVariant(baseEcon, 1);
    assert.strictEqual(variant1.isVariant, true);
    assert.ok(variant1.text.includes("Q_d = 50 - 3P"));
    assert.strictEqual(variant1.correctOption, "A");
  });
});
