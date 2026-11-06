import { getSubjectCurriculum, SubjectCurriculum } from "@/app/study/curriculum-data";

export interface RoadmapTopicNode {
  id: string; // unique slug e.g. "math-indices-logarithms"
  subject: string; // e.g. "mathematics"
  stream: "science" | "commercial" | "arts";
  stage: number; // 1, 2, 3, 4
  stageTitle: string;
  order: number;
  title: string;
  subtitle: string;
  highYield?: boolean;
  examinerTrap?: boolean;
  trapAlert?: string;
  syllabusOutlines: string[];
  conceptDeepDive: string;
  textbookAdvice: Array<{
    textbook: string;
    chapters: string;
    focusNote: string;
  }>;
  keyFormulasOrRules: string[];
  sampleMnemonics?: string[];
  drillTopic: string;
  prerequisites: string[];
  nextTopics: string[];
}

export interface RoadmapStage {
  stage: number;
  title: string;
  description: string;
  topics: RoadmapTopicNode[];
}

export interface SubjectRoadmap {
  id: string; // subject slug e.g. "mathematics"
  name: string; // "Mathematics"
  code: string; // "MTH"
  stream: "science" | "commercial" | "arts";
  iconName: string;
  totalTopics: number;
  highYieldCount: number;
  description: string;
  stages: RoadmapStage[];
}

// =========================================================================
// ROADMAP CURRICULUM DEFINITIONS ACROSS DEPARTMENTS & SUBJECTS
// =========================================================================

