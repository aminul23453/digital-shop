// src/pages/BlogPage.jsx
import React from 'react';
import { Feather, Calendar, UserCircle } from 'lucide-react'; // Icons for blog
import { Link } from 'react-router-dom'; // For "Read More" links if we link to single posts later

// Placeholder blog post data
const placeholderPosts = [
  {
    id: 1,
    slug: 'our-commitment-to-sustainable-materials',
    title: 'Deep Dive: Our Commitment to Sustainable Materials',
    author: 'Jane Doe, Head of Sustainability',
    date: 'May 10, 2025',
    excerpt: 'Learn about the eco-friendly fabrics that form the core of EcoThreads, from organic cotton to innovative recycled fibers...',
    imageUrl: 'https://unsplash.com/photos/brown-and-white-concrete-building-SsV4Ck4GISU', 
    category: 'Sustainability',
  },
  {
    id: 2,
    slug: 'ethical-manufacturing-the-ecothreads-way',
    title: 'Ethical Manufacturing: The EcoThreads Way',
    author: 'John Smith, CEO',
    date: 'April 28, 2025',
    excerpt: 'A look into our partnerships and the standards we uphold to ensure every garment is made with respect for people and the planet...',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Ethics',
  },
  {
    id: 3,
    slug: 'style-your-wardrobe-sustainably',
    title: '5 Tips to Style Your Wardrobe Sustainably',
    author: 'Alice Green, Fashion Editor',
    date: 'April 15, 2025',
    excerpt: 'Discover easy and impactful ways to make your fashion choices more eco-conscious without compromising on style...',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    category: 'Style Tips',
  },
  // Add more placeholder posts if desired
];

function BlogCard({ post }) {
  return (
    <article className="bg-card rounded-xl shadow-lg overflow-hidden flex flex-col group">
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
         {/* For now, "Read More" goes nowhere specific. Later, change to /blog/${post.slug} */}
          <Link to={`#`} className="block"> 
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </Link>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        {post.category && (
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{post.category}</p>
        )}
        <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {/* For now, "Read More" goes nowhere specific. Later, change to /blog/${post.slug} */}
          <Link to={`#`} className="hover:underline"> 
            {post.title}
          </Link>
        </h2>
        <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-3">
          {post.author && (
            <span className="flex items-center">
              <UserCircle className="h-3.5 w-3.5 mr-1" /> {post.author}
            </span>
          )}
          {post.date && (
            <span className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" /> {post.date}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>
        {/* For now, "Read More" goes nowhere specific. Later, change to /blog/${post.slug} */}
        <Link 
         to={`#`}
         className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mt-auto"
        >
          Read More <Feather className="ml-1 h-4 w-4 transform -rotate-45" />
        </Link>
      </div>
    </article>
  );
}


function BlogPage() {
  // In a real app, you would fetch blogPosts from an API
  const [blogPosts, setBlogPosts] = React.useState(placeholderPosts);
  const [isLoading, setIsLoading] = React.useState(false); // Set to true if fetching

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     setIsLoading(true);
  //     try {
  //       // const response = await api.getBlogPosts(); // Hypothetical API call
  //       // setBlogPosts(response.data.results || response.data); 
  //     } catch (error) {
  //       console.error("Failed to fetch blog posts:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchPosts();
  // }, []);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <Feather className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">EcoThreads Blog</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            Insights, tips, and stories on sustainable fashion, ethical living, and the EcoThreads journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading posts...</p> // Replace with Skeleton loaders if desired
        ) : blogPosts && blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg py-12">
            No blog posts available yet. Check back soon!
          </p>
        )}

        {/* Placeholder for Pagination if you have many posts */}
        {/* <div className="flex justify-center mt-12">
          <Button variant="outline" className="mr-2">Previous</Button>
          <Button variant="outline">Next</Button>
        </div> */}
      </div>
    </div>
  );
}

export default BlogPage;