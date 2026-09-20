import tagliatelle from "@/assets/tagliatelle.jpg";
import pizza from "@/assets/pizza.jpg";
import ribeye from "@/assets/ribeye.jpg";
import caesar from "@/assets/caesar.jpg";
import bruschetta from "@/assets/bruschetta.jpg";
import lavaCake from "@/assets/lava-cake.jpg";
import salmonBowl from "@/assets/salmon-bowl.jpg";
import quinoaSalad from "@/assets/quinoa-salad.jpg";
import chickenPlate from "@/assets/chicken-plate.jpg";
import smoothieBowl from "@/assets/smoothie-bowl.jpg";
import zucchini from "@/assets/zucchini.jpg";
import parfait from "@/assets/parfait.jpg";

export const RESTAURANT = {
  name: "Verde Bistro",
  tagline: "Scan · Choose · Enjoy",
};

export interface NormalItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: "Starters" | "Mains" | "Desserts";
}

export const NORMAL_MENU: NormalItem[] = [
  {
    id: "bruschetta",
    name: "Tomato Basil Bruschetta",
    price: 9,
    description: "Toasted sourdough, marinated tomatoes, fresh basil, extra-virgin olive oil.",
    image: bruschetta,
    category: "Starters",
  },
  {
    id: "caesar",
    name: "Grilled Chicken Caesar",
    price: 14,
    description: "Crisp romaine, shaved parmesan, sourdough croutons, house caesar dressing.",
    image: caesar,
    category: "Starters",
  },
  {
    id: "tagliatelle",
    name: "Truffle Tagliatelle",
    price: 24,
    description: "Hand-cut pasta, black truffle cream, aged parmesan shavings.",
    image: tagliatelle,
    category: "Mains",
  },
  {
    id: "pizza",
    name: "Wood-Fired Margherita",
    price: 18,
    description: "San Marzano tomatoes, buffalo mozzarella, basil, blistered crust.",
    image: pizza,
    category: "Mains",
  },
  {
    id: "ribeye",
    name: "Flame-Grilled Ribeye",
    price: 32,
    description: "300g grass-fed ribeye, roasted garlic butter, charred onion, rosemary.",
    image: ribeye,
    category: "Mains",
  },
  {
    id: "lava-cake",
    name: "Molten Lava Cake",
    price: 11,
    description: "Dark chocolate, salted caramel heart, vanilla bean ice cream, berries.",
    image: lavaCake,
    category: "Desserts",
  },
];

export type Goal = "high-protein" | "low-calorie" | "weight-management";

export const GOAL_LABELS: Record<Goal, string> = {
  "high-protein": "Gym / High-protein",
  "low-calorie": "Low-calorie",
  "weight-management": "Weight mgmt",
};

export interface HealthyItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  goals: Goal[];
}

export const HEALTHY_MENU: HealthyItem[] = [
  {
    id: "salmon-bowl",
    name: "Grilled Salmon Bowl",
    price: 21,
    description: "Grilled salmon, quinoa, avocado, baby greens, lemon-tahini drizzle.",
    image: salmonBowl,
    kcal: 420,
    protein: 38,
    carbs: 22,
    fat: 18,
    fiber: 6,
    goals: ["high-protein", "weight-management"],
  },
  {
    id: "chicken-plate",
    name: "Herb Chicken Plate",
    price: 17,
    description: "Grilled herb chicken breast with roasted seasonal vegetables.",
    image: chickenPlate,
    kcal: 360,
    protein: 42,
    carbs: 18,
    fat: 12,
    fiber: 5,
    goals: ["high-protein", "low-calorie"],
  },
  {
    id: "smoothie-bowl",
    name: "Protein Smoothie Bowl",
    price: 12,
    description: "Berry blend with whey protein, granola, banana, chia seeds.",
    image: smoothieBowl,
    kcal: 320,
    protein: 24,
    carbs: 45,
    fat: 8,
    fiber: 9,
    goals: ["high-protein"],
  },
  {
    id: "quinoa-salad",
    name: "Quinoa Chickpea Salad",
    price: 13,
    description: "Quinoa, chickpeas, cucumber, fresh herbs, lemon vinaigrette.",
    image: quinoaSalad,
    kcal: 280,
    protein: 12,
    carbs: 40,
    fat: 9,
    fiber: 10,
    goals: ["low-calorie", "weight-management"],
  },
  {
    id: "zucchini",
    name: "Zucchini Pesto Noodles",
    price: 14,
    description: "Spiralized zucchini, basil pesto, cherry tomatoes, pine nuts.",
    image: zucchini,
    kcal: 240,
    protein: 9,
    carbs: 20,
    fat: 14,
    fiber: 6,
    goals: ["low-calorie", "weight-management"],
  },
  {
    id: "parfait",
    name: "Greek Yogurt Parfait",
    price: 9,
    description: "Greek yogurt, raw honey, house granola, fresh berries.",
    image: parfait,
    kcal: 290,
    protein: 18,
    carbs: 34,
    fat: 10,
    fiber: 5,
    goals: ["weight-management"],
  },
];
