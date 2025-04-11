
import React, { useEffect, useState } from "react";
import { analyzeHealthTrends } from "@/utils/analyzeHealthTrends";
import { extractHealthDataFromImage } from "@/utils/extractHealthData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const HealthSuggestions: React.FC = () => {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      try {
        // In a real app, fetch actual reports from Firestore or another source
        const filesRef = collection(db, "patientFiles");
        const q = query(filesRef, where("patientId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedReports: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedReports.push({
            id: doc.id,
            fileName: data.fileName || "",
            fileUrl: data.fileUrl || "",
            uploadedAt: data.uploadedAt?.toDate() || new Date()
          });
        });
        
        setReports(fetchedReports);
        
        // For demonstration, we're using mock data since we can't actually analyze the PDFs here
        generateMockData(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [user]);

  // This function simulates extracting health data from reports
  // In a real app, you'd use the actual extractHealthDataFromImage function
  const generateMockData = (reports: any[]) => {
    // Generate mock data based on the number of reports
    const mockData = reports.slice(0, 5).map((report, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - index);
      
      // Generate some random values for demonstration
      const systolicBP = Math.floor(Math.random() * 40) + 110; // 110-150
      const diastolicBP = Math.floor(Math.random() * 20) + 70; // 70-90
      const sugarLevel = Math.floor(Math.random() * 80) + 100; // 100-180
      const pulseRate = Math.floor(Math.random() * 30) + 65; // 65-95
      
      return {
        ...report,
        extractedData: {
          systolicBP,
          diastolicBP,
          sugarLevel,
          pulseRate
        },
        date: date.toLocaleDateString()
      };
    });
    
    // Format data for the chart
    const chartData = mockData.map(item => ({
      date: item.date,
      systolicBP: item.extractedData.systolicBP,
      diastolicBP: item.extractedData.diastolicBP,
      sugarLevel: item.extractedData.sugarLevel,
      pulseRate: item.extractedData.pulseRate
    })).reverse(); // Reverse to show chronological order
    
    setChartData(chartData);
    
    // Run the analysis on the mock data
    const results = analyzeHealthTrends(mockData);
    setTips(results);
  };

  const openReportAnalysis = () => {
    // Create a new window for the report
    const reportWindow = window.open('', '_blank', 'width=800,height=600');
    if (!reportWindow) return;
    
    // Generate HTML content for the new window
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Health Report Analysis</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; }
          .chart-container { height: 300px; }
        </style>
      </head>
      <body class="bg-gray-50">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-2xl font-bold mb-6">Health Report Analysis</h1>
          
          <div class="bg-white shadow rounded-lg p-6 mb-8">
            <h2 class="text-xl font-semibold mb-4">Health Metrics Over Time</h2>
            <div class="chart-container">
              <canvas id="healthChart"></canvas>
            </div>
          </div>
          
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Health Suggestions</h2>
            ${tips.length === 0 ? 
              '<p class="text-green-600 font-medium">No frequent health issues detected! 🎉</p>' : 
              tips.map(tip => `
                <div class="mb-6 p-4 border rounded-md bg-blue-50">
                  <h3 class="font-bold text-lg">${tip.label}</h3>
                  <p class="mt-2"><strong>Diet:</strong> ${tip.diet}</p>
                  <p class="mt-1"><strong>Exercise:</strong> ${tip.exercise}</p>
                </div>
              `).join('')
            }
          </div>
        </div>
        
        <script>
          // Data from your React app
          const chartData = ${JSON.stringify(chartData)};
          
          // Create the chart
          const ctx = document.getElementById('healthChart').getContext('2d');
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: chartData.map(item => item.date),
              datasets: [
                {
                  label: 'Systolic BP',
                  data: chartData.map(item => item.systolicBP),
                  borderColor: 'rgb(255, 99, 132)',
                  tension: 0.1
                },
                {
                  label: 'Diastolic BP',
                  data: chartData.map(item => item.diastolicBP),
                  borderColor: 'rgb(54, 162, 235)',
                  tension: 0.1
                },
                {
                  label: 'Sugar Level',
                  data: chartData.map(item => item.sugarLevel),
                  borderColor: 'rgb(255, 206, 86)',
                  tension: 0.1
                },
                {
                  label: 'Pulse Rate',
                  data: chartData.map(item => item.pulseRate),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false
                }
              }
            }
          });
        </script>
      </body>
      </html>
    `;
    
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Health Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2">Analyzing reports...</span>
          </div>
        ) : reports.length < 2 ? (
          <p className="text-muted-foreground text-center py-4">
            Upload at least 2 medical reports for AI analysis
          </p>
        ) : (
          <>
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="systolicBP" stroke="#ff0000" name="Systolic BP" />
                  <Line type="monotone" dataKey="diastolicBP" stroke="#0000ff" name="Diastolic BP" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {tips.length > 0 ? tips.slice(0, 1).map((tip, idx) => (
                <div key={idx} className="p-3 bg-blue-50 rounded-md border border-blue-100">
                  <h3 className="font-medium">{tip.label}</h3>
                  <p className="text-sm mt-1"><strong>Diet:</strong> {tip.diet}</p>
                </div>
              )) : (
                <p className="text-green-600 font-medium">No health issues detected.</p>
              )}
              
              <button
                onClick={openReportAnalysis}
                className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
              >
                View Full Analysis
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthSuggestions;
