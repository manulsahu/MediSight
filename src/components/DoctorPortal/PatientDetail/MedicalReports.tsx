
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { FileRecord, uploadAndStoreFile, deleteFileRecord } from "@/utils/fileStorage";
import { getFileUrl, getPublicSharingUrl } from "@/utils/cloudinary";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type MedicalReportsProps = {
  patient: any;
  setPatient: React.Dispatch<React.SetStateAction<any>>;
};

export const MedicalReports = ({ patient, setPatient }: MedicalReportsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [patientFiles, setPatientFiles] = useState<FileRecord[]>([]);
  
  useEffect(() => {
    // Set up real-time listener for this patient's files
    if (!patient || !patient.id) return;
    
    setIsLoading(true);
    const filesCollection = collection(db, "patientFiles");
    const patientFilesQuery = query(filesCollection, where("patientId", "==", patient.id));
    
    const unsubscribe = onSnapshot(patientFilesQuery, (snapshot) => {
      const files: FileRecord[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        files.push({
          id: doc.id,
          patientId: data.patientId,
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          fileType: data.fileType,
          uploadedAt: data.uploadedAt?.toDate() || new Date()
        });
      });
      
      console.log(`Real-time update: Fetched ${files.length} files for patient ${patient.id}`);
      setPatientFiles(files);
      setIsLoading(false);
    }, (error) => {
      console.error("Error in patient files subscription:", error);
      setIsLoading(false);
    });
    
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [patient]);
  
  const handleDownload = (fileUrl: string, fileName: string) => {
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
      if (fileName.toLowerCase().endsWith('.pdf')) {
        window.open(downloadUrl, '_blank');
      } else {
        // Create temporary anchor to trigger download for non-PDFs
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description: "There was a problem downloading the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !patient || !patient.id) return;

    setIsUploading(true);
    try {
      // Process each file
      for (const file of Array.from(files)) {
        console.log(`Uploading file for patient: ${file.name}`);
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is too large. Maximum size is 10MB.`,
            variant: "destructive"
          });
          continue;
        }
        
        // Upload to Cloudinary and store in Firestore
        await uploadAndStoreFile(file, patient.id);
        // No need to update state as the real-time listener will handle it
      }
      
      toast({
        title: "Report uploaded",
        description: `${files.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteFile = async (file: FileRecord) => {
    if (!file.id || !patient.id) return;
    
    try {
      const success = await deleteFileRecord(file.id, patient.id, file.fileName, file.fileUrl);
      
      if (success) {
        // No need to update state as the real-time listener will handle it
        toast({
          title: "Report deleted",
          description: `${file.fileName} has been deleted successfully.`,
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
  
  if (!patient) return null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center">
            <FileText size={16} className="mr-2" />
            Medical Reports
          </div>
          <div>
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => document.getElementById('doctor-upload-report')?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              Upload Report
            </Button>
            <input 
              type="file"
              id="doctor-upload-report" 
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : patientFiles.length > 0 ? (
            <div className="divide-y">
              {patientFiles.map((file, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDownload(file.fileUrl, file.fileName)}
                    >
                      <Download size={14} className="mr-1" />
                      {file.fileName.toLowerCase().endsWith('.pdf') ? 'View' : 'Download'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteFile(file)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No reports available for this patient.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
