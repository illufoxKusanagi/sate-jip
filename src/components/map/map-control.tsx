import { useMap } from "@/app/context/map-context";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";

export default function MapControls() {
  const { map } = useMap();
  const zoomIn = () => {
    map?.zoomIn();
  };
  const zoomOut = () => {
    map?.zoomOut();
  };

  return (
    <>
      <aside className="flex flex-col gap-2 *:absolute bottom-8 right-4 z-10 bg-background p2 rounded-lg shadow-lg">
        <Button variant={"ghost"} size={"icon"} onClick={zoomIn}>
          <PlusIcon className="w-5 h-5" />
          <span className="sr-only">Zoom in</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={zoomOut}>
          <MinusIcon className="w-5 h-5" />
          <span className="sr-only">Zoom out</span>
        </Button>
      </aside>
    </>
  );
}
