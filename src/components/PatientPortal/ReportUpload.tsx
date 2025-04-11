import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { uploadAndStoreFile, FileRecord, getFileRecordsForPatient, deleteFileRecord } from "@/utils/fileStorage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getFileUrl, getPublicSharingUrl } from "@/utils/cloudinary";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ReportUpload = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileRecord[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    
    const filesCollection = collection(db, "patientFiles");
    const patientFilesQuery = query(filesCollection, where("patientId", "==", user.uid));
    
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
      
      console.log(`Real-time update: Fetched ${files.length} files for patient ${user.uid}`);
      setUploadedFiles(files);
    }, (error) => {
      console.error("Error in patient files subscription:", error);
    });
    
    return () => unsubscribe();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setIsUploading(true);
    setUploadError(null);
    
    try {
      for (const file of Array.from(files)) {
        console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);
        
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
        }
        
        await uploadAndStoreFile(file, user.uid);
      }
      
      toast({
        title: "Report uploaded successfully",
        description: `${files.length} file(s) have been uploaded to your doctor.`,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError(error instanceof Error ? error.message : "Unknown error uploading files");
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0 || !user) return;

    setIsUploading(true);
    setUploadError(null);
    
    try {
      for (const file of Array.from(files)) {
        console.log(`Uploading dropped file: ${file.name}, size: ${file.size}, type: ${file.type}`);
        await uploadAndStoreFile(file, user.uid);
      }
      
      toast({
        title: "Report uploaded successfully",
        description: `${files.length} file(s) have been uploaded to your doctor.`,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError(error instanceof Error ? error.message : "Unknown error uploading files");
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleViewFile = (fileUrl: string, fileName: string) => {
    const downloadUrl = getFileUrl(fileUrl);
    
    const publicShareUrl = getPublicSharingUrl(fileUrl);
    
    navigator.clipboard.writeText(publicShareUrl)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "The public sharing link has been copied to your clipboard."
        });
      })
      .catch(err => console.error('Failed to copy link:', err));
    
    if (fileName.toLowerCase().endsWith('.pdf')) {
      window.open(downloadUrl, '_blank');
    } else {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  const handleDeleteFile = async (file: FileRecord) => {
    if (!file.id || !user?.uid) return;
    
    try {
      const success = await deleteFileRecord(file.id, user.uid, file.fileName, file.fileUrl);
      
      if (success) {
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

  return (
    <Card className="h-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Upload Medical Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center border-muted relative ${isUploading ? 'opacity-50' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="py-2">
                <Loader2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG (up to 10MB)</p>
              </>
            )}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Uploaded Files</h3>
              <ul className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between text-sm p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{file.fileName}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewFile(file.fileUrl, file.fileName)}
                      >
                        {file.fileName.toLowerCase().endsWith('.pdf') ? 'View' : 'Download'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteFile(file)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Button disabled={isUploading} onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}>
            {isUploading ? "Uploading..." : "Upload Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportUpload;
