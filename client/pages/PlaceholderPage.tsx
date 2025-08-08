import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  relatedPages?: { title: string; href: string; description: string }[];
}

export default function PlaceholderPage({
  title,
  description,
  icon = <Construction className="h-12 w-12" />,
  relatedPages = [],
}: PlaceholderPageProps) {
  return (
    <Layout>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground mb-6">{icon}</div>
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {description}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  This feature is coming soon! In the meantime, check out our
                  other SEO tools.
                </p>

                {relatedPages.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Related Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relatedPages.map((page, index) => (
                        <Link key={index} to={page.href}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">{page.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {page.description}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
