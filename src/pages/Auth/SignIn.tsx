
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmail, signInWithGoogle, checkUserRole, storeDoctorData, storePatientData } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("patient");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    // Store the selected type in localStorage immediately
    localStorage.setItem('userType', type);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signInWithEmail(email, password);
      
      if (result.user) {
        // Check if user has a role in Firestore
        const existingRole = await checkUserRole(result.user.uid);
        
        if (existingRole) {
          // If user already has a role, use that
          localStorage.setItem('userType', existingRole);
          
          if (existingRole === "doctor") {
            navigate("/doctor/dashboard");
          } else {
            navigate("/patient/dashboard");
          }
        } else {
          // If no role exists, use the selected userType
          localStorage.setItem('userType', userType);
          
          // Store user data in Firestore based on selected role
          if (userType === "doctor") {
            await storeDoctorData(result.user.uid, {
              email: result.user.email,
              name: result.user.displayName || result.user.email?.split('@')[0] || "",
              photoURL: result.user.photoURL || ""
            });
            navigate("/doctor/dashboard");
          } else {
            await storePatientData(result.user.uid, {
              email: result.user.email,
              name: result.user.displayName || result.user.email?.split('@')[0] || "",
              photoURL: result.user.photoURL || ""
            });
            navigate("/patient/dashboard");
          }
        }
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      
      if (result.user) {
        // Check if user has a role in Firestore
        const existingRole = await checkUserRole(result.user.uid);
        
        if (existingRole) {
          // If user already has a role, use that
          localStorage.setItem('userType', existingRole);
          
          if (existingRole === "doctor") {
            navigate("/doctor/dashboard");
          } else {
            navigate("/patient/dashboard");
          }
        } else {
          // If no role exists, use the selected userType
          localStorage.setItem('userType', userType);
          
          // Store user data in Firestore based on selected role
          if (userType === "doctor") {
            await storeDoctorData(result.user.uid, {
              email: result.user.email,
              name: result.user.displayName || result.user.email?.split('@')[0] || "",
              photoURL: result.user.photoURL || ""
            });
            navigate("/doctor/dashboard");
          } else {
            await storePatientData(result.user.uid, {
              email: result.user.email,
              name: result.user.displayName || result.user.email?.split('@')[0] || "",
              photoURL: result.user.photoURL || ""
            });
            navigate("/patient/dashboard");
          }
        }
      }
    } catch (error) {
      toast({
        title: "Google sign in failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage: "url('https://cdn.discordapp.com/attachments/1275127310395379795/1360008947527848156/signin-back.jpg?ex=67f98e88&is=67f83d08&hm=fccb981fa73a81a02752bc05aa6a308b158326ce3c88c1fe04242624683c206a&format=webp&width=882&height=882')",
    }}>
      <div className="w-full max-w-md p-4">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              MediSight
            </CardTitle>
            <CardDescription>
              Sign in to access your health information
            </CardDescription>
          </CardHeader>
          
          <Tabs 
            defaultValue="patient" 
            className="w-full"
            onValueChange={handleUserTypeSelection}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient">
              <CardContent className="space-y-4">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  Google
                </Button>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="doctor">
              <CardContent className="space-y-4">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
                      type="email" 
                      placeholder="Doctor Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In as Doctor"}
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  Google
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex flex-col">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate("/signup")}
            >
              Don't have an account? Sign up
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
