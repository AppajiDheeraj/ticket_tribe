"use client";

import { GeneratedAvatar } from "@/components/generated-avtar";
import {
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Users, Trophy, Plus, Search } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  /** ------------------------------------
   *  🔥 TICKERTRIBE DUMMY FRONTEND DATA
   * -----------------------------------*/
  const stocks = [
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "TSLA", name: "Tesla Motors" },
    { ticker: "NVDA", name: "NVIDIA" },
    { ticker: "GOOGL", name: "Alphabet" },
  ];

  const tribes = [
    { id: "t1", name: "Alpha Traders", code: "238992" },
    { id: "t2", name: "Bull Gang", code: "112233" },
    { id: "t3", name: "Market Ninjas", code: "778899" },
  ];

  const members = [
    { id: "u1", name: "Rahul" },
    { id: "u2", name: "Priya" },
    { id: "u3", name: "Arjun" },
  ];

  /** ------------------------------------
   *  🔎 SEARCH FILTER LOGIC
   * -----------------------------------*/
  const filteredStocks = stocks.filter(
    (s) =>
      s.ticker.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTribes = tribes.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CommandResponsiveDialog
      shouldFilter={false}
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder="Search stocks, tribes, members..."
        value={search}
        onValueChange={setSearch}
      />

      <CommandList>

        {/* ------------------ STOCKS ------------------ */}
        <CommandGroup heading="Stocks">
          {filteredStocks.length === 0 && (
            <CommandEmpty>No stocks found</CommandEmpty>
          )}

          {filteredStocks.map((stock) => (
            <CommandItem
              key={stock.ticker}
              onSelect={() => {
                setOpen(false);
                console.log("Navigate to stock:", stock);
                // router.push(`/stocks/${stock.ticker}`)
              }}
            >
              <Search className="size-4 mr-2" />
              {stock.ticker} • {stock.name}
            </CommandItem>
          ))}
        </CommandGroup>

        {/* ------------------ TRIBES ------------------ */}
        <CommandGroup heading="Tribes">
          {filteredTribes.length === 0 && (
            <CommandEmpty>No tribes found</CommandEmpty>
          )}

          {filteredTribes.map((tribe) => (
            <CommandItem
              key={tribe.id}
              onSelect={() => {
                setOpen(false);
                console.log("Navigate to tribe:", tribe);
                // router.push(`/tribe/${tribe.id}`)
              }}
            >
              <Users className="size-4 mr-2" />
              {tribe.name} (#{tribe.code})
            </CommandItem>
          ))}

          {/* Quick Action - Create Tribe */}
          <CommandItem
            onSelect={() => {
              setOpen(false);
              console.log("Create Tribe");
              // router.push("/create-tribe")
            }}
          >
            <Plus className="size-4 mr-2" /> Create New Tribe
          </CommandItem>
        </CommandGroup>

        {/* ------------------ MEMBERS ------------------ */}
        <CommandGroup heading="Members">
          {filteredMembers.length === 0 && (
            <CommandEmpty>No members found</CommandEmpty>
          )}

          {filteredMembers.map((m) => (
            <CommandItem
              key={m.id}
              onSelect={() => {
                setOpen(false);
                console.log("Open member:", m);
                // router.push(`/profile/${m.id}`)
              }}
            >
              <GeneratedAvatar seed={m.name} variant="initials" className="size-5 mr-2" />
              {m.name}
            </CommandItem>
          ))}
        </CommandGroup>

        {/* ------------------ QUICK ACTIONS ------------------ */}
        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              console.log("Go to predictions");
              // router.push("/dashboard")
            }}
          >
            <ArrowUp className="size-4 mr-2" />
            Make Today's Prediction
          </CommandItem>

          <CommandItem
            onSelect={() => {
              setOpen(false);
              console.log("Open leaderboard");
              // router.push("/leaderboard")
            }}
          >
            <Trophy className="size-4 mr-2" />
            View Leaderboard
          </CommandItem>
        </CommandGroup>

      </CommandList>
    </CommandResponsiveDialog>
  );
};
