import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { products as seed } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const empty = { id: "", name: "", price: "", category: "flours-staples", stock: "", tagline: "", image: "" };

const AdminProducts = () => {
  const [list, setList] = useState(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(empty);

  const save = () => {
    if (!editing.name || !editing.price) return toast.error("Name and price required");
    if (editing.id && list.find((p) => p.id === editing.id)) {
      setList(list.map((p) => (p.id === editing.id ? { ...p, ...editing, price: +editing.price, stock: +editing.stock } : p)));
      toast.success("Product updated");
    } else {
      const id = editing.name.toLowerCase().replace(/\s+/g, "-");
      setList([{ ...editing, id, price: +editing.price, stock: +editing.stock, image: editing.image || seed[0].image, rating: 4.8 }, ...list]);
      toast.success("Product added");
    }
    setOpen(false);
    setEditing(empty);
  };

  const del = (id) => {
    setList(list.filter((p) => p.id !== id));
    toast.success("Product removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Catalog</p>
          <h1 className="font-display text-4xl">Products</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full" onClick={() => setEditing(empty)}>
              <Plus className="h-4 w-4 mr-1" /> New product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display text-2xl">{editing.id ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Tagline</Label><Input value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Price</Label><Input type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></div>
                <div><Label>Stock</Label><Input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} /></div>
              </div>
              <Button className="w-full" onClick={save}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4 hidden md:table-cell">Category</th>
              <th className="text-left p-4 hidden md:table-cell">Stock</th>
              <th className="text-left p-4">Price</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-secondary"><img src={p.image} alt="" className="h-full w-full object-cover" /></div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.tagline}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell capitalize">{p.category}</td>
                <td className="p-4 hidden md:table-cell">{p.stock}</td>
                <td className="p-4 tabular-nums">${p.price.toFixed(2)}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing({ ...p, price: String(p.price), stock: String(p.stock) }); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => del(p.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
