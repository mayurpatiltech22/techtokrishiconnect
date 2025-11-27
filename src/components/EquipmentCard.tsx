import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

interface EquipmentCardProps {
  name: string;
  image: string;
  pricePerDay: string;
  location: string;
  available: boolean;
  specifications: string[];
}

export const EquipmentCard = ({ name, image, pricePerDay, location, available, specifications }: EquipmentCardProps) => {
  return (
    <Card className="h-full border-2 overflow-hidden hover:shadow-elevated transition-all">
      <div className="h-48 bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {image}
        </div>
        <Badge 
          className={`absolute top-3 right-3 ${available ? 'bg-primary' : 'bg-muted-foreground'}`}
        >
          {available ? 'Available' : 'Rented'}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-2xl font-bold text-primary">{pricePerDay}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            per day rental
          </p>
        </div>
        <div className="space-y-2 mb-4">
          <p className="text-sm font-semibold">Specifications:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {specifications.map((spec, index) => (
              <li key={index}>• {spec}</li>
            ))}
          </ul>
        </div>
        <Button className="w-full" disabled={!available}>
          {available ? 'Book Now' : 'Currently Unavailable'}
        </Button>
      </CardContent>
    </Card>
  );
};
