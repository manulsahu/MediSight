
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

// Mock reports data - would come from Firestore in a real app
const reports = [
  {
    id: "1",
    title: "Blood Test Results",
    doctor: "Dr. Smith",
    date: "2025-03-25",
    analysis: "All values within normal range. Slight elevation in cholesterol.",
    fileUrl: "#",
  },
  {
    id: "2",
    title: "X-Ray Report",
    doctor: "Dr. Johnson",
    date: "2025-02-15",
    analysis: "No abnormalities detected in chest X-ray.",
    fileUrl: "#",
  },
  {
    id: "3",
    title: "Annual Physical Examination",
    doctor: "Dr. Williams",
    date: "2025-01-10",
    analysis: "Patient in good health. Recommended regular exercise and dietary changes to reduce cholesterol.",
    fileUrl: "#",
  },
];

const MedicalReports = () => {
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const toggleReport = (id: string) => {
    setExpandedReport(expandedReport === id ? null : id);
  };

  const downloadReport = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    // In a real app, this would trigger a download from Firebase Storage
    console.log(`Downloading report from: ${url}`);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Medical Reports</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-4 cursor-pointer hover:bg-muted/50"
              onClick={() => toggleReport(report.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.doctor} · {report.date}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => downloadReport(e, report.fileUrl)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              {expandedReport === report.id && (
                <div className="mt-3 ml-8 text-sm">
                  <p className="font-medium text-xs text-muted-foreground mb-1">Analysis</p>
                  <p>{report.analysis}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalReports;
