
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientReportUploadProps {
  patientName: string;
  existingReports?: Array<{
    title: string;
    date: string;
    url: string;
  }>;
  onReportUploaded?: (reports: Array<{ title: string; date: string; url: string }>) => void;
}

const PatientReportUpload: React.FC<PatientReportUploadProps> = ({
  patientName,
  existingReports = [],
  onReportUploaded,
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    // In a real app, this would upload to Firebase Storage
    setTimeout(() => {
      const newFiles = Array.from(files).map((file) => file.name);
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Create new report objects
      const newReports = newFiles.map((title) => ({
        title,
        date: new Date().toISOString().split("T")[0],
        url: "#"
      }));

      // Notify parent component
      if (onReportUploaded) {
        onReportUploaded(newReports);
      }

      setIsUploading(false);
      toast({
        title: "Report uploaded successfully",
        description: `${files.length} file(s) have been uploaded for ${patientName}.`,
      });
    }, 1500);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <FileText size={16} className="mr-2" />
          Patient Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="border-2 border-dashed rounded-lg p-4 text-center border-muted relative">
            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="mb-1 text-sm text-muted-foreground">
              Upload report for {patientName}
            </p>
            <p className="text-xs text-muted-foreground">PDF (up to 10MB)</p>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>

          {existingReports.length > 0 && (
            <div className="divide-y border rounded-lg">
              {existingReports.map((report, idx) => (
                <div
                  key={idx}
                  className="py-2 px-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">{report.title}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {uploadedFiles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Newly Uploaded:</h4>
              <ul className="space-y-1">
                {uploadedFiles.map((file, idx) => (
                  <li key={idx} className="text-sm flex items-center">
                    <FileText size={14} className="mr-1 text-muted-foreground" />
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientReportUpload;
