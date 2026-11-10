import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2, type LucideIcon } from "lucide-react";

interface ExtraAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface Props {
  onEdit: () => void;
  onDelete: () => void;
  extraActions?: ExtraAction[];
}

export function RowActionsMenu({ onEdit, onDelete, extraActions }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid h-8 w-8 place-items-center rounded-md text-muted transition hover:bg-[#F0EEE8] hover:text-ink dark:text-muted-dark dark:hover:bg-white/[0.06] dark:hover:text-ink-dark"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1.5 w-40 overflow-hidden rounded-md border border-line bg-surface shadow-lg dark:border-line-dark dark:bg-surface-dark">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium text-ink hover:bg-[#F0EEE8] dark:text-ink-dark dark:hover:bg-white/[0.06]"
          >
            <Pencil size={15} />
            Editar
          </button>
          {extraActions?.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium text-ink hover:bg-[#F0EEE8] dark:text-ink-dark dark:hover:bg-white/[0.06]"
            >
              <action.icon size={15} />
              {action.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium text-danger hover:bg-[#F6E4E1] dark:text-danger-dark dark:hover:bg-danger-dark/10"
          >
            <Trash2 size={15} />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
