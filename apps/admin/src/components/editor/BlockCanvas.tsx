import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LayoutGrid } from "lucide-react";
import type { Block } from "@acquisition/shared";
import SortableBlockItem from "./SortableBlockItem";

type BlockCanvasProps = {
  blocks: Block[];
  selectedBlockIndex: number | null;
  onSelectBlock: (index: number) => void;
  onReorderBlocks: (blocks: Block[]) => void;
  onDeleteBlock: (index: number) => void;
};

export default function BlockCanvas({
  blocks,
  selectedBlockIndex,
  onSelectBlock,
  onReorderBlocks,
  onDeleteBlock,
}: BlockCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemIds = blocks.map((_, i) => String(i));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onReorderBlocks(arrayMove(blocks, oldIndex, newIndex));
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-lg bg-[#00131a] p-4">
      <h2 className="mb-3 text-sm font-semibold text-white/90">Canvas</h2>
      {blocks.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16">
          <LayoutGrid size={48} className="text-gray-600" />
          <p className="text-center text-sm text-white/45">
            ბლოკის დასამატებლად გამოიყენეთ მარცხენა პანელი
          </p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-2">
              {blocks.map((block, index) => (
                <li key={index}>
                  <SortableBlockItem
                    block={block}
                    index={index}
                    isSelected={selectedBlockIndex === index}
                    onSelect={() => onSelectBlock(index)}
                    onDelete={() => onDeleteBlock(index)}
                  />
                </li>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
