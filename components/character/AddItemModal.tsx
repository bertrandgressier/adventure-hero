'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddItemModalProps {
  onAdd: (name: string) => Promise<void>;
  onClose: () => void;
}

export default function AddItemModal({ onAdd, onClose }: AddItemModalProps) {
  const [newItemName, setNewItemName] = useState('');

  const handleAdd = async () => {
    if (!newItemName.trim()) {
      alert('Veuillez entrer un nom d\'objet');
      return;
    }

    await onAdd(newItemName.trim());
    setNewItemName('');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-2 border-primary/50 rounded-lg p-6 max-w-md w-full" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="font-[var(--font-uncial)] text-3xl tracking-wide text-primary mb-6 text-center">
            📦 Nouvel objet
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <label className="font-[var(--font-merriweather)] text-muted-light text-sm mb-2 block">
            Nom de l&apos;objet
          </label>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
            }}
            placeholder="Ex: Potion, Clé, Parchemin..."
            className="w-full bg-background border border-primary/20 rounded px-4 py-2 font-[var(--font-merriweather)] text-light placeholder:text-muted-light focus:outline-none focus:border-primary"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-muted hover:bg-muted/80 text-light font-[var(--font-merriweather)] font-bold px-6 py-3 rounded-lg transition-colors border border-primary/20"
          >
            Annuler
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-[var(--font-uncial)] font-bold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Ajouter
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