export const SCIENCE_MATHEMATICS_ROADMAP: SubjectRoadmap = {
  id: "mathematics",
  name: "Mathematics",
  code: "MTH",
  stream: "science",
  iconName: "calculator",
  totalTopics: 10,
  highYieldCount: 6,
  description: "Master foundational number theory, algebraic structures, calculus, and coordinate geometry.",
  stages: [
    {
      stage: 1,
      title: "Stage 1: Foundations & Number Systems",
      description: "Core manipulative fluency required for 80% of subsequent UTME calculations.",
      topics: [
        {
          id: "math-indices-logarithms",
          subject: "mathematics",
          stream: "science",
          stage: 1,
          stageTitle: "Stage 1: Foundations",
          order: 1,
          title: "Indices, Logarithms & Surds",
          subtitle: "Exponent laws, irrational numbers, conjugate rationalization, and logarithmic conversions.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "JAMB frequently sets exponential equations that simplify into hidden quadratics (e.g. 2^(2x) - 5(2^x) + 4 = 0). Do not confuse log(A + B) with log(A) + log(B)!",
          syllabusOutlines: [
            "Apply the elementary laws of indices to simplify complex exponential expressions.",
            "Solve logarithmic equations in various bases using change of base: log_b(a) = log_c(a) / log_c(b).",
            "Simplify surds and rationalize denominators involving binomial irrational conjugates (a ± √b).",
            "Relate logarithms to characteristics and mantissa without tables.",
          ],
          conceptDeepDive:
            "Logarithms are the inverses of exponential operations. When multiplying numbers with identical bases, you add exponents; in logarithms, the log of a product is the sum of the logs. Surds represent exact root values that cannot be expressed as terminating decimals. To eliminate a square root from a denominator, multiply both numerator and denominator by its conjugate so that (x - √y)(x + √y) = x² - y.",
          textbookAdvice: [
            {
              textbook: "Essential Mathematics for Senior Secondary Schools by A.J.S. Oluwasanmi",
              chapters: "Chapter 1 (Indices & Surds) & Chapter 2 (Logarithms)",
              focusNote: "Practice exercises 1c and 2d specifically on hidden quadratic substitutions.",
            },
            {
              textbook: "New General Mathematics for SS3 by M.F. Macrae et al.",
              chapters: "Chapter 4: Laws of Logarithms",
              focusNote: "Review change-of-base derivations and practical word problems.",
            },
          ],
          keyFormulasOrRules: [
            "a^m × a^n = a^(m+n)",
            "log_b(xy) = log_b(x) + log_b(y)",
            "log_b(x/y) = log_b(x) - log_b(y)",
            "log_b(x^k) = k · log_b(x)",
            "(a - √b)(a + √b) = a² - b",
          ],
          sampleMnemonics: [
            "L-P-P (Log Product Plus): The Log of a Product is the Plus of their logs.",
            "CONJUGATE FLIP: Flip the middle operator sign (+ to -) to vaporize square roots.",
          ],
          drillTopic: "Indices and Logarithms",
          prerequisites: [],
          nextTopics: ["math-sets-relations", "math-polynomials-algebra"],
        },
        {
          id: "math-sets-relations",
          subject: "mathematics",
          stream: "science",
          stage: 1,
          stageTitle: "Stage 1: Foundations",
          order: 2,
          title: "Sets, Venn Diagrams & Binary Operations",
          subtitle: "Set operations, cardinality of two/three sets, identity elements, and inverses.",
          highYield: true,
          examinerTrap: false,
          syllabusOutlines: [
            "Perform set operations: union, intersection, complement, symmetric difference.",
            "Solve 2-set and 3-set inclusion-exclusion problems with Venn diagrams.",
            "Test closure, commutativity, associativity, and distributivity of binary operations.",
            "Find the identity element 'e' such that a * e = a and solve for inverses: a * a⁻¹ = e.",
          ],
          conceptDeepDive:
            "Set theory establishes logical collections. In 3-set Venn diagram questions, always start filling values from the innermost region (the intersection of all three sets, x ∩ y ∩ z) and work outwards to prevent double-counting. For binary operations, an identity element e is unique; once found, each element's inverse solves the equation a * b = e.",
          textbookAdvice: [
            {
              textbook: "Essential Mathematics by A.J.S. Oluwasanmi",
              chapters: "Chapter 3: Set Theory and Venn Diagrams",
              focusNote: "Focus on 3-circle word problems with candidates offering multiple subjects.",
            },
          ],
          keyFormulasOrRules: [
            "n(A ∪ B) = n(A) + n(B) - n(A ∩ B)",
            "n(A ∪ B ∪ C) = n(A) + n(B) + n(C) - n(A∩B) - n(B∩C) - n(A∩C) + n(A∩B∩C)",
            "Identity: a * e = a",
            "Inverse: a * a⁻¹ = e",
          ],
          sampleMnemonics: [
            "IN-TO-OUT: On 3-circle Venn diagrams, always populate the exact center first!",
          ],
          drillTopic: "Sets and Binary Operations",
          prerequisites: [],
          nextTopics: ["math-polynomials-algebra"],
        },
      ],
    },
    {
      stage: 2,
      title: "Stage 2: Core Algebraic & Functional Analysis",
      description: "Polynomial manipulation, quadratic graphs, progressions, and linear inequalities.",
      topics: [
        {
          id: "math-polynomials-algebra",
          subject: "mathematics",
          stream: "science",
          stage: 2,
          stageTitle: "Stage 2: Core Algebra",
          order: 3,
          title: "Polynomials, Roots & Factor Theorems",
          subtitle: "Remainder theorem, synthetic division, roots of quadratics (α, β), and partial fractions.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "If (x - a) divides f(x), then f(a) = 0. Watch out for signs when dividing by (2x + 1) — the root tested is x = -1/2, not +1/2!",
          syllabusOutlines: [
            "Apply the Remainder and Factor Theorems to solve cubic and quartic equations.",
            "Form quadratic equations given the sum (α + β = -b/a) and product (αβ = c/a) of roots.",
            "Decompose rational algebraic fractions into partial fractions with linear and repeated factors.",
          ],
          conceptDeepDive:
            "A polynomial f(x) divided by (x - c) produces a remainder equal to f(c). If f(c) = 0, (x - c) is an exact factor. Quadratic roots α and β satisfy the equation x² - (α + β)x + αβ = 0. Common symmetric expressions include α² + β² = (α + β)² - 2αβ.",
          textbookAdvice: [
            {
              textbook: "Essential Mathematics by A.J.S. Oluwasanmi",
              chapters: "Chapter 5 (Quadratic Equations) & Chapter 7 (Polynomials)",
              focusNote: "Practice finding α³ + β³ = (α + β)³ - 3αβ(α + β).",
            },
          ],
          keyFormulasOrRules: [
            "f(x) = (x - c)Q(x) + R => R = f(c)",
            "Sum of roots: α + β = -b/a",
            "Product of roots: αβ = c/a",
            "α² + β² = (α + β)² - 2αβ",
          ],
          sampleMnemonics: [
            "SUM IS MINUS B OVER A: Negative sign belongs to the linear term coefficient.",
          ],
          drillTopic: "Polynomials",
          prerequisites: ["math-indices-logarithms", "math-sets-relations"],
          nextTopics: ["math-progressions-series"],
        },
        {
          id: "math-progressions-series",
          subject: "mathematics",
          stream: "science",
          stage: 2,
          stageTitle: "Stage 2: Core Algebra",
          order: 4,
          title: "Progressions (AP, GP) & Series",
          subtitle: "Arithmetic & geometric progressions, sum to infinity, arithmetic/geometric means.",
          highYield: true,
          examinerTrap: false,
          syllabusOutlines: [
            "Determine the nth term and sum of n terms of an Arithmetic Progression (AP).",
            "Determine the nth term and sum of n terms of a Geometric Progression (GP).",
            "Calculate the sum to infinity of a convergent GP: S_∞ = a / (1 - r) when |r| < 1.",
          ],
          conceptDeepDive:
            "In an AP, consecutive terms have a constant difference (d = T_n - T_(n-1)). In a GP, consecutive terms share a common ratio (r = T_n / T_(n-1)). If |r| < 1, the terms diminish toward zero and the total sum approaches a finite limit: S_∞ = a / (1 - r).",
          textbookAdvice: [
            {
              textbook: "New General Mathematics SS3 by M.F. Macrae",
              chapters: "Chapter 6: Sequences and Series",
              focusNote: "Work through word problems involving salary increments and bouncing ball physics.",
            },
          ],
          keyFormulasOrRules: [
            "AP nth term: T_n = a + (n - 1)d",
            "AP Sum: S_n = n/2 [2a + (n - 1)d]",
            "GP nth term: T_n = a · r^(n - 1)",
            "GP Sum: S_n = a(1 - r^n)/(1 - r) for r < 1",
            "Sum to Infinity: S_∞ = a / (1 - r), where |r| < 1",
          ],
          sampleMnemonics: [
            "A-P PLUS, G-P TIMES: Arithmetic adds d, Geometric multiplies r.",
          ],
          drillTopic: "Sequences and Series",
          prerequisites: ["math-polynomials-algebra"],
          nextTopics: ["math-calculus-differentiation"],
        },
      ],
    },
    {
      stage: 3,
      title: "Stage 3: Advanced Calculus & Trigonometry",
      description: "Limits, differential calculus, integral calculus, and trigonometric identities.",
      topics: [
        {
          id: "math-calculus-differentiation",
          subject: "mathematics",
          stream: "science",
          stage: 3,
          stageTitle: "Stage 3: Advanced Calculus",
          order: 5,
          title: "Differential Calculus & Applications",
          subtitle: "Power rule, product rule, quotient rule, chain rule, and turning points (maxima/minima).",
          highYield: true,
          examinerTrap: true,
          trapAlert: "At turning points, dy/dx = 0. To determine maximum vs minimum: d²y/dx² < 0 indicates a MAXIMUM, whereas d²y/dx² > 0 indicates a MINIMUM. Students constantly invert this!",
          syllabusOutlines: [
            "Differentiate algebraic, trigonometric, exponential, and logarithmic functions from first principles and rules.",
            "Apply Chain Rule dy/dx = (dy/du)(du/dx), Product Rule, and Quotient Rule: (v u' - u v') / v².",
            "Locate stationary points and classify as local maxima, minima, or points of inflexion.",
            "Solve rate of change and kinematics problems (velocity v = ds/dt, acceleration a = dv/dt).",
          ],
          conceptDeepDive:
            "Differentiation measures instantaneous rate of change. Geometrically, dy/dx represents the slope of the tangent line to the curve y = f(x) at any point. When a projectile reaches its peak height, its vertical velocity is zero (dy/dt = 0). When a firm maximizes profit, marginal profit is zero.",
          textbookAdvice: [
            {
              textbook: "Essential Mathematics by A.J.S. Oluwasanmi",
              chapters: "Chapter 14: Differentiation and Applications",
              focusNote: "Practice quotient rule problems with polynomial denominators.",
            },
            {
              textbook: "Additional Mathematics for West Africa by Talbert, Godman & Ogum",
              chapters: "Chapter 9: The Calculus",
              focusNote: "Excellent diagrams explaining maximum/minimum curvatures.",
            },
          ],
          keyFormulasOrRules: [
            "Power Rule: d/dx(x^n) = n · x^(n-1)",
            "Product Rule: (uv)' = u'v + uv'",
            "Quotient Rule: (u/v)' = (v u' - u v') / v²",
            "Chain Rule: dy/dx = (dy/du) · (du/dx)",
            "Turning point: dy/dx = 0 (Max if d²y/dx² < 0, Min if d²y/dx² > 0)",
          ],
          sampleMnemonics: [
            "LOW D-HIGH MINUS HIGH D-LOW OVER SQUARE OF WHAT'S BELOW: Quotient rule memorization chant.",
            "HAPPY SMILE = MINIMUM: A positive second derivative (+ smile) dips to a minimum.",
          ],
          drillTopic: "Calculus",
          prerequisites: ["math-progressions-series"],
          nextTopics: ["math-calculus-integration"],
        },
        {
          id: "math-calculus-integration",
          subject: "mathematics",
          stream: "science",
          stage: 3,
          stageTitle: "Stage 3: Advanced Calculus",
          order: 6,
          title: "Integral Calculus & Definite Integrals",
          subtitle: "Anti-differentiation, definite integrals, area under curves, and volume of revolution.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Never forget the constant of integration (+ C) for indefinite integrals! For definite integrals ∫[a,b] f(x)dx, evaluate F(b) - F(a).",
          syllabusOutlines: [
            "Integrate polynomial and basic trigonometric functions using standard formulas.",
            "Evaluate definite integrals between boundaries [a, b].",
            "Calculate the area bounded by a curve, the x-axis, and vertical lines x = a and x = b.",
          ],
          conceptDeepDive:
            "Integration is the reverse process of differentiation. The definite integral ∫[a,b] f(x)dx sums an infinite number of infinitesimal rectangular strips of width dx and height f(x), yielding the exact area under the curve between x = a and x = b.",
          textbookAdvice: [
            {
              textbook: "Essential Mathematics by A.J.S. Oluwasanmi",
              chapters: "Chapter 15: Integration and Area under Curve",
              focusNote: "Practice solving definite integrals with negative boundaries.",
            },
          ],
          keyFormulasOrRules: [
            "∫ x^n dx = [x^(n+1) / (n+1)] + C  (for n ≠ -1)",
            "∫ 1/x dx = ln|x| + C",
            "∫[a,b] f(x)dx = F(b) - F(a)",
            "Area = ∫[a,b] y dx",
          ],
          sampleMnemonics: [
            "ADD ONE, DIVIDE BY NEW: In integration, add 1 to exponent and divide by the new power.",
          ],
          drillTopic: "Calculus",
          prerequisites: ["math-calculus-differentiation"],
          nextTopics: ["math-vectors-matrices"],
        },
      ],
    },
    {
      stage: 4,
      title: "Stage 4: Coordinate Geometry, Vectors & Statistics",
      description: "Straight line equations, circles, matrix determinants, vectors, and probability.",
      topics: [
        {
          id: "math-coordinate-geometry",
          subject: "mathematics",
          stream: "science",
          stage: 4,
          stageTitle: "Stage 4: Geometry & Vectors",
          order: 7,
          title: "Coordinate Geometry of Straight Lines & Circles",
          subtitle: "Gradient, distance, midpoint, parallel/perpendicular lines, and standard circle equations.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Two lines are perpendicular if and only if m₁ · m₂ = -1 (m₂ = -1/m₁). For circle x² + y² + 2gx + 2fy + c = 0, center is (-g, -f) and radius r = √(g² + f² - c).",
          syllabusOutlines: [
            "Calculate gradient m = (y₂ - y₁) / (x₂ - x₁), distance d, and midpoint coordinates.",
            "Write equation of lines in slope-intercept (y = mx + c) and point-slope forms.",
            "Deduce condition for perpendicularity (m₁m₂ = -1) and parallelism (m₁ = m₂).",
            "Identify center and radius of circles given in general expanded form.",
          ],
          conceptDeepDive:
            "Coordinate geometry links algebra with Euclidean space. The slope m measures steepness. If a line has slope 3/4, any line perpendicular to it has a negative reciprocal slope of -4/3.",
          textbookAdvice: [
            {
              textbook: "Essential Mathematics by A.J.S. Oluwasanmi",
              chapters: "Chapter 10: Coordinate Geometry",
              focusNote: "Master exercises on finding equations of lines passing through perpendicular intersections.",
            },
          ],
          keyFormulasOrRules: [
            "Slope: m = (y₂ - y₁) / (x₂ - x₁)",
            "Distance: d = √[(x₂ - x₁)² + (y₂ - y₁)²]",
            "Perpendicular: m₁ · m₂ = -1",
            "Circle: (x - a)² + (y - b)² = r²",
            "Radius from general form: r = √(g² + f² - c)",
          ],
          sampleMnemonics: [
            "NEGATIVE RECIPROCAL: Flip upside down and flip the sign for perpendicular lines.",
          ],
          drillTopic: "Coordinate Geometry",
          prerequisites: ["math-calculus-integration"],
          nextTopics: ["math-vectors-matrices"],
        },
        {
          id: "math-vectors-matrices",
          subject: "mathematics",
          stream: "science",
          stage: 4,
          stageTitle: "Stage 4: Geometry & Vectors",
          order: 8,
          title: "Vectors in 2D & Matrices (Determinants/Inverses)",
          subtitle: "Dot product, vector magnitude, 2x2 and 3x3 matrix determinants, and transformation matrices.",
          highYield: false,
          examinerTrap: false,
          syllabusOutlines: [
            "Add, subtract, and calculate scalar product (dot product) of 2D vectors: u · v = |u||v|cosθ.",
            "Calculate determinant of 2x2 and 3x3 matrices.",
            "Determine inverse of 2x2 non-singular matrices: A⁻¹ = (1/det A) · adj(A).",
          ],
          conceptDeepDive:
            "Vectors possess both magnitude and direction. Two vectors are perpendicular if their dot product equals zero (u · v = 0). A matrix with determinant zero is singular and has no inverse.",
          textbookAdvice: [
            {
              textbook: "Essential Mathematics by A.J.S. Oluwasanmi",
              chapters: "Chapter 12: Matrices & Determinants",
              focusNote: "Practice 2x2 adjoint swapping rule: swap diagonals, negate off-diagonals.",
            },
          ],
          keyFormulasOrRules: [
            "Dot product: u · v = u_x v_x + u_y v_y = |u||v| cos θ",
            "Magnitude: |v| = √(v_x² + v_y²)",
            "Det |a b; c d| = ad - bc",
            "Inverse: (1/(ad - bc)) [d -b; -c a]",
          ],
          sampleMnemonics: [
            "SWAP MAIN, NEGATE OFF: Adjoint of 2x2 matrix swaps main diagonal and negates other elements.",
          ],
          drillTopic: "Matrices and Determinants",
          prerequisites: ["math-coordinate-geometry"],
          nextTopics: [],
        },
      ],
    },
  ],
};

