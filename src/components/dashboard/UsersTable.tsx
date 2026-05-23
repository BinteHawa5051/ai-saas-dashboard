"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, MoreHorizontal, Search } from "lucide-react";
import type { User, UserPlan, UserStatus } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const PLAN_VARIANT: Record<UserPlan, "default" | "secondary" | "outline"> = {
  free: "outline",
  pro: "secondary",
  enterprise: "default",
};

const STATUS_VARIANT: Record<UserStatus, "default" | "secondary" | "destructive"> = {
  active: "default",
  inactive: "secondary",
  suspended: "destructive",
};

type SortKey = keyof Pick<User, "name" | "apiCalls" | "monthlySpend" | "lastActive">;
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return users
      .filter((u) => {
        const matchesSearch =
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase());
        const matchesPlan = planFilter === "all" || u.plan === planFilter;
        const matchesStatus = statusFilter === "all" || u.status === statusFilter;
        return matchesSearch && matchesPlan && matchesStatus;
      })
      .sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDir === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return sortDir === "asc"
          ? Number(aVal) - Number(bVal)
          : Number(bVal) - Number(aVal);
      });
  }, [users, search, planFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 inline size-3" />
    ) : (
      <ChevronDown className="ml-1 inline size-3" />
    );
  };

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((u) => u.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          Manage and monitor your platform users ({filtered.length} total)
        </CardDescription>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setSelected(new Set()); // Fix F6: reset selection on filter change
              }}
              className="pl-9"
            />
          </div>
          <Select value={planFilter} onValueChange={(v) => { if (v) { setPlanFilter(v); setPage(1); setSelected(new Set()); } }}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setPage(1); setSelected(new Set()); } }}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 bg-card w-10">
                <Checkbox
                  checked={
                    paginated.length > 0 && selected.size === paginated.length
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              {/* Fix A3: aria-sort on sortable columns */}
              <TableHead
                className="cursor-pointer sticky left-10 z-10 bg-card min-w-48"
                onClick={() => toggleSort("name")}
                aria-sort={sortKey === "name" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                User <SortIcon column="name" />
              </TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => toggleSort("apiCalls")}
                aria-sort={sortKey === "apiCalls" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                API Calls <SortIcon column="apiCalls" />
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => toggleSort("monthlySpend")}
                aria-sort={sortKey === "monthlySpend" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                Spend <SortIcon column="monthlySpend" />
              </TableHead>
              <TableHead>Country</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("lastActive")}
                aria-sort={sortKey === "lastActive" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
              >
                Last Active <SortIcon column="lastActive" />
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((user) => (
              <TableRow
                key={user.id}
                className={cn(selected.has(user.id) && "bg-muted/50")}
              >
                <TableCell className="sticky left-0 z-10 bg-card">
                  <Checkbox
                    checked={selected.has(user.id)}
                    onCheckedChange={() => toggleSelect(user.id)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="sticky left-10 z-10 bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={PLAN_VARIANT[user.plan]} className="capitalize">
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[user.status]} className="capitalize">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {user.apiCalls.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  ${user.monthlySpend.toLocaleString()}
                </TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(parseISO(user.lastActive), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-8",
                      )}
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => console.info("View profile:", user.id)}>
                        View profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.info("Edit user:", user.id)}>
                        Edit user
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => console.info("Suspend user:", user.id)}
                      >
                        Suspend user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selected.size > 0 && `${selected.size} selected · `}
            Page {page} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UsersTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
        <Skeleton className="h-10 w-full mt-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-96 w-full" />
      </CardContent>
    </Card>
  );
}
