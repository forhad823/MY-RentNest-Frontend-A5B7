import { Button } from "@/components/ui/button";

export default function HomePage() {
  console.log("Root Route");
  return (
    <div>
      <h1>Main Landing Page -Hero, Categories, Featured</h1>
      <Button size={"xs"} variant={"destructive"}>
        Click Me
      </Button>
    </div>
  );
}