export const SCIENCE_PHYSICS_ROADMAP: SubjectRoadmap = {
  id: "physics",
  name: "Physics",
  code: "PHY",
  stream: "science",
  iconName: "atom",
  totalTopics: 10,
  highYieldCount: 7,
  description: "Master kinematics, mechanics, wave optics, electricity, magnetism, and modern atomic physics.",
  stages: [
    {
      stage: 1,
      title: "Stage 1: Mechanics & Motion",
      description: "Vectors, equations of linear motion, Newton's laws, and projectile mechanics.",
      topics: [
        {
          id: "phys-kinematics-projectiles",
          subject: "physics",
          stream: "science",
          stage: 1,
          stageTitle: "Stage 1: Mechanics",
          order: 1,
          title: "Kinematics & Projectile Motion",
          subtitle: "Uniform acceleration, equations of motion, time of flight, maximum height, and horizontal range.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Maximum range occurs strictly at launch angle θ = 45°. At maximum height, vertical velocity v_y = 0, but horizontal velocity v_x = u cos θ remains non-zero!",
          syllabusOutlines: [
            "Apply equations of uniformly accelerated linear motion: v = u + at, s = ut + 1/2 at², v² = u² + 2as.",
            "Decompose projectile velocity into orthogonal components: u_x = u cos θ, u_y = u sin θ.",
            "Calculate Time of Flight: T = (2u sin θ) / g.",
            "Calculate Maximum Height: H = (u² sin² θ) / (2g).",
            "Calculate Horizontal Range: R = (u² sin 2θ) / g.",
          ],
          conceptDeepDive:
            "A projectile is an object moving through space under the sole influence of gravity. Its horizontal motion has zero acceleration (a_x = 0), meaning horizontal velocity is completely constant throughout the flight. Its vertical motion experiences constant downward gravitational acceleration (g = 9.8 or 10 m/s²).",
          textbookAdvice: [
            {
              textbook: "New School Physics for Senior Secondary Schools by M.W. Anyakoha",
              chapters: "Chapter 3: Motion & Chapter 4: Projectiles",
              focusNote: "Study worked examples on page 38-44 regarding projectiles fired horizontally from cliffs.",
            },
            {
              textbook: "Comprehensive Certificate Physics by Olumuyiwa & Ogunkoya",
              chapters: "Chapter 2: Motion in Two Dimensions",
              focusNote: "Carefully analyze velocity-time graph area and gradient problems.",
            },
          ],
          keyFormulasOrRules: [
            "v = u + at",
            "s = ut + ½ at²",
            "v² = u² + 2as",
            "T = (2u sin θ) / g",
            "H_max = (u² sin² θ) / (2g)",
            "R = (u² sin 2θ) / g (Max at θ = 45°)",
          ],
          sampleMnemonics: [
            "FORTY-FIVE FLIES FARTHEST: 45 degrees yields maximum range.",
            "AREA UNDER v-t IS DISTANCE: The geometric area of a velocity-time graph always equals distance.",
          ],
          drillTopic: "Kinematics and Projectiles",
          prerequisites: [],
          nextTopics: ["phys-work-energy-power", "phys-waves-optics"],
        },
        {
          id: "phys-work-energy-power",
          subject: "physics",
          stream: "science",
          stage: 1,
          stageTitle: "Stage 1: Mechanics",
          order: 2,
          title: "Work, Energy, Power & Simple Machines",
          subtitle: "Conservation of mechanical energy, mechanical advantage (MA), velocity ratio (VR), and efficiency.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Velocity Ratio (VR) depends ONLY on machine geometry (number of pulleys or radius ratio), never on friction! Mechanical Advantage (MA) decreases with friction. Efficiency = (MA / VR) × 100%.",
          syllabusOutlines: [
            "Distinguish work done W = F d cos θ from energy stored.",
            "Apply conservation of mechanical energy: E_k + E_p = constant.",
            "Calculate Mechanical Advantage: MA = Load / Effort.",
            "Calculate Velocity Ratio: VR = Distance moved by Effort / Distance moved by Load.",
            "Relate efficiency η = (MA / VR) × 100% = (Work Output / Work Input) × 100%.",
          ],
          conceptDeepDive:
            "Work is scalar energy transfer occurring when a force acts through a parallel displacement. In simple machines, friction wastes energy as heat, meaning Work Output is always less than Work Input, so efficiency is always strictly less than 100% in real-world systems.",
          textbookAdvice: [
            {
              textbook: "New School Physics by M.W. Anyakoha",
              chapters: "Chapter 6: Work, Energy and Power & Chapter 7: Simple Machines",
              focusNote: "Review pulley systems: for a block and tackle system, VR = total number of pulleys in both blocks.",
            },
          ],
          keyFormulasOrRules: [
            "W = F · d · cos θ",
            "E_k = ½ mv²,  E_p = mgh",
            "P = W / t = F · v",
            "MA = Load / Effort",
            "VR = d_effort / d_load",
            "Efficiency = (MA / VR) × 100%",
          ],
          sampleMnemonics: [
            "EFFICIENCY IS MA OVER VR: My Aunt Over Very Right.",
          ],
          drillTopic: "Work, Energy, and Power",
          prerequisites: ["phys-kinematics-projectiles"],
          nextTopics: ["phys-waves-optics"],
        },
      ],
    },
    {
      stage: 2,
      title: "Stage 2: Waves, Sound & Optics",
      description: "Wave properties, sound resonance, reflection, refraction, and optical instruments.",
      topics: [
        {
          id: "phys-waves-optics",
          subject: "physics",
          stream: "science",
          stage: 2,
          stageTitle: "Stage 2: Waves & Optics",
          order: 3,
          title: "Wave Motion & Light Optics (Reflection/Refraction)",
          subtitle: "Wave equation v = fλ, Snell's law, total internal reflection, lens formula, and magnification.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "When light travels from dense to rare medium, critical angle c satisfies: sin c = 1/n. If angle of incidence i > c, Total Internal Reflection occurs with ZERO light escaping!",
          syllabusOutlines: [
            "Apply fundamental wave equation: v = f λ and frequency f = 1 / T.",
            "Distinguish transverse waves from longitudinal waves (sound cannot be polarized!).",
            "Apply Snell's law: n₁ sin θ₁ = n₂ sin θ₂ and refractive index n = c / v.",
            "Determine critical angle: sin c = 1 / n and condition for Total Internal Reflection.",
            "Apply thin lens formula: 1/f = 1/u + 1/v and magnification m = v / u.",
          ],
          conceptDeepDive:
            "Waves transport energy without permanent transport of matter. Transverse waves oscillate perpendicular to propagation (light, ripples); longitudinal waves oscillate parallel to propagation (sound). Polarization is unique to transverse waves only.",
          textbookAdvice: [
            {
              textbook: "New School Physics by M.W. Anyakoha",
              chapters: "Chapter 11: Waves & Chapter 13: Refraction of Light",
              focusNote: "Practice ray diagrams for concave mirrors and convex lenses when object is between F and 2F.",
            },
          ],
          keyFormulasOrRules: [
            "v = f · λ",
            "n = sin i / sin r = Real depth / Apparent depth = 1 / sin c",
            "1/f = 1/u + 1/v",
            "Magnification m = v / u = Image size / Object size",
          ],
          sampleMnemonics: [
            "SOUND CANNOT POLARIZE: Only transverse waves can pass through polarizers.",
            "ROYGBIV: Red, Orange, Yellow, Green, Blue, Indigo, Violet (descending wavelength).",
          ],
          drillTopic: "Waves and Optics",
          prerequisites: ["phys-kinematics-projectiles"],
          nextTopics: ["phys-current-electricity"],
        },
      ],
    },
    {
      stage: 3,
      title: "Stage 3: Electricity & Magnetism",
      description: "Ohm's law, resistor networks, internal resistance, magnetic fields, and electromagnetic induction.",
      topics: [
        {
          id: "phys-current-electricity",
          subject: "physics",
          stream: "science",
          stage: 3,
          stageTitle: "Stage 3: Electricity",
          order: 4,
          title: "Current Electricity & DC Circuits",
          subtitle: "Ohm's law, series/parallel combinations, electromotive force (EMF), and lost volts (Ir).",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Terminal voltage V = E - Ir. As external current I increases, terminal voltage DECREASES due to higher internal voltage drop (lost volts Ir).",
          syllabusOutlines: [
            "Apply Ohm's law: V = I R and calculate electrical power P = IV = I²R = V² / R.",
            "Combine resistors: Series R_s = R₁ + R₂ + ..., Parallel 1/R_p = 1/R₁ + 1/R₂.",
            "Relate cell EMF to external load and internal resistance: E = I(R + r) = V + Ir.",
            "Convert moving coil galvanometers into ammeters (using small shunt resistor in parallel) and voltmeters (using large multiplier in series).",
          ],
          conceptDeepDive:
            "An electric circuit requires a closed loop and potential difference. A battery produces an electromotive force E, but inside the chemical electrolyte, charge carriers face internal resistance r. The lost voltage Ir is unrecoverable heat, leaving only V = E - Ir for external appliances.",
          textbookAdvice: [
            {
              textbook: "New School Physics by M.W. Anyakoha",
              chapters: "Chapter 18: Current Electricity & Chapter 19: Electrical Energy",
              focusNote: "Read section on Shunts and Multipliers on page 312.",
            },
          ],
          keyFormulasOrRules: [
            "V = I · R",
            "P = I · V = I²R = V² / R",
            "E = I(R + r) = V + Ir",
            "Shunt resistance: R_s = (I_g · R_g) / (I - I_g)",
            "Multiplier resistance: R_m = (V / I_g) - R_g",
          ],
          sampleMnemonics: [
            "SHUNT PARALLEL SMALL, MULTIPLIER SERIES MASSIVE: Galvanometer conversion memory key.",
          ],
          drillTopic: "Electricity and Magnetism",
          prerequisites: ["phys-waves-optics"],
          nextTopics: ["phys-atomic-modern-physics"],
        },
      ],
    },
    {
      stage: 4,
      title: "Stage 4: Modern & Atomic Physics",
      description: "Photoelectric effect, radioactive decay, half-life, and nuclear reactions.",
      topics: [
        {
          id: "phys-atomic-modern-physics",
          subject: "physics",
          stream: "science",
          stage: 4,
          stageTitle: "Stage 4: Modern Physics",
          order: 5,
          title: "Photoelectric Effect & Nuclear Radioactivity",
          subtitle: "Einstein's photoelectric equation, work function, half-life (T_1/2), alpha/beta decay, and nuclear fusion/fission.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "In the photoelectric effect: Increasing INTENSITY increases the rate (number) of emitted electrons, but does NOT increase their kinetic energy. Kinetic energy depends strictly on FREQUENCY (E = hf)!",
          syllabusOutlines: [
            "Apply Einstein's photoelectric equation: E = h f = W₀ + K_max = h f₀ + ½ m v²_max.",
            "Calculate stopping potential: eV_s = K_max.",
            "Solve radioactive decay problems using half-life: N(t) = N₀ · (½)^(t / T_½).",
            "Balance nuclear decay equations for alpha (⁴₂He), beta (⁰₋₁e), and gamma emissions.",
          ],
          conceptDeepDive:
            "Einstein explained the photoelectric effect by positing that light consists of discrete energy packets called photons (E = hf). Below a metal's threshold frequency f₀, no electrons can escape regardless of beam brightness. Radioactivity is the spontaneous disintegration of unstable atomic nuclei.",
          textbookAdvice: [
            {
              textbook: "New School Physics by M.W. Anyakoha",
              chapters: "Chapter 23: Structure of Atom & Chapter 24: Radioactivity",
              focusNote: "Practice half-life tables and nuclear decay balance equations.",
            },
          ],
          keyFormulasOrRules: [
            "E = h · f = h · c / λ",
            "h f = W₀ + K_max",
            "W₀ = h · f₀ (Work function)",
            "N = N₀ (½)^(t / T_½)",
            "Decay constant λ = 0.693 / T_½",
          ],
          sampleMnemonics: [
            "FREQUENCY FUELS ENERGY, BRIGHTNESS BRINGS COUNT: Frequency controls individual electron speed; intensity controls electron count.",
          ],
          drillTopic: "Atomic and Nuclear Physics",
          prerequisites: ["phys-current-electricity"],
          nextTopics: [],
        },
      ],
    },
  ],
};

