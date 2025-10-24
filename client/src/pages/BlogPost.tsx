import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { getBlogPostBySlug } from "@/lib/blogPosts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import NotFound from "@/pages/not-found";
import ReactMarkdown from "react-markdown";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const post = params?.slug ? getBlogPostBySlug(params.slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Smart Emailer Pro Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | Smart Emailer Pro Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.publishedDate} />
        <meta property="article:section" content={post.category} />
        <meta name="keywords" content={post.keywords.join(', ')} />
        <link rel="canonical" href={`https://smart-emailer-pro.replit.app/blog/${post.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/blog">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-8"
              data-testid="button-back-to-blog"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge data-testid="badge-category">{post.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span data-testid="text-read-time">{post.readTime} min read</span>
            </div>
            <span className="text-sm text-muted-foreground" data-testid="text-published-date">
              {new Date(post.publishedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4" data-testid="text-blog-post-title">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground" data-testid="text-excerpt">
            {post.excerpt}
          </p>
        </div>

        <div 
          className="prose prose-neutral dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-foreground
            prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6
            prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
            prose-p:text-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:text-foreground prose-ol:text-foreground
            prose-li:text-foreground
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-muted prose-pre:border"
          data-testid="blog-post-content"
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-12 pt-8 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {post.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" data-testid={`keyword-${index}`}>
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 bg-primary/5 rounded-lg border">
          <h3 className="text-xl font-bold mb-2">Try Smart Emailer Pro</h3>
          <p className="text-muted-foreground mb-4">
            Generate professional emails instantly with AI. Choose from 30+ writing styles 
            and get perfect emails every time.
          </p>
          <Link href="/composer">
            <Button data-testid="button-try-composer">
              Try Email Composer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/blog">
            <Button variant="outline" data-testid="button-view-all-articles">
              <ArrowLeft className="w-4 h-4 mr-2" />
              View All Articles
            </Button>
          </Link>
        </div>
      </article>
    </div>
    </>
  );
}
