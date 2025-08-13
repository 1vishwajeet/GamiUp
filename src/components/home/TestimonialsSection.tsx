import { motion } from "framer-motion";
import { Star, Check } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Arjun Sharma",
      location: "Mumbai, India",
      game: "BGMI Player",
      rating: 5,
      earnings: "₹5000",
      text: "I've been playing competitive BGMI for months here. The platform is legit and payouts are instant! Made over ₹5K last month alone.",
      verified: true,
    },
    {
      id: 2,
      name: "Priya Patel",
      location: "Bangalore, India",
      game: "Free Fire Player",
      rating: 5,
      earnings: "₹7500",
      text: "As a female gamer, I was skeptical at first. But this platform is amazing! Fair play, quick verification, and real money. Highly recommended!",
      verified: true,
    },
    {
      id: 3,
      name: "Rohit Kumar",
      location: "Delhi, India",
      game: "PUBG Player",
      rating: 5,
      earnings: "₹3000",
      text: "Best gaming platform I've used! Manual verification ensures no cheaters. Won ₹3K in 3 months. Customer support is also excellent.",
      verified: true,
    },
    {
      id: 4,
      name: "Sneha Reddy",
      location: "Hyderabad, India",
      game: "BGMI Player",
      rating: 5,
      earnings: "₹7000",
      text: "Finally found a trustworthy platform! No bots, real players, and instant UPI transfers. Made gaming my side income source!",
      verified: true,
    },
    {
      id: 5,
      name: "Vikash Singh",
      location: "Pune, India",
      game: "Free Fire Player",
      rating: 5,
      earnings: "₹4000",
      text: "Love the transparency here. Every match is fair, results are verified manually. Earned ₹4K+ and still going strong!",
      verified: true,
    },
    {
      id: 6,
      name: "Ananya Das",
      location: "Kolkata, India",
      game: "PUBG Player",
      rating: 5,
      earnings: "₹4500",
      text: "Great platform for competitive gaming! Clean interface, fair matches, and quick payouts. Definitely recommend to all gamers!",
      verified: true,
    },
  ];

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 via-gaming-blue/5 to-gaming-cyan/10 animate-pulse" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/20 via-transparent to-gaming-blue/20 z-10" />

      {/* Floating Circles */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-4 h-4 bg-gaming-purple rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-gaming-cyan rounded-full opacity-40 animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-gaming-green rounded-full opacity-80 animate-pulse delay-500" />
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-gaming-orange rounded-full opacity-50 animate-pulse delay-1500" />
      </div>

      <div className="container mx-auto relative z-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-gaming font-black mb-6 bg-gradient-to-r from-gaming-purple to-gaming-cyan bg-clip-text text-transparent">
            What Gamers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real testimonials from real winners earning real money
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 h-full transition-all duration-500 hover:scale-105 hover:bg-white/15 hover:shadow-2xl hover:shadow-gaming-purple/20 group-hover:backdrop-blur-xl overflow-hidden">
                {/* Glossy overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Rating Badge */}
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gaming-purple rounded-full flex items-center justify-center border-2 border-white/30 backdrop-blur-sm">
                  <span className="text-white text-sm font-bold">99</span>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-white/90 text-sm leading-relaxed mb-6 italic group-hover:text-white transition-colors duration-300">
                    "{testimonial.text}"
                  </blockquote>

                  {/* User Info Section */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-lg">👤</span>
                      </div>
                    </div>
                    
                    {/* User Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold text-sm group-hover:text-white/95 transition-colors duration-300">
                          {testimonial.name}
                        </h4>
                        {testimonial.verified && (
                          <div className="w-4 h-4 bg-gaming-blue rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-white/70 text-xs mb-1">{testimonial.location}</p>
                      <p className="text-gaming-purple text-xs font-medium">{testimonial.game}</p>
                    </div>

                    {/* Earnings Badge */}
                    <div className="bg-gaming-green text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-gaming-green/30">
                      {testimonial.earnings}
                    </div>
                  </div>
                </div>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gaming-purple via-gaming-blue to-gaming-green opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;