export const SCIENCE_CHEMISTRY_ROADMAP: SubjectRoadmap = {
  id: "chemistry",
  name: "Chemistry",
  code: "CHM",
  stream: "science",
  iconName: "flask",
  totalTopics: 10,
  highYieldCount: 7,
  description: "Master stoichiometry, chemical equilibrium, electrochemistry, periodicity, and organic chemistry.",
  stages: [
    {
      stage: 1,
      title: "Stage 1: Stoichiometry & Gas Laws",
      description: "Mole concept, empirical formulas, ideal gas laws, and Graham's diffusion.",
      topics: [
        {
          id: "chem-stoichiometry-gas-laws",
          subject: "chemistry",
          stream: "science",
          stage: 1,
          stageTitle: "Stage 1: Stoichiometry",
          order: 1,
          title: "The Mole Concept & Gas Laws",
          subtitle: "Molar mass, percentage composition, Boyle/Charles/General gas equation, and Graham's law of diffusion.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "In gas calculations, temperatures MUST ALWAYS be converted to Kelvin (K = °C + 273). In Graham's law: Rate is INVERSELY proportional to the square root of density or molar mass (R₁/R₂ = √(M₂/M₁))!",
          syllabusOutlines: [
            "Apply the mole concept: Number of moles n = Mass / Molar mass = Volume / 22.4 dm³ (at STP).",
            "Deduce empirical and molecular formulas from percentage compositions.",
            "Apply gas laws: P₁V₁/T₁ = P₂V₂/T₂ and ideal gas equation PV = nRT.",
            "Apply Graham's Law of Diffusion: R₁ / R₂ = √(M₂ / M₁) = √(d₂ / d₁).",
          ],
          conceptDeepDive:
            "The mole is the chemist's counting unit (6.02 × 10²³ particles). At Standard Temperature and Pressure (STP: 0°C, 1 atm), one mole of any ideal gas occupies exactly 22.4 dm³. Graham's law proves that lighter gas molecules diffuse faster than heavier gas molecules.",
          textbookAdvice: [
            {
              textbook: "New School Chemistry for Senior Secondary Schools by Osei Yaw Ababio",
              chapters: "Chapter 5: Gas Laws & Chapter 6: The Mole Concept",
              focusNote: "Memorize STP conditions and practice stoichiometric titration molarity equations.",
            },
          ],
          keyFormulasOrRules: [
            "n = m / M = N / N_A = V / 22.4 (at STP)",
            "P₁V₁ / T₁ = P₂V₂ / T₂",
            "PV = nRT",
            "R₁ / R₂ = √(M₂ / M₁)",
            "K = °C + 273",
          ],
          sampleMnemonics: [
            "LIGHTER GAS LEAPS AHEAD: Smaller molar mass diffuses faster.",
            "BOYLE'S BOILING POT: Temperature is constant in Boyle's Law.",
          ],
          drillTopic: "Stoichiometry and Gas Laws",
          prerequisites: [],
          nextTopics: ["chem-periodicity-bonding", "chem-acids-bases-salts"],
        },
      ],
    },
    {
      stage: 2,
      title: "Stage 2: Periodic Table, Bonding & Reactions",
      description: "Electronic configuration, periodic trends, ionic/covalent/hydrogen bonding, and shapes of molecules.",
      topics: [
        {
          id: "chem-periodicity-bonding",
          subject: "chemistry",
          stream: "science",
          stage: 2,
          stageTitle: "Stage 2: Bonding",
          order: 2,
          title: "Periodic Trends & Chemical Bonding",
          subtitle: "Ionization energy, electronegativity, electron affinity, ionic, covalent, and coordinate dative bonds.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Electronegativity INCREASES across a period (left to right) and DECREASES down a group. Fluorine is the most electronegative element (4.0). Noble gases have zero electronegativity!",
          syllabusOutlines: [
            "Write s, p, d electronic configurations for atoms and ions (e.g. Fe²⁺ is [Ar] 3d⁶, not 4s² 3d⁴).",
            "Explain periodic variations: atomic radius, ionization energy, electronegativity.",
            "Distinguish electrovalent (ionic), covalent, coordinate (dative), and hydrogen bonding.",
          ],
          conceptDeepDive:
            "Atoms form bonds to achieve stable octet/duplet configurations. Dative bonding occurs when one atom provides BOTH shared bonding electrons (as in ammonium NH₄⁺ and hydronium H₃O⁺). Hydrogen bonding causes water's unusually high boiling point.",
          textbookAdvice: [
            {
              textbook: "New School Chemistry by Osei Yaw Ababio",
              chapters: "Chapter 3: Atomic Structure & Chapter 4: Chemical Bonding",
              focusNote: "Review shapes of molecules: methane (tetrahedral, 109.5°), ammonia (pyramidal, 107°), water (V-shaped/bent, 104.5°).",
            },
          ],
          keyFormulasOrRules: [
            "Ionization Energy: X(g) -> X⁺(g) + e⁻",
            "NH₃ + H⁺ -> NH₄⁺ (Coordinate Dative bond)",
            "H-bond donors: Fluorine, Oxygen, Nitrogen (FON)",
          ],
          sampleMnemonics: [
            "FON CALL FOR HYDROGEN BONDS: Hydrogen bonds only with Fluorine, Oxygen, and Nitrogen.",
          ],
          drillTopic: "Periodicity and Chemical Bonding",
          prerequisites: ["chem-stoichiometry-gas-laws"],
          nextTopics: ["chem-electrochemistry-redox"],
        },
      ],
    },
    {
      stage: 3,
      title: "Stage 3: Equilibrium, Acids & Electrochemistry",
      description: "Le Chatelier's principle, pH scale, Faraday's laws of electrolysis, and redox half-reactions.",
      topics: [
        {
          id: "chem-electrochemistry-redox",
          subject: "chemistry",
          stream: "science",
          stage: 3,
          stageTitle: "Stage 3: Physical Chemistry",
          order: 3,
          title: "Redox & Faraday's Laws of Electrolysis",
          subtitle: "Oxidation numbers, oxidizing/reducing agents, Faraday's 1st & 2nd laws: m = (I t M) / (n F).",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Oxidation is LOSS of electrons and occurs at the ANODE. Reduction is GAIN of electrons and occurs at the CATHODE. Remember: AN OX and RED CAT!",
          syllabusOutlines: [
            "Calculate oxidation numbers in complex ions (e.g. Mn in KMnO₄ is +7, Cr in K₂Cr₂O₇ is +6).",
            "Apply Faraday's First Law: Mass m = Z · I · t = (M · I · t) / (n · F).",
            "Apply Faraday's constant: 1 Faraday = 96,500 Coulombs = charge of 1 mole of electrons.",
            "Predict preferential discharge of ions based on concentration, electrode position, and nature of electrode.",
          ],
          conceptDeepDive:
            "Electrolysis is the chemical decomposition of an ionic compound by passing an electric current. Electrons flow from anode to cathode in external wires. In aqueous solutions, H⁺ and OH⁻ compete with solute ions for discharge.",
          textbookAdvice: [
            {
              textbook: "New School Chemistry by Osei Yaw Ababio",
              chapters: "Chapter 10: Oxidation-Reduction Reactions & Chapter 11: Electrolysis",
              focusNote: "Practice calculating mass of copper deposited at the cathode when current passes for 2 hours.",
            },
          ],
          keyFormulasOrRules: [
            "Q = I · t",
            "m = (M · I · t) / (n · 96500)",
            "1 F = 96,500 C/mol e⁻",
            "Anode = Oxidation; Cathode = Reduction",
          ],
          sampleMnemonics: [
            "OIL RIG: Oxidation Is Loss, Reduction Is Gain of electrons.",
            "AN OX & RED CAT: Anode = Oxidation, Reduction = Cathode.",
          ],
          drillTopic: "Electrochemistry",
          prerequisites: ["chem-periodicity-bonding"],
          nextTopics: ["chem-organic-hydrocarbons"],
        },
      ],
    },
    {
      stage: 4,
      title: "Stage 4: Organic Chemistry & Polymers",
      description: "Alkanes, alkenes, alkynes, functional groups, isomerism, and polymerisation.",
      topics: [
        {
          id: "chem-organic-hydrocarbons",
          subject: "chemistry",
          stream: "science",
          stage: 4,
          stageTitle: "Stage 4: Organic Chemistry",
          order: 4,
          title: "Hydrocarbons, Functional Groups & Isomerism",
          subtitle: "Alkanes, alkenes, alkynes, benzene, alcohols, carboxylic acids, IUPAC nomenclature, and structural isomerism.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Ethyne (acetylene) has a terminal triple bond (C≡C-H) and reacts with ammoniacal silver nitrate to form a white precipitate. Ethene does NOT form a precipitate!",
          syllabusOutlines: [
            "Name organic compounds using IUPAC nomenclature for chains, branches, and functional groups.",
            "Differentiate saturated hydrocarbons (substitution) from unsaturated hydrocarbons (addition).",
            "Identify structural and geometric (cis/trans) isomers.",
            "Describe reactions of functional groups: esterification, saponification, oxidation of alcohols.",
          ],
          conceptDeepDive:
            "Carbon's unique ability to catenate (form long stable C-C chains and rings) generates thousands of organic compounds. Alkenes undergo addition reactions across their double bond, decolourizing bromine water from reddish-brown to colourless.",
          textbookAdvice: [
            {
              textbook: "New School Chemistry by Osei Yaw Ababio",
              chapters: "Chapters 21 to 24: Organic Chemistry (Hydrocarbons, Alkanols, Carboxylic Acids)",
              focusNote: "Focus on distinguishing chemical tests between alkanes, alkenes, and terminal alkynes.",
            },
          ],
          keyFormulasOrRules: [
            "Alkanes: C_n H_(2n+2)",
            "Alkenes: C_n H_2n",
            "Alkynes: C_n H_(2n-2)",
            "Esterification: Acid + Alcohol <=> Ester + Water (conc H₂SO₄ catalyst)",
          ],
          sampleMnemonics: [
            "A-E-Y ORDER: Alkane (single), Alkene (double), Alkyne (triple bond).",
          ],
          drillTopic: "Organic Chemistry",
          prerequisites: ["chem-electrochemistry-redox"],
          nextTopics: [],
        },
      ],
    },
  ],
};

