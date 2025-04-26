
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail, signInWithGoogle, updateUserProfile, storeDoctorData, storePatientData } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("patient");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUserTypeSelection = (type: string) => {
    setUserType(type);
    // Store the selected type in localStorage immediately
    localStorage.setItem('userType', type);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signUpWithEmail(email, password);
      if (result.user) {
        // Update the user profile with the name
        await updateUserProfile(result.user, {
          displayName: name
        });
        
        // Store user type info in localStorage for persistence
        localStorage.setItem('userType', userType);
        
        // Store user data in Firestore based on role
        if (userType === "doctor") {
          await storeDoctorData(result.user.uid, {
            email: email,
            name: name,
            photoURL: result.user.photoURL || ""
          });
          
          // Redirect to doctor dashboard
          navigate("/doctor/dashboard");
        } else {
          await storePatientData(result.user.uid, {
            email: email,
            name: name,
            photoURL: result.user.photoURL || ""
          });
          
          // Redirect to patient dashboard
          navigate("/patient/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithGoogle();
      
      if (result.user) {
        // Store user type in localStorage before redirecting
        localStorage.setItem('userType', userType);
        
        // Store user data in Firestore based on role
        if (userType === "doctor") {
          await storeDoctorData(result.user.uid, {
            email: result.user.email,
            name: result.user.displayName || result.user.email?.split('@')[0] || "",
            photoURL: result.user.photoURL || ""
          });
          
          // Redirect to doctor dashboard
          navigate("/doctor/dashboard");
        } else {
          await storePatientData(result.user.uid, {
            email: result.user.email,
            name: result.user.displayName || result.user.email?.split('@')[0] || "",
            photoURL: result.user.photoURL || ""
          });
          
          // Redirect to patient dashboard
          navigate("/patient/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Google sign up failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage: "url('https://cdn.discordapp.com/attachments/1275127310395379795/1360008947527848156/signin-back.jpg?ex=680d5508&is=680c0388&hm=32f5af3b158867c1f292f1d323bc397acf06a73760ca96a47fdb68ed64ec14fc&')",
    }}>
      <div className="w-full max-w-md p-4">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Create an Account
            </CardTitle>
            <CardDescription>
              Sign up to access healthcare services
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
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
                      type="text" 
                      placeholder="Full Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
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
                    {loading ? "Creating Account..." : "Sign Up"}
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
                  onClick={handleGoogleSignUp}
                >
                  Google
                </Button>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="doctor">
              <CardContent className="space-y-4">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
                      type="text" 
                      placeholder="Doctor Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="email" 
                      placeholder="Medical Email" 
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
                    {loading ? "Creating Account..." : "Sign Up as Doctor"}
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
                  onClick={handleGoogleSignUp}
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
              onClick={() => navigate("/signin")}
            >
              Already have an account? Sign in
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
