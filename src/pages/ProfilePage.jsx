import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { deletePost, getUserProfile } from "../api";
import PostSkeleton from "../components/PostSkeleton";
import { Avatar, Card } from "@heroui/react";
import PostCard from "../components/PostCard";
import { toast } from "@heroui/react";
import { useAuthStore } from "../store/authStore";

export default function ProfilePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserProfile(id),
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId) => deletePost(postId, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: () => {
      toast.danger("Не удалось удалить пост");
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p>Пользователь не найден</p>
      </div>
    );
  }

  const registrationYear = new Date(profile.createdAt).getFullYear();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
      <Card className="w-full p-6">
        <div className="flex items-center gap-4">
          <Avatar>
            <Avatar.Image src={profile.avatar} alt={profile.username} />
            <Avatar.Fallback>{profile.username.charAt(0)}</Avatar.Fallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-semibold">{profile.username}</h2>

            <p className="text-sm text-default-500">
              Участник с {registrationYear} г.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        {profile.posts.length > 0 ? (
          profile.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={(postId) => deletePostMutation.mutate(postId)}
            />
          ))
        ) : (
          <p className="text-center text-default-500">Постов пока нет</p>
        )}
      </div>
    </div>
  );
}
