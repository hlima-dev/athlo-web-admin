import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const MENU_WIDTH = 160; // w-40
const MENU_GAP = 6; // equivalente ao mt-1.5 de antes

export function RowActionsMenu({ onEdit, onDelete, extraActions }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Renderiza o menu via portal em document.body (position: fixed) em vez
  // de absolute dentro da linha da tabela — assim ele flutua livre por
  // cima da página, sem ficar preso/cortado pelo overflow da tabela (que
  // antes escondia as opções de baixo quando a linha ficava perto do
  // fim da área rolável).
  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const itemCount = 2 + (extraActions?.length ?? 0);
      const estimatedHeight = itemCount * 42;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < estimatedHeight + MENU_GAP && rect.top > estimatedHeight;

      setPosition({
        top: openUpward ? rect.top - estimatedHeight - MENU_GAP : rect.bottom + MENU_GAP,
        left: Math.max(8, rect.right - MENU_WIDTH),
      });
    }

    updatePosition();

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    // Fechar em vez de reposicionar ao rolar/redimensionar — mais simples
    // que acompanhar a posição em tempo real, e evita o menu "flutuar
    // descolado" do botão que o abriu. Captura (true) pra pegar scroll de
    // qualquer contêiner rolável aninhado, não só da janela.
    function handleDismiss() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleDismiss, true);
    window.addEventListener("resize", handleDismiss);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleDismiss, true);
      window.removeEventListener("resize", handleDismiss);
    };
  }, [open, extraActions]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid h-8 w-8 place-items-center rounded-md text-muted transition hover:bg-[#F0EEE8] hover:text-ink dark:text-muted-dark dark:hover:bg-white/[0.06] dark:hover:text-ink-dark"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && position
        ? createPortal(
            <div
              ref={menuRef}
              style={{ position: "fixed", top: position.top, left: position.left }}
              className="z-50 w-40 overflow-hidden rounded-md border border-line bg-surface shadow-lg dark:border-line-dark dark:bg-surface-dark"
            >
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
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
