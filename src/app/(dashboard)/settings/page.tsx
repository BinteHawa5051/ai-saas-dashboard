"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Copy, Key, Plus, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { CURRENT_USER } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  company: z.string().min(1, "Company is required"),
  bio: z.string().max(280, "Bio must be 280 characters or fewer"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ApiKey {
  id: string;
  name: string;
  masked: string;
  createdAt: string;
}

const INITIAL_API_KEYS: ApiKey[] = [
  { id: "key-1", name: "Production",  masked: "sk-prod-••••••••••••4f2a", createdAt: "2025-03-12" },
  { id: "key-2", name: "Development", masked: "sk-dev-••••••••••••8b1c",  createdAt: "2025-01-08" },
];

const SETTINGS_TABS = ["profile", "api-keys", "notifications", "appearance"] as const;
type SettingsTab = (typeof SETTINGS_TABS)[number];

function isSettingsTab(value: string | null): value is SettingsTab {
  return SETTINGS_TABS.includes(value as SettingsTab);
}

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = searchParams.get("tab");
  const activeTab = useMemo(
    () => (isSettingsTab(tabFromUrl) ? tabFromUrl : "profile"),
    [tabFromUrl],
  );

  const { theme, setTheme } = useTheme();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [notifications, setNotifications] = useState({
    apiAlerts: true,
    billing: true,
    productUpdates: false,
    security: true,
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(CURRENT_USER.avatar);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: CURRENT_USER.name,
      email: CURRENT_USER.email,
      company: CURRENT_USER.company,
      bio: "Building intelligent products with NeuralDesk AI infrastructure.",
    },
  });

  // #15: avatar file picker wired up
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  // #21: copy shows visual feedback (masked value — real app copies actual secret at generation time)
  const copyKey = (masked: string, id: string) => {
    void navigator.clipboard.writeText(masked);
    setCopyStatus((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setCopyStatus((prev) => ({ ...prev, [id]: false })), 2000);
  };

  const revokeKey = (id: string) => setApiKeys((keys) => keys.filter((k) => k.id !== id));

  const generateKey = () => {
    setApiKeys((keys) => [
      ...keys,
      {
        id: `key-${Date.now()}`,
        name: "New Key",
        masked: `sk-new-••••••••••••${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  // #14: save handler gives real feedback
  const onSubmit = (values: ProfileFormValues) => {
    console.info("Profile saved:", values);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  // #11: clicking a tab updates the URL so back/forward and deep links work
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences and workspace configuration
        </p>
      </div>

      <Tabs key={activeTab} defaultValue={activeTab} onValueChange={handleTabChange}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* ── Profile ── */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarImage src={avatarPreview} alt={CURRENT_USER.name} />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  {/* #15: hidden file input wired to button */}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-label="Upload avatar"
                    onChange={handleAvatarChange}
                  />
                  <Button type="button" variant="outline" size="sm"
                    onClick={() => avatarInputRef.current?.click()}>
                    Change avatar
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...form.register("name")} />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...form.register("email")} />
                    {form.formState.errors.email && (
                      <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" {...form.register("company")} />
                    {form.formState.errors.company && (
                      <p className="text-xs text-destructive">{form.formState.errors.company.message}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" {...form.register("bio")} />
                    {form.formState.errors.bio && (
                      <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit">Save changes</Button>
                  {/* #14: success feedback */}
                  {saveStatus === "saved" && (
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                      ✓ Profile saved
                    </span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── API Keys ── */}
        <TabsContent value="api-keys" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage keys used to authenticate API requests</CardDescription>
              </div>
              <Button size="sm" onClick={generateKey}>
                <Plus className="mr-2 size-4" />
                Generate key
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <code className="flex items-center gap-2 rounded bg-muted px-2 py-1 text-xs font-mono">
                          <Key className="size-3 text-muted-foreground" />
                          {key.masked}
                        </code>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{key.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {/* #21: copy with visual feedback */}
                          <Button
                            variant="ghost" size="icon"
                            className={cn("size-8", copyStatus[key.id] && "text-emerald-500")}
                            onClick={() => copyKey(key.masked, key.id)}
                            aria-label={copyStatus[key.id] ? "Copied!" : "Copy key"}
                            title={copyStatus[key.id] ? "Copied!" : "Copy key"}
                          >
                            <Copy className="size-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="size-8 text-destructive"
                            onClick={() => revokeKey(key.id)}
                            aria-label="Revoke key"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications ── */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what updates you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(
                [
                  ["apiAlerts",      "API alerts",       "Get notified when usage exceeds thresholds"],
                  ["billing",        "Billing updates",  "Invoices, payments, and plan changes"],
                  ["productUpdates", "Product updates",  "New features and model releases"],
                  ["security",       "Security alerts",  "Login attempts and key changes"],
                ] as const
              ).map(([key, title, description]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <Switch
                    checked={notifications[key]}
                    onCheckedChange={(checked) =>
                      setNotifications((n) => ({ ...n, [key]: checked === true }))
                    }
                    aria-label={title}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Appearance ── */}
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how NeuralDesk looks for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* #13: single theme control — Select only, ThemeToggle removed from here */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Color scheme</p>
                  <p className="text-sm text-muted-foreground">Select your preferred theme mode</p>
                </div>
                <Select value={theme ?? "system"} onValueChange={(v) => { if (v) setTheme(v); }}>
                  <SelectTrigger className="w-36" aria-label="Color scheme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* #12: density select now has a live visual preview */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Density</p>
                  <p className="text-sm text-muted-foreground">Adjust spacing across the interface</p>
                </div>
                <Select
                  value={density}
                  onValueChange={(v) => { if (v) setDensity(v as "comfortable" | "compact"); }}
                >
                  <SelectTrigger className="w-36" aria-label="Interface density">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* #12: live density preview so the setting visibly does something */}
              <div className={cn(
                "rounded-lg border border-dashed border-border transition-all duration-200",
                density === "compact" ? "p-2" : "p-5",
              )}>
                <p className="mb-2 text-center text-xs text-muted-foreground">
                  Preview — <span className="font-medium capitalize">{density}</span>
                </p>
                <div className={cn("flex flex-col", density === "compact" ? "gap-0.5" : "gap-3")}>
                  {["Dashboard item", "Analytics item", "Settings item"].map((item) => (
                    <div
                      key={item}
                      className={cn(
                        "rounded bg-muted text-xs text-muted-foreground transition-all duration-200",
                        density === "compact" ? "px-2 py-0.5" : "px-3 py-2",
                      )}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading settings…</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
