import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import AdminDeleteSet from "./admin-delete-set";

interface FlashcardDisplayProps {
  subject: string;
  creator: string;
}

export default function FlashcardDisplay({
  subject,
  creator,
}: FlashcardDisplayProps) {
  return (
    <Card className="w-96 mx-2 h-52 flex items-start shadow-lg p-8 flex-col">
      <h2>{subject}</h2>
      <Separator className="my-4" />
      <span className="text-xs text-muted-foreground">By {creator}</span>
    </Card>
  );
}
