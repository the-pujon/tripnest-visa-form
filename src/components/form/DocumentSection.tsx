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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documentData: any
}

export function DocumentSection({ title, documents, travelerId, documentData }: DocumentSectionProps) {
  return (
    <div className="space-y-4">
      <Title>{title}</Title>
      <div className="grid md:grid-cols-2 gap-x-24 gap-y-6">
        {documents.map((doc) => {
          const key = doc.name.split(".")[1]
          const existingFile = documentData?.[key]?.url ?? "";
          
          // console.log("key", key)
          // console.log("doc", doc)
          // console.log("documentData", documentData[key])
          return <FileUpload
          existingFile={existingFile}
          key={doc.name}
          number={doc.number}
          label={doc.label}
          name={doc.name}
          travelerId={travelerId}
        />
        })}
      </div>
    </div>
  );
} 