export const COMMERCIAL_ECONOMICS_ROADMAP: SubjectRoadmap = {
  id: "economics",
  name: "Economics",
  code: "ECO",
  stream: "commercial",
  iconName: "chart-bar",
  totalTopics: 10,
  highYieldCount: 6,
  description: "Master price determination, elasticity, national income, inflation, money & banking, and international trade.",
  stages: [
    {
      stage: 1,
      title: "Stage 1: Basic Economic Concepts & Price Theory",
      description: "Scarcity, choice, opportunity cost, demand, supply, and equilibrium price determination.",
      topics: [
        {
          id: "econ-scarcity-demand-supply",
          subject: "economics",
          stream: "commercial",
          stage: 1,
          stageTitle: "Stage 1: Price Theory",
          order: 1,
          title: "Scarcity, Opportunity Cost & Price Equilibrium",
          subtitle: "Scale of preference, production possibility curve (PPC), laws of demand/supply, and market equilibrium.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "A change in price causes a 'CHANGE IN QUANTITY DEMANDED' (movement ALONG the curve). A change in any other factor (income, taste, tax) causes a 'CHANGE IN DEMAND' (SHIFT of the entire curve)!",
          syllabusOutlines: [
            "Define economics, scarcity, choice, scale of preference, and opportunity cost.",
            "Illustrate scarcity and efficiency using the Production Possibility Frontier (PPF).",
            "Formulate demand and supply equations: Q_d = a - bP, Q_s = c + dP.",
            "Calculate market clearing equilibrium price and quantity where Q_d = Q_s.",
          ],
          conceptDeepDive:
            "Economics studies how scarce resources with alternative uses are allocated to satisfy unlimited human wants. Opportunity cost is the real cost expressed in terms of the next best alternative forgone. Market equilibrium is reached where the quantity consumers wish to buy equals the quantity producers offer for sale.",
          textbookAdvice: [
            {
              textbook: "Comprehensive Economics for Senior Secondary Schools by J.U. Anyaele",
              chapters: "Chapter 1: Nature of Economics & Chapter 3: Theory of Demand and Supply",
              focusNote: "Practice shifting supply curves rightward (subsidies) vs leftward (taxes).",
            },
            {
              textbook: "Amplified and Simplified Economics by Femi Longe",
              chapters: "Chapter 4: Equilibrium Price Determination",
              focusNote: "Work through simultaneous linear equations for Q_d and Q_s.",
            },
          ],
          keyFormulasOrRules: [
            "Equilibrium: Q_d = Q_s",
            "Q_d = a - bP (Downward sloping)",
            "Q_s = c + dP (Upward sloping)",
            "Opportunity Cost = Next best foregone alternative",
          ],
          sampleMnemonics: [
            "PRICE MOVES ALONG, OTHERS SHIFT BEYOND: Price changes slide along the curve; income or taste shifts the whole line.",
          ],
          drillTopic: "Demand and Supply",
          prerequisites: [],
          nextTopics: ["econ-elasticity-market-structures"],
        },
        {
          id: "econ-elasticity-market-structures",
          subject: "economics",
          stream: "commercial",
          stage: 1,
          stageTitle: "Stage 1: Price Theory",
          order: 2,
          title: "Elasticity of Demand & Supply",
          subtitle: "Price elasticity of demand (PED), income elasticity (YED), cross elasticity (XED), and revenue implications.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "If cross elasticity XED is POSITIVE, the goods are SUBSTITUTES (e.g. Milo and Bournvita). If XED is NEGATIVE, the goods are COMPLEMENTS (e.g. Car and Petrol)!",
          syllabusOutlines: [
            "Calculate Price Elasticity of Demand: PED = (% change in Q_d) / (% change in P).",
            "Interpret PED values: elastic (|e| > 1), inelastic (|e| < 1), unitary (|e| = 1).",
            "Calculate and interpret Cross-Price Elasticity (Substitutes > 0, Complements < 0).",
            "Calculate Income Elasticity (Normal goods > 0, Inferior goods < 0).",
          ],
          conceptDeepDive:
            "Elasticity measures consumer responsiveness to price changes. If demand is inelastic (|e| < 1), a price increase increases a firm's total revenue because the percentage drop in quantity demanded is smaller than the percentage price hike.",
          textbookAdvice: [
            {
              textbook: "Comprehensive Economics by J.U. Anyaele",
              chapters: "Chapter 5: Elasticity of Demand and Supply",
              focusNote: "Review the total revenue test diagram.",
            },
          ],
          keyFormulasOrRules: [
            "PED = (ΔQ / Q₁) / (ΔP / P₁) = (ΔQ / ΔP) × (P₁ / Q₁)",
            "XED > 0 => Substitutes",
            "XED < 0 => Complements",
            "YED < 0 => Inferior Goods",
          ],
          sampleMnemonics: [
            "PLUS IS PARALLEL SUBSTITUTE: Positive cross-elasticity means goods substitute for each other.",
          ],
          drillTopic: "Elasticity of Demand and Supply",
          prerequisites: ["econ-scarcity-demand-supply"],
          nextTopics: ["econ-national-income-money"],
        },
      ],
    },
    {
      stage: 2,
      title: "Stage 2: Macroeconomics & Public Finance",
      description: "National income accounting, inflation, fiscal policy, and banking systems.",
      topics: [
        {
          id: "econ-national-income-money",
          subject: "economics",
          stream: "commercial",
          stage: 2,
          stageTitle: "Stage 2: Macroeconomics",
          order: 3,
          title: "National Income, Inflation & Money Banking",
          subtitle: "GDP, GNP, NNP, expenditure/income/output methods, causes of inflation, and central bank monetary tools.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "GDP measures output produced WITHIN a country's geographical borders. GNP = GDP + Net Factor Income from Abroad (NFIA). Do not confuse them!",
          syllabusOutlines: [
            "Distinguish GDP, GNP, NNP, and National Income.",
            "Identify components of expenditure method: Y = C + I + G + (X - M).",
            "Explain types and causes of inflation (Demand-pull vs Cost-push).",
            "Explain Central Bank tools to fight inflation: raising Cash Reserve Ratio (CRR), raising Monetary Policy Rate (MPR), and selling Open Market Operations (OMO) securities.",
          ],
          conceptDeepDive:
            "National income measures the monetary value of all final goods and services produced in an economy over a year. Double-counting is avoided by measuring only value added at each production stage. To combat high inflation, the Central Bank implements contractionary monetary policy, mopping up commercial bank liquidity.",
          textbookAdvice: [
            {
              textbook: "Comprehensive Economics by J.U. Anyaele",
              chapters: "Chapter 14: National Income & Chapter 18: Money and Banking",
              focusNote: "Practice OMO open market operations questions.",
            },
          ],
          keyFormulasOrRules: [
            "GDP = C + I + G + (X - M)",
            "GNP = GDP + Net Factor Income from Abroad",
            "NNP = GNP - Depreciation (Capital Consumption)",
            "Fisher's Quantity Theory of Money: MV = PT",
          ],
          sampleMnemonics: [
            "DOMESTIC IS DIRT: GDP is about the physical land/soil (borders) of the country.",
          ],
          drillTopic: "National Income and Macroeconomics",
          prerequisites: ["econ-elasticity-market-structures"],
          nextTopics: [],
        },
      ],
    },
  ],
};

