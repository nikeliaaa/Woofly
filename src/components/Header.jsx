import { Button } from "@heroui/react";

// Хедер приложения с кнопкой создания поста
export default function Header({ onOpenCreate }) {
  return (
    <header className="sticky top-0 z-10 border-b border-default-200 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">🐶 Woofly</h1>
        </div>
        <Button onPress={onOpenCreate}>Написать пост</Button>
      </div>
    </header>
  );
}
