"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Edit, Lock, Check } from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/global/app-sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-up");
    } else if (user) {
      getUserProfile(user.uid).then((res) => {
        if (res.success && res.data) {
          setInitialData(res.data);
          reset(res.data); // preload form values
        }
      });
    }
  }, [user, loading, router, reset]);

  const onSubmit = async (data: any) => {
    if (!user) return;
    setSaving(true);
    await updateUserProfile(user.uid, data);
    setSaving(false);
  };

  const handleInputChange = () => {
    setIsChanged(true);
  };

  const handleCancel = () => {
    reset(initialData);
    setIsChanged(false);
  };

  if (loading || !initialData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-6 max-w-xl mx-auto">
          <Card>
            <CardHeader className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={user?.photoURL || "/default-avatar.png"}
                  alt="User Avatar"
                />
                <AvatarFallback>
                  {user?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="flex flex-col gap-1">
                <span className="text-lg">{user?.displayName}</span>
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Label className="flex-1">Course</Label>
                  </div>
                  <Input {...register("course")} onChange={handleInputChange} />

                  <div className="flex items-center">
                    <Label className="flex-1">Annual Income</Label>
                  </div>
                  <Input
                    {...register("annualIncome")}
                    onChange={handleInputChange}
                  />

                  <div className="flex items-center">
                    <Label className="flex-1">State</Label>
                  </div>
                  <Input {...register("state")} onChange={handleInputChange} />

                  <div className="flex items-center">
                    <Label className="flex-1">City</Label>
                  </div>
                  <Input {...register("city")} onChange={handleInputChange} />
                </div>
                {isChanged && (
                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full md:w-auto"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="w-full md:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarProvider>
  );
}
