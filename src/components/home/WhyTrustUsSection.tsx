import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Users, CheckCircle, Clock, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// Counter animation hook
const useCountAnimation = (targetValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView && !isInView) {
      setIsInView(true);
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(targetValue * easeOutQuart));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(targetValue);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, targetValue, duration, isInView]);

  return { count, ref };
};

const WhyTrustUsSection = () => {
  const navigate = useNavigate();

  const trustFeatures = [
    {
      title: "Manual Moderation",
      description: "Every match result is manually verified by our expert team to ensure fair play",
      icon: Shield,
      bgColor: "bg-gradient-to-br from-gaming-blue to-gaming-blue/80",
    },
    {
      title: "Instant Payouts",
      description: "Get your winnings transferred to your UPI within minutes of verification",
      icon: Zap,
      bgColor: "bg-gradient-to-br from-gaming-green to-gaming-green/80",
    },
    {
      title: "No Bots Policy",
      description: "100% real players only. We actively monitor and prevent bot participation",
      icon: Users,
      bgColor: "bg-gradient-to-br from-gaming-purple to-gaming-purple/80",
    },
    {
      title: "Verified Players",
      description: "All players go through identity verification to maintain platform integrity",
      icon: CheckCircle,
      bgColor: "bg-gradient-to-br from-gaming-orange to-gaming-orange/80",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support to resolve any issues or disputes",
      icon: Clock,
      bgColor: "bg-gradient-to-br from-gaming-purple to-gaming-purple/80",
    },
    {
      title: "Fair Play Guarantee",
      description: "Advanced anti-cheat systems and fair play policies protect all participants",
      icon: Award,
      bgColor: "bg-gradient-to-br from-gaming-orange to-gaming-orange/80",
    },
  ];

  const stats = [
    {
      value: "50K+",
      numericValue: 50000,
      suffix: "K+",
      label: "Verified Players",
      color: "text-gaming-blue",
    },
    {
      value: "₹2.5Cr+",
      numericValue: 2.5,
      prefix: "₹",
      suffix: "Cr+",
      label: "Payouts Made",
      color: "text-gaming-green",
    },
    {
      value: "99.8%",
      numericValue: 99.8,
      suffix: "%",
      label: "Dispute Resolution",
      color: "text-gaming-purple",
    },
    {
      value: "24/7",
      numericValue: 24,
      suffix: "/7",
      label: "Support Available",
      color: "text-gaming-cyan",
    },
  ];

  const ctaFeatures = [
    "Instant Registration",
    "No Hidden Fees", 
    "24/7 Support"
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
        {/* Why Trust Us Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-gaming font-black mb-6 bg-gradient-to-r from-gaming-cyan to-gaming-blue bg-clip-text text-transparent">
            Why Trust Us?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with security, fairness, and transparency at its core
          </p>
        </motion.div>

        {/* Trust Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-background/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] h-full overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon container with gradient background */}
                <div className={`relative w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white relative z-10" />
                </div>
                
                <h3 className="text-2xl font-gaming font-bold text-foreground mb-4 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const { count, ref } = useCountAnimation(stat.numericValue, 2000);
            
            const getDisplayValue = () => {
              if (count === stat.numericValue) {
                return stat.value;
              }
              
              if (stat.prefix === "₹") {
                return `${stat.prefix}${count.toFixed(1)}${stat.suffix}`;
              } else if (stat.suffix === "%") {
                return `${count.toFixed(1)}${stat.suffix}`;
              } else if (stat.suffix === "K+") {
                return `${Math.floor(count / 1000)}${stat.suffix}`;
              } else {
                return `${count}${stat.suffix}`;
              }
            };
            
            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card/50 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <h3 className={`text-4xl md:text-5xl font-gaming font-black ${stat.color} mb-2`}>
                  {getDisplayValue()}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gaming-blue/30 to-gaming-purple/30 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm text-center"
        >
          <h3 className="text-3xl md:text-4xl font-gaming font-black mb-6 bg-gradient-to-r from-gaming-blue via-gaming-purple to-gaming-green bg-clip-text text-transparent">
            Ready to Join the Battle?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Start competing today and turn your gaming skills into real earnings
          </p>
          
          <Button
            size="lg"
            onClick={() => navigate("/gamer-place")}
            className="bg-gradient-to-r from-gaming-blue to-gaming-green hover:shadow-glow transition-all duration-300 text-lg px-12 py-6 font-gaming font-bold group mb-8"
          >
            Let's Play Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-sm">
            {ctaFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gaming-green rounded-full" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyTrustUsSection;