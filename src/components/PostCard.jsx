import { Avatar, Button, Card, Dropdown, Label } from "@heroui/react";
import { MoreVertical, Trash2 } from "lucide-react";
import { API_URL } from "../api";
import { Link } from "react-router";

// Карточка одного поста
export default function PostCard({ post, onDelete, isPending }) {
  const date = new Date(post.createdAt).toLocaleString("ru-RU");
  const avatarUrl =
    post.avatar ||
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(post.author)}`;

  return (
    <Card className={`w-full gap-3 p-4 ${isPending ? "animate-pulse" : ""}`}>
      <div className="flex items-start justify-between">
        <Card.Header className="flex-row gap-4">
          <Link
            to={`/profile/${post.userId}`}
            className="flex items-center gap-4"
          >
            <Avatar>
              <Avatar.Image alt={post.author} src={avatarUrl} />
              <Avatar.Fallback>{post.author.charAt(0)}</Avatar.Fallback>
            </Avatar>

            <div>
              <p className="text-sm font-semibold">{post.author}</p>
              <p className="text-xs text-muted">{date}</p>
            </div>
          </Link>
        </Card.Header>

        {!isPending && (
          <Dropdown>
            <Button isIconOnly size="sm" variant="ghost">
              <MoreVertical />
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu
                onAction={(key) => {
                  if (key === "delete") onDelete(post.id);
                }}
              >
                <Dropdown.Item id="delete" textValue="Удалить" variant="danger">
                  <Trash2 className="size-4 text-danger" />
                  <Label>Удалить</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        )}
      </div>
      <p className="whitespace-pre-wrap text-sm">{post.text}</p>
      {post.images && post.images.length > 0 && (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.min(post.images.length, 3)}, 1fr)`,
          }}
        >
          {post.images.map((img, i) =>
            isPending ? (
              <div
                key={i}
                className="h-48 w-full animate-pulse rounded-xl bg-default-200"
              />
            ) : (
              <img
                key={i}
                src={`${API_URL}${img}`}
                alt=""
                className="h-48 w-full rounded-xl object-cover"
              />
            ),
          )}
        </div>
      )}
    </Card>
  );
}
