import { Toast } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import CreatePostModal from "./components/CreatePostModal";
import Feed from "./components/Feed";
import Header from "./components/Header";

const queryClient = new QueryClient();

export default function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Toast.Provider placement="bottom end" />
      <Header onOpenCreate={() => setIsCreateOpen(true)} />
      <Feed />
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </QueryClientProvider>
  );
}
