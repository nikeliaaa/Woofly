import { Button, Modal, TextArea, toast } from "@heroui/react";
import { Image, X } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api";

// Модалка создания нового поста
export default function CreatePostModal({ isOpen, onClose }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient(); // Доступ к кэшу

  const createPostMutation = useMutation({
    // Мутация для публикации поста
    mutationFn: ({ text, files }) => createPost(text, files),

    onMutate: ({ text, previews }) => {
      // Optimistic UI
      const previousData = queryClient.getQueryData(["posts"]); // Текущее состояние ленты постов

      const optimisticPost = {
        // Создание временного поста
        id: `temp-${Date.now()}`,
        text,
        author: "Публикация...",
        images: previews.map((p) => p.url),
        createdAt: new Date().toISOString(),
        isPending: true,
      };

      queryClient.setQueryData(["posts"], (old) => ({
        ...old,
        pages: old.pages.map((page, index) =>
          index === 0
            ? {
                ...page,
                posts: [optimisticPost, ...page.posts],
              }
            : page,
        ),
      }));

      return { previousData };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(["posts"], context.previousData); // Замена ленты постов на предыдущее состояние
      toast.danger(error.message);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Замена устаревших данных

      // Очистка формы создания поста
      setText("");
      setFiles([]);
      setPreviews([]);
    },
  });

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    URL.revokeObjectURL(previews[index].url);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Закрываем модалку сразу, чтобы пользователь видел ленту с оптимистичным постом
  const handleSubmit = () => {
    if (!text.trim()) return;
    onClose();

    createPostMutation.mutate({
      text,
      files,
      previews,
    });
  };

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      variant="blur"
      onOpenChange={(open) => !open && onClose()}
    >
      <Modal.Container placement="center">
        <Modal.Dialog className="sm:max-w-lg">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Новый пост</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            <TextArea
              className="resize-none"
              aria-label="Текст поста"
              placeholder="Расскажите о своей собаке..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              fullWidth
            />
            {/* Превью загруженных фото */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((p, i) => (
                  <div key={i} className="relative">
                    <img
                      src={p.url}
                      alt=""
                      className="h-24 w-full rounded-lg object-cover"
                    />
                    <Button
                      isIconOnly
                      onClick={() => removePreview(i)}
                      className="absolute top-1 right-1"
                      size="sm"
                      variant="secondary"
                    >
                      <X className="text-xs" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="secondary"
              onPress={() => fileInputRef.current?.click()}
            >
              <Image />
              Добавить фото
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" slot="close">
              Отмена
            </Button>
            <Button onPress={handleSubmit} isDisabled={!text.trim()}>
              Опубликовать
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