export const ARTS_GOVERNMENT_ROADMAP: SubjectRoadmap = {
  id: "government",
  name: "Government",
  code: "GOV",
  stream: "arts",
  iconName: "landmark",
  totalTopics: 10,
  highYieldCount: 6,
  description: "Master political theories, forms of government, Nigerian constitutional developments, and foreign policy.",
  stages: [
    {
      stage: 1,
      title: "Stage 1: Basic Political Concepts & Systems",
      description: "State, sovereignty, rule of law, separation of powers, and political ideologies.",
      topics: [
        {
          id: "gov-sovereignty-rule-of-law",
          subject: "government",
          stream: "arts",
          stage: 1,
          stageTitle: "Stage 1: Political Theory",
          order: 1,
          title: "Sovereignty, Separation of Powers & Rule of Law",
          subtitle: "Jean Bodin, Baron de Montesquieu, A.V. Dicey, checks and balances, and fundamental human rights.",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Montesquieu proposed 'Separation of Powers' to prevent tyranny, but complete separation creates deadlock; it requires 'Checks and Balances' to function. Dicey established three pillars of Rule of Law.",
          syllabusOutlines: [
            "Define sovereignty, its characteristics (indivisibility, permanence, absoluteness), and limitations.",
            "Explain Baron de Montesquieu's doctrine of Separation of Powers.",
            "Explain A.V. Dicey's three pillars of Rule of Law: Supremacy of regular law, equality before the law, and predominance of legal spirit.",
            "Identify factors that limit citizen rights during emergencies and military regimes.",
          ],
          conceptDeepDive:
            "Sovereignty is the supreme, absolute, and uncontrollable power by which an independent state is governed. Separation of powers distributes legislative, executive, and judicial powers across distinct organs, ensuring no single branch acquires tyrannical control.",
          textbookAdvice: [
            {
              textbook: "Government for Senior Secondary Schools by J.U. Anyaele",
              chapters: "Chapter 2: Basic Concepts of Government",
              focusNote: "Memorize the scholars associated with each doctrine (Bodin = Sovereignty, Montesquieu = Separation of Powers, Dicey = Rule of Law).",
            },
          ],
          keyFormulasOrRules: [
            "Sovereignty = Jean Bodin",
            "Separation of Powers = Montesquieu",
            "Rule of Law = A.V. Dicey",
            "Checks & Balances: Legislature makes laws, Executive enforces, Judiciary interprets",
          ],
          sampleMnemonics: [
            "D-I-C-E-Y EQUALITY: Dicey demanded equal standing before the ordinary courts.",
          ],
          drillTopic: "Basic Concepts of Government",
          prerequisites: [],
          nextTopics: ["gov-nigerian-constitutional-development"],
        },
      ],
    },
    {
      stage: 2,
      title: "Stage 2: Nigerian Constitutional Development",
      description: "Clifford, Richards, Macpherson, Lyttelton constitutions, and Post-Independence constitutions.",
      topics: [
        {
          id: "gov-nigerian-constitutional-development",
          subject: "government",
          stream: "arts",
          stage: 2,
          stageTitle: "Stage 2: Constitutional History",
          order: 2,
          title: "Colonial & Post-Independence Constitutions (1922 - 1999)",
          subtitle: "Clifford 1922 (elective principle), Richards 1946 (regionalism), Macpherson 1951, and Lyttelton 1954 (true federalism).",
          highYield: true,
          examinerTrap: true,
          trapAlert: "Clifford (1922) introduced the ELECTIVE PRINCIPLE (4 elected seats: 3 in Lagos, 1 in Calabar). Lyttelton (1954) established TRUE FEDERALISM with Premier roles in regions!",
          syllabusOutlines: [
            "Identify features of Clifford Constitution (1922) and first newspaper/political parties (NNDP by Herbert Macaulay).",
            "Analyze Richards Constitution (1946): introduced regional councils and linked North to Legislative Council.",
            "Examine Macpherson Constitution (1951): nationwide consultations and Council of Ministers.",
            "Analyze Lyttelton Constitution (1954): created true federal system and made civil service/judiciary regional.",
            "Compare 1963 Republican Constitution with 1979 & 1999 Presidential Constitutions.",
          ],
          conceptDeepDive:
            "Nigeria's constitutional history moved from governor-general autocracy under Sir Hugh Clifford in 1922 to regional federalism under Sir Oliver Lyttelton in 1954. In 1963, the British monarch was replaced by an indigenous ceremonial President, creating the Federal Republic of Nigeria.",
          textbookAdvice: [
            {
              textbook: "Essential Government for Senior Secondary Schools by Dibie C. Chris",
              chapters: "Chapter 16: Pre-Independence Constitutional Development",
              focusNote: "Table the years and chief contributions: 1922 (Elective), 1946 (Regionalism), 1951 (Consultation), 1954 (Federalism).",
            },
          ],
          keyFormulasOrRules: [
            "1922 Clifford: Elective principle (3 Lagos, 1 Calabar)",
            "1946 Richards: Regionalism (3 regions: North, West, East)",
            "1954 Lyttelton: True Federalism (Regional autonomy & civil services)",
            "1963 Republican: Abolished Privy Council appeals, President replaced Queen",
            "1979: Introduced American-style Executive Presidential system",
          ],
          sampleMnemonics: [
            "C-R-M-L: Clifford, Richards, Macpherson, Lyttelton (Constitutions in chronological sequence).",
          ],
          drillTopic: "Nigerian Constitutional Development",
          prerequisites: ["gov-sovereignty-rule-of-law"],
          nextTopics: [],
        },
      ],
    },
  ],
};

