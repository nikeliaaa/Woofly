import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router";
import { LogOut, User } from "lucide-react";

// Хедер приложения с кнопкой создания поста
export default function Header() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const avatarUrl =
    user?.avatar ||
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
      user?.username || "",
    )}`;

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-default-200 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">🐶 Woofly</h1>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Button onPress={() => setIsCreateOpen(true)}>
                Написать пост
              </Button>

              <Dropdown>
                <Button isIconOnly variant="ghost">
                  <Avatar>
                    <Avatar.Image src={avatarUrl} alt={user.username} />
                    <Avatar.Fallback>
                      {user.username?.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
                </Button>

                <Dropdown.Popover>
                  <Dropdown.Menu
                    onAction={(key) => {
                      if (key === "profile") {
                        navigate(`/profile/${user.id}`);
                      }

                      if (key === "logout") {
                        logout();
                        navigate("/");
                      }
                    }}
                  >
                    <Dropdown.Item id="profile" textValue="Профиль">
                      <User className="size-4" />
                      <Label>Профиль</Label>
                    </Dropdown.Item>

                    <Dropdown.Item
                      id="logout"
                      textValue="Выйти"
                      variant="danger"
                    >
                      <LogOut className="size-4 text-danger" />
                      <Label>Выйти</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          ) : (
            <Link to="/login">
              <Button>Войти</Button>
            </Link>
          )}
        </div>
      </header>

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
