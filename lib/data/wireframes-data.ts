export interface WireframeData {
  id: string;
  title: string;
  imagePath: string;
  altText: string;
  features: string[];
}

export const wireframesData: WireframeData[] = [
  {
    id: "A0",
    title: "A0 (Splash Screen)",
    imagePath: "/projects/addvanced/A0-Addvanced Splash Screen.png",
    altText:
      "Wireframe for Addvanced app splash screen showing logo and loading state",
    features: [
      "Brand introduction with logo animation",
      "Loading progress indicator",
      "Smooth transition to main app",
    ],
  },
  {
    id: "A1",
    title: "A1 (Home)",
    imagePath: "/projects/addvanced/A1-Home.png",
    altText:
      "Wireframe for Addvanced app home screen with navigation and content areas",
    features: [
      "Main navigation and search",
      "Featured content showcase",
      "Quick action buttons",
    ],
  },
  {
    id: "A17c",
    title: "A17c (Moved to Offer)",
    imagePath: "/projects/addvanced/A17c-Moved to Offer.png",
    altText:
      "Wireframe showing offer moved state with confirmation and next steps",
    features: [
      "Offer status confirmation",
      "Next steps guidance",
      "Action completion feedback",
      "User progress tracking",
    ],
  },
  {
    id: "A5",
    title: "A5 (Connection Details)",
    imagePath: "/projects/addvanced/A5-Connection Details.png",
    altText:
      "Wireframe for connection details screen with contact information and actions",
    features: [
      "Contact information display",
      "Connection status indicators",
      "Communication action buttons",
    ],
  },
];
