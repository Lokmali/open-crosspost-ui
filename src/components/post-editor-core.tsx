import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import { SortablePost } from "./sortable-post";
import { Button } from "./ui/button";
import { EditorContent } from "@/store/drafts-store";

interface PostEditorCoreProps {
  posts: EditorContent[];
  onPostsChange: (posts: EditorContent[]) => void;
  onTextChange: (index: number, text: string) => void;
  onMediaUpload: (index: number, file: File) => void;
  onMediaRemove: (index: number) => void;
  onAddThread: () => void;
  onRemoveThread: (index: number) => void;
  onOpenMediaModal: (src: string, type: string) => void;
  onTextFocus?: (index: number) => void;
  onTextBlur?: (index: number) => void;
}

export function PostEditorCore({
  posts,
  onPostsChange,
  onTextChange,
  onMediaUpload,
  onMediaRemove,
  onAddThread,
  onRemoveThread,
  onOpenMediaModal,
  onTextFocus,
  onTextBlur,
}: PostEditorCoreProps) {
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance required before activating drag, helps with touch devices
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag end for sortable posts
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.split("-")[1]);
      const newIndex = parseInt(over.id.split("-")[1]);

      const newPosts = arrayMove(posts, oldIndex, newIndex);
      onPostsChange(newPosts);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={posts.map((_, i) => `post-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          {posts.map((post, index) => (
            <SortablePost
              key={`post-${index}`}
              post={post}
              index={index}
              onTextChange={onTextChange}
              onMediaUpload={onMediaUpload}
              onMediaRemove={onMediaRemove}
              onRemove={posts.length > 1 ? onRemoveThread : undefined}
              onOpenMediaModal={onOpenMediaModal}
              onTextFocus={onTextFocus}
              onTextBlur={onTextBlur}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button onClick={onAddThread} className="w-full" size="sm">
        + Add Post
      </Button>
    </div>
  );
}
