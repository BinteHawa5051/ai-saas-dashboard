"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Bell,
  Check,
  Copy,
  Key,
  Palette,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { CURRENT_USER } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ─── Schema ─────────────────────────────────────────────── */
// Use a simple schema — no complex union types that break across Zod versions
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  company: z.string().min(1, "Company is required"),
  bio: z.string().max(280, "Bio must be 280 characters or fewer"),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

/* ─── Types ───────────────────────────────────────────────── */
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

/* ─── Nav config ──────────────────────────────────────────── */
const SETTINGS_TABS = ["profile", "api-keys", "notifications", "appearance"] as const;
type SettingsTab = (typeof SETTINGS_TABS)[number];

const TAB_CONFIG: {
  id: SettingsTab;
  label: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}[] = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    description: "Personal info & avatar",
  },
  {
    id: "api-keys",
    label: "API Keys",
    icon: Key,
    description: "Manage access tokens",
    badge: "2",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Alerts & updates",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Theme & density",
  },
];

function isSettingsTab(value: string | null): value is SettingsTab {
  return SETTINGS_TABS.includes(value as SettingsTab);
}

/* ─── Main component ──────────────────────────────────────── */
function SettingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = searchParams.get("tab");
  const activeTab: SettingsTab = isSettingsTab(tabFromUrl) ? tabFromUrl : "profile";

  const { theme, setTheme } = useTheme();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [notifications, setNotifications] = useState({
    apiAlerts: true,
    billing: true,
    productUpdates: false,
    security: true,
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const copyKey = (masked: string, id: string) => {
    void navigator.clipboard.writeText(masked);
    setCopyStatus((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setCopyStatus((prev) => ({ ...prev, [id]: false })), 2000);
  };

  const revokeKey = (id: string) =>
    setApiKeys((keys) => keys.filter((k) => k.id !== id));

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

  const onSubmit = (values: ProfileFormValues) => {
    setSaveStatus("saving");
    setTimeout(() => {
      console.info("Profile saved:", values);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }, 600);
  };

  const handleTabChange = (tab: SettingsTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const activeConfig = TAB_CONFIG.find((t) => t.id === activeTab)!;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences and workspace configuration
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">

        {/* ── Left nav ── */}
        <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-x-visible">
          {TAB_CONFIG.map(({ id, label, icon: Icon, description, badge }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabChange(id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "border-primary/30 bg-primary text-primary-foreground shadow-sm"
                    : "border-transparent bg-muted/40 text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Icon container */}
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "bg-background text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </div>

                {/* Label + description — hidden on mobile, shown on lg */}
                <div className="hidden min-w-0 flex-1 lg:block">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{label}</span>
                    {badge && (
                      <Badge
                        variant={isActive ? "outline" : "secondary"}
                        className={cn(
                          "h-5 min-w-5 px-1.5 text-[10px]",
                          isActive && "border-primary-foreground/40 text-primary-foreground",
                        )}
                      >
                        {badge}
                      </Badge>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-0.5 truncate text-xs",
                      isActive ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {description}
                  </p>
                </div>

                {/* Mobile: just show label below icon */}
                <span className="text-xs font-medium lg:hidden">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── Right content ── */}
        <div className="min-w-0 flex-1">
          {/* Section header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <activeConfig.icon className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold">{activeConfig.label}</h3>
              <p className="text-xs text-muted-foreground">{activeConfig.description}</p>
            </div>
          </div>

          {/* ── Profile ── */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your name, email, and public profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Avatar row */}
                  <div className="flex items-center gap-5 rounded-xl border border-border bg-muted/30 p-4">
                    <Avatar className="size-20 ring-2 ring-border ring-offset-2 ring-offset-background">
                      <AvatarImage src={avatarPreview} alt={CURRENT_USER.name} />
                      <AvatarFallback className="text-lg">
                        {CURRENT_USER.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{CURRENT_USER.name}</p>
                      <p className="text-xs text-muted-foreground">{CURRENT_USER.email}</p>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        aria-label="Upload avatar"
                        onChange={handleAvatarChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 h-8 text-xs"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        Change photo
                      </Button>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" placeholder="Sofia Martinez" {...form.register("name")} />
                      {form.formState.errors.name && (
                        <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" placeholder="sofia@example.com" {...form.register("email")} />
                      {form.formState.errors.email && (
                        <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="NeuralDesk Inc." {...form.register("company")} />
                      {form.formState.errors.company && (
                        <p className="text-xs text-destructive">{form.formState.errors.company.message}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="bio">
                        Bio{" "}
                        <span className="text-xs text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="bio"
                        placeholder="Tell us about yourself…"
                        {...form.register("bio")}
                      />
                      {form.formState.errors.bio && (
                        <p className="text-xs text-destructive">{form.formState.errors.bio.message}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      disabled={saveStatus === "saving"}
                      className="min-w-32"
                    >
                      {saveStatus === "saving" ? (
                        "Saving…"
                      ) : saveStatus === "saved" ? (
                        <span className="flex items-center gap-2">
                          <Check className="size-4" /> Saved
                        </span>
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* ── API Keys ── */}
          {activeTab === "api-keys" && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Keys used to authenticate requests to the NeuralDesk API
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={generateKey} className="shrink-0">
                    <Plus className="mr-2 size-4" />
                    Generate key
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Info banner */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
                  <strong>Keep your keys secret.</strong> Never share them in public repositories or client-side code.
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-emerald-500" />
                            <span className="font-medium">{key.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="flex items-center gap-2 rounded-md border border-border bg-muted px-2 py-1 text-xs font-mono">
                            <Key className="size-3 shrink-0 text-muted-foreground" />
                            {key.masked}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {key.createdAt}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "size-8 transition-colors",
                                copyStatus[key.id]
                                  ? "text-emerald-500 hover:text-emerald-500"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                              onClick={() => copyKey(key.masked, key.id)}
                              aria-label={copyStatus[key.id] ? "Copied!" : "Copy key"}
                              title={copyStatus[key.id] ? "Copied!" : "Copy key"}
                            >
                              {copyStatus[key.id] ? (
                                <Check className="size-4" />
                              ) : (
                                <Copy className="size-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() => revokeKey(key.id)}
                              aria-label="Revoke key"
                              title="Revoke key"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {apiKeys.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                          No API keys yet. Generate one to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose which events trigger notifications for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {(
                  [
                    {
                      key: "apiAlerts" as const,
                      title: "API alerts",
                      description: "Get notified when usage exceeds thresholds",
                      icon: "🔔",
                    },
                    {
                      key: "billing" as const,
                      title: "Billing updates",
                      description: "Invoices, payments, and plan changes",
                      icon: "💳",
                    },
                    {
                      key: "productUpdates" as const,
                      title: "Product updates",
                      description: "New features and model releases",
                      icon: "🚀",
                    },
                    {
                      key: "security" as const,
                      title: "Security alerts",
                      description: "Login attempts and key changes",
                      icon: "🔒",
                    },
                  ]
                ).map(({ key, title, description, icon }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-xl leading-none">{icon}</span>
                      <div>
                        <p className="text-sm font-medium">{title}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs font-medium",
                        notifications[key] ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                      )}>
                        {notifications[key] ? "On" : "Off"}
                      </span>
                      <Switch
                        checked={notifications[key]}
                        onCheckedChange={(checked) =>
                          setNotifications((n) => ({ ...n, [key]: checked === true }))
                        }
                        aria-label={title}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* ── Appearance ── */}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              {/* Theme card */}
              <Card>
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                  <CardDescription>Choose how NeuralDesk looks for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTheme(t)}
                        className={cn(
                          "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          (theme ?? "system") === t
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/40 hover:bg-muted/50",
                        )}
                        aria-pressed={(theme ?? "system") === t}
                      >
                        {/* Theme preview swatch */}
                        <div className={cn(
                          "flex size-12 items-center justify-center rounded-lg text-xl shadow-sm",
                          t === "light" && "bg-white text-gray-800",
                          t === "dark"  && "bg-gray-900 text-white",
                          t === "system" && "bg-gradient-to-br from-white to-gray-900",
                        )}>
                          {t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"}
                        </div>
                        <span className="text-xs font-medium capitalize">{t}</span>
                        {(theme ?? "system") === t && (
                          <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Density card */}
              <Card>
                <CardHeader>
                  <CardTitle>Interface Density</CardTitle>
                  <CardDescription>Adjust the spacing and size of UI elements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {(["comfortable", "compact"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDensity(d)}
                        className={cn(
                          "relative flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          density === d
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/40 hover:bg-muted/50",
                        )}
                        aria-pressed={density === d}
                      >
                        <span className="text-sm font-medium capitalize">{d}</span>
                        <div className={cn("flex flex-col", d === "compact" ? "gap-0.5" : "gap-2")}>
                          {[60, 80, 50].map((w, i) => (
                            <div
                              key={i}
                              className={cn(
                                "rounded bg-muted",
                                d === "compact" ? "h-1.5" : "h-2.5",
                              )}
                              style={{ width: `${w}%` }}
                            />
                          ))}
                        </div>
                        {density === d && (
                          <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Live preview */}
                  <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
                    <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Live preview
                    </p>
                    <div className={cn("flex flex-col", density === "compact" ? "gap-1" : "gap-3")}>
                      {["Overview", "Analytics", "Models"].map((item) => (
                        <div
                          key={item}
                          className={cn(
                            "flex items-center gap-2 rounded-lg bg-background border border-border transition-all duration-200",
                            density === "compact" ? "px-2 py-1" : "px-3 py-2.5",
                          )}
                        >
                          <div className={cn(
                            "rounded bg-primary/20",
                            density === "compact" ? "size-3" : "size-4",
                          )} />
                          <span className={cn(
                            "font-medium text-foreground",
                            density === "compact" ? "text-xs" : "text-sm",
                          )}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          Loading settings…
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}
