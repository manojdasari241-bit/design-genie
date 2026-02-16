import TemplateCard from "./TemplateCard";
import template1 from "@/assets/template-1.jpg";
import template2 from "@/assets/template-2.jpg";
import template3 from "@/assets/template-3.jpg";
import template4 from "@/assets/template-4.jpg";
import template5 from "@/assets/template-5.jpg";

const templates = [
  { 
    id: 1, 
    title: "Design joy this season", 
    gradient: "bg-gradient-to-br from-orange-400 to-orange-600",
    image: template1
  },
  { 
    id: 2, 
    title: "Fly into design", 
    gradient: "bg-gradient-to-br from-teal-400 to-cyan-500",
    image: template2
  },
  { 
    id: 3, 
    title: "Celebrate harvest", 
    gradient: "bg-gradient-to-br from-yellow-400 to-amber-500",
    image: template3
  },
  { 
    id: 4, 
    title: "Design for spring's fresh vibe", 
    gradient: "bg-gradient-to-br from-green-400 to-emerald-600",
    image: template4
  },
  { 
    id: 5, 
    title: "Celebrate with your design", 
    gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
    image: template5
  },
];

const TemplatesSection = () => {
  return (
    <section className="px-8 py-10 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-foreground mb-6">See what's new</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              title={template.title}
              gradient={template.gradient}
              image={template.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
