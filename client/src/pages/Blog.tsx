import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blogPosts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Blog() {
  const allPosts = getAllBlogPosts();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(allPosts.map(post => post.category)))];

  const filteredPosts = selectedCategory === "all" 
    ? allPosts 
    : allPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold" data-testid="text-blog-title">Email Writing Blog</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Master the art of professional email communication with our comprehensive guides. 
            Learn best practices, templates, and techniques for every email situation.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              data-testid={`filter-${category.toLowerCase()}`}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card 
                className="h-full hover-elevate active-elevate-2 transition-all cursor-pointer"
                data-testid={`blog-card-${post.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="secondary" data-testid={`badge-category-${post.id}`}>
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span data-testid={`text-read-time-${post.id}`}>{post.readTime} min read</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold leading-tight mb-2" data-testid={`text-title-${post.id}`}>
                    {post.title}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`text-excerpt-${post.id}`}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    Read article
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found in this category.</p>
          </div>
        )}
      </div>

      <div className="bg-muted/30 border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Need AI-Powered Email Help?</h2>
          <p className="text-muted-foreground mb-6">
            Try Smart Emailer Pro to generate professional emails in seconds with 30+ writing styles.
          </p>
          <Link href="/composer">
            <Button size="lg" data-testid="button-try-composer">
              Try Email Composer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
