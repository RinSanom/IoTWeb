import {
  HealthIcon,
  EnvironmentIcon,
  EconomyIcon,
  WildlifeIcon,
} from "../components/ui/impact-icons";

export const impactData = [
  {
    title: "Human Health",
    description:
      "Air pollution causes breathing problems like asthma and lung infections. It can also lead to heart diseases, strokes, and even cancer.",
    icon: <HealthIcon />,
    delay: 100,
  },
  {
    title: "Environment",
    description:
      "Acid rain, greenhouse gases, and ozone layer depletion are contributing to climate change by causing harm to plants, soil, and water bodies.",
    icon: <EnvironmentIcon />,
    delay: 200,
  },
  {
    title: "Economy",
    description:
      "High pollution levels increase healthcare costs, lead to increased hospital visits, and negatively impact workers' productivity, crop yields, food production, and trade.",
    icon: <EconomyIcon />,
    delay: 300,
  },
  {
    title: "Wildlife",
    description:
      "Air and water pollution affects animals' health and survival, while climate change disrupts natural habitats, forcing species to migrate or face extinction.",
    icon: <WildlifeIcon />,
    delay: 400,
  },
];
