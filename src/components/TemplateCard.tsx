import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TemplateCardProps {
  title: string;
  gradient: string;
  image?: string;
  onClick?: () => void;
}

const TemplateCard = ({ title, gradient, image, onClick }: TemplateCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/editor");
    }
  };

  return (
    <button onClick={handleClick} className={`template-card ${gradient} w-full aspect-[4/5] relative overflow-hidden`}>
      <div className="absolute inset-0 p-4 flex flex-col">
        <div className="flex items-center gap-1 text-white font-semibold text-sm">
          <span>{title}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
      {image && (
        <img 
          src={image} 
          alt={title}
          className="absolute bottom-0 left-0 right-0 w-full h-3/4 object-cover object-top"
        />
      )}
    </button>
  );
};

export default TemplateCard;
