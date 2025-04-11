
import { healthSuggestionsMap } from "./healthSuggestions";

export const analyzeHealthTrends = (reports: any[]) => {
  let bp = 0, sugar = 0, pulse = 0;

  reports.forEach((r) => {
    const d = r.extractedData;
    if (!d) return;
    if (d.systolicBP > 130 || d.diastolicBP > 80) bp++;
    if (d.sugarLevel > 140) sugar++;
    if (d.pulseRate > 100) pulse++;
  });

  const suggestions = [];
  if (bp >= 3) suggestions.push(healthSuggestionsMap.highBP);
  if (sugar >= 3) suggestions.push(healthSuggestionsMap.highSugar);
  if (pulse >= 3) suggestions.push(healthSuggestionsMap.highPulse);

  return suggestions;
};
