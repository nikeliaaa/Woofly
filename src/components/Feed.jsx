import { toast } from "@heroui/react";
import { useEffect, useRef } from "react";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"; // Хук для бесконечной ленты, delete-запроса и доступа к кэшу
import { fetchPosts, deletePost } from "../api"; // Получить посты (cursor-based pagination), удалить пост

export default function Feed() {
  const toastIdRef = useRef(null);
  const sentinelRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    // Деструктуризация объекта
    data, // Загруженные данные
    isPending, // Первая загрузка
    isError, // Ошибка
    isFetching, // Сейчас выполняется запрос
    isFetchingNextPage, // Грузится следующая страница
    hasNextPage, // Есть ли следующая страница
    fetchNextPage, // Загрузить следующую страницу
  } = useInfiniteQuery({
    queryKey: ["posts"],

    queryFn: ({ pageParam }) => {
      return fetchPosts({ cursor: pageParam });
    },

    initialPageParam: undefined, // Начальный параметр страницы

    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },

    refetchOnWindowFocus: true,
  });

  const deletePostMutation = useMutation({
    // Удаление поста
    mutationFn: (id) => deletePost(id),

    onMutate: (id) => {
      const previousData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old) => ({
        ...old,
        pages:
          old?.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post.id !== id),
          })) ?? [],
      }));

      return { previousData };
    },

    onError: (error, id, context) => {
      queryClient.setQueryData(["posts"], context.previousData);
      toast.danger("Не удалось удалить пост");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  // IntersectionObserver для бесконечного скролла
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Toast при фоновом обновлении (refetch, не подгрузка страниц)
  useEffect(() => {
    if (
      isFetching &&
      !isPending &&
      !isFetchingNextPage &&
      !posts.some((p) => p.isPending)
    ) {
      if (!toastIdRef.current) {
        toast.clear();
        toastIdRef.current = toast("Обновление ленты...", {
          isLoading: true,
          timeout: 0,
        });
      }
    } else if (!isFetching && toastIdRef.current) {
      toast.close(toastIdRef.current);
      toastIdRef.current = null;
      toast.success("Лента обновлена");
    }
  }, [isFetching, isPending, isFetchingNextPage, posts]);

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
        toastIdRef.current = null;
      }
    };
  }, []);

  if (isPending) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-center text-danger">
        Ошибка загрузки постов. Попробуйте обновить страницу.
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      {posts.length === 0 && (
        <p className="py-12 text-center">Пока нет постов. Будьте первым!</p>
      )}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isPending={post.isPending}
          onDelete={(id) => {
            deletePostMutation.mutate(id);
          }}
        />
      ))}
      {/* Страница подгружается */}
      {isFetchingNextPage && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <PostSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}
      {/* Сентринел для IntersectionObserver */}
      {hasNextPage && <div ref={sentinelRef} className="h-1" />}
    </div>
  );
}
