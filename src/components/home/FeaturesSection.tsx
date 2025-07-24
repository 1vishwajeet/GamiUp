import { motion } from "framer-motion";
import { Trophy, Users, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Trophy,
      title: "Instant Challenges",
      description: "Join or create challenges instantly. Entry fees from ₹10-₹20 with guaranteed payouts.",
      color: "text-white",
      bgColor: "bg-white/10 backdrop-blur-md border-white/20",
      iconBg: "bg-gradient-to-br from-gaming-purple to-gaming-purple/80",
    },
    {
      icon: Users,
      title: "Fair Play",
      description: "Manual verification system ensures fair competition. Upload proof, get verified, receive rewards.",
      color: "text-white",
      bgColor: "bg-white/10 backdrop-blur-md border-white/20",
      iconBg: "bg-gradient-to-br from-gaming-blue to-gaming-blue/80",
    },
    {
      icon: Zap,
      title: "Quick Payouts",
      description: "Get your winnings instantly after verification. Secure payment system with multiple options.",
      color: "text-white",
      bgColor: "bg-white/10 backdrop-blur-md border-white/20",
      iconBg: "bg-gradient-to-br from-gaming-green to-gaming-green/80",
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
        <div className="absolute top-32 left-20 w-5 h-5 bg-gaming-purple rounded-full opacity-60 animate-pulse delay-300" />
        <div className="absolute top-60 right-32 w-4 h-4 bg-gaming-cyan rounded-full opacity-40 animate-pulse delay-700" />
        <div className="absolute bottom-40 left-1/3 w-6 h-6 bg-gaming-green rounded-full opacity-80 animate-pulse delay-1200" />
        <div className="absolute bottom-60 right-1/4 w-3 h-3 bg-gaming-orange rounded-full opacity-50 animate-pulse delay-900" />
      </div>
      <div className="container mx-auto relative z-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-gaming font-black text-foreground mb-6">
            Why Choose Arena Nexus?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the most trusted and fair gaming platform designed for serious gamers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className={`${feature.bgColor} rounded-3xl p-8 h-full transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:shadow-2xl hover:shadow-gaming-purple/20 group-hover:backdrop-blur-xl relative overflow-hidden`}>
                {/* Glossy overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-gaming font-bold text-white mb-4 group-hover:text-white/90 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
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

export default FeaturesSection;