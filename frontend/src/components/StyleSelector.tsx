import modernStyle from "@/assets/modern-style.jpg";
import industrialStyle from "@/assets/industrial-style.jpg";
import bohemianStyle from "@/assets/bohemian-style.jpg";
import traditionalStyle from "@/assets/traditional-style.jpg";
import rusticStyle from "@/assets/rustic-style.jpg";
import minimalistStyle from "@/assets/minimalist-style.jpg";

interface StyleOption {
  id: string;
  name: string;
  image: string;
}

const styleOptions: StyleOption[] = [
  { id: "modern", name: "Modern", image: modernStyle },
  { id: "industrial", name: "Industrial", image: industrialStyle },
  { id: "bohemian", name: "Bohemian", image: bohemianStyle },
  { id: "traditional", name: "Traditional", image: traditionalStyle },
  { id: "rustic", name: "Rustic", image: rusticStyle },
  { id: "minimalist", name: "Minimalist", image: minimalistStyle },
];

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

const StyleSelector = ({ selectedStyle, onStyleChange }: StyleSelectorProps) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground">
        Select interior design type*
      </label>
      <div className="grid grid-cols-3 gap-4">
        {styleOptions.map((style) => (
          <div
            key={style.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
              selectedStyle === style.id
                ? "ring-2 ring-brand-brown shadow-lg scale-105"
                : "hover:shadow-md hover:scale-102"
            }`}
            onClick={() => onStyleChange(style.id)}
          >
            <div className="aspect-video bg-muted relative">
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover"
              />
              {selectedStyle === style.id && (
                <div className="absolute inset-0 bg-brand-brown/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-brand-brown rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-brand-cream rounded-full" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 text-center">
              <span className="text-sm font-medium text-foreground">
                {style.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;