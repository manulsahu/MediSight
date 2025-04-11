
import Tesseract from 'tesseract.js';

export const extractHealthDataFromImage = async (imageUrl: string) => {
  const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng');

  const getValue = (keyword: string) => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escapedKeyword}\\s*[:=]?\\s*(\\d{2,3})`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1]) : null;
  };

  return {
    systolicBP: getValue("Systolic") || getValue("BP"),
    diastolicBP: getValue("Diastolic"),
    sugarLevel: getValue("Sugar") || getValue("Glucose"),
    pulseRate: getValue("Pulse") || getValue("Heart Rate"),
    rawText: text,
  };
};