// General Roadmap Registry
export const ALL_ROADMAPS: Record<string, SubjectRoadmap> = {
  mathematics: SCIENCE_MATHEMATICS_ROADMAP,
  physics: SCIENCE_PHYSICS_ROADMAP,
  chemistry: SCIENCE_CHEMISTRY_ROADMAP,
  economics: COMMERCIAL_ECONOMICS_ROADMAP,
  government: ARTS_GOVERNMENT_ROADMAP,
};

export function convertCurriculumToRoadmap(curriculum: SubjectCurriculum): SubjectRoadmap {
  const iconMap: Record<string, string> = {
    mathematics: "calculator",
    physics: "zap",
    chemistry: "beaker",
    biology: "heart",
    english: "book-open",
    economics: "trending-up",
    government: "shield",
    commerce: "briefcase",
    accounts: "file-text",
    literature: "feather",
    crs: "book",
  };

  const subjectKey = curriculum.id.toLowerCase();
  const iconName = iconMap[subjectKey] || "book-open";

  // Build a lookup of curated rich topic details from curated roadmaps
  const curatedRoadmap = ALL_ROADMAPS[curriculum.id];
  const curatedTopicMap = new Map<string, RoadmapTopicNode>();
  if (curatedRoadmap?.stages) {
    curatedRoadmap.stages.flatMap((s) => s.topics).forEach((t) => {
      curatedTopicMap.set(t.id.toLowerCase(), t);
      curatedTopicMap.set(t.title.toLowerCase(), t);
      curatedTopicMap.set(t.drillTopic.toLowerCase(), t);
    });
  }

  let totalTopics = 0;
  let highYieldCount = 0;

  const stages: RoadmapStage[] = curriculum.sections.map((section, sIdx) => {
    const stageNum = sIdx + 1;
    const stageTitle = section.sectionTitle;
    const stageDesc =
      curriculum.examinationStructure[sIdx]?.description ||
      `Official JAMB examination section covering ${section.topics.length} syllabus topics with targeted CBT questions.`;

    const topics: RoadmapTopicNode[] = section.topics.map((t, tIdx) => {
      totalTopics++;
      const isHighYield = Boolean(t.highYield || tIdx === 0 || t.objectives.length >= 4);
      if (isHighYield) highYieldCount++;

      const topicId = `${curriculum.id}-t${t.topicNumber}`;
      const searchKey = t.title.toLowerCase();

      // Check if curated notes exist for this topic
      let curatedMatch: RoadmapTopicNode | undefined;
      for (const [key, node] of curatedTopicMap.entries()) {
        if (searchKey.includes(key) || key.includes(searchKey)) {
          curatedMatch = node;
          break;
        }
      }

      // Format recommended textbook advice from curriculum
      const defaultTextbook =
        curriculum.recommendedTexts.length > 0
          ? curriculum.recommendedTexts[0]
          : `Senior Secondary ${curriculum.subjectName} Textbook`;

      const textbookAdvice =
        curatedMatch && curatedMatch.textbookAdvice.length > 0
          ? curatedMatch.textbookAdvice
          : [
              {
                textbook: defaultTextbook,
                chapters: `Topic ${t.topicNumber}: ${t.title}`,
                focusNote: `Read relevant chapter on ${t.title}. Pay special attention to: ${t.contents.slice(0, 3).join("; ")}.`,
              },
              ...(curriculum.recommendedTexts.length > 1
                ? [
                    {
                      textbook: curriculum.recommendedTexts[1],
                      chapters: "Past UTME Review Questions",
                      focusNote: `Solve end-of-unit objective questions testing: ${t.objectives.slice(0, 2).join("; ")}.`,
                    },
                  ]
                : []),
            ];

      const syllabusOutlines =
        t.objectives && t.objectives.length > 0
          ? t.objectives
          : t.contents && t.contents.length > 0
          ? t.contents
          : [`Master fundamental principles and problem solving in ${t.title}`];

      const conceptDeepDive =
        curatedMatch?.conceptDeepDive ||
        `${t.title} is an essential component of the official JAMB UTME syllabus for ${curriculum.subjectName}. Core curriculum contents include: ${t.contents.join("; ")}. Key examination objectives: ${t.objectives.join("; ")}. Candidates must master these principles to score high in CBT assessments.`;

      const keyFormulasOrRules =
        curatedMatch?.keyFormulasOrRules && curatedMatch.keyFormulasOrRules.length > 0
          ? curatedMatch.keyFormulasOrRules
          : t.contents.filter((c) => c.length < 90).slice(0, 5);

      const trapAlert =
        t.trapAlert ||
        curatedMatch?.trapAlert ||
        curriculum.examinerTraps?.find((et) =>
          et.title.toLowerCase().includes(t.title.toLowerCase())
        )?.explanation ||
        undefined;

      const sampleMnemonics = curatedMatch?.sampleMnemonics || [];

      // Link previous and next topics in sequence
      const prevTopicInStage = tIdx > 0 ? [`${curriculum.id}-t${section.topics[tIdx - 1].topicNumber}`] : [];
      const nextTopicInStage =
        tIdx < section.topics.length - 1
          ? [`${curriculum.id}-t${section.topics[tIdx + 1].topicNumber}`]
          : [];

      return {
        id: topicId,
        subject: curriculum.id,
        stream: curriculum.streamId,
        stage: stageNum,
        stageTitle,
        order: t.topicNumber || tIdx + 1,
        title: t.title,
        subtitle: t.contents.slice(0, 2).join(", ") || `${curriculum.subjectName} curriculum topic`,
        highYield: isHighYield,
        examinerTrap: Boolean(trapAlert),
        trapAlert,
        syllabusOutlines,
        conceptDeepDive,
        textbookAdvice,
        keyFormulasOrRules:
          keyFormulasOrRules.length > 0
            ? keyFormulasOrRules
            : [`Review core definitions and practice questions on ${t.title}.`],
        sampleMnemonics,
        drillTopic: t.drillTopicId || t.title,
        prerequisites: prevTopicInStage,
        nextTopics: nextTopicInStage,
      };
    });

    return {
      stage: stageNum,
      title: stageTitle,
      description: stageDesc,
      topics,
    };
  });

  return {
    id: curriculum.id,
    name: curriculum.subjectName,
    code: curriculum.subjectCode,
    stream: curriculum.streamId,
    iconName,
    totalTopics,
    highYieldCount,
    description: curriculum.overview,
    stages,
  };
}

export function getRoadmapForSubject(
  subjectSlug: string,
  stream: "science" | "commercial" | "arts" = "science"
): SubjectRoadmap {
  const curriculum = getSubjectCurriculum(stream, subjectSlug);
  return convertCurriculumToRoadmap(curriculum);
}

