import { useRef, useState } from 'react';

/**
 * Reusable hook for HTML5 drag-and-drop reordering of a list.
 *
 * @param {(from: number, to: number) => void} reorderFn  – context function to reorder
 *
 * Returns:
 *   draggingIndex – index currently being dragged (null if idle)
 *   overIndex     – index the pointer is hovering over (null if idle)
 *   flashIndex    – index to highlight after a successful drop (null if idle)
 *   handleDragStart(index)
 *   handleDragOver(event, index)
 *   handleDrop(event, index)
 *   handleDragEnd()
 */
export function useDragReorder(reorderFn) {
  const dragRef = useRef(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [overIndex,     setOverIndex]     = useState(null);
  const [flashIndex,    setFlashIndex]    = useState(null);

  function handleDragStart(index) {
    dragRef.current = index;
    setDraggingIndex(index);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragRef.current !== null && dragRef.current !== index) {
      setOverIndex(index);
    }
  }

  function handleDrop(e, index) {
    e.preventDefault();
    const from = dragRef.current;
    if (from !== null && from !== index) {
      reorderFn(from, index);
      setFlashIndex(index);
      setTimeout(() => setFlashIndex(null), 400);
    }
    dragRef.current   = null;
    setDraggingIndex(null);
    setOverIndex(null);
  }

  function handleDragEnd() {
    dragRef.current   = null;
    setDraggingIndex(null);
    setOverIndex(null);
  }

  return {
    draggingIndex,
    overIndex,
    flashIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
