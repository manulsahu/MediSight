
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

// Mock recommendations - would come from Firebase/AI analysis
const recommendations = [
  {
    id: "1",
    title: "Increase Water Intake",
    description:
      "Based on your recent lab results, we recommend drinking at least 8 glasses of water daily to improve kidney function.",
    source: "AI Analysis",
  },
  {
    id: "2",
    title: "Daily Walking",
    description:
      "30 minutes of walking each day can help lower your blood pressure and improve cardiovascular health.",
    source: "Dr. Smith",
  },
  {
    id: "3",
    title: "Reduce Sodium Intake",
    description:
      "Your recent blood pressure readings suggest you should limit salt consumption to less than 2,300mg per day.",
    source: "AI Analysis",
  },
];

const HealthRecommendations = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="p-4 hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{recommendation.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {recommendation.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Source: {recommendation.source}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRecommendations;
