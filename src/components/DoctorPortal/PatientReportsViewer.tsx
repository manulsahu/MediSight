
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Search, Loader2, Trash2 } from "lucide-react";
import { getFileRecordsForPatient, FileRecord, deleteFileRecord } from "@/utils/fileStorage";
import { getAllPatients } from "@/lib/firebase";
import { collection, query, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getFileUrl, getPublicSharingUrl } from "@/utils/cloudinary";
import { useToast } from "@/hooks/use-toast";

const PatientReportsViewer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        console.log("Fetching all patients...");
        const patients = await getAllPatients();
        setAllPatients(patients || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setAllPatients([]);
      }
    };
    
    fetchPatients();
  }, []);

  useEffect(() => {
    setLoading(true);
    
    // Setup real-time listener for files collection
    const filesCollection = collection(db, "patientFiles");
    const unsubscribe = onSnapshot(filesCollection, (snapshot) => {
      const allFiles: FileRecord[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          allFiles.push({
            id: doc.id,
            patientId: data.patientId || "",
            fileName: data.fileName || "",
            fileUrl: data.fileUrl || "",
            fileType: data.fileType || "",
            uploadedAt: data.uploadedAt?.toDate() || new Date()
          });
        }
      });
      
      console.log(`Real-time update: Fetched ${allFiles.length} files from Firestore`);
      setFiles(allFiles);
      setLoading(false);
    }, (error) => {
      console.error("Error in files subscription:", error);
      setLoading(false);
    });
    
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // Filter files based on search query with comprehensive null checks
  const filteredFiles = files.filter(file => {
    if (!file) return false;
    
    // Ensure all values have defaults
    const fileName = file.fileName || "";
    const patientId = file.patientId || "";
    
    // Find patient with additional null check
    const patient = Array.isArray(allPatients) 
      ? allPatients.find(p => p && p.id === patientId) 
      : null;
    
    const patientName = patient?.name || "";
    const searchQueryLower = (searchQuery || "").toLowerCase();
    
    // Compare with safe toLowerCase calls
    return fileName.toLowerCase().includes(searchQueryLower) || 
           patientName.toLowerCase().includes(searchQueryLower);
  });

  const getPatientName = (patientId: string) => {
    if (!patientId) return "Unknown Patient";
    
    if (!Array.isArray(allPatients)) return "Unknown Patient";
    
    const patient = allPatients.find(p => p && p.id === patientId);
    return patient?.name || "Unknown Patient";
  };
  
  const handleDownload = (fileUrl: string, fileName: string) => {
    if (!fileUrl) {
      toast({
        title: "Download Failed",
        description: "File URL is missing.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a download link using our helper function
      const downloadUrl = getFileUrl(fileUrl);
      
      // Get public sharing URL
      const publicShareUrl = getPublicSharingUrl(fileUrl);
      
      // Copy to clipboard
      navigator.clipboard.writeText(publicShareUrl)
        .then(() => {
          toast({
            title: "Link copied to clipboard",
            description: "The public sharing link has been copied to your clipboard."
          });
        })
        .catch(err => console.error('Failed to copy link:', err));
      
      // Open in a new tab for PDFs so user can view/download
      const safeFileName = fileName || "file";
      if (safeFileName.toLowerCase().endsWith('.pdf')) {
        window.open(downloadUrl, '_blank');
      } else {
        // Create temporary anchor to trigger download for non-PDFs
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = safeFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description: "There was a problem downloading the file.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteFile = async (file: FileRecord) => {
    if (!file?.id || !file?.patientId) {
      toast({
        title: "Delete failed",
        description: "Missing file information.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const success = await deleteFileRecord(file.id, file.patientId, file.fileName || "", file.fileUrl || "");
      
      if (success) {
        // File deletion is now handled by the real-time listener
        toast({
          title: "Report deleted",
          description: `${file.fileName || "File"} has been deleted successfully.`,
        });
      } else {
        throw new Error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Patient Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports or patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        
        {loading ? (
          <div className="text-center py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mb-2 text-muted-foreground" />
            <p>Loading reports...</p>
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="divide-y border rounded-md">
            {filteredFiles.map((file) => (
              file && <div key={file.id} className="p-4 flex justify-between items-center">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{file.fileName || "Unnamed file"}</p>
                    <p className="text-xs text-muted-foreground">
                      {getPatientName(file.patientId || "")} · {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(file.fileUrl || "", file.fileName || "file")}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {(file.fileName || "").toLowerCase().endsWith('.pdf') ? 'View' : 'Download'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteFile(file)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No reports found. Ask patients to upload their medical reports.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientReportsViewer;
