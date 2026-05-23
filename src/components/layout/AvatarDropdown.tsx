import { Link, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AvatarDropdown() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const initials = (user?.username ?? "??").slice(0, 2).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Account menu"
          className="group relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-primary opacity-70 blur-sm group-hover:opacity-100 transition-opacity" />
          <Avatar className="relative h-9 w-9 border border-border">
            <AvatarFallback className="bg-card font-display font-semibold text-sm">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 glass border-border">
        <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
          <span className="font-display text-sm font-semibold">{user?.username ?? "Guest"}</span>
          <span className="text-xs font-normal text-muted-foreground">{user?.email ?? ""}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/support" className="flex items-center gap-2 cursor-pointer">
            <ShieldCheck className="h-4 w-4" /> Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => { logout(); nav({ to: "/" }); }}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
