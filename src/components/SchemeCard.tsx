import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SchemeCardProps {
  title: string;
  department: string;
  subsidy: string;
  eligibility: string[];
  deadline: string;
}

export const SchemeCard = ({ title, department, subsidy, eligibility, deadline }: SchemeCardProps) => {
  return (
    <Card className="h-full border-2 hover:shadow-elevated transition-all">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className="bg-accent text-accent-foreground">{department}</Badge>
          <Badge variant="outline" className="border-primary text-primary">{subsidy}</Badge>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Deadline: {deadline}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <p className="font-semibold text-sm">Eligibility:</p>
          <ul className="space-y-2">
            {eligibility.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button className="w-full bg-gradient-primary">Apply Now</Button>
      </CardContent>
    </Card>
  );
};
