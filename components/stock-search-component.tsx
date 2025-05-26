import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "./ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";

interface StockResult {
  symbol: string;
  name: string;
}

interface StockSearchComponentProps {
  query: {
    symbol: string;
    name: string;
  };
  setQuery: (query: { symbol: string; name: string }) => void;
  open: boolean;
  setOpen: (open: boolean) => void;

}

const StockSearchComponent = ({ query, setQuery, open, setOpen }: StockSearchComponentProps) => {
  const [results, setResults] = useState<StockResult[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stock-search`);
      const data = await res.json();
      setResults(data || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const filteredResults = results.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query?.symbol?.toLowerCase()) ||
      stock.name.toLowerCase().includes(query?.name?.toLowerCase())
  );

  const selectedStock = query.name || query.symbol;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between text-ellipsis whitespace-nowrap overflow-hidden"
          >
            {selectedStock ? selectedStock : "Select stock..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={query.symbol}
              onValueChange={(value) =>
                setQuery({ ...query, symbol: value, name: value })
              }
              placeholder="Search stocks..."
            />
            <CommandList>
              <CommandEmpty>No stocks found.</CommandEmpty>
              <CommandGroup>
                {loading ? (
                  <div className="mt-2 text-sm text-gray-500">Loading...</div>
                ) : (
                  filteredResults.slice(0, 20).map((stock) => (
                    <CommandItem
                      onSelect={() => {
                        console.log(`Selected stock: ${stock.symbol}`);
                        setQuery({
                          symbol: stock.symbol,
                          name: stock.name,
                        });
                        setOpen(false);
                      }}
                      key={stock.symbol}
                      value={stock.symbol}
                    >
                      <span className="font-bold">{stock.symbol}</span> -{" "}
                      {stock.name}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {loading && (
        <div className="mt-2 text-sm text-gray-500">Searching...</div>
      )}
    </>
  );
};

export default StockSearchComponent;
