import { Title } from "@/components/ui/title";
import { FileUpload } from "@/components/form/file-upload";

interface DocumentSectionProps {
  title: string;
  documents: Array<{
    number: number;
    label: string;
    name: string;
  }>;
  travelerId: number;
}

export function DocumentSection({ title, documents, travelerId }: DocumentSectionProps) {
  return (
    <div className="space-y-4">
      <Title>{title}</Title>
      <div className="grid md:grid-cols-2 gap-6">
        {documents.map((doc) => (
          <FileUpload
            key={doc.name}
            number={doc.number}
            label={doc.label}
            name={doc.name}
            travelerId={travelerId}
          />
        ))}
      </div>
    </div>
  );
} 