import { Question } from "./equations";

export interface TriangleDiagram {
  type: "angle" | "pythagoras";
  angleA?: number | null;  // bottom-left angle
  angleB?: number | null;  // bottom-right angle
  angleC?: number | null;  // top angle
  isRightAngle?: boolean;  // right angle at bottom-left
  isIsosceles?: boolean;
  isObtuse?: boolean;      // renders a flat wide triangle with obtuse angle at bottom-left
  sideA?: number | null;   // vertical left side
  sideB?: number | null;   // horizontal bottom side
  sideC?: number | null;   // hypotenuse
  unknown?: "a" | "b" | "c";
}

export interface TriangleQuestion extends Question {
  diagram?: TriangleDiagram;
}

export const triangleQuestions: TriangleQuestion[] = [
  {
    id: 1,
    question: "A triangle has angles of 60° and 80°. What is the third angle?",
    options: ["30°", "40°", "50°", "60°"],
    correct: 1,
    working: "Angles in a triangle always add up to 180°. 60 + 80 = 140. So the third angle = 180 − 140 = 40°",
    hint: "All three angles in any triangle must add up to a specific number. What is it?",
    diagram: { type: "angle", angleA: 80, angleB: 60, angleC: null },
  },
  {
    id: 2,
    question: "A triangle has angles of 45° and 95°. What is the third angle?",
    options: ["30°", "40°", "50°", "60°"],
    correct: 1,
    working: "Angles in a triangle add up to 180°. 45 + 95 = 140. Third angle = 180 − 140 = 40°",
    hint: "Add the two known angles, then subtract from 180°.",
    diagram: { type: "angle", angleA: 95, angleB: 45, angleC: null, isObtuse: true },
  },
  {
    id: 3,
    question: "A triangle has angles of 35° and 75°. What is the third angle?",
    options: ["60°", "65°", "70°", "75°"],
    correct: 2,
    working: "Angles in a triangle add up to 180°. 35 + 75 = 110. Third angle = 180 − 110 = 70°",
    hint: "Add the two known angles, then subtract from 180°.",
    diagram: { type: "angle", angleA: 75, angleB: 35, angleC: null },
  },
  {
    id: 4,
    question: "An isosceles triangle has a top angle of 40°. What are the two base angles?",
    options: ["60° each", "65° each", "70° each", "80° each"],
    correct: 2,
    working: "Angles add up to 180°. The two base angles are equal. 180 − 40 = 140. Each base angle = 140 ÷ 2 = 70°",
    hint: "In an isosceles triangle, the two base angles are equal. Subtract the top angle from 180°, then split what's left equally.",
    diagram: { type: "angle", angleA: null, angleB: null, angleC: 40, isIsosceles: true },
  },
  {
    id: 5,
    question: "A right-angled isosceles triangle has one angle of 90°. What are the other two angles?",
    options: ["30° and 60°", "45° and 45°", "50° and 40°", "60° and 30°"],
    correct: 1,
    working: "Angles add up to 180°. 180 − 90 = 90 remaining. It's isosceles so the two remaining angles are equal: 90 ÷ 2 = 45° each",
    hint: "After accounting for the right angle, the remaining degrees are split equally between two identical angles.",
    diagram: { type: "angle", angleA: 90, angleB: null, angleC: null, isRightAngle: true, isIsosceles: true },
  },
  {
    id: 6,
    question: "A triangle has angles of 52° and 63°. What is the third angle?",
    options: ["55°", "60°", "65°", "75°"],
    correct: 2,
    working: "Angles in a triangle add up to 180°. 52 + 63 = 115. Third angle = 180 − 115 = 65°",
    hint: "Add the two known angles, then subtract from 180°.",
    diagram: { type: "angle", angleA: 63, angleB: 52, angleC: null },
  },
  {
    id: 7,
    question: "A right-angled triangle has two shorter sides of 3 cm and 4 cm. What is the longest side?",
    options: ["5 cm", "6 cm", "7 cm", "√7 cm"],
    correct: 0,
    working: "Pythagoras: a² + b² = c². So 3² + 4² = 9 + 16 = 25. c = √25 = 5 cm",
    hint: "Square both shorter sides, add them together, then square root the result to find the longest side.",
    diagram: { type: "pythagoras", sideA: 3, sideB: 4, sideC: null, unknown: "c" },
  },
  {
    id: 8,
    question: "A right-angled triangle has two shorter sides of 5 cm and 12 cm. What is the longest side?",
    options: ["11 cm", "13 cm", "15 cm", "17 cm"],
    correct: 1,
    working: "Pythagoras: a² + b² = c². So 5² + 12² = 25 + 144 = 169. c = √169 = 13 cm",
    hint: "Square both shorter sides, add them, then square root. Look for a whole number answer.",
    diagram: { type: "pythagoras", sideA: 5, sideB: 12, sideC: null, unknown: "c" },
  },
  {
    id: 9,
    question: "The longest side of a right-angled triangle is 10 cm and one shorter side is 6 cm. What is the other shorter side?",
    options: ["6 cm", "7 cm", "8 cm", "9 cm"],
    correct: 2,
    working: "Pythagoras: a² + b² = c². So b² = c² − a² = 10² − 6² = 100 − 36 = 64. b = √64 = 8 cm",
    hint: "When finding a shorter side, rearrange Pythagoras: subtract the known shorter side squared from the longest side squared.",
    diagram: { type: "pythagoras", sideA: 6, sideB: null, sideC: 10, unknown: "b" },
  },
  {
    id: 10,
    question: "A right-angled triangle has two shorter sides of 8 cm and 15 cm. What is the longest side?",
    options: ["16 cm", "17 cm", "18 cm", "19 cm"],
    correct: 1,
    working: "Pythagoras: a² + b² = c². So 8² + 15² = 64 + 225 = 289. c = √289 = 17 cm",
    hint: "Square both shorter sides, add them together, then square root the total.",
    diagram: { type: "pythagoras", sideA: 8, sideB: 15, sideC: null, unknown: "c" },
  },
  {
    id: 11,
    question: "The longest side of a right-angled triangle is 13 cm and one shorter side is 5 cm. What is the other shorter side?",
    options: ["10 cm", "11 cm", "12 cm", "14 cm"],
    correct: 2,
    working: "b² = c² − a² = 13² − 5² = 169 − 25 = 144. b = √144 = 12 cm",
    hint: "You're finding a shorter side — subtract the known shorter side squared from the longest side squared.",
    diagram: { type: "pythagoras", sideA: 5, sideB: null, sideC: 13, unknown: "b" },
  },
  {
    id: 12,
    question: "A right-angled triangle has two shorter sides of 9 cm and 12 cm. What is the longest side?",
    options: ["13 cm", "14 cm", "15 cm", "16 cm"],
    correct: 2,
    working: "Pythagoras: 9² + 12² = 81 + 144 = 225. c = √225 = 15 cm",
    hint: "Square both shorter sides and add — then think about what number multiplied by itself gives that total.",
    diagram: { type: "pythagoras", sideA: 9, sideB: 12, sideC: null, unknown: "c" },
  },
];
