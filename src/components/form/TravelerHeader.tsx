import { Title } from "@/components/ui/title";

interface TravelerHeaderProps {
  id: number;
  isFirst: boolean;
  onRemove: (id: number) => void;
}

export function TravelerHeader({ id, onRemove }: TravelerHeaderProps) {
  return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				{/* <Title>
          Traveler {String(id).padStart(2, "0")}
          {isFirst ? " (Primary Contact)" : ""}
        </Title> */}
				<Title>
					Primary Contact <span className="text-black font-semibold">(Traveler {String(id).padStart(2, "0")})</span>
				</Title>
				{/* {isFirst && (
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="myself"
							className="rounded text-orange-500 focus:ring-orange-500"
						/>
						<label htmlFor="myself" className="text-sm text-gray-600">
							Myself
						</label>
					</div>
				)} */}
			</div>
			{id !== 1 && (
				<button
					type="button"
					onClick={() => onRemove(id)}
					className="text-red-500 hover:text-red-700"
				>
					Remove Traveler
				</button>
			)}
		</div>
	);
